# ProApp Core Backend

Centralizovaný backend pro správu uživatelů, autentizace a přístupu k modulům.

## 🚀 Quick Start

### 1. Instalace dependencies

```bash
cd /Users/lenkaroubalova/Documents/Projekty/ProApp/proapp-core/backend
npm install
```

### 2. Konfigurace

Ujisti se, že máš vyplněný `.env` soubor v `/Users/lenkaroubalova/Documents/Projekty/ProApp/.env`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
PORT=3001
NODE_ENV=development
ADMIN_EMAIL=lenkaroubalova@seznam.cz
```

### 3. Spuštění serveru

**Development mode (s auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server poběží na: **http://localhost:3001**

---

## 📚 API Endpoints

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Registrace nového uživatele | ❌ |
| POST | `/api/auth/login` | Přihlášení | ❌ |
| POST | `/api/auth/refresh` | Obnovení tokenu | ❌ |
| POST | `/api/auth/logout` | Odhlášení | ✅ |
| GET | `/api/auth/me` | Aktuální uživatel | ✅ |

**Příklad registrace:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepass123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

**Odpověď:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "...",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user"
  }
}
```

**Příklad přihlášení:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepass123"
  }'
```

---

### 👥 Users (`/api/users`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/users` | Seznam uživatelů | ✅ | ✅ |
| GET | `/api/users/:id` | Detail uživatele | ✅ | Own or Admin |
| PUT | `/api/users/:id` | Aktualizace profilu | ✅ | Own or Admin |
| PUT | `/api/users/:id/password` | Změna hesla | ✅ | Own only |
| PUT | `/api/users/:id/role` | Změna role | ✅ | ✅ |
| DELETE | `/api/users/:id` | Smazání uživatele | ✅ | ✅ |

**Příklad získání vlastního profilu:**
```bash
curl http://localhost:3001/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 🎯 Modules (`/api/modules`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/modules` | Všechny moduly | ❌ | ❌ |
| GET | `/api/modules/my` | Moje moduly | ✅ | ❌ |
| POST | `/api/modules/:id/grant` | Udělit přístup | ✅ | ✅ |
| DELETE | `/api/modules/:id/revoke` | Odebrat přístup | ✅ | ✅ |
| GET | `/api/modules/:id/users` | Uživatelé s přístupem | ✅ | ✅ |
| POST | `/api/modules` | Vytvořit modul | ✅ | ✅ |

**Příklad udělení přístupu k modulu:**
```bash
curl -X POST http://localhost:3001/api/modules/paymentspro/grant \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid-of-user",
    "expires_at": "2025-12-31T23:59:59Z"
  }'
```

---

## 🔑 Authentication Flow

### 1. Registrace / Login
Client zavolá `/api/auth/register` nebo `/api/auth/login` a dostane:
- `token` - JWT token (platnost 7 dní)
- `refreshToken` - Refresh token (platnost 30 dní)
- `user` - User data

### 2. Autentizované požadavky
Pro všechny chráněné endpointy posílej header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### 3. Refresh tokenu
Když token vyprší, použij `/api/auth/refresh`:
```bash
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN"}'
```

Dostaneš nový `token` (refresh token zůstává stejný).

---

## 🏗️ Struktura projektu

```
backend/
├── server.js              # Hlavní Express server
├── package.json           # Dependencies
├── lib/
│   └── supabase.js       # Supabase client setup
├── middleware/
│   └── auth.js           # JWT auth middleware
└── routes/
    ├── auth.js           # Auth endpoints
    ├── users.js          # User management
    └── modules.js        # Module access control
```

---

## 🛡️ Security

### JWT Token Structure
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "role": "user|admin|super_admin",
  "modules": ["paymentspro", "lifepro"],
  "first_name": "John",
  "last_name": "Doe",
  "exp": 1234567890
}
```

### Role Hierarchy
- **user** - Běžný uživatel (access jen k přiděleným modulům)
- **admin** - Může spravovat uživatele a moduly
- **super_admin** - Plný přístup (nelze smazat nebo degradovat jiným adminem)

### Middleware Guards
- `authenticateToken` - Vyžaduje platný JWT token
- `requireAdmin` - Vyžaduje admin nebo super_admin role
- `requireModuleAccess(moduleId)` - Vyžaduje přístup ke konkrétnímu modulu

---

## 🧪 Testování

### Health Check
```bash
curl http://localhost:3001/health
```

### Vytvoření testovacího uživatele
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lenkaroubalova@seznam.cz",
    "password": "TestPass123!",
    "first_name": "Lenka",
    "last_name": "Roubalová"
  }'
```

### Login a získání tokenu
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lenkaroubalova@seznam.cz",
    "password": "TestPass123!"
  }'
```

Ulož si vrácený `token` a použij ho pro další požadavky:
```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔗 Integrace s moduly

### Jak modul ověří uživatele?

1. **Client posílá JWT token** z ProApp Core do modulu (např. PaymentsPro)
2. **Modul ověří token** pomocí stejného JWT_SECRET
3. **Modul zkontroluje `modules` array** v tokenu, zda obsahuje jeho ID

**Příklad v PaymentsPro backendu:**
```javascript
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

function verifyProAppToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No token' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' })

    // Kontrola přístupu k PaymentsPro
    if (!user.modules.includes('paymentspro')) {
      return res.status(403).json({ error: 'No access to PaymentsPro' })
    }

    req.user = user
    next()
  })
}
```

---

## 📝 TODO / Budoucí vylepšení

- [ ] OAuth integrace (Google, Apple) - použít kód z PaymentsPro
- [ ] Email verification flow
- [ ] Password reset flow
- [ ] Rate limiting
- [ ] API documentation (Swagger)
- [ ] Unit tests
- [ ] Logging system (Winston)
- [ ] Subscription management routes
- [ ] Payment integration (Stripe)

---

## 🐛 Debugging

**Logování:**
Server loguje všechny requesty do console:
```
2025-10-11T10:30:00.000Z - POST /api/auth/login
```

**Environment check:**
Při startu server vypíše:
```
🚀 ProApp Core Backend Started
📍 Server running on: http://localhost:3001
🌍 Environment: development
🔗 Supabase URL: https://your-project.supabase.co
```

**Chyby:**
- Všechny chyby vracejí JSON s `error` a `message`
- V development mode se posílá i `stack` trace

---

## 🌐 CORS

CORS je nakonfigurován pro povolení všech origins v development:
```javascript
cors({
  origin: '*',
  credentials: true
})
```

Pro produkci změň na konkrétní domény:
```javascript
cors({
  origin: ['https://your-frontend.com', 'https://paymentspro.com'],
  credentials: true
})
```

---

## 📞 Support

Pro otázky nebo problémy kontaktuj: lenkaroubalova@seznam.cz

---

**Vytvořeno: 11.10.2025**
**Poslední update: 11.10.2025**
