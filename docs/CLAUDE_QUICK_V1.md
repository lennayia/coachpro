# CoachPro - Quick Reference

**Aktualizováno:** Session #15 (11.11.2025)

## 🚀 Quick Start

### Autentizace (Session #14 Complete Overhaul)
- ✅ Email + Password
- ✅ Google OAuth  
- ✅ Magic Link (OTP)
- ❌ Access codes (REMOVED)

**Registrace:**
```javascript
<RegisterForm
  onSuccess={handleRegistrationSuccess}
  userType="tester|client|coach"
  redirectTo="/dashboard"
/>
```

**⚠️ KRITICKÉ:** `signOut()` až PO `onSuccess()` callback, jinak RLS zablokuje INSERT!

---

## 📁 Soubory & Komponenty

### Universal Components (Session #14 + #15)

#### `ProfileScreen.jsx` (NEW - Session #15)
```javascript
<ProfileScreen
  profile={coachProfile}
  user={user}
  onSave={async (data) => {
    await supabase.from('coachpro_coaches').update(data).eq('auth_user_id', user.id);
  }}
  onBack={() => navigate('/welcome')}
  userType="client|coach|tester"
  photoBucket={PHOTO_BUCKETS.COACH_PHOTOS}
  showPhotoUpload={true}
  editableFields={['name', 'email', 'phone', 'education', ...]}
  metadata={{ registrationDate, appVersion }}
  loading={loading}
/>
```
**Features:** Validace, auto-formátování, password change, photo upload

#### `WelcomeScreen.jsx`
```javascript
<WelcomeScreen
  profile={profile}
  userType="client|tester|coach"
  onLogout={handleLogout}
  actionCards={[...]}
  onAvatarClick={() => navigate('/profile')}
  customCodeEntry={<YourCodeEntry />}  // optional
/>
```

#### `RegisterForm.jsx`
```javascript
<RegisterForm
  onSuccess={async (data) => {
    // Insert do DB while session active
    await supabase.from('testers').insert({
      auth_user_id: data.authUserId  // VŽDY populated!
    });
  }}
  userType="tester"
/>
```

#### `PhotoUpload.jsx`
```javascript
<PhotoUpload
  photoUrl={profile?.photo_url}
  onPhotoChange={(url) => setPhotoUrl(url)}
  userId={profile.id}
  bucket={PHOTO_BUCKETS.CLIENT_PHOTOS}
/>
```

---

## 🔧 Utils

### Sessions (`src/shared/utils/sessions.js`)
```javascript
import { getNextSession, getClientSessions } from '@shared/utils/sessions';

const nextSession = await getNextSession(clientId);
const upcoming = await getClientSessions(clientId, { upcoming: true });
```

### Photo Storage (`src/shared/utils/photoStorage.js`)
```javascript
import { uploadPhoto, PHOTO_BUCKETS } from '@shared/utils/photoStorage';

const url = await uploadPhoto(file, {
  bucket: PHOTO_BUCKETS.CLIENT_PHOTOS,
  userId: profile.id
});
```

### Czech Grammar (`src/shared/utils/czechGrammar.js`)
```javascript
import { getVocative } from '@shared/utils/czechGrammar';

getVocative('Lenka')  // → "Enko"
```

---

## 🗄️ Database

### Tables (aktuální)
- `testers` - auth_user_id (NOT NULL), ❌ NO access_code
- `coachpro_coaches` - auth_user_id, is_tester, tester_id
- `coachpro_client_profiles` - auth_user_id, photo_url, coach_id
- `coachpro_sessions` - client_id, coach_id, status, location

### RLS Pattern
```sql
-- User can view own record
FOR SELECT USING (auth_user_id = auth.uid())

-- Anyone can register
FOR INSERT WITH CHECK (true)
```

---

## 🚨 Časté Chyby

### 1. RLS 401 během registrace
**Fix:** `signOut()` až PO DB inserts!

### 2. 406 Not Acceptable
**Fix:** NIKDY nepoužívej embedded resources (`:`) s RLS. Separátní queries.

### 3. `.single()` na prázdné tabulce
**Fix:** Použij array + check length, nebo `.maybeSingle()`

---

## 📝 Workflow Checklist

### Nová Feature
- [ ] Vytvoř utils (modular functions)
- [ ] Vytvoř shared component
- [ ] Implementuj do pages
- [ ] Migrace + RLS
- [ ] Test
- [ ] Security Advisor check
- [ ] Commit

### End of Session
- [ ] Summary.md
- [ ] Update CLAUDE.md
- [ ] Update MASTER_TODO files
- [ ] Update QUICK/CONTEXT docs

---

## 💡 Mantry

1. **Modularita** > DRY > Performance
2. **Security** > Features  
3. **Czech first** - date-fns `cs` locale, getVocative()
4. **Auth lifecycle** - signOut() až nakonec!
5. **Access codes** jsou minulost!

---

## 🔗 Key Files

- `CLAUDE.md` - Complete instructions
- `docs/summary14.md` - Session #14 detailed docs
- `src/shared/utils/` - All utility functions
- `src/shared/components/` - Reusable components

---

**Session #14 Motto:** Email+password + OAuth, ne access codes!
