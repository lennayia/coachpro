// models/User.js - ES6 verze s OAuth podporou a BEZPEČNÝM hashováním
import { hashPassword, verifyPassword } from '../utils/passwordUtils.js';

class User {
  constructor(db) {
    this.db = db;
  }

  // Najdi uživatele podle emailu
  async findByEmail(email) {
    try {
      const user = await this.db.get(
        'SELECT * FROM users WHERE email = ? AND is_active = 1',
        [email]
      );
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Najdi uživatele podle ID
  async findById(id) {
    try {
      const user = await this.db.get(
        'SELECT * FROM users WHERE id = ? AND is_active = 1',
        [id]
      );
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // NOVÉ - Najdi uživatele podle OAuth ID
  async findByOAuthId(provider, oauthId) {
    try {
      const user = await this.db.get(
        'SELECT * FROM users WHERE oauth_provider = ? AND oauth_id = ? AND is_active = 1',
        [provider, oauthId]
      );
      return user;
    } catch (error) {
      console.error('Error finding user by OAuth ID:', error);
      throw error;
    }
  }

  // Vytvoř nového uživatele - OPRAVENO
  // Vytvoř nového uživatele - OPRAVENO
async create(userData) {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      oauth_provider = null,
      oauth_id = null,
      avatar_url = null,
      role = 'user',
      email_verified = false
    } = userData;

    console.log('🔒 Creating user with password:', password ? 'PROVIDED' : 'NULL');

    // Heslo už je hashované z routes/auth.js
    const password_hash = password;

    console.log('🔒 Password hash ready:', password_hash ? 'SUCCESS' : 'NULL');

    // OPRAVENO: Používáme Promise wrapper pro správné ID
    const result = await this.db.run(`
      INSERT INTO users (
        email, password_hash, first_name, last_name,
        oauth_provider, oauth_id, avatar_url, role, email_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      email, password_hash, first_name, last_name,
      oauth_provider, oauth_id, avatar_url, role, email_verified ? 1 : 0
    ]);

    console.log('✅ User created successfully');

    // Načti a vrať nově vytvořeného uživatele
    return await this.findByEmail(email);

  } catch (error) {
    console.error('❌ Error creating user:', error);
    throw error;
  }
}

  // NOVÉ - Aktualizuj OAuth pro existujícího uživatele
  async updateOAuth(userId, provider, oauthId) {
    try {
      await this.db.run(
        'UPDATE users SET oauth_provider = ?, oauth_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [provider, oauthId, userId]
      );
    } catch (error) {
      console.error('Error updating OAuth:', error);
      throw error;
    }
  }

  // Ověř heslo - OPRAVENO
  async verifyPassword(email, password) {
    try {
      const user = await this.findByEmail(email);
      
      if (!user || !user.password_hash) {
        console.log('🔒 User not found or no password hash');
        return null;
      }

      console.log('🔒 Verifying password for user:', user.email);
      
      // OPRAVENO: používá verifyPassword místo comparePassword
      const isValid = await verifyPassword(password, user.password_hash);
      
      console.log('🔒 Password verification result:', isValid);
      
      return isValid ? user : null;
    } catch (error) {
      console.error('Error verifying password:', error);
      throw error;
    }
  }

  // Aktualizuj last_login_at
  async updateLastLogin(id) {
    try {
      await this.db.run(
        'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }
}

export default User;