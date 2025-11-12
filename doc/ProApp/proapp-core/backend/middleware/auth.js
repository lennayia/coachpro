// middleware/auth.js - ES6 verze
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// JWT Secret - v produkci použij silný secret z .env
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

// JWT token expiration
const JWT_EXPIRES_IN = '4h'; // Access token: 4 hodiny
const JWT_REFRESH_EXPIRES_IN = '7d'; // Refresh token: 7 dní

// Generate JWT tokens
const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    first_name: user.first_name,
    last_name: user.last_name
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN 
  });

  const refreshToken = jwt.sign(
    { id: user.id, type: 'refresh' }, 
    JWT_REFRESH_SECRET, 
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

const authenticateToken = (req, res, next) => {
  console.log('🔐 Auth middleware started for:', req.method, req.path);
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  console.log('🔑 Auth header present:', !!authHeader);
  console.log('🎫 Token extracted:', !!token);

  if (!token) {
    console.log('❌ No token found');
    return res.status(401).json({ 
      success: false, 
      error: 'Access token required' 
    });
  }

  console.log('⏳ Starting JWT verification...');
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    console.log('🔍 JWT verify callback executed');
    
    if (err) {
      console.log('❌ JWT error:', err.message);
      return res.status(403).json({ 
        success: false, 
        error: 'Invalid or expired token' 
      });
    }
    
    console.log('✅ Auth successful for user:', user.id);
    req.user = user;
    next();
  });
};

// Admin role middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }
  next();
};

// Optional auth middleware
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    req.user = err ? null : user;
    next();
  });
};

// Password utilities
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  console.log('🔍 Validating password:', password);
  console.log('🔍 Password length:', password.length);
  
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&]{8,}$/;
  const result = passwordRegex.test(password);
  
  console.log('🔍 Password validation result:', result);
  
  // Zkusíme jednotlivé části
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\\d/.test(password);
  const hasValidLength = password.length >= 8;
  
  console.log('🔍 Has letter:', hasLetter);
  console.log('🔍 Has number:', hasNumber);
  console.log('🔍 Has valid length:', hasValidLength);
  
  return result;
};

export {
  generateTokens,
  authenticateToken,
  requireAdmin,
  optionalAuth,
  hashPassword,
  comparePassword,
  isValidEmail,
  isValidPassword,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN
};