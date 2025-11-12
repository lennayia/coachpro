// backend/routes/oauth.js
import express from 'express';
import passport from '../config/passport.js';
import { generateTokens } from '../middleware/auth.js';

const router = express.Router();

// Dynamické zjištění frontend URL pro development
const getFrontendUrl = () => {
  // Pro production použij environment variable
  if (process.env.NODE_ENV === 'production') {
    return process.env.FRONTEND_URL;
  }

  // Pro development používáme env URL (port se může měnit)
  const envUrl = process.env.FRONTEND_URL || 'http://localhost:5174';

  console.log('🔗 Using frontend URL:', envUrl);
  return envUrl;
};

// GET /auth/google - Přesměrování na Google
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// GET /auth/google/callback - Google callback
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${getFrontendUrl()}/login?error=oauth_failed`,
    session: false  // Nepoužíváme sessions, jen JWT
  }),
  async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        console.error('❌ No user in OAuth callback');
        return res.redirect(`${getFrontendUrl()}/login?error=no_user`);
      }

      console.log('✅ Google OAuth successful for:', user.email);

      // Vygeneruj JWT tokeny
      const { accessToken, refreshToken } = generateTokens(user);

      // Ulož refresh token do databáze
      await req.db.run(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, datetime("now", "+7 days"))',
        [user.id, refreshToken]
      );

      // Aktualizuj last login
      await req.db.run(
        'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?',
        [user.id]
      );

      // Přesměruj na frontend s tokeny v URL
      const frontendUrl = getFrontendUrl();
      const redirectUrl = `${frontendUrl}/oauth-success?` +
        `accessToken=${accessToken}&refreshToken=${refreshToken}`;

      console.log('🔀 Redirecting to:', redirectUrl);
      res.redirect(redirectUrl);

    } catch (error) {
      console.error('❌ OAuth callback error:', error);
      res.redirect(`${getFrontendUrl()}/login?error=callback_error`);
    }
  }
);

// GET /auth/apple - Přesměrování na Apple
router.get('/apple', 
  passport.authenticate('apple', { 
    scope: ['name', 'email'] 
  })
);

// GET /auth/apple/callback - Apple callback
router.get('/apple/callback',
  passport.authenticate('apple', { 
    failureRedirect: `${getFrontendUrl()}/login?error=oauth_failed`,
    session: false  // Nepoužíváme sessions, jen JWT
  }),
  async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        console.error('❌ No user in Apple OAuth callback');
        return res.redirect(`${getFrontendUrl()}/login?error=no_user`);
      }

      console.log('✅ Apple OAuth successful for:', user.email);

      // Vygeneruj JWT tokeny
      const { accessToken, refreshToken } = generateTokens(user);

      // Ulož refresh token do databáze
      await req.db.run(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, datetime("now", "+7 days"))',
        [user.id, refreshToken]
      );

      // Aktualizuj last login
      await req.db.run(
        'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?',
        [user.id]
      );

      // Přesměruj na frontend s tokeny v URL
      const frontendUrl = getFrontendUrl();
      const redirectUrl = `${frontendUrl}/oauth-success?` +
        `accessToken=${accessToken}&refreshToken=${refreshToken}`;

      console.log('🔀 Redirecting to:', redirectUrl);
      res.redirect(redirectUrl);

    } catch (error) {
      console.error('❌ Apple OAuth callback error:', error);
      res.redirect(`${getFrontendUrl()}/login?error=callback_error`);
    }
  }
);

export default router;