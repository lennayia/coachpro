# 🚀 ProApp Core Backend - Spuštění

## Rychlý start

### 1. Instalace dependencies

```bash
cd /Users/lenkaroubalova/Documents/Projekty/ProApp/proapp-core/backend
npm install
```

### 2. Spuštění serveru

**Development mode (s auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### 3. Testování

Server poběží na: **http://localhost:3001**

Otevři prohlížeč a zkus:
- http://localhost:3001/ - API info
- http://localhost:3001/health - Health check

## 📝 Testování registrace a přihlášení

### Test registrace (curl):

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lenkaroubalova@seznam.cz",
    "password": "TestPass123",
    "first_name": "Lenka",
    "last_name": "Roubalová"
  }'
```

### Test přihlášení:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lenkaroubalova@seznam.cz",
    "password": "TestPass123"
  }'
```

Uložíš si vrácený token:
```bash
export TOKEN="tvůj_jwt_token_zde"
```

### Test autentizovaného endpointu:

```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## 🗄️ Databáze

- Backend používá **SQLite** (soubor `proapp-core.db`)
- Databáze se vytvoří automaticky při prvním spuštění
- Default subscription plans a modules se seedují automaticky

## 📚 Dostupné endpointy

Viz server.js console log při startu pro kompletní seznam endpointů.

### Hlavní funkcionality:
- ✅ Registrace a přihlášení (email + password)
- ✅ Forgot password / Reset password
- ✅ JWT autentizace
- ✅ Admin funkce
- ✅ Subscription management
- ✅ SSO pro moduly
- ⏳ OAuth (Google, Apple) - připraveno, čeká na credentials

## 🔜 Další kroky

1. ✅ **HOTOVO**: ProApp Core backend běží na localhost:3001
2. **TODO**: Otestovat všechny endpointy
3. **TODO**: Přidat Google/Apple OAuth credentials do .env
4. **TODO**: Vytvořit frontend pro ProApp Core
5. **TODO (Phase 2)**: Migrovat PaymentsPro na Supabase
6. **TODO (Phase 3)**: Implementovat LifePro modul

---

**Vytvořeno**: 11.10.2025
**Status**: ✅ Funkční (SQLite - temporary until Supabase migration)
