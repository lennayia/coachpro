// routes/subscription.js - Subscription management API
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { createAuditLog, AUDIT_ACTIONS, TARGET_TYPES } from '../middleware/auditLog.js';

const router = express.Router();

// Apply auth middleware
router.use(authenticateToken);

// 📋 Získat dostupné plány
router.get('/plans', async (req, res) => {
  try {
    const db = req.db;
    
    const plans = await db.all(`
      SELECT 
        sp.*,
        GROUP_CONCAT(pma.module_id) as module_ids,
        GROUP_CONCAT(m.name) as module_names
      FROM subscription_plans sp
      LEFT JOIN plan_module_access pma ON sp.id = pma.plan_id
      LEFT JOIN modules m ON pma.module_id = m.id
      WHERE sp.is_active = 1
      GROUP BY sp.id
      ORDER BY sp.sort_order, sp.price_monthly
    `);

    // Parse features JSON
    const processedPlans = plans.map(plan => ({
      ...plan,
      features: plan.features ? JSON.parse(plan.features) : [],
      modules: plan.module_ids ? plan.module_ids.split(',') : [],
      module_names: plan.module_names ? plan.module_names.split(',') : []
    }));

    res.json({
      success: true,
      plans: processedPlans
    });
  } catch (error) {
    console.error('❌ Get plans error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load subscription plans'
    });
  }
});

// 🎯 Získat aktuální subscription uživatele
router.get('/current', async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;

    // Najdi aktivní subscription
    const subscription = await db.get(`
      SELECT 
        us.*,
        sp.name as plan_name,
        sp.description as plan_description,
        sp.price_monthly,
        sp.features
      FROM user_subscriptions us
      JOIN subscription_plans sp ON us.plan_id = sp.id
      WHERE us.user_id = ? AND us.status IN ('active', 'trial')
      ORDER BY us.created_at DESC
      LIMIT 1
    `, [userId]);

    if (!subscription) {
      // Žádné aktivní subscription - vytvoř free trial
      const freeTrialEndDate = new Date();
      freeTrialEndDate.setDate(freeTrialEndDate.getDate() + 30);
      
      await db.run(`
        INSERT INTO user_subscriptions (
          user_id, plan_id, status, trial_ends_at, 
          current_period_end, payment_method
        ) VALUES (?, 'free', 'trial', ?, ?, 'free')
      `, [userId, freeTrialEndDate.toISOString(), freeTrialEndDate.toISOString()]);

      // Znovu načti subscription
      const newSubscription = await db.get(`
        SELECT 
          us.*,
          sp.name as plan_name,
          sp.description as plan_description,
          sp.price_monthly,
          sp.features
        FROM user_subscriptions us
        JOIN subscription_plans sp ON us.plan_id = sp.id
        WHERE us.user_id = ? 
        ORDER BY us.created_at DESC
        LIMIT 1
      `, [userId]);

      const processedSub = {
        ...newSubscription,
        features: newSubscription.features ? JSON.parse(newSubscription.features) : []
      };

      return res.json({
        success: true,
        data: processedSub
      });
    }

    // Získej přístupné moduly
    const moduleAccess = await db.all(`
      SELECT 
        m.*,
        pma.access_level,
        pma.feature_limits
      FROM plan_module_access pma
      JOIN modules m ON pma.module_id = m.id
      WHERE pma.plan_id = ? AND m.is_active = 1
    `, [subscription.plan_id]);

    const processedModules = moduleAccess.map(mod => ({
      ...mod,
      feature_limits: mod.feature_limits ? JSON.parse(mod.feature_limits) : null
    }));

    const processedSub = {
      ...subscription,
      features: subscription.features ? JSON.parse(subscription.features) : [],
      modules: processedModules
    };

    res.json({
      success: true,
      data: processedSub
    });

  } catch (error) {
    console.error('❌ Get current subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load subscription'
    });
  }
});

// 🔄 Změnit subscription plán
router.post('/change-plan', async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;
    const { plan_id } = req.body;

    // Ověř že plán existuje
    const plan = await db.get(`
      SELECT * FROM subscription_plans WHERE id = ? AND is_active = 1
    `, [plan_id]);

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Subscription plan not found'
      });
    }

    // Najdi současné subscription
    const currentSub = await db.get(`
      SELECT * FROM user_subscriptions 
      WHERE user_id = ? AND status IN ('active', 'trial')
      ORDER BY created_at DESC LIMIT 1
    `, [userId]);

    if (currentSub) {
      // Zruš současné subscription
      await db.run(`
        UPDATE user_subscriptions 
        SET status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [currentSub.id]);
    }

    // Vytvoř nové subscription
    const trialDays = plan.trial_days || 0;
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + trialDays);

    const periodEndDate = new Date();
    periodEndDate.setMonth(periodEndDate.getMonth() + 1); // Měsíční billing

    await db.run(`
      INSERT INTO user_subscriptions (
        user_id, plan_id, status, trial_ends_at,
        current_period_end, payment_method
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      userId, 
      plan_id, 
      trialDays > 0 ? 'trial' : 'active',
      trialDays > 0 ? trialEndDate.toISOString() : null,
      periodEndDate.toISOString(),
      plan.price_monthly > 0 ? 'pending' : 'free'
    ]);

    // Audit log
    await createAuditLog(db, {
      adminUserId: userId,
      adminEmail: req.user.email,
      action: 'subscription_change',
      targetType: 'subscription',
      targetId: userId,
      changesMade: { from: currentSub?.plan_id, to: plan_id },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: `Subscription changed to ${plan.name}`,
      plan: plan.name
    });

  } catch (error) {
    console.error('❌ Change plan error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change subscription plan'
    });
  }
});

// 🔑 Ověřit přístup k modulu
router.get('/access/:module_id', async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;
    const { module_id } = req.params;

    // Najdi aktivní subscription
    const subscription = await db.get(`
      SELECT us.*, sp.id as plan_id
      FROM user_subscriptions us
      JOIN subscription_plans sp ON us.plan_id = sp.id
      WHERE us.user_id = ? AND us.status IN ('active', 'trial')
      ORDER BY us.created_at DESC LIMIT 1
    `, [userId]);

    if (!subscription) {
      return res.json({
        success: true,
        data: { hasAccess: false, reason: 'no_subscription' }
      });
    }

    // Zkontroluj přístup k modulu
    const moduleAccess = await db.get(`
      SELECT pma.*, m.name as module_name
      FROM plan_module_access pma
      JOIN modules m ON pma.module_id = m.id
      WHERE pma.plan_id = ? AND pma.module_id = ?
    `, [subscription.plan_id, module_id]);

    const hasAccess = !!moduleAccess;

    res.json({
      success: true,
      data: {
        hasAccess,
        accessLevel: moduleAccess?.access_level || null,
        featureLimits: moduleAccess?.feature_limits ? JSON.parse(moduleAccess.feature_limits) : null,
        subscription: {
          plan: subscription.plan_id,
          status: subscription.status,
          expiresAt: subscription.current_period_end
        }
      }
    });

  } catch (error) {
    console.error('❌ Check module access error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check module access'
    });
  }
});

// 📊 Usage tracking
router.post('/usage/:module_id', async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;
    const { module_id } = req.params;
    const { usage_type, increment = 1 } = req.body;

    const currentDate = new Date();
    const periodStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const periodEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Najdi nebo vytvoř usage záznam
    let usage = await db.get(`
      SELECT * FROM subscription_usage
      WHERE user_id = ? AND module_id = ? AND usage_type = ? AND period_start = ?
    `, [userId, module_id, usage_type, periodStart.toISOString().split('T')[0]]);

    if (usage) {
      // Aktualizuj existující
      await db.run(`
        UPDATE subscription_usage 
        SET count_current = count_current + ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [increment, usage.id]);
    } else {
      // Vytvoř nový
      await db.run(`
        INSERT INTO subscription_usage (
          user_id, module_id, usage_type, count_current,
          period_start, period_end
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        userId, module_id, usage_type, increment,
        periodStart.toISOString().split('T')[0],
        periodEnd.toISOString().split('T')[0]
      ]);
    }

    res.json({
      success: true,
      message: 'Usage tracked'
    });

  } catch (error) {
    console.error('❌ Track usage error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track usage'
    });
  }
});

// === ADMIN ONLY ROUTES ===
router.use(requireAdmin);

// 👥 Admin - seznam všech subscriptions
router.get('/admin/subscriptions', async (req, res) => {
  try {
    const db = req.db;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const subscriptions = await db.all(`
      SELECT 
        us.*,
        u.email,
        u.first_name,
        u.last_name,
        sp.name as plan_name,
        sp.price_monthly
      FROM user_subscriptions us
      JOIN users u ON us.user_id = u.id
      JOIN subscription_plans sp ON us.plan_id = sp.id
      ORDER BY us.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    res.json({
      success: true,
      data: subscriptions
    });

  } catch (error) {
    console.error('❌ Admin subscriptions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load subscriptions'
    });
  }
});

// 🔧 Admin - upravit subscription
router.put('/admin/subscriptions/:id', async (req, res) => {
  try {
    const db = req.db;
    const { id } = req.params;
    const { plan_id, status, current_period_end } = req.body;

    await db.run(`
      UPDATE user_subscriptions 
      SET plan_id = ?, status = ?, current_period_end = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [plan_id, status, current_period_end, id]);

    res.json({
      success: true,
      message: 'Subscription updated'
    });

  } catch (error) {
    console.error('❌ Admin update subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update subscription'
    });
  }
});

export default router;