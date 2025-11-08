# 📋 Session Summary #8 - Dashboard Security Fix

**Datum**: 8. listopadu 2025 (odpoledne)
**Branch**: `fix/client-route-consolidation` (před zálohou)
**Status**: ⚠️ PENDING - Čeká na zálohu, pak pokračovat s RLS fix

---

## 🎯 Hlavní Úkol

**User request**: "když se přihlásím jako testerka s mým primárním g-mailem, tak vidím toto na dashboardu - ani nejsem oslovená jménem, ale mám tam všechny materiály a programy admina a dalších testerů nebo koučů. A v supabase jsem si nastavila 2 admin účty. To chci, aby zůstalo."

**3 problémy identifikovány**:
1. ✅ **FIXED** - Dashboard nepoužívá personalizované oslovení
2. ⏳ **PENDING** - RLS politiky nefiltrují materiály/programy podle coach_id
3. ⏳ **PENDING** - Hardcoded admin email místo database check

---

## ✅ Dokončeno v Této Session

### 1. Fix Personalized Greeting on Dashboard

**Problem**: Dashboard zobrazuje "Ahoj koučko, hezký den!" místo jména

**Root Cause**:
- DashboardOverview.jsx používá `getCurrentUser()` z localStorage
- Pro OAuth testers není jméno v localStorage, ale v TesterAuthContext

**Solution**: DashboardOverview.jsx (lines 1-30, 141-145)

```javascript
// Imports
import { getVocative } from '@shared/utils/czechGrammar';
import { useTesterAuth } from '@shared/context/TesterAuthContext';

// Component
const { profile: testerProfile } = useTesterAuth();

// Greeting
<Typography variant="h4">
  Ahoj {testerProfile?.displayName
    ? getVocative(testerProfile.displayName)
    : (currentUser?.name ? getVocative(currentUser.name) : 'koučko')
  }, hezký den!
</Typography>
```

**Priority Logic**:
1. TesterAuthContext profile (OAuth testers)
2. localStorage currentUser (access code testers)
3. Fallback "koučko"

**Files Changed**: 1
- `/src/modules/coach/components/coach/DashboardOverview.jsx`

---

## ⏳ Pending Tasks (AFTER Záloha)

### 2. Fix RLS Policies - Materials & Programs

**Problem**: RLS políti ky nastaveny na `USING (true)` - všichni vidí vše!

**Supabase Status** (ověřeno SQL query):
```sql
-- RLS is ENABLED ✅
coachpro_materials: rowsecurity = true
coachpro_programs: rowsecurity = true

-- Policies jsou permissive ❌
Policy: "Anyone can read materials" - USING (true)
Policy: "Anyone can read programs" - USING (true)
```

**Root Cause**:
- Development/testing policies v produkci
- Supabase vrací VŠECHNA data (filtrování jen v app code)
- Application code filtruje správně: `getMaterials(coachId)`, `getPrograms(coachId)`
- **Ale RLS nefiltruje na DB úrovni!**

**Solution (připraveno)**:

**A) Přidat `auth_user_id` do `coachpro_coaches`** (NEW column)
```sql
ALTER TABLE coachpro_coaches
ADD COLUMN auth_user_id UUID REFERENCES auth.users(id);
```

**B) Propojit při přihlášení** (Tester.jsx, AdminLogin.jsx)
```javascript
// OAuth testers
const coachUser = {
  id: tester.id,
  auth_user_id: user.id,  // ← Link to Supabase Auth
  ...
};
await saveCoach(coachUser);
```

**C) Update RLS políti ky**
```sql
-- Materials
DROP POLICY "Anyone can read materials" ON coachpro_materials;

CREATE POLICY "Coaches can read own materials"
ON coachpro_materials
FOR SELECT
TO authenticated
USING (
  coach_id = (
    SELECT id FROM coachpro_coaches
    WHERE auth_user_id = auth.uid()
  )
);

-- Programs (stejný pattern)
```

**Files to Create**:
- `/supabase/migrations/20250108_01_add_auth_to_coaches.sql`
- `/supabase/migrations/20250108_02_fix_materials_programs_rls.sql`

**Files to Modify**:
- `src/modules/coach/pages/Tester.jsx` - Add auth_user_id linking
- `src/modules/coach/pages/AdminLogin.jsx` - Add auth_user_id linking
- `src/modules/coach/utils/storage.js` - saveCoach() update

---

### 3. Support Multiple Admin Accounts

**Problem**: Hardcoded admin email v RootRedirect.jsx

**Current Code** (RootRedirect.jsx:32-36):
```javascript
const ADMIN_EMAIL = 'lenna@online-byznys.cz';
const [adminCheck] = await Promise.all([
  authUser.email === ADMIN_EMAIL
    ? supabase.from('coachpro_coaches').select('*').eq('email', ADMIN_EMAIL).eq('is_admin', true).maybeSingle()
    : Promise.resolve({ data: null }),
  // ...
]);
```

**Solution**: Query database instead of hardcode

```javascript
// Check admin status from DB (any email with is_admin = true)
const { data: adminCheck } = await supabase
  .from('coachpro_coaches')
  .select('*')
  .eq('email', authUser.email)
  .eq('is_admin', true)
  .maybeSingle();

if (adminCheck) {
  roles.push('admin');
  // Set current user...
}
```

**Files to Modify**:
- `/src/shared/components/RootRedirect.jsx` (lines 32-54)

**Benefit**: Jakýkoliv admin účet v Supabase bude fungovat (ne jen hardcoded email)

---

## 📊 Supabase RLS Investigation Results

**Query Run**:
```sql
SELECT tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('coachpro_materials', 'coachpro_programs')
ORDER BY tablename, policyname;
```

**Results**:
| Table | Policy | Command | USING | WITH_CHECK |
|-------|--------|---------|-------|------------|
| coachpro_materials | Anyone can delete materials | DELETE | true | NULL |
| coachpro_materials | Anyone can insert materials | INSERT | NULL | true |
| coachpro_materials | Anyone can read materials | SELECT | true | NULL |
| coachpro_materials | Anyone can update materials | UPDATE | true | NULL |
| coachpro_programs | Anyone can delete programs | DELETE | true | NULL |
| coachpro_programs | Anyone can insert programs | INSERT | NULL | true |
| coachpro_programs | Anyone can read programs | SELECT | true | NULL |
| coachpro_programs | Anyone can update programs | UPDATE | true | NULL |

**⚠️ SECURITY ISSUE**: `USING (true)` = NO FILTERING!

---

## 🎓 Critical Lessons

### Lesson 1: RLS Policies vs Application Code

**Wrong Assumption**: "Application code filtruje podle coachId, takže je to bezpečné"

**Reality**:
- RLS policies MUSÍ filtrovat na DB úrovni
- Application code filtering je SECONDARY (UX, ne security)
- Uživatel může obejít frontend a volat Supabase API přímo!

**Example Attack**:
```javascript
// Útočník obejde frontend a volá Supabase přímo
const { data } = await supabase
  .from('coachpro_materials')
  .select('*');  // ← Vrátí VŠECHNY materiály (RLS = true)!
```

**Correct Pattern**:
1. RLS policies = PRIMARY security (DB level)
2. Application code = SECONDARY filtering (UX level)

### Lesson 2: Production Testing of RLS

**Always Test**:
```sql
-- 1. Check RLS enabled
SELECT tablename, rowsecurity FROM pg_tables;

-- 2. Check policies exist
SELECT * FROM pg_policies WHERE tablename = 'xyz';

-- 3. Test as user (NOT service_role!)
-- Try SELECT in Supabase SQL editor
```

**User caught this**: "mám tam všechny materiály a programy admina"

### Lesson 3: Migration Design Pattern

**Use `IF NOT EXISTS` for safety**:
```sql
-- ❌ WRONG - Fails if column exists
ALTER TABLE coaches ADD COLUMN auth_user_id UUID;

-- ✅ CORRECT - Idempotent migration
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'coachpro_coaches'
    AND column_name = 'auth_user_id'
  ) THEN
    ALTER TABLE coachpro_coaches
    ADD COLUMN auth_user_id UUID REFERENCES auth.users(id);
  END IF;
END $$;
```

**Benefit**: Můžeš spustit migraci vícekrát bez erroru

---

## 📁 Files Changed (Session #8)

### Modified (1 file):
1. `/src/modules/coach/components/coach/DashboardOverview.jsx`
   - Added `useTesterAuth` import
   - Added `getVocative` import
   - Added testerProfile context usage
   - Updated greeting logic (priority: tester → coach → fallback)

---

## 📝 Documentation Updates Needed

### CLAUDE_QUICK.md
- Add Section 19: RLS Security Pattern
- Update Section 15: Context API usage (add TesterAuthContext example)

### MASTER_TODO_V4.md
- Update Sprint 2a: RLS Policies (mark as IN PROGRESS)
- Add Sprint 2a.1: Auth User ID Migration (NEW)
- Add Sprint 2a.2: Multiple Admin Support (NEW)

### CONTEXT_QUICK.md
- Update "Current Work" - Session #8 summary
- Update "Pending Tasks" - 2 RLS fixes

---

## 🚀 Next Steps (AFTER Záloha)

**Priority Order**:
1. ✅ User creates backup
2. Create migration `20250108_01_add_auth_to_coaches.sql`
3. Create migration `20250108_02_fix_materials_programs_rls.sql`
4. Update Tester.jsx to link auth_user_id
5. Update AdminLogin.jsx to link auth_user_id
6. Update RootRedirect.jsx to remove hardcoded email
7. Run migrations in Supabase
8. Test as tester (should see ONLY own materials/programs)
9. Test as admin (should work with any admin account)

---

## ⏰ Timeline

**Start**: 14:00
**Discovery**: 14:15 (RLS investigation in Supabase)
**Fix #1**: 14:30 (Dashboard greeting)
**Planning**: 14:45 (RLS strategy discussion)
**Pause**: 15:00 (User creates backup)

**Estimated Time to Complete**:
- Migrations: 30 min
- Code updates: 20 min
- Testing: 20 min
- **Total**: ~70 min

---

## 🔒 Security Status

**Before This Session**:
- ❌ Materials/Programs visible to ALL coaches (RLS = true but permissive)
- ❌ Only hardcoded admin email works
- ✅ Greeting uses generic "koučko"

**After This Session** (partial):
- ✅ Dashboard greeting personalized (tester names work)
- ❌ Materials/Programs still visible to ALL (PENDING migration)
- ❌ Admin still hardcoded (PENDING RootRedirect update)

**After Full Fix** (target):
- ✅ Dashboard greeting personalized
- ✅ Materials/Programs filtered by coach (RLS on DB level)
- ✅ Multiple admin accounts supported (database-driven)

---

## 💡 Key Takeaways

1. **RLS = PRIMARY Security** - Application code filtering is UX, not security
2. **Test RLS in Production** - Check `pg_policies` regularly
3. **Idempotent Migrations** - Use `IF NOT EXISTS` checks
4. **Context API Everywhere** - Don't duplicate auth checks
5. **User Testing Catches Issues** - User found RLS problem before production breach

---

**Status**: ✅ Session #8 planning complete, user preparing backup
**Next**: Execute RLS migration plan

---

**Autor**: Lenka + Claude Sonnet 4.5
**Poslední update**: 8. listopadu 2025, 13:00
