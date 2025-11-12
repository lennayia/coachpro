// backend/config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as AppleStrategy } from 'passport-apple';
import User from '../models/User.js';

let userModel;

// Initialize passport with database
export const initializePassport = (db) => {
  userModel = new User(db);

  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('🔍 Google OAuth profile:', {
        id: profile.id,
        email: profile.emails[0]?.value,
        name: profile.displayName
      });

      const email = profile.emails[0]?.value;
      const googleId = profile.id;
      
      if (!email) {
        return done(new Error('No email from Google'), null);
      }

      // Zkus najít existujícího uživatele podle Google ID
      let user = await userModel.findByGoogleId(googleId);
      
      if (user) {
        console.log('✅ Existing user found via Google ID:', user.email);
        return done(null, user);
      }

      // Zkus najít podle emailu (pro spojení existujících účtů)
      user = await userModel.findByEmail(email);
      
      if (user) {
        // Propoj existující účet s Google
        console.log('🔗 Linking existing account with Google:', user.email);
        await userModel.updateGoogleId(user.id, googleId);
        user.google_id = googleId;
        return done(null, user);
      }

      // Vytvoř nového uživatele
      console.log('👤 Creating new user from Google:', email);
      const names = profile.displayName?.split(' ') || ['', ''];
      const newUser = await userModel.create({
        email: email,
        first_name: names[0] || 'Google',
        last_name: names.slice(1).join(' ') || 'User',
        google_id: googleId,
        avatar_url: profile.photos[0]?.value || null,
        email_verified: true, // Google účty jsou ověřené
        password: null // OAuth uživatelé nemají heslo
      });

      console.log('✅ New Google user created:', newUser.email);
      return done(null, newUser);

    } catch (error) {
      console.error('❌ Google OAuth error:', error);
      return done(error, null);
    }
  }));

  // Apple Sign-In Strategy
  if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY) {
    passport.use(new AppleStrategy({
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      privateKey: process.env.APPLE_PRIVATE_KEY,
      callbackURL: "/auth/apple/callback",
      scope: ['name', 'email']
    },
    async (accessToken, refreshToken, idToken, profile, done) => {
      try {
        console.log('🍎 Apple Sign-In profile:', {
          id: profile.id,
          email: profile.email,
          name: profile.name
        });

        const email = profile.email;
        const appleId = profile.id;
        
        if (!email) {
          return done(new Error('No email from Apple'), null);
        }

        // Zkus najít existujícího uživatele podle Apple ID
        let user = await userModel.findByAppleId(appleId);
        
        if (user) {
          console.log('✅ Existing user found via Apple ID:', user.email);
          return done(null, user);
        }

        // Zkus najít podle emailu (pro spojení existujících účtů)
        user = await userModel.findByEmail(email);
        
        if (user) {
          // Propoj existující účet s Apple
          console.log('🔗 Linking existing account with Apple:', user.email);
          await userModel.updateAppleId(user.id, appleId);
          user.apple_id = appleId;
          return done(null, user);
        }

        // Vytvoř nového uživatele
        console.log('👤 Creating new user from Apple:', email);
        const firstName = profile.name?.firstName || 'Apple';
        const lastName = profile.name?.lastName || 'User';
        
        const newUser = await userModel.create({
          email: email,
          first_name: firstName,
          last_name: lastName,
          apple_id: appleId,
          email_verified: true, // Apple účty jsou ověřené
          password: null // OAuth uživatelé nemají heslo
        });

        console.log('✅ New Apple user created:', newUser.email);
        return done(null, newUser);

      } catch (error) {
        console.error('❌ Apple OAuth error:', error);
        return done(error, null);
      }
    }));
  } else {
    console.log('⚠️ Apple Sign-In not configured - missing environment variables');
  }

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default passport;