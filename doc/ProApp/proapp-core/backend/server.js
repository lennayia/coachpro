import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import sqlite3 from 'sqlite3'
import { promisify } from 'util'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import passport from 'passport'

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env from ProApp root
dotenv.config({ path: join(__dirname, '../..', '.env') })


// ===========================================
// DATABASE SETUP (SQLite - temporary until Supabase migration)
// ===========================================
const database = new sqlite3.Database(join(__dirname, 'proapp-core.db'), (err) => {
  if (err) {
    console.error('❌ Database connection error:', err)
    process.exit(1)
  }
  console.log('✅ Connected to SQLite database: proapp-core.db')
})

// Promisify database methods
const db = {
  run: promisify(database.run.bind(database)),
  get: promisify(database.get.bind(database)),
  all: promisify(database.all.bind(database))
}

// ===========================================
// INITIALIZE EXPRESS APP
// ===========================================
const app = express()
const PORT = process.env.PORT || 3001

// ===========================================
// ROUTES IMPORTS
// ===========================================
import authRoutes, { initializeRoutes as initializeAuthRoutes } from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import subscriptionRoutes from './routes/subscription.js'
import ssoRoutes from './routes/sso.js'
import oauthRoutes from './routes/oauth.js'
import modulesSqliteRoutes from './routes/modules-sqlite.js'
// TODO: users.js používá Supabase - přidat po migraci
// import usersRoutes from './routes/users.js'

// Initialize auth routes with database connection (only auth.js needs this)
initializeAuthRoutes(db)

// Initialize passport configuration
import('./config/passport.js').then(module => {
  if (module.default) {
    module.default(passport, db)
    console.log('✅ Passport OAuth configured')
  }
}).catch(err => {
  console.warn('⚠️ Passport config not found, OAuth disabled:', err.message)
})

// ===========================================
// MIDDLEWARE
// ===========================================

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}))

// Compression
app.use(compression())

// CORS - allow all origins for development
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-frontend-domain.com'] // TODO: Update in production
    : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Body parsers
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Cookie parser
app.use(cookieParser())

// Session (required for passport OAuth)
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'fallback-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))

// Initialize passport
app.use(passport.initialize())
app.use(passport.session())

// Request logger
app.use(morgan('dev'))

// Attach database to all requests
app.use((req, res, next) => {
  req.db = db
  next()
})

// Request logger with timestamp
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// ===========================================
// ROUTES
// ===========================================

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'ProApp Core API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  })
})

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: 'SQLite (temporary - migrating to Supabase)'
  })
})

// Serve test HTML page
app.get('/test', (req, res) => {
  res.sendFile(join(__dirname, 'test-api.html'))
})

// Auth endpoints
app.use('/api/auth', authRoutes)

// OAuth endpoints (Google, Apple)
app.use('/auth', oauthRoutes)

// Admin endpoints
app.use('/api/admin', adminRoutes)

// Subscription endpoints
app.use('/api/subscription', subscriptionRoutes)

// SSO endpoints
app.use('/api/sso', ssoRoutes)

// Module management endpoints (SQLite version)
app.use('/api/modules', modulesSqliteRoutes)

// TODO: Přidat po migraci na Supabase
// User management endpoints
// app.use('/api/users', usersRoutes)

// ===========================================
// ERROR HANDLING
// ===========================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err)

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err
    })
  })
})

// ===========================================
// DATABASE INITIALIZATION
// ===========================================

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database schema...')

    // Users table
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        first_name TEXT,
        last_name TEXT,
        role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin', 'super_admin')),
        email_verified INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        oauth_provider TEXT,
        oauth_id TEXT,
        avatar_url TEXT,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login_at DATETIME
      )
    `)

    // Refresh tokens table
    await db.run(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Password reset tokens table
    await db.run(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        used_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Subscription plans table
    await db.run(`
      CREATE TABLE IF NOT EXISTS subscription_plans (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price_monthly REAL NOT NULL,
        price_yearly REAL NOT NULL,
        currency TEXT DEFAULT 'CZK',
        features TEXT,
        max_users INTEGER,
        max_payments INTEGER,
        is_active INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        trial_days INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // User subscriptions table
    await db.run(`
      CREATE TABLE IF NOT EXISTS user_subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        plan_id TEXT NOT NULL,
        status TEXT DEFAULT 'active' CHECK(status IN ('active', 'trial', 'cancelled', 'expired')),
        current_period_start DATETIME NOT NULL,
        current_period_end DATETIME NOT NULL,
        trial_ends_at DATETIME,
        cancelled_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
      )
    `)

    // Modules table
    await db.run(`
      CREATE TABLE IF NOT EXISTS modules (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        color TEXT,
        is_active INTEGER DEFAULT 1,
        requires_subscription INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // User module access table
    await db.run(`
      CREATE TABLE IF NOT EXISTS user_module_access (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        module_id TEXT NOT NULL,
        is_enabled INTEGER DEFAULT 1,
        granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        granted_by TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (module_id) REFERENCES modules(id),
        UNIQUE(user_id, module_id)
      )
    `)

    // Audit logs table
    await db.run(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        action TEXT NOT NULL,
        resource_type TEXT,
        resource_id TEXT,
        details TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `)

    // Plan module access table (optional - for linking plans to specific modules)
    await db.run(`
      CREATE TABLE IF NOT EXISTS plan_module_access (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plan_id TEXT NOT NULL,
        module_id TEXT NOT NULL,
        access_level TEXT DEFAULT 'full',
        feature_limits TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE CASCADE,
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
        UNIQUE(plan_id, module_id)
      )
    `)

    console.log('✅ Database schema initialized')

    // Seed default subscription plans
    await seedDefaultPlans()

    // Seed default modules
    await seedDefaultModules()

  } catch (error) {
    console.error('❌ Database initialization error:', error)
    throw error
  }
}

async function seedDefaultPlans() {
  const plans = [
    {
      id: 'free',
      name: 'Zdarma',
      description: 'Základní plán zdarma',
      price_monthly: 0,
      price_yearly: 0,
      features: JSON.stringify(['základní moduly', 'trial podpora']),
      max_users: 1,
      max_payments: 5
    },
    {
      id: 'basic',
      name: 'Základní',
      description: 'Pro malé firmy',
      price_monthly: 299,
      price_yearly: 2990,
      features: JSON.stringify(['všechny moduly', 'emailová podpora', 'exporty']),
      max_users: 3,
      max_payments: 100
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Pro rostoucí firmy',
      price_monthly: 599,
      price_yearly: 5990,
      features: JSON.stringify(['všechny moduly', 'prioritní podpora', 'pokročilé reporty', 'API přístup']),
      max_users: 10,
      max_payments: 1000
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Pro velké firmy',
      price_monthly: 1299,
      price_yearly: 12990,
      features: JSON.stringify(['všechny moduly', 'VIP podpora 24/7', 'white-label', 'vlastní doména', 'neomezené platby']),
      max_users: null,
      max_payments: null
    }
  ]

  for (const plan of plans) {
    try {
      await db.run(`
        INSERT OR IGNORE INTO subscription_plans
        (id, name, description, price_monthly, price_yearly, features, max_users, max_payments)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [plan.id, plan.name, plan.description, plan.price_monthly, plan.price_yearly, plan.features, plan.max_users, plan.max_payments])
    } catch (err) {
      console.log('⚠️ Plan already exists:', plan.id)
    }
  }

  console.log('✅ Default subscription plans seeded')
}

async function seedDefaultModules() {
  const modules = [
    {
      id: 'paymentspro',
      name: 'PaymentsPro',
      description: 'Sledování plateb a dluhů',
      icon: '💰',
      color: '#10b981',
      sort_order: 1
    },
    {
      id: 'lifepro',
      name: 'LifePro',
      description: 'Najděte svůj životní cíl',
      icon: '🎯',
      color: '#6366f1',
      sort_order: 2
    },
    {
      id: 'digipro',
      name: 'DigiPro',
      description: 'Digitální řešení pro váš byznys',
      icon: '📱',
      color: '#f59e0b',
      sort_order: 3
    }
  ]

  for (const module of modules) {
    try {
      await db.run(`
        INSERT OR IGNORE INTO modules
        (id, name, description, icon, color, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [module.id, module.name, module.description, module.icon, module.color, module.sort_order])
    } catch (err) {
      console.log('⚠️ Module already exists:', module.id)
    }
  }

  console.log('✅ Default modules seeded')
}

// ===========================================
// SERVER START
// ===========================================

async function startServer() {
  try {
    // Initialize database first
    await initializeDatabase()

    // Start server
    app.listen(PORT, () => {
      console.log('='.repeat(60))
      console.log('🚀 ProApp Core Backend Started')
      console.log('='.repeat(60))
      console.log(`📍 Server running on: http://localhost:${PORT}`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`💾 Database: SQLite (proapp-core.db)`)
      console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? '✅ Configured' : '⚠️ Using default'}`)
      console.log('='.repeat(60))
      console.log('\n📚 Available endpoints:')
      console.log('  GET  / - API info')
      console.log('  GET  /health - Health check')
      console.log('\n🔐 Auth:')
      console.log('  POST /api/auth/register - Register user')
      console.log('  POST /api/auth/login - Login')
      console.log('  POST /api/auth/forgot-password - Request password reset')
      console.log('  GET  /api/auth/verify-reset-token/:token - Verify reset token')
      console.log('  POST /api/auth/reset-password - Reset password')
      console.log('  GET  /api/auth/me - Get current user')
      console.log('  PUT  /api/auth/profile - Update profile')
      console.log('\n🔗 OAuth:')
      console.log('  GET  /auth/google - Google OAuth')
      console.log('  GET  /auth/google/callback - Google callback')
      console.log('  GET  /auth/apple - Apple OAuth')
      console.log('  GET  /auth/apple/callback - Apple callback')
      console.log('\n🎯 Modules:')
      console.log('  GET  /api/modules - List all modules')
      console.log('  GET  /api/modules/my - Get my modules (auth)')
      console.log('  POST /api/modules/:id/grant - Grant access (admin)')
      console.log('  DELETE /api/modules/:id/revoke - Revoke access (admin)')
      console.log('  POST /api/modules - Create module (admin)')
      console.log('  📦 Seeded modules: paymentspro, lifepro, digipro')
      console.log('\n💳 Subscriptions:')
      console.log('  GET  /api/subscription/plans - List plans')
      console.log('  POST /api/subscription/subscribe - Subscribe to plan (auth)')
      console.log('  POST /api/subscription/cancel - Cancel subscription (auth)')
      console.log('  GET  /api/subscription/my - Get my subscription (auth)')
      console.log('\n🔑 Admin:')
      console.log('  GET  /api/admin/users - List all users (admin)')
      console.log('  PUT  /api/admin/users/:id/role - Change user role (admin)')
      console.log('  DELETE /api/admin/users/:id - Delete user (admin)')
      console.log('  GET  /api/admin/stats - Get system stats (admin)')
      console.log('\n🔐 SSO:')
      console.log('  POST /api/sso/verify-token - Verify SSO token (modules)')
      console.log('\n' + '='.repeat(60))
      console.log('\n💡 Next steps:')
      console.log('  1. Test registration: POST http://localhost:3001/api/auth/register')
      console.log('  2. Test login: POST http://localhost:3001/api/auth/login')
      console.log('  3. Phase 2: Migrate PaymentsPro to Supabase')
      console.log('  4. Phase 3: Implement LifePro module')
      console.log('\n' + '='.repeat(60))
    })

  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  database.close(() => {
    console.log('Database connection closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...')
  database.close(() => {
    console.log('Database connection closed')
    process.exit(0)
  })
})

// Start the server
startServer()

export default app
