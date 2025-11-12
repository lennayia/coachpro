// routes/admin.js - Admin rozhraní pro správu aplikace
import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { auditLogMiddleware, createAuditLog, AUDIT_ACTIONS, TARGET_TYPES } from '../middleware/auditLog.js';

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// 📊 Admin Dashboard - přehled statistik
router.get('/dashboard', auditLogMiddleware(AUDIT_ACTIONS.DASHBOARD_VIEW, TARGET_TYPES.SYSTEM), async (req, res) => {
  try {
    const db = req.db;
    
    // Celkové statistiky
    const userCount = await db.get('SELECT COUNT(*) as count FROM users WHERE is_active = 1');
    const totalUsers = userCount.count;
    
    const adminCount = await db.get('SELECT COUNT(*) as count FROM users WHERE role = "admin" AND is_active = 1');
    const totalAdmins = adminCount.count;
    
    const paymentCount = await db.get('SELECT COUNT(*) as count FROM payments');
    const totalPayments = paymentCount.count;
    
    const activePaymentCount = await db.get('SELECT COUNT(*) as count FROM payments WHERE is_active = 1');
    const totalActivePayments = activePaymentCount.count;
    
    const categoryCount = await db.get('SELECT COUNT(*) as count FROM categories');
    const totalCategories = categoryCount.count;
    
    const rezervyCount = await db.get('SELECT COUNT(*) as count FROM rezervy');
    const totalRezervy = rezervyCount.count;
    
    // Nejnovější uživatelé (posledních 10)
    const recentUsers = await db.all(`
      SELECT id, email, first_name, last_name, role, created_at, last_login_at, is_active
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    // Top kategorie podle počtu plateb
    const topCategories = await db.all(`
      SELECT c.name, c.color, c.icon, COUNT(p.id) as payment_count
      FROM categories c
      LEFT JOIN payments p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY payment_count DESC
      LIMIT 10
    `);
    
    // Měsíční statistiky registrací (posledních 6 měsíců)
    const monthlyStats = await db.all(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as user_registrations
      FROM users
      WHERE created_at >= datetime('now', '-6 months')
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month DESC
    `);
    
    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalAdmins,
          totalPayments,
          totalActivePayments,
          totalCategories,
          totalRezervy
        },
        recentUsers,
        topCategories,
        monthlyStats
      }
    });
    
  } catch (error) {
    console.error('❌ Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load dashboard data'
    });
  }
});

// 👥 Správa uživatelů - seznam všech uživatelů
router.get('/users', auditLogMiddleware(AUDIT_ACTIONS.USERS_LIST, TARGET_TYPES.USER), async (req, res) => {
  try {
    const db = req.db;
    const { page = 1, limit = 20, search = '', role = '', active = '' } = req.query;
    
    let whereConditions = ['1 = 1'];
    let params = [];
    
    // Search filtr
    if (search) {
      whereConditions.push('(email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)');
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    // Role filtr
    if (role && role !== 'all') {
      whereConditions.push('role = ?');
      params.push(role);
    }
    
    // Active filtr
    if (active && active !== 'all') {
      whereConditions.push('is_active = ?');
      params.push(active === 'true' ? 1 : 0);
    }
    
    const whereClause = whereConditions.join(' AND ');
    const offset = (page - 1) * limit;
    
    // Získání uživatelů s paginací
    const users = await db.all(`
      SELECT 
        id, email, first_name, last_name, role, 
        email_verified, is_active, google_id, apple_id,
        created_at, updated_at, last_login_at,
        (SELECT COUNT(*) FROM payments WHERE user_id = users.id) as payment_count,
        (SELECT COUNT(*) FROM rezervy WHERE user_id = users.id) as rezervy_count
      FROM users 
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);
    
    // Celkový počet pro paginaci
    const totalResult = await db.get(`
      SELECT COUNT(*) as total 
      FROM users 
      WHERE ${whereClause}
    `, params);
    
    const totalUsers = totalResult.total;
    const totalPages = Math.ceil(totalUsers / limit);
    
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          limit: parseInt(limit),
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Admin users list error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load users'
    });
  }
});

// 👤 Detail uživatele s jeho daty
router.get('/users/:id', auditLogMiddleware(AUDIT_ACTIONS.USER_VIEW, TARGET_TYPES.USER), async (req, res) => {
  try {
    const db = req.db;
    const { id } = req.params;
    
    // Základní info o uživateli
    const user = await db.get(`
      SELECT * FROM users WHERE id = ?
    `, [id]);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Platby uživatele
    const payments = await db.all(`
      SELECT p.*, c.name as category_name, c.color as category_color
      FROM payments p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `, [id]);
    
    // Rezervy uživatele
    const rezervy = await db.all(`
      SELECT * FROM rezervy WHERE user_id = ?
      ORDER BY created_at DESC
    `, [id]);
    
    // Kategorie uživatele
    const categories = await db.all(`
      SELECT c.*, COUNT(p.id) as payment_count
      FROM categories c
      LEFT JOIN payments p ON c.id = p.category_id AND p.user_id = ?
      WHERE c.user_id = ?
      GROUP BY c.id
      ORDER BY c.name
    `, [id, id]);
    
    // Statistiky uživatele
    const stats = await db.get(`
      SELECT 
        COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_payments,
        COUNT(*) as total_payments,
        SUM(CASE WHEN is_active = 1 THEN amount ELSE 0 END) as monthly_total
      FROM payments 
      WHERE user_id = ?
    `, [id]);
    
    res.json({
      success: true,
      data: {
        user,
        payments,
        rezervy,
        categories,
        stats
      }
    });
    
  } catch (error) {
    console.error('❌ Admin user detail error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load user details'
    });
  }
});

// 🔧 Upravit uživatele (admin může změnit role, active status)
router.put('/users/:id', auditLogMiddleware(AUDIT_ACTIONS.USER_UPDATE, TARGET_TYPES.USER), async (req, res) => {
  try {
    const db = req.db;
    const { id } = req.params;
    const { role, is_active, email_verified, first_name, last_name, email } = req.body;
    
    // Zabráníme změně role posledního admina
    if (role === 'user') {
      const adminCount = await db.get('SELECT COUNT(*) as count FROM users WHERE role = "admin" AND is_active = 1');
      if (adminCount.count <= 1) {
        const currentUser = await db.get('SELECT role FROM users WHERE id = ?', [id]);
        if (currentUser?.role === 'admin') {
          return res.status(400).json({
            success: false,
            error: 'Nelze změnit roli posledního aktivního administrátora'
          });
        }
      }
    }
    
    await db.run(`
      UPDATE users 
      SET role = ?, is_active = ?, email_verified = ?, 
          first_name = ?, last_name = ?, email = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [role, is_active ? 1 : 0, email_verified ? 1 : 0, first_name, last_name, email, id]);
    
    // Log admin akce
    console.log(`🔧 Admin ${req.user.email} upravil uživatele ID ${id}: role=${role}, active=${is_active}`);
    
    res.json({
      success: true,
      message: 'Uživatel byl úspěšně upraven'
    });
    
  } catch (error) {
    console.error('❌ Admin user update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
});

// 🗑️ Deaktivace uživatele (soft delete)
router.delete('/users/:id', auditLogMiddleware(AUDIT_ACTIONS.USER_DELETE, TARGET_TYPES.USER), async (req, res) => {
  try {
    const db = req.db;
    const { id } = req.params;
    
    // Zabráníme smazání sebe sama
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Nemůžete deaktivovat svůj vlastní účet'
      });
    }
    
    // Zabráníme deaktivaci posledního admina
    const user = await db.get('SELECT role FROM users WHERE id = ?', [id]);
    if (user?.role === 'admin') {
      const adminCount = await db.get('SELECT COUNT(*) as count FROM users WHERE role = "admin" AND is_active = 1');
      if (adminCount.count <= 1) {
        return res.status(400).json({
          success: false,
          error: 'Nelze deaktivovat posledního aktivního administrátora'
        });
      }
    }
    
    await db.run(`
      UPDATE users 
      SET is_active = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [id]);
    
    // Log admin akce
    console.log(`🗑️ Admin ${req.user.email} deaktivoval uživatele ID ${id}`);
    
    res.json({
      success: true,
      message: 'Uživatel byl deaktivován'
    });
    
  } catch (error) {
    console.error('❌ Admin user delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to deactivate user'
    });
  }
});

// 📊 Systémové informace
router.get('/system', auditLogMiddleware(AUDIT_ACTIONS.SYSTEM_INFO, TARGET_TYPES.SYSTEM), async (req, res) => {
  try {
    const db = req.db;
    
    // Database size info
    const dbStats = await db.get('SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()');
    
    // Table counts
    const tables = await db.all(`
      SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `);
    
    const tableStats = {};
    for (const table of tables) {
      const result = await db.get(`SELECT COUNT(*) as count FROM ${table.name}`);
      tableStats[table.name] = result.count;
    }
    
    res.json({
      success: true,
      data: {
        database: {
          size: dbStats?.size || 0,
          tables: tableStats
        },
        server: {
          nodeVersion: process.version,
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage()
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Admin system info error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load system info'
    });
  }
});

// 💼 Správa předplatných - seznam všech subscriptions
router.get('/subscriptions', auditLogMiddleware(AUDIT_ACTIONS.SUBSCRIPTION_LIST, TARGET_TYPES.SUBSCRIPTION), async (req, res) => {
  try {
    const db = req.db;
    
    const subscriptions = await db.all(`
      SELECT 
        us.id, us.user_id, us.plan_id, us.status, us.started_at,
        us.trial_ends_at, us.current_period_start, us.current_period_end,
        us.cancel_at_period_end, us.cancelled_at, us.payment_method,
        us.external_subscription_id, us.created_at, us.updated_at,
        sp.name as plan_name,
        u.email as user_email, u.first_name, u.last_name, u.role
      FROM user_subscriptions us
      LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
      LEFT JOIN users u ON us.user_id = u.id
      ORDER BY us.created_at DESC
    `);

    res.json({
      success: true,
      subscriptions: subscriptions
    });
  } catch (error) {
    console.error('❌ Admin subscriptions list error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load subscriptions'
    });
  }
});

// 💼 Upravit předplatné
router.put('/subscriptions/:id', auditLogMiddleware(AUDIT_ACTIONS.SUBSCRIPTION_UPDATE, TARGET_TYPES.SUBSCRIPTION), async (req, res) => {
  try {
    const db = req.db;
    const { id } = req.params;
    const { plan_id, status } = req.body;

    // Validation
    const validPlans = ['free', 'basic', 'business', 'enterprise'];
    const validStatuses = ['active', 'trial', 'cancelled', 'expired'];

    if (plan_id && !validPlans.includes(plan_id)) {
      return res.status(400).json({
        success: false,
        error: 'Neplatný plán předplatného'
      });
    }

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Neplatný status předplatného'
      });
    }

    // Update subscription
    const updates = [];
    const params = [];
    
    if (plan_id) {
      updates.push('plan_id = ?');
      params.push(plan_id);
    }
    
    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Žádné změny k uložení'
      });
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await db.run(`
      UPDATE user_subscriptions 
      SET ${updates.join(', ')}
      WHERE id = ?
    `, params);

    console.log(`💼 Admin ${req.user.email} upravil předplatné ID ${id}`);

    res.json({
      success: true,
      message: 'Předplatné bylo úspěšně upraveno'
    });
  } catch (error) {
    console.error('❌ Admin subscription update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update subscription'
    });
  }
});

// 🔄 Všichni uživatelé s subscription statusem
router.get('/users-subscriptions', auditLogMiddleware(AUDIT_ACTIONS.SUBSCRIPTION_LIST, TARGET_TYPES.SUBSCRIPTION), async (req, res) => {
  try {
    const db = req.db;
    
    // Získej všechny uživatele s jejich aktuálním předplatným
    const usersWithSubscriptions = await db.all(`
      SELECT 
        u.id as user_id,
        u.email,
        u.first_name,
        u.last_name,
        u.role,
        u.is_active as user_active,
        u.created_at as user_created,
        u.email_verified,
        u.last_login_at,
        
        -- Subscription info
        us.id as subscription_id,
        us.plan_id,
        us.status as subscription_status,
        us.started_at as subscription_started,
        us.current_period_end,
        us.current_period_start,
        us.trial_ends_at,
        us.external_subscription_id,
        us.created_at as subscription_created,
        us.updated_at as subscription_updated,
        
        -- Plan info
        sp.name as plan_name,
        sp.price_monthly as plan_price_monthly,
        sp.price_yearly as plan_price_yearly,
        sp.currency as plan_currency,
        CASE 
          WHEN us.current_period_end IS NOT NULL AND 
               CAST((julianday(us.current_period_end) - julianday(us.current_period_start)) AS INTEGER) > 35 
          THEN 'yearly' 
          ELSE 'monthly' 
        END as billing_cycle,
        sp.features,
        CASE WHEN sp.price_monthly = 0 THEN 1 ELSE 0 END as is_free,
        sp.trial_days
        
      FROM users u
      LEFT JOIN (
        SELECT us.*, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
        FROM user_subscriptions us 
        WHERE us.status IN ('active', 'trial')
      ) us ON u.id = us.user_id AND us.rn = 1
      LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
      ORDER BY u.created_at DESC
    `);
    
    // Přidat defaultní free plán pro uživatele bez předplatného
    const processedUsers = usersWithSubscriptions.map(user => {
      if (!user.subscription_id) {
        return {
          ...user,
          subscription_status: 'free',
          plan_name: 'Free',
          plan_price_monthly: 0,
          plan_price_yearly: 0,
          plan_currency: 'CZK',
          billing_cycle: 'lifetime',
          is_free: 1,
          trial_days: 0
        };
      }
      return user;
    });

    res.json({
      success: true,
      data: {
        users: processedUsers,
        total: processedUsers.length
      }
    });
  } catch (error) {
    console.error('❌ Admin users-subscriptions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load users with subscriptions'
    });
  }
});

// 🔄 Změna předplatného uživatele
router.put('/users/:id/subscription', auditLogMiddleware(AUDIT_ACTIONS.SUBSCRIPTION_UPDATE, TARGET_TYPES.SUBSCRIPTION), async (req, res) => {
  try {
    const db = req.db;
    const userId = parseInt(req.params.id);
    const { plan_id, billing_cycle = 'monthly' } = req.body;
    
    if (!plan_id) {
      return res.status(400).json({
        success: false,
        error: 'Plan ID je povinný'
      });
    }

    // Ověř, že plán existuje
    const plan = await db.get('SELECT * FROM subscription_plans WHERE id = ? AND is_active = 1', [plan_id]);
    if (!plan) {
      return res.status(400).json({
        success: false,
        error: 'Neplatný plán'
      });
    }

    // Najdi nebo vytvoř subscription pro uživatele
    let subscription = await db.get('SELECT * FROM user_subscriptions WHERE user_id = ?', [userId]);
    
    const now = new Date().toISOString();
    const periodEnd = billing_cycle === 'yearly' 
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    if (subscription) {
      // Update existující subscription
      await db.run(`
        UPDATE user_subscriptions SET 
          plan_id = ?,
          status = ?,
          current_period_start = ?,
          current_period_end = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, [
        plan_id,
        plan_id === 'free' ? 'active' : 'active',
        now,
        periodEnd,
        userId
      ]);
    } else {
      // Vytvoř nový subscription
      await db.run(`
        INSERT INTO user_subscriptions (
          user_id, plan_id, status, started_at, 
          current_period_start, current_period_end
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        userId, plan_id, 'active', now, now, periodEnd
      ]);
    }

    console.log(`✅ Admin changed subscription for user ${userId} to plan ${plan_id}`);

    res.json({
      success: true,
      message: 'Předplatné bylo úspěšně změněno'
    });
  } catch (error) {
    console.error('❌ Admin subscription change error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change subscription'
    });
  }
});

// 📝 Audit Logs - zobrazení admin akcí
router.get('/audit-logs', async (req, res) => {
  try {
    const db = req.db;
    const { page = 1, limit = 50, action = '', admin_email = '', target_type = '' } = req.query;
    
    let whereConditions = ['1 = 1'];
    let params = [];
    
    // Action filter
    if (action && action !== 'all') {
      whereConditions.push('action = ?');
      params.push(action);
    }
    
    // Admin email filter
    if (admin_email) {
      whereConditions.push('admin_email LIKE ?');
      params.push(`%${admin_email}%`);
    }
    
    // Target type filter
    if (target_type && target_type !== 'all') {
      whereConditions.push('target_type = ?');
      params.push(target_type);
    }
    
    const whereClause = whereConditions.join(' AND ');
    const offset = (page - 1) * limit;
    
    // Získání audit logů s paginací
    const auditLogs = await db.all(`
      SELECT 
        id, admin_user_id, admin_email, action, target_type, target_id,
        target_details, changes_made, ip_address, user_agent,
        success, error_message, created_at
      FROM audit_logs 
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);
    
    // Celkový počet pro paginaci
    const totalResult = await db.get(`
      SELECT COUNT(*) as total 
      FROM audit_logs 
      WHERE ${whereClause}
    `, params);
    
    const totalLogs = totalResult.total;
    const totalPages = Math.ceil(totalLogs / limit);
    
    // Parse JSON fields
    const processedLogs = auditLogs.map(log => ({
      ...log,
      target_details: log.target_details ? JSON.parse(log.target_details) : null,
      changes_made: log.changes_made ? JSON.parse(log.changes_made) : null,
      success: Boolean(log.success)
    }));
    
    res.json({
      success: true,
      data: {
        auditLogs: processedLogs,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalLogs,
          limit: parseInt(limit),
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Admin audit logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load audit logs'
    });
  }
});

// 🔄 Bulk operace s uživateli
router.post('/users/bulk-action', auditLogMiddleware(AUDIT_ACTIONS.BULK_ACTION, TARGET_TYPES.USER), async (req, res) => {
  try {
    const db = req.db;
    const { action, userIds, data } = req.body;
    
    if (!action || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Chybí action, userIds nebo prázdný seznam uživatelů'
      });
    }
    
    console.log(`🔄 Bulk action: ${action} na ${userIds.length} uživatelích`);
    
    let results = [];
    let errors = [];
    
    for (const userId of userIds) {
      try {
        switch (action) {
          case 'activate':
            await db.run('UPDATE users SET is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [userId]);
            results.push({ userId, action: 'activated' });
            break;
            
          case 'deactivate':
            // Kontrola aby nedeaktivovali posledního admina
            const user = await db.get('SELECT role FROM users WHERE id = ?', [userId]);
            if (user?.role === 'admin') {
              const adminCount = await db.get('SELECT COUNT(*) as count FROM users WHERE role = "admin" AND is_active = 1');
              if (adminCount.count <= 1) {
                errors.push({ userId, error: 'Nelze deaktivovat posledního admina' });
                continue;
              }
            }
            await db.run('UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [userId]);
            results.push({ userId, action: 'deactivated' });
            break;
            
          case 'changeRole':
            const { newRole } = data;
            if (!newRole || !['admin', 'user'].includes(newRole)) {
              errors.push({ userId, error: 'Neplatná role' });
              continue;
            }
            await db.run('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newRole, userId]);
            results.push({ userId, action: `role changed to ${newRole}` });
            break;
            
          case 'delete':
            // Kontrola aby nesmazali posledního admina
            const deleteUser = await db.get('SELECT role FROM users WHERE id = ?', [userId]);
            if (deleteUser?.role === 'admin') {
              const adminCount = await db.get('SELECT COUNT(*) as count FROM users WHERE role = "admin" AND is_active = 1');
              if (adminCount.count <= 1) {
                errors.push({ userId, error: 'Nelze smazat posledního admina' });
                continue;
              }
            }
            await db.run('UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [userId]);
            results.push({ userId, action: 'deleted (deactivated)' });
            break;
            
          case 'resendVerification':
            // TODO: Implementovat poslání ověřovacího emailu
            results.push({ userId, action: 'verification email sent (mock)' });
            break;
            
          case 'export':
            // Export se řeší jinak - jen vrátíme success
            results.push({ userId, action: 'prepared for export' });
            break;
            
          default:
            errors.push({ userId, error: `Neznámá akce: ${action}` });
        }
      } catch (error) {
        console.error(`❌ Bulk action error for user ${userId}:`, error);
        errors.push({ userId, error: error.message });
      }
    }
    
    // Log bulk akce
    console.log(`✅ Bulk action ${action} dokončena: ${results.length} úspěšných, ${errors.length} chyb`);
    
    res.json({
      success: true,
      data: {
        processed: results.length,
        errors: errors.length,
        results,
        errors
      }
    });
    
  } catch (error) {
    console.error('❌ Bulk action error:', error);
    res.status(500).json({
      success: false,
      error: 'Chyba při provádění bulk akce'
    });
  }
});

export default router;