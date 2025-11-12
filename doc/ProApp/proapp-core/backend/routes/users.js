import express from 'express'
import { body, validationResult } from 'express-validator'
import { supabase } from '../lib/supabase.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'
import bcrypt from 'bcryptjs'

const router = express.Router()

// Všechny routes vyžadují autentizaci
router.use(authenticateToken)

/**
 * GET /api/users
 * Získat seznam všech uživatelů (admin only)
 */
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query

    let query = supabase
      .from('users')
      .select('id, email, first_name, last_name, role, is_active, email_verified, created_at, last_login_at', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Vyhledávání
    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
    }

    // Paginace
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: users, error, count } = await query

    if (error) throw error

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    })

  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({
      error: 'Failed to fetch users',
      message: error.message
    })
  }
})

/**
 * GET /api/users/:id
 * Získat detail uživatele
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    // User může vidět jen sebe, admin všechny
    if (req.user.id !== id && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only view your own profile'
      })
    }

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        user_subscriptions(*, subscription_plans(*)),
        user_module_access(*, modules(*))
      `)
      .eq('id', id)
      .single()

    if (error || !user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      })
    }

    // Odstraň citlivá data
    delete user.password_hash

    res.json({ user })

  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      error: 'Failed to fetch user',
      message: error.message
    })
  }
})

/**
 * PUT /api/users/:id
 * Aktualizovat uživatele
 */
router.put('/:id',
  [
    body('first_name').optional().trim(),
    body('last_name').optional().trim(),
    body('phone').optional().trim(),
    body('avatar_url').optional().isURL()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { id } = req.params

      // User může editovat jen sebe, admin všechny
      if (req.user.id !== id && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You can only update your own profile'
        })
      }

      const { first_name, last_name, phone, avatar_url } = req.body

      const updateData = {}
      if (first_name !== undefined) updateData.first_name = first_name
      if (last_name !== undefined) updateData.last_name = last_name
      if (phone !== undefined) updateData.phone = phone
      if (avatar_url !== undefined) updateData.avatar_url = avatar_url

      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select('id, email, first_name, last_name, phone, avatar_url, role')
        .single()

      if (error) throw error

      res.json({
        message: 'User updated successfully',
        user: updatedUser
      })

    } catch (error) {
      console.error('Update user error:', error)
      res.status(500).json({
        error: 'Failed to update user',
        message: error.message
      })
    }
  }
)

/**
 * PUT /api/users/:id/password
 * Změna hesla
 */
router.put('/:id/password',
  [
    body('current_password').notEmpty(),
    body('new_password').isLength({ min: 8 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { id } = req.params

      // User může měnit jen své heslo
      if (req.user.id !== id) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You can only change your own password'
        })
      }

      const { current_password, new_password } = req.body

      // Načti uživatele
      const { data: user } = await supabase
        .from('users')
        .select('password_hash')
        .eq('id', id)
        .single()

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Ověř aktuální heslo
      const isValidPassword = await bcrypt.compare(current_password, user.password_hash)
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Invalid password',
          message: 'Current password is incorrect'
        })
      }

      // Hash nového hesla
      const salt = await bcrypt.genSalt(10)
      const password_hash = await bcrypt.hash(new_password, salt)

      // Update hesla
      const { error } = await supabase
        .from('users')
        .update({ password_hash })
        .eq('id', id)

      if (error) throw error

      res.json({ message: 'Password changed successfully' })

    } catch (error) {
      console.error('Change password error:', error)
      res.status(500).json({
        error: 'Failed to change password',
        message: error.message
      })
    }
  }
)

/**
 * PUT /api/users/:id/role
 * Změna role (admin only)
 */
router.put('/:id/role',
  requireAdmin,
  [
    body('role').isIn(['user', 'admin', 'super_admin'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { id } = req.params
      const { role } = req.body

      // Super admin nemůže být degradován (kromě sebe)
      const { data: targetUser } = await supabase
        .from('users')
        .select('role')
        .eq('id', id)
        .single()

      if (targetUser?.role === 'super_admin' && req.user.id !== id) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Cannot modify super admin role'
        })
      }

      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', id)
        .select('id, email, first_name, last_name, role')
        .single()

      if (error) throw error

      res.json({
        message: 'User role updated successfully',
        user: updatedUser
      })

    } catch (error) {
      console.error('Update role error:', error)
      res.status(500).json({
        error: 'Failed to update role',
        message: error.message
      })
    }
  }
)

/**
 * DELETE /api/users/:id
 * Smazat uživatele (admin only)
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params

    // Super admin nemůže být smazán (kromě sebe)
    const { data: targetUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', id)
      .single()

    if (targetUser?.role === 'super_admin' && req.user.id !== id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Cannot delete super admin'
      })
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ message: 'User deleted successfully' })

  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({
      error: 'Failed to delete user',
      message: error.message
    })
  }
})

export default router
