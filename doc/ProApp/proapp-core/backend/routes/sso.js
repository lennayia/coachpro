// routes/sso.js - Single Sign-On pro moduly
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../middleware/auth.js';
import { requireModuleAccess } from '../middleware/moduleAccess.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Apply auth middleware
router.use(authenticateToken);

// 🔑 Vytvoření SSO tokenu pro přechod do modulu
router.post('/generate-token/:module_id', async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;
    const { module_id } = req.params;
    const { return_url } = req.body;

    // Ověř přístup k modulu
    const moduleAccessCheck = requireModuleAccess(module_id);
    
    // Simulate middleware check
    req.db = db;
    const mockRes = {
      status: (code) => ({ json: (data) => ({ statusCode: code, body: data }) }),
      json: (data) => ({ statusCode: 200, body: data })
    };

    await moduleAccessCheck(req, mockRes, () => {});
    
    if (!req.moduleAccess?.hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to module',
        code: 'MODULE_ACCESS_DENIED'
      });
    }

    // Vytvoř SSO token
    const ssoTokenId = uuidv4();
    const ssoToken = jwt.sign({
      id: ssoTokenId,
      user_id: userId,
      module_id,
      access_level: req.moduleAccess.accessLevel,
      type: 'sso'
    }, JWT_SECRET, { expiresIn: '10m' }); // Krátká doba platnosti pro bezpečnost

    // Ulož token do databáze
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minut
    await db.run(`
      INSERT INTO sso_tokens (
        id, user_id, token, module_id, expires_at,
        ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      ssoTokenId,
      userId,
      ssoToken,
      module_id,
      expiresAt.toISOString(),
      req.ip || req.connection.remoteAddress,
      req.get('User-Agent')
    ]);

    // Získej module info
    const module = await db.get(`SELECT * FROM modules WHERE id = ?`, [module_id]);
    
    let redirectUrl;
    if (module?.is_external && module.base_url) {
      // Externí modul - vytvořme redirect URL
      const baseUrl = module.base_url.replace(/\/$/, '');
      redirectUrl = `${baseUrl}/auth/sso?token=${ssoToken}`;
      
      if (return_url) {
        redirectUrl += `&return_url=${encodeURIComponent(return_url)}`;
      }
    } else {
      // Interní modul
      redirectUrl = `/${module_id}?sso_token=${ssoToken}`;
      if (return_url) {
        redirectUrl += `&return_url=${encodeURIComponent(return_url)}`;
      }
    }

    res.json({
      success: true,
      data: {
        token: ssoToken,
        redirectUrl,
        expiresAt: expiresAt.toISOString(),
        module: {
          id: module_id,
          name: module?.name,
          isExternal: module?.is_external
        }
      }
    });

  } catch (error) {
    console.error('❌ Generate SSO token error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate SSO token'
    });
  }
});

// 🔓 Ověření SSO tokenu (pro cílové moduly)
router.post('/verify-token', async (req, res) => {
  try {
    const db = req.db;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'SSO token required'
      });
    }

    // Ověř JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired SSO token',
        code: 'TOKEN_INVALID'
      });
    }

    if (decoded.type !== 'sso') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token type',
        code: 'INVALID_TOKEN_TYPE'
      });
    }

    // Zkontroluj v databázi
    const ssoRecord = await db.get(`
      SELECT st.*, u.email, u.first_name, u.last_name, u.role
      FROM sso_tokens st
      JOIN users u ON st.user_id = u.id
      WHERE st.id = ? AND st.token = ? AND st.expires_at > datetime('now')
    `, [decoded.id, token]);

    if (!ssoRecord) {
      return res.status(401).json({
        success: false,
        error: 'SSO token not found or expired',
        code: 'TOKEN_NOT_FOUND'
      });
    }

    if (ssoRecord.used_at) {
      return res.status(401).json({
        success: false,
        error: 'SSO token already used',
        code: 'TOKEN_ALREADY_USED'
      });
    }

    // Označit token jako použitý
    await db.run(`
      UPDATE sso_tokens 
      SET used_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [decoded.id]);

    // Vygeneruj nový access token pro cílový modul
    const newAccessToken = jwt.sign({
      id: ssoRecord.user_id,
      email: ssoRecord.email,
      role: ssoRecord.role,
      first_name: ssoRecord.first_name,
      last_name: ssoRecord.last_name,
      module_access: {
        module_id: ssoRecord.module_id,
        access_level: decoded.access_level
      }
    }, JWT_SECRET, { expiresIn: '4h' }); // Delší doba pro práci v modulu

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        user: {
          id: ssoRecord.user_id,
          email: ssoRecord.email,
          first_name: ssoRecord.first_name,
          last_name: ssoRecord.last_name,
          role: ssoRecord.role
        },
        module: {
          id: ssoRecord.module_id,
          access_level: decoded.access_level
        },
        expiresIn: '4h'
      }
    });

  } catch (error) {
    console.error('❌ Verify SSO token error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify SSO token'
    });
  }
});

// 📋 Seznam aktivních SSO sessionů uživatele
router.get('/active-sessions', async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;

    const sessions = await db.all(`
      SELECT 
        st.id,
        st.module_id,
        st.expires_at,
        st.used_at,
        st.created_at,
        m.name as module_name,
        m.is_external
      FROM sso_tokens st
      JOIN modules m ON st.module_id = m.id
      WHERE st.user_id = ? 
      AND st.expires_at > datetime('now')
      ORDER BY st.created_at DESC
      LIMIT 10
    `, [userId]);

    res.json({
      success: true,
      data: sessions
    });

  } catch (error) {
    console.error('❌ Get active sessions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get active sessions'
    });
  }
});

// 🗑️ Zrušit SSO session
router.delete('/sessions/:token_id', async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;
    const { token_id } = req.params;

    await db.run(`
      UPDATE sso_tokens 
      SET expires_at = datetime('now')
      WHERE id = ? AND user_id = ?
    `, [token_id, userId]);

    res.json({
      success: true,
      message: 'SSO session revoked'
    });

  } catch (error) {
    console.error('❌ Revoke SSO session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to revoke SSO session'
    });
  }
});

// 🧹 Cleanup expired tokens (cron job endpoint)
router.delete('/cleanup-expired', async (req, res) => {
  try {
    const db = req.db;
    
    // Only admin can trigger cleanup
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const result = await db.run(`
      DELETE FROM sso_tokens 
      WHERE expires_at <= datetime('now', '-1 hour')
    `);

    res.json({
      success: true,
      message: `Cleaned up ${result.changes} expired SSO tokens`
    });

  } catch (error) {
    console.error('❌ Cleanup expired tokens error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup expired tokens'
    });
  }
});

export default router;