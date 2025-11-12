import express from 'express'
import { body, validationResult } from 'express-validator'
import { supabase } from '../lib/supabase.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

/**
 * GET /api/modules
 * Získat seznam všech aktivních modulů (public)
 */
router.get('/', async (req, res) => {
  try {
    const { data: modules, error } = await supabase
      .from('modules')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) throw error

    res.json({ modules })

  } catch (error) {
    console.error('Get modules error:', error)
    res.status(500).json({
      error: 'Failed to fetch modules',
      message: error.message
    })
  }
})

/**
 * GET /api/modules/my
 * Získat moduly dostupné pro aktuálního uživatele
 */
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const { data: moduleAccess, error } = await supabase
      .from('user_module_access')
      .select(`
        module_id,
        is_enabled,
        granted_at,
        expires_at,
        modules (
          id,
          name,
          description,
          icon,
          color,
          is_active
        )
      `)
      .eq('user_id', req.user.id)
      .eq('is_enabled', true)

    if (error) throw error

    // Filtruj jen aktivní moduly které ještě nevypršely
    const activeModules = moduleAccess.filter(access => {
      if (!access.modules.is_active) return false
      if (access.expires_at && new Date(access.expires_at) < new Date()) return false
      return true
    })

    res.json({
      modules: activeModules.map(access => ({
        ...access.modules,
        granted_at: access.granted_at,
        expires_at: access.expires_at
      }))
    })

  } catch (error) {
    console.error('Get user modules error:', error)
    res.status(500).json({
      error: 'Failed to fetch user modules',
      message: error.message
    })
  }
})

/**
 * POST /api/modules/:moduleId/grant
 * Udělit přístup k modulu uživateli (admin only)
 */
router.post('/:moduleId/grant',
  authenticateToken,
  requireAdmin,
  [
    body('user_id').isUUID(),
    body('expires_at').optional().isISO8601()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { moduleId } = req.params
      const { user_id, expires_at } = req.body

      // Kontrola, zda modul existuje
      const { data: module } = await supabase
        .from('modules')
        .select('id')
        .eq('id', moduleId)
        .single()

      if (!module) {
        return res.status(404).json({
          error: 'Module not found',
          message: `Module '${moduleId}' does not exist`
        })
      }

      // Kontrola, zda user existuje
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('id', user_id)
        .single()

      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User does not exist'
        })
      }

      // Přidej nebo update přístup
      const { data: access, error } = await supabase
        .from('user_module_access')
        .upsert([{
          user_id,
          module_id: moduleId,
          is_enabled: true,
          expires_at: expires_at || null,
          granted_by: req.user.id
        }], {
          onConflict: 'user_id,module_id'
        })
        .select()
        .single()

      if (error) throw error

      res.json({
        message: 'Module access granted',
        access
      })

    } catch (error) {
      console.error('Grant module access error:', error)
      res.status(500).json({
        error: 'Failed to grant module access',
        message: error.message
      })
    }
  }
)

/**
 * DELETE /api/modules/:moduleId/revoke
 * Odebrat přístup k modulu (admin only)
 */
router.delete('/:moduleId/revoke',
  authenticateToken,
  requireAdmin,
  [
    body('user_id').isUUID()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { moduleId } = req.params
      const { user_id } = req.body

      const { error } = await supabase
        .from('user_module_access')
        .delete()
        .eq('user_id', user_id)
        .eq('module_id', moduleId)

      if (error) throw error

      res.json({ message: 'Module access revoked' })

    } catch (error) {
      console.error('Revoke module access error:', error)
      res.status(500).json({
        error: 'Failed to revoke module access',
        message: error.message
      })
    }
  }
)

/**
 * GET /api/modules/:moduleId/users
 * Získat seznam uživatelů s přístupem k modulu (admin only)
 */
router.get('/:moduleId/users',
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { moduleId } = req.params

      const { data: access, error } = await supabase
        .from('user_module_access')
        .select(`
          *,
          users (
            id,
            email,
            first_name,
            last_name,
            role
          )
        `)
        .eq('module_id', moduleId)
        .eq('is_enabled', true)

      if (error) throw error

      res.json({
        module_id: moduleId,
        users: access.map(a => ({
          ...a.users,
          granted_at: a.granted_at,
          expires_at: a.expires_at,
          granted_by: a.granted_by
        }))
      })

    } catch (error) {
      console.error('Get module users error:', error)
      res.status(500).json({
        error: 'Failed to fetch module users',
        message: error.message
      })
    }
  }
)

/**
 * POST /api/modules (admin only)
 * Vytvořit nový modul
 */
router.post('/',
  authenticateToken,
  requireAdmin,
  [
    body('id').matches(/^[a-z0-9_]+$/),
    body('name').notEmpty(),
    body('description').optional(),
    body('icon').optional(),
    body('color').optional().matches(/^#[0-9A-F]{6}$/i)
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { id, name, description, icon, color, requires_subscription, sort_order } = req.body

      const { data: newModule, error } = await supabase
        .from('modules')
        .insert([{
          id,
          name,
          description,
          icon,
          color,
          requires_subscription: requires_subscription ?? true,
          sort_order: sort_order ?? 0,
          is_active: true
        }])
        .select()
        .single()

      if (error) throw error

      res.status(201).json({
        message: 'Module created successfully',
        module: newModule
      })

    } catch (error) {
      console.error('Create module error:', error)
      res.status(500).json({
        error: 'Failed to create module',
        message: error.message
      })
    }
  }
)

export default router
