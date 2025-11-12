// routes/modules-sqlite.js - Temporary SQLite version (until Supabase migration)
import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/modules
 * Získat seznam všech aktivních modulů (public)
 */
router.get('/', async (req, res) => {
  try {
    const modules = await req.db.all(`
      SELECT * FROM modules
      WHERE is_active = 1
      ORDER BY sort_order ASC
    `);

    res.json({
      success: true,
      modules
    });

  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch modules',
      message: error.message
    });
  }
});

/**
 * GET /api/modules/my
 * Získat moduly dostupné pro aktuálního uživatele
 */
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const moduleAccess = await req.db.all(`
      SELECT
        uma.module_id,
        uma.is_enabled,
        uma.granted_at,
        uma.expires_at,
        m.id,
        m.name,
        m.description,
        m.icon,
        m.color,
        m.is_active
      FROM user_module_access uma
      JOIN modules m ON uma.module_id = m.id
      WHERE uma.user_id = ? AND uma.is_enabled = 1 AND m.is_active = 1
    `, [req.user.id]);

    // Filtruj jen moduly které ještě nevypršely
    const activeModules = moduleAccess.filter(access => {
      if (!access.expires_at) return true; // Nevyprší nikdy
      return new Date(access.expires_at) > new Date();
    });

    res.json({
      success: true,
      modules: activeModules.map(access => ({
        id: access.module_id,
        name: access.name,
        description: access.description,
        icon: access.icon,
        color: access.color,
        granted_at: access.granted_at,
        expires_at: access.expires_at
      }))
    });

  } catch (error) {
    console.error('Get user modules error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user modules',
      message: error.message
    });
  }
});

/**
 * POST /api/modules/:moduleId/grant
 * Udělit přístup k modulu uživateli (admin only)
 */
router.post('/:moduleId/grant',
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { moduleId } = req.params;
      const { user_id, expires_at } = req.body;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          error: 'user_id is required'
        });
      }

      // Kontrola, zda modul existuje
      const module = await req.db.get('SELECT id FROM modules WHERE id = ?', [moduleId]);
      if (!module) {
        return res.status(404).json({
          success: false,
          error: 'Module not found',
          message: `Module '${moduleId}' does not exist`
        });
      }

      // Kontrola, zda user existuje
      const user = await req.db.get('SELECT id FROM users WHERE id = ?', [user_id]);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          message: 'User does not exist'
        });
      }

      // Přidej nebo update přístup (UPSERT)
      const existing = await req.db.get(
        'SELECT id FROM user_module_access WHERE user_id = ? AND module_id = ?',
        [user_id, moduleId]
      );

      if (existing) {
        await req.db.run(`
          UPDATE user_module_access
          SET is_enabled = 1, expires_at = ?, granted_by = ?
          WHERE user_id = ? AND module_id = ?
        `, [expires_at || null, req.user.id, user_id, moduleId]);
      } else {
        await req.db.run(`
          INSERT INTO user_module_access (user_id, module_id, is_enabled, expires_at, granted_by)
          VALUES (?, ?, 1, ?, ?)
        `, [user_id, moduleId, expires_at || null, req.user.id]);
      }

      res.json({
        success: true,
        message: 'Module access granted'
      });

    } catch (error) {
      console.error('Grant module access error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to grant module access',
        message: error.message
      });
    }
  }
);

/**
 * DELETE /api/modules/:moduleId/revoke
 * Odebrat přístup k modulu (admin only)
 */
router.delete('/:moduleId/revoke',
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { moduleId } = req.params;
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          error: 'user_id is required'
        });
      }

      await req.db.run(
        'DELETE FROM user_module_access WHERE user_id = ? AND module_id = ?',
        [user_id, moduleId]
      );

      res.json({
        success: true,
        message: 'Module access revoked'
      });

    } catch (error) {
      console.error('Revoke module access error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to revoke module access',
        message: error.message
      });
    }
  }
);

/**
 * POST /api/modules (admin only)
 * Vytvořit nový modul
 */
router.post('/',
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { id, name, description, icon, color, requires_subscription, sort_order } = req.body;

      if (!id || !name) {
        return res.status(400).json({
          success: false,
          error: 'id and name are required'
        });
      }

      await req.db.run(`
        INSERT INTO modules (id, name, description, icon, color, requires_subscription, sort_order, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `, [
        id,
        name,
        description || null,
        icon || null,
        color || null,
        requires_subscription !== false ? 1 : 0,
        sort_order || 0
      ]);

      const newModule = await req.db.get('SELECT * FROM modules WHERE id = ?', [id]);

      res.status(201).json({
        success: true,
        message: 'Module created successfully',
        module: newModule
      });

    } catch (error) {
      console.error('Create module error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create module',
        message: error.message
      });
    }
  }
);

export default router;
