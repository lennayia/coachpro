# Claude Quick Reference - Sessions #16-20

**Datum:** 17.01.2025
**Branch:** `main`
**Latest:** Session #20 - Lead Magnets & Multi-tenant Architecture

---

## 🆕 Session #20 - Lead Magnets & Multi-tenant

### PayWithContactModal Component
**Cesta:** `/src/shared/components/PayWithContactModal.jsx` (265 lines)

```jsx
<PayWithContactModal
  open={payModalOpen}
  onClose={() => setPayModalOpen(false)}
  item={{ id, type, title }}
  coach={{ id, name }}
  onSuccess={(purchase) => {
    console.log('Purchase created:', purchase);
    // Reload catalog
  }}
/>
```

**Features:**
- Auto-fill z user profilu
- Validace (name, email required)
- Duplicate purchase detection (error 23505)
- Success/error notifications

### Public Catalog Utilities
**Cesta:** `/src/shared/utils/publicCatalog.js` (180 lines)

```javascript
import { getEnrichedCatalog, hasAccess } from '@shared/utils/publicCatalog';

// Load public materials with access info
const catalog = await getEnrichedCatalog(coachId, clientEmail);
// { materials: [...], programs: [...] }

// Check if client has access
const hasAccess = await hasAccess(clientEmail, 'material', materialId);
// true/false
```

### CoachDetail Enhancement

```jsx
// Public catalog with pricing
{materials.map((material) => (
  <Card>
    {material.is_lead_magnet ? (
      <Chip label="Zdarma za kontakt" color="success" icon={<Gift />} />
    ) : material.price > 0 ? (
      <Chip label={`${material.price} ${material.currency}`} />
    ) : null}

    <Button
      onClick={() => material.hasAccess
        ? navigate(`/material/${material.id}`)
        : setPayModalOpen(true)
      }
    >
      {material.hasAccess ? 'Otevřít' : 'Získat zdarma'}
    </Button>
  </Card>
))}
```

### Database Schema (Multi-tenant)

**Schema Alias (Zero Code Changes):**
```javascript
// src/supabaseClient.js
export const supabase = createClient(url, key, {
  db: { schema: 'coachpro' }
});
```

**Purchases Table:**
```sql
CREATE TABLE coachpro_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type TEXT CHECK (item_type IN ('material', 'program', 'card-deck')),
  item_id TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  coach_id TEXT REFERENCES coachpro_coaches(id),
  payment_method TEXT DEFAULT 'contact',
  amount DECIMAL(10, 2) DEFAULT 0,
  access_granted BOOLEAN DEFAULT true,
  CONSTRAINT unique_purchase UNIQUE(client_email, item_type, item_id)
);
```

**Pricing Fields:**
```sql
ALTER TABLE coachpro_materials
ADD COLUMN is_public BOOLEAN DEFAULT false,
ADD COLUMN price DECIMAL(10, 2),
ADD COLUMN is_lead_magnet BOOLEAN DEFAULT false;
```

**Auto-share Trigger:**
```sql
CREATE FUNCTION auto_share_after_purchase() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.access_granted = true THEN
    INSERT INTO coachpro_shared_materials (
      id, coach_id, material_id, client_email
    ) VALUES (
      gen_random_uuid()::text,
      NEW.coach_id,
      NEW.item_id,
      NEW.client_email
    )
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 📚 Session #19 - Google Calendar

### Google Calendar Sync
**Cesta:** `/src/shared/utils/googleCalendar.js` (200 lines)

```javascript
import { syncGoogleCalendarToSessions } from '@shared/utils/googleCalendar';

// Sync calendar events to database
const result = await syncGoogleCalendarToSessions(coachId, accessToken);
// { created: 5, skipped: 2, errors: [] }
```

### CoachSessions Page
**Cesta:** `/src/modules/coach/pages/CoachSessions.jsx` (255 lines)

```jsx
<Button onClick={handleSyncCalendar}>
  Synchronizovat Google Calendar
</Button>

{/* Results dialog */}
<Dialog open={showResults}>
  <Typography>Vytvořeno: {syncResults.created}</Typography>
  <Typography>Přeskočeno: {syncResults.skipped}</Typography>
</Dialog>
```

---

## 🎯 Session #16-17 - FlipCard & Profiles

### FlipCard Component
**Cesta:** `/src/shared/components/cards/FlipCard.jsx`

```jsx
<FlipCard
  frontContent={<Box>Přední strana</Box>}
  backContent={<Box>Zadní strana</Box>}
  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  flipDuration={0.6}
  onFlip={(isFlipped) => console.log(isFlipped)}
/>
```

### Sound Feedback Hook
**Cesta:** `/src/shared/hooks/useSoundFeedback.js`

```jsx
const { playClick, playFlip, enabled, setEnabled } = useSoundFeedback({
  volume: 0.3
});

<Button onClick={() => { playClick(); /* akce */ }}>
  Klikni
</Button>
```

### AnimatedGradient
**Cesta:** `/src/shared/components/effects/AnimatedGradient.jsx`

```jsx
<AnimatedGradient
  colors={['#0a0f0a', '#1a2410', '#0f140a']}
  animation="wave"
  duration={8}
/>
```

### CoachCard with Profiles
**Cesta:** `/src/shared/components/cards/CoachCard.jsx`

```jsx
<CoachCard
  coach={{
    name: "Lenka Roubalová",
    photo_url: "...",
    bio: "...",
    specializations: ["Mindfulness", "Life Coaching"],
    linkedin: "lenka-roubalova",
    instagram: "@lenka.coach"
  }}
  showFullProfile={true}
  onNavigate={(slug) => navigate(`/client/coach/${slug}`)}
/>
```

---

## 🛠️ Common Patterns

### Error Handling (Duplicate Purchase)
```javascript
try {
  await supabase.from('coachpro_purchases').insert(data);
} catch (error) {
  if (error.code === '23505') {
    showError('Již máte přístup', 'Tento materiál už máte.');
    return;
  }
  throw error;
}
```

### Theme-aware Styling
```jsx
sx={{
  color: (theme) =>
    theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary,
  background: (theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(143, 188, 143, 0.03)'
      : 'rgba(143, 188, 143, 0.05)'
}}
```

### Soft Gradients
```javascript
const createSoftGradient = (color1, color2, angle = 135) => {
  const hexToRgba = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return `linear-gradient(${angle}deg,
    ${hexToRgba(color1, 0.35)} 0%,
    ${hexToRgba(color2, 0.25)} 100%)`;
};
```

---

## 🗄️ Database Quick Reference

### Client-Coach Relationship
```sql
-- Primary coach
ALTER TABLE coachpro_client_profiles
ADD COLUMN coach_id TEXT REFERENCES coachpro_coaches(id);

-- Check in code
const hasPrimaryCoach = profile?.coach_id != null;
```

### Public Materials
```sql
-- Query public materials
SELECT * FROM coachpro_materials
WHERE coach_id = ? AND is_public = true;

-- Check access
SELECT EXISTS (
  SELECT 1 FROM coachpro_shared_materials
  WHERE client_email = ? AND material_id = ?
  UNION
  SELECT 1 FROM coachpro_purchases
  WHERE client_email = ? AND item_id = ? AND access_granted = true
);
```

---

## 📁 File Locations

### Session #20 Files
- `src/shared/components/PayWithContactModal.jsx` (265 lines)
- `src/shared/utils/publicCatalog.js` (180 lines)
- `src/modules/coach/pages/CoachDetail.jsx` (enhanced)
- `supabase/migrations/20250116_02_create_material_purchases.sql`
- `supabase/migrations/20250116_03_add_pricing_to_materials_programs.sql`
- `supabase/migrations/20250117_01_create_schema_structure.sql`
- `supabase/migrations/20250117_02_move_tables_to_coachpro_schema.sql`
- `supabase/migrations/20250117_03_create_shared_tables.sql`

### Session #19 Files
- `src/shared/utils/googleCalendar.js` (200 lines)
- `src/modules/coach/pages/CoachSessions.jsx` (255 lines)
- `src/modules/coach/pages/LandingPage.jsx` (652 lines)
- `src/modules/coach/pages/ClientDashboard.jsx` (1087 lines)

### Session #16-17 Files
- `src/shared/components/cards/FlipCard.jsx`
- `src/shared/components/cards/CoachCard.jsx` (refactored)
- `src/shared/hooks/useSoundFeedback.js`
- `src/shared/components/effects/AnimatedGradient.jsx`
- `src/modules/client/pages/CoachDetail.jsx` (580 lines)
- `src/modules/client/pages/ClientPrograms.jsx` (680 lines)

---

## 🚀 Quick Commands

### Apply Schema Migrations
```bash
# In Supabase SQL Editor
-- 1. Run 20250117_01_create_schema_structure.sql
-- 2. Run 20250117_02_move_tables_to_coachpro_schema.sql
-- 3. Run 20250117_03_create_shared_tables.sql
```

### Update Supabase Client
```javascript
// src/supabaseClient.js
export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY,
  {
    db: { schema: 'coachpro' }  // ✅ Add this
  }
);
```

### Test Purchase Flow
```bash
# 1. Mark material as public + lead magnet (in Supabase)
UPDATE coachpro_materials
SET is_public = true, is_lead_magnet = true
WHERE id = 'material-id';

# 2. Test as client
# - Navigate to /client/coach/lenka-roubalova
# - See material in Materials tab
# - Click "Získat zdarma"
# - Fill contact form
# - Check coachpro_purchases table
# - Check coachpro_shared_materials table (auto-shared by trigger)
```

---

## 📊 Session Statistics

### Session #20
- **Files created:** 15 (migrations, components, docs)
- **Files modified:** 3
- **Lines added:** ~2,080
- **Bugs fixed:** 10 (iterative trigger fixes)

### Sessions #16-19
- **Total lines added:** ~5,300
- **Components created:** 10+
- **Pages created/refactored:** 8

### Total (20 sessions)
- **Lines of code:** ~7,400+
- **Files created:** 40+
- **Bugs fixed:** 20+

---

## 🎯 Next Steps

1. **Apply schema migrations** (immediate)
2. **Update supabaseClient.js** (immediate)
3. **Test CoachPro after migration** (immediate)
4. **Coach UI for pricing** (next session)
5. **Stripe integration** (future)

---

*Last Updated: 17.01.2025*
*Quick Reference for Sessions #16-20*
