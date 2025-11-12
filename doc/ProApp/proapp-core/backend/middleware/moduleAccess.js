// middleware/moduleAccess.js - Middleware pro kontrolu přístupu k modulům
import { createAuditLog, AUDIT_ACTIONS, TARGET_TYPES } from './auditLog.js';

// Kontrola přístupu k modulu
export const requireModuleAccess = (moduleId, requiredAccessLevel = 'limited') => {
  return async (req, res, next) => {
    try {
      console.log('🔍 ModuleAccess check for:', { moduleId, userId: req.user?.id, userEmail: req.user?.email });
      
      if (!req.user || !req.db) {
        console.log('❌ Missing auth or db:', { user: !!req.user, db: !!req.db });
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const db = req.db;
      const userId = req.user.id;

      // Admin má přístup ke všemu
      if (req.user.role === 'admin') {
        req.moduleAccess = {
          hasAccess: true,
          accessLevel: 'full',
          isAdmin: true
        };
        return next();
      }

      // Najdi aktivní subscription
      let subscription = await db.get(`
        SELECT us.*, sp.id as plan_id, sp.name as plan_name
        FROM user_subscriptions us
        JOIN subscription_plans sp ON us.plan_id = sp.id
        WHERE us.user_id = ? AND us.status IN ('active', 'trial')
        AND (datetime(us.current_period_end) > datetime('now') OR us.current_period_end IS NULL)
        ORDER BY us.created_at DESC LIMIT 1
      `, [userId]);
      
      console.log('🔍 Found subscription:', subscription);

      if (!subscription) {
        // Auto-create free trial if no subscription exists
        const freeTrialEndDate = new Date();
        freeTrialEndDate.setDate(freeTrialEndDate.getDate() + 30);
        
        await db.run(`
          INSERT INTO user_subscriptions (
            user_id, plan_id, status, trial_ends_at, 
            current_period_end, payment_method
          ) VALUES (?, 'free', 'trial', ?, ?, 'free')
        `, [userId, freeTrialEndDate.toISOString(), freeTrialEndDate.toISOString()]);

        // Re-fetch subscription
        const newSubscription = await db.get(`
          SELECT us.*, sp.id as plan_id, sp.name as plan_name
          FROM user_subscriptions us
          JOIN subscription_plans sp ON us.plan_id = sp.id
          WHERE us.user_id = ? 
          ORDER BY us.created_at DESC LIMIT 1
        `, [userId]);

        if (!newSubscription) {
          return res.status(403).json({
            success: false,
            error: 'No valid subscription found',
            code: 'SUBSCRIPTION_REQUIRED'
          });
        }

        subscription = newSubscription;
      }

      // Check if subscription is expired
      if (subscription.current_period_end && new Date(subscription.current_period_end) < new Date()) {
        return res.status(403).json({
          success: false,
          error: 'Subscription expired',
          code: 'SUBSCRIPTION_EXPIRED',
          expiredAt: subscription.current_period_end
        });
      }

      // Zkontroluj přístup k modulu
      const moduleAccess = await db.get(`
        SELECT pma.*, m.name as module_name, m.is_core
        FROM plan_module_access pma
        JOIN modules m ON pma.module_id = m.id
        WHERE pma.plan_id = ? AND pma.module_id = ? AND m.is_active = 1
      `, [subscription.plan_id, moduleId]);
      
      console.log('🔍 Module access query result:', moduleAccess);

      // Core moduly jsou vždy přístupné
      const module = await db.get(`SELECT is_core FROM modules WHERE id = ?`, [moduleId]);
      console.log('🔍 Module info:', module);
      
      if (module?.is_core) {
        console.log('✅ Core module - granting full access');
        req.moduleAccess = {
          hasAccess: true,
          accessLevel: 'full',
          isCore: true
        };
        return next();
      }

      if (!moduleAccess) {
        // Log access attempt
        await createAuditLog(db, {
          adminUserId: userId,
          adminEmail: req.user.email,
          action: 'module_access_denied',
          targetType: TARGET_TYPES.USER,
          targetId: userId,
          changesMade: { 
            module: moduleId, 
            plan: subscription.plan_id,
            reason: 'module_not_in_plan'
          },
          success: false,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        });

        return res.status(403).json({
          success: false,
          error: `Module '${moduleId}' not available in your current plan`,
          code: 'MODULE_ACCESS_DENIED',
          currentPlan: subscription.plan_name,
          suggestedAction: 'upgrade_plan'
        });
      }

      // Zkontroluj access level
      const accessLevels = ['read_only', 'limited', 'full'];
      const userLevel = accessLevels.indexOf(moduleAccess.access_level);
      const requiredLevel = accessLevels.indexOf(requiredAccessLevel);

      if (userLevel < requiredLevel) {
        return res.status(403).json({
          success: false,
          error: `Insufficient access level for module '${moduleId}'`,
          code: 'INSUFFICIENT_ACCESS_LEVEL',
          currentLevel: moduleAccess.access_level,
          requiredLevel: requiredAccessLevel
        });
      }

      // Přidej module access info do request
      req.moduleAccess = {
        hasAccess: true,
        accessLevel: moduleAccess.access_level,
        featureLimits: moduleAccess.feature_limits ? JSON.parse(moduleAccess.feature_limits) : null,
        subscription: {
          id: subscription.id,
          plan: subscription.plan_id,
          status: subscription.status,
          expiresAt: subscription.current_period_end
        }
      };

      next();

    } catch (error) {
      console.error('❌ Module access middleware error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to verify module access'
      });
    }
  };
};

// Usage tracking middleware
export const trackModuleUsage = (moduleId, usageType) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.db) return next();

      const db = req.db;
      const userId = req.user.id;

      // Skip tracking for admin
      if (req.user.role === 'admin') return next();

      const currentDate = new Date();
      const periodStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const periodEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      // Find or create usage record
      let usage = await db.get(`
        SELECT * FROM subscription_usage
        WHERE user_id = ? AND module_id = ? AND usage_type = ? AND period_start = ?
      `, [userId, moduleId, usageType, periodStart.toISOString().split('T')[0]]);

      if (usage) {
        // Update existing
        await db.run(`
          UPDATE subscription_usage 
          SET count_current = count_current + 1, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `, [usage.id]);

        // Check limits
        if (usage.count_limit && usage.count_current >= usage.count_limit) {
          return res.status(429).json({
            success: false,
            error: `Usage limit exceeded for ${usageType}`,
            code: 'USAGE_LIMIT_EXCEEDED',
            currentUsage: usage.count_current + 1,
            limit: usage.count_limit,
            resetDate: periodEnd.toISOString().split('T')[0]
          });
        }
      } else {
        // Create new usage record
        await db.run(`
          INSERT INTO subscription_usage (
            user_id, module_id, usage_type, count_current,
            period_start, period_end
          ) VALUES (?, ?, ?, 1, ?, ?)
        `, [
          userId, moduleId, usageType,
          periodStart.toISOString().split('T')[0],
          periodEnd.toISOString().split('T')[0]
        ]);
      }

      next();

    } catch (error) {
      console.error('❌ Usage tracking middleware error:', error);
      // Don't fail the request, just log the error
      next();
    }
  };
};

// Helper pro získání všech dostupných modulů pro uživatele
export const getUserModules = async (db, userId) => {
  try {
    // Admin má přístup ke všemu
    const user = await db.get('SELECT role FROM users WHERE id = ?', [userId]);
    if (user?.role === 'admin') {
      return await db.all('SELECT * FROM modules WHERE is_active = 1');
    }

    // Najdi aktivní subscription
    const subscription = await db.get(`
      SELECT plan_id FROM user_subscriptions
      WHERE user_id = ? AND status IN ('active', 'trial')
      AND (current_period_end > datetime('now') OR current_period_end IS NULL)
      ORDER BY created_at DESC LIMIT 1
    `, [userId]);

    if (!subscription) return [];

    // Získej moduly pro plán
    const modules = await db.all(`
      SELECT m.*, pma.access_level, pma.feature_limits
      FROM plan_module_access pma
      JOIN modules m ON pma.module_id = m.id
      WHERE pma.plan_id = ? AND m.is_active = 1
    `, [subscription.plan_id]);

    return modules.map(mod => ({
      ...mod,
      feature_limits: mod.feature_limits ? JSON.parse(mod.feature_limits) : null
    }));

  } catch (error) {
    console.error('❌ Get user modules error:', error);
    return [];
  }
};

// Module constants
export const MODULES = {
  CORE: 'core',
  PAYMENTS: 'payments',
  CRM: 'crm',
  ANALYTICS: 'analytics',
  ECOMMERCE: 'ecommerce'
};

export const ACCESS_LEVELS = {
  READ_ONLY: 'read_only',
  LIMITED: 'limited',
  FULL: 'full'
};

export const USAGE_TYPES = {
  API_CALLS: 'api_calls',
  PAYMENTS_CREATED: 'payments_created',
  USERS_CREATED: 'users_created',
  STORAGE_USED: 'storage_used',
  EMAIL_SENT: 'email_sent'
};