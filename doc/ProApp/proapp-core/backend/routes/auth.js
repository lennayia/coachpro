// routes/auth.js - ES6 verze s FORGOT PASSWORD funkcionalitou
import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { 
  generateTokens, 
  authenticateToken, 
  isValidEmail, 
  isValidPassword,
  JWT_REFRESH_SECRET 
} from '../middleware/auth.js';
import { hashPassword, verifyPassword, validatePasswordStrength } from '../utils/passwordUtils.js';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../emailService.js';

const router = express.Router();

// Initialize User model - will be set by initializeRoutes
let userModel;

const initializeRoutes = (db) => {
  userModel = new User(db);
};

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  // Odstraníme validaci hesla úplně - uděláme ji ručně
  body('first_name').trim().isLength({ min: 2 }),
  body('last_name').trim().isLength({ min: 2 })
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
];

// POST /api/auth/register - Registrace
// Vylepšená registrace - nahraď v routes/auth.js
router.post('/register', registerValidation, async (req, res) => {
  try {
    // Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password, first_name, last_name } = req.body;

    // DEBUG: Přidáme debug informace
    console.log('🔍 Validating password:', password);
    console.log('🔍 Password length:', password.length);
    
    // Additional password validation
    const hasMinLength = password.length >= 8;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    console.log('🔍 Has min length:', hasMinLength);
    console.log('🔍 Has lowercase:', hasLowerCase);    // ← PŘIDEJ
    console.log('🔍 Has uppercase:', hasUpperCase);    // ← PŘIDEJ  
    console.log('🔍 Has number:', hasNumber);
    
    if (!hasMinLength || !hasLowerCase || !hasUpperCase || !hasNumber) {
  return res.status(400).json({
    success: false,
    error: 'Heslo musí mít minimálně 8 znaků, velké i malé písmeno a číslo'
  });
}
    
    console.log('🔍 Password validation passed');

    // Check if user already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      // VYLEPŠENO: Poskytneme užitečnou informaci
      console.log('⚠️ User already exists:', email);
      return res.status(409).json({
        success: false,
        error: 'Uživatel s tímto emailem již existuje',
        message: 'Pokud jste zapomněli heslo, použijte odkaz "Zapomněli jste heslo?" níže.',
        canLogin: true, // ← Frontend může zobrazit hint o přihlášení
        email: email
      });
    }

    // VYLEPŠENO: Hash hesla s try/catch
    let hashedPassword;
    try {
      hashedPassword = await hashPassword(password);
      console.log('✅ Password successfully hashed');
    } catch (hashError) {
      console.error('❌ Password hashing failed:', hashError);
      return res.status(500).json({
        success: false,
        error: 'Chyba při zabezpečování hesla'
      });
    }

    // VYLEPŠENO: Create user s explicitním hashem
    let newUser;
    try {
      newUser = await userModel.create({
        email,
        password: hashedPassword, // Posíláme už hashované heslo
        first_name,
        last_name
      });
      console.log('✅ User created successfully:', newUser.id);
    } catch (createError) {
      console.error('❌ User creation failed:', createError);
      
      // Zkontroluj jestli se user mezitím nevytvořil (race condition)
      const checkUser = await userModel.findByEmail(email);
      if (checkUser) {
        return res.status(409).json({
          success: false,
          error: 'Uživatel byl úspěšně vytvořen. Zkuste se přihlásit.',
          canLogin: true,
          email: email
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Chyba při vytváření účtu'
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser);

    // Store refresh token in database
    await req.db.run(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, datetime("now", "+7 days"))',
      [newUser.id, refreshToken]
    );

    // Update last login
    await userModel.updateLastLogin(newUser.id);

    // Pošli uvítací email (volitelně)
    try {
      await sendWelcomeEmail(newUser.email, newUser.first_name);
      console.log('✅ Welcome email sent to:', newUser.email);
    } catch (emailError) {
      console.error('❌ Welcome email failed:', emailError);
      // Nepřerušujeme registraci kvůli emailu
    }

    // Return user data (without password)
    const { password_hash, ...userData } = newUser;

    res.status(201).json({
      success: true,
      message: 'Registrace úspěšná',
      user: userData,
      tokens: {
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    
    // VYLEPŠENO: Detailnější error handling
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({
        success: false,
        error: 'Uživatel s tímto emailem již existuje',
        canLogin: true,
        email: req.body.email
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Chyba při registraci - zkuste to prosím znovu'
    });
  }
});

// POST /api/auth/login - Přihlášení
router.post('/login', loginValidation, async (req, res) => {
  try {
    // Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Zkonktrolujte zadané údaje'
      });
    }

    const { email, password } = req.body;

    // Verify user credentials
    const user = await userModel.verifyPassword(email, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Neplatný email nebo heslo'
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Store refresh token in database
    await req.db.run(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, datetime("now", "+7 days"))',
      [user.id, refreshToken]
    );

    // Update last login
    await userModel.updateLastLogin(user.id);

    // Return user data (without password)
    const { password_hash, ...userData } = user;

    res.json({
      success: true,
      message: 'Přihlášení úspěšné',
      user: userData,
      tokens: {
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Chyba při přihlašování'
    });
  }
});

// GET /api/auth/me - Aktuální uživatel
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Načti subscription informace
    const subscription = await req.db.get(`
      SELECT 
        us.plan_id,
        us.status,
        us.current_period_end,
        us.trial_ends_at,
        sp.name as plan_name,
        sp.price_monthly,
        sp.price_yearly,
        sp.max_users,
        sp.max_payments,
        sp.features
      FROM user_subscriptions us
      JOIN subscription_plans sp ON us.plan_id = sp.id
      WHERE us.user_id = ? AND us.status IN ('active', 'trial')
      ORDER BY us.created_at DESC
      LIMIT 1
    `, [user.id]);

    // Return user data (without password) + subscription
    const { password_hash, ...userData } = user;
    
    // Přidej subscription info
    userData.subscription = subscription ? {
      plan_id: subscription.plan_id,
      plan_name: subscription.plan_name,
      status: subscription.status,
      current_period_end: subscription.current_period_end,
      trial_ends_at: subscription.trial_ends_at,
      max_users: subscription.max_users,
      max_payments: subscription.max_payments,
      features: subscription.features ? JSON.parse(subscription.features) : []
    } : {
      plan_id: 'free',
      plan_name: 'Zdarma',
      status: 'active',
      max_users: 1,
      max_payments: 5,
      features: ['základní moduly', 'trial podpora']
    };

    res.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Chyba při načítání uživatele'
    });
  }
});

// ===================================
// FORGOT PASSWORD ENDPOINTY - NOVÉ!
// ===================================

// POST /api/auth/forgot-password - Žádost o reset hesla
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email je povinný'
      });
    }

    console.log('🔑 Forgot password request for:', email);

    // Najdi uživatele podle emailu
    const user = await userModel.findByEmail(email);
    if (!user) {
      // Z bezpečnostních důvodů vracíme stejnou odpověď i když user neexistuje
      console.log('⚠️ User not found for email:', email);
      return res.json({
        success: true,
        message: 'Pokud email existuje v naší databázi, byl odeslán reset link'
      });
    }

    // Vygeneruj reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hodina

    console.log('🔑 Generated reset token for:', user.email);

    // Ulož token do databáze
    await req.db.run(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, resetToken, expiresAt.toISOString()]
    );

    // Pošli email s reset linkem
    try {
      await sendPasswordResetEmail(user.email, resetToken, user.first_name);
      console.log('✅ Reset email sent to:', user.email);
    } catch (emailError) {
      console.error('❌ Error sending reset email:', emailError);
      // Pokračujeme i když email selhá - bezpečnostně lepší
    }

    res.json({
      success: true,
      message: 'Pokud email existuje v naší databázi, byl odeslán reset link'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Chyba při zpracování požadavku'
    });
  }
});

// GET /api/auth/verify-reset-token/:token - Ověření platnosti reset tokenu
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;

    console.log('🔍 Verifying reset token:', token.substring(0, 8) + '...');

    const resetRecord = await req.db.get(`
      SELECT prt.*, u.first_name, u.email
      FROM password_reset_tokens prt
      JOIN users u ON prt.user_id = u.id
      WHERE prt.token = ? 
        AND prt.expires_at > datetime('now') 
        AND prt.used_at IS NULL
    `, [token]);

    if (!resetRecord) {
      console.log('❌ Invalid or expired reset token');
      return res.status(400).json({
        success: false,
        error: 'Neplatný nebo expirovaný reset token'
      });
    }

    console.log('✅ Valid reset token for:', resetRecord.email);

    res.json({
      success: true,
      message: 'Token je platný',
      user: {
        first_name: resetRecord.first_name,
        email: resetRecord.email
      }
    });

  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({
      success: false,
      error: 'Chyba při ověřování tokenu'
    });
  }
});

// POST /api/auth/reset-password - Nastavení nového hesla
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Token a nové heslo jsou povinné'
      });
    }

    console.log('🔑 Password reset attempt with token:', token.substring(0, 8) + '...');

    // Validace nového hesla
    const hasMinLength = newPassword.length >= 8;
const hasLowerCase = /[a-z]/.test(newPassword);      // ← ZMĚŇ
const hasUpperCase = /[A-Z]/.test(newPassword);      // ← PŘIDEJ
const hasNumber = /[0-9]/.test(newPassword);

if (!hasMinLength || !hasLowerCase || !hasUpperCase || !hasNumber) {
  return res.status(400).json({
    success: false,
    error: 'Heslo musí mít minimálně 8 znaků, velké i malé písmeno a číslo'  // ← UPRAV TEXT
  });
}

    // Najdi platný reset token
    const resetRecord = await req.db.get(`
      SELECT prt.*, u.* 
      FROM password_reset_tokens prt
      JOIN users u ON prt.user_id = u.id
      WHERE prt.token = ? 
        AND prt.expires_at > datetime('now') 
        AND prt.used_at IS NULL
    `, [token]);

    if (!resetRecord) {
      console.log('❌ Invalid or expired reset token for password reset');
      return res.status(400).json({
        success: false,
        error: 'Neplatný nebo expirovaný reset token'
      });
    }

    // Hash nového hesla
    const newPasswordHash = await hashPassword(newPassword);

    // Aktualizuj heslo uživatele
    await req.db.run(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newPasswordHash, resetRecord.user_id]
    );

    // Označ token jako použitý
    await req.db.run(
      'UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ?',
      [resetRecord.id]
    );

    // Smaž všechny ostatní nevyužité tokeny pro tohoto uživatele
    await req.db.run(
      'UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE user_id = ? AND used_at IS NULL',
      [resetRecord.user_id]
    );

    // Smaž všechny refresh tokeny (přinutí uživatele znovu se přihlásit)
    await req.db.run(
      'DELETE FROM refresh_tokens WHERE user_id = ?',
      [resetRecord.user_id]
    );

    console.log('✅ Password successfully reset for user:', resetRecord.email);

    res.json({
      success: true,
      message: 'Heslo bylo úspěšně změněno. Můžete se přihlásit s novým heslem.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Chyba při změně hesla'
    });
  }
});

// PUT /api/auth/profile - Aktualizace uživatelského profilu
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { first_name, last_name } = req.body;
    const userId = req.user.id;

    // Validace
    if (!first_name || !last_name) {
      return res.status(400).json({
        success: false,
        error: 'Křestní jméno a příjmení jsou povinné'
      });
    }

    if (first_name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Křestní jméno musí mít alespoň 2 znaky'
      });
    }

    if (last_name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Příjmení musí mít alespoň 2 znaky'
      });
    }

    console.log('🔄 Updating profile for user:', userId, { first_name, last_name });

    // Aktualizuj profil v databázi
    await req.db.run(
      'UPDATE users SET first_name = ?, last_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [first_name.trim(), last_name.trim(), userId]
    );

    console.log('✅ Profile updated successfully for user:', userId);

    res.json({
      success: true,
      message: 'Profil byl úspěšně aktualizován'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Chyba při aktualizaci profilu'
    });
  }
});

export default router;
export { initializeRoutes };