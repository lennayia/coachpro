# Update CoachPro Code for Schema Migration

Po aplikaci schema migrací je potřeba updatovat kód, aby používal `coachpro.table_name` místo `table_name`.

---

## Automatická Aktualizace (Recommended)

### Find & Replace Pattern

```bash
# V src/ složce najdi všechny .from('coachpro_
# a updatuj na .from('coachpro.coachpro_

# PŘED:
.from('coachpro_coaches')
.from('coachpro_materials')

# PO:
.from('coachpro.coachpro_coaches')
.from('coachpro.coachpro_materials')
```

---

## Manuální Kontrola (Důležité soubory)

### 1. Storage Functions (`src/shared/utils/storage.js`)

```javascript
// PŘED
export async function getCoaches() {
  const { data } = await supabase
    .from('coachpro_coaches')
    .select('*');
}

// PO
export async function getCoaches() {
  const { data } = await supabase
    .from('coachpro.coachpro_coaches')
    .select('*');
}
```

### 2. Public Catalog (`src/shared/utils/publicCatalog.js`)

```javascript
// PŘED
const { data } = await supabase
  .from('coachpro_materials')
  .select('*')
  .eq('is_public', true);

// PO
const { data } = await supabase
  .from('coachpro.coachpro_materials')
  .select('*')
  .eq('is_public', true);
```

### 3. Auth Contexts

- `src/contexts/TesterAuthContext.jsx`
- `src/contexts/CoachAuthContext.jsx`
- `src/contexts/ClientAuthContext.jsx`

```javascript
// PŘED
await supabase
  .from('coachpro_coaches')
  .update({ photo_url })
  .eq('id', coachId);

// PO
await supabase
  .from('coachpro.coachpro_coaches')
  .update({ photo_url })
  .eq('id', coachId);
```

### 4. Všechny Page komponenty

- `src/modules/coach/pages/*.jsx`
- `src/modules/client/pages/*.jsx`

---

## Alternativní Přístup: Schema Alias

Pokud nechceš updatovat celý codebase, můžeš nastavit **default schema** v Supabase klientovi:

```javascript
// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'coachpro', // ✅ Default schema
  },
});
```

**S tímto nastavením:**
```javascript
// FUNGUJE BEZ ZMĚNY KÓDU
.from('coachpro_coaches')  // Automaticky hledá v coachpro schema
```

---

## Doporučení

### Pro CoachPro (stávající app):
✅ **Použij schema alias** v supabaseClient.js
- Nulová změna kódu
- Všechny queries fungují stejně
- Přidáš jen 3 řádky config

### Pro LifePro (nová app):
✅ **Vytvoř separátní Supabase klienta**

```javascript
// src/supabaseClient.js (CoachPro)
export const supabase = createClient(url, key, {
  db: { schema: 'coachpro' }
});

// future: src/lifeproClient.js (LifePro)
export const lifeproClient = createClient(url, key, {
  db: { schema: 'lifepro' }
});
```

---

## Testing Checklist

Po update kódu otestuj:

- [ ] Coach login
- [ ] Client login
- [ ] Material sharing
- [ ] Program access
- [ ] Purchase flow (lead magnets)
- [ ] Session management
- [ ] Card decks

---

## Rollback Plan

Pokud něco nefunguje:

```sql
-- Přesuň tabulky zpět do public
ALTER TABLE coachpro.coachpro_coaches SET SCHEMA public;
ALTER TABLE coachpro.coachpro_materials SET SCHEMA public;
-- ... atd

-- Smaž prázdné schemas
DROP SCHEMA IF EXISTS coachpro CASCADE;
DROP SCHEMA IF EXISTS lifepro CASCADE;
```
