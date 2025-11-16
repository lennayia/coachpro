# Jak najít Google Scopes v Supabase Dashboard

## Krok za krokem:

### 1. Otevři Supabase Dashboard
- URL: https://app.supabase.com/
- Přihlaš se

### 2. Vyber projekt CoachPro
- V levém menu vidíš seznam projektů
- Klikni na **CoachPro** (nebo jak máš projekt pojmenovaný)

### 3. Navigace v levém menu
```
🏠 Home
📊 Table Editor
🔐 Authentication  ← KLIKNI SEM
  ├── Users
  ├── Policies
  ├── Providers     ← PAK SEM
  ├── ...
```

### 4. Providers stránka
Po kliknutí na **Providers** uvidíš seznam OAuth providerů:
- Apple
- Azure
- Discord
- Facebook
- GitHub
- **Google** ← KLIKNI SEM
- LinkedIn
- Twitter
- ...

### 5. Google Provider formulář
Po kliknutí na **Google** se otevře formulář s těmito poli:

```
┌─────────────────────────────────────────────┐
│ Google enabled                              │
│ ☑ Enable Google provider                   │
├─────────────────────────────────────────────┤
│ Client ID (for OAuth)                       │
│ [your-client-id.apps.googleusercontent.com] │
├─────────────────────────────────────────────┤
│ Client Secret (for OAuth)                   │
│ [••••••••••••••••••••••••••••••••••••••]   │
├─────────────────────────────────────────────┤
│ Authorized Client IDs                       │
│ (Optional - for additional clients)         │
├─────────────────────────────────────────────┤
│ Skip nonce check                            │
│ ☐ Skip nonce check                          │
├─────────────────────────────────────────────┤
│ Additional Scopes                           │  ← TADY!!!
│ [                                         ] │
└─────────────────────────────────────────────┘
```

### 6. Co napsat do "Additional Scopes"
Aktuálně tam možná máš prázdné pole, nebo jen:
```
email profile
```

**Změň to na:**
```
email profile https://www.googleapis.com/auth/calendar.readonly
```

### 7. Save
- Scrolluj dolů
- Klikni **Save** (zelené tlačítko)

---

## Alternativní cesta (pokud to nevypadá stejně):

Někdy Supabase mění UI. Pokud nevidíš "Additional Scopes", hledej:
- "Scopes"
- "OAuth Scopes"
- "Requested Scopes"
- "Google Scopes"

Nebo se dívej na pravou stranu formuláře - někdy je to v "Advanced Settings" nebo "Additional Configuration".

---

## ⚠️ DŮLEŽITÉ: Po uložení
**MUSÍŠ se odhlásit a znovu přihlásit!**

Nový scope se aplikuje jen na **nové** access tokeny. Starý token (z předchozího přihlášení) nemá calendar.readonly a pořád bude házet 403.

---

## Pokud to nenajdeš:
1. Screenshot mi celou stránku Google Provider settings
2. Nebo mi napiš, jaká pole tam vidíš
3. Pomůžu ti to najít!
