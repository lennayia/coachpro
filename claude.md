Session Updates (4.11.2025 večer 21:40)

  > **Update k CLAUDE.md**: Nové poznatky a patterns z UI Polish & Modularity Cleanup session

  ---

  ## 📍 Aktuální Stav (4.11.2025, večer)

  **Session**: UI Polish & Modularity Cleanup (continuation)
  **Status**: ✅ MaterialCardSkeleton refactored, Button fix applied, Sprint 18b documented
  **Production**: ✅ PROJEKT JE V PRODUKCI NA SUPABASE (kritické si pamatovat!)
  **Dev server**: `http://localhost:3000/`

  ---

  ## 🎓 Klíčové Lekce z Této Session

  ### 1. Production Status Awareness ⚠️

  **KRITICKÉ**: Projekt JE v produkci na Supabase, NE v development phase!

  **Uživatelka zdůraznila**:
  - "A Supabase už přece máme!"
  - "A opravdu, my už jsme v produkčním režimu na supabase, to přece už musíš vědět za tu dobu!"

  **Důsledek**: AI asistent MUSÍ si pamatovat production status a nenavrhovat "future Supabase integration" - už JE integrovaný!

  **300ms delay** v MaterialsLibrary.jsx (line 331):
  - NENÍ pro "future Supabase integration"
  - JE pro simulaci async operace při načítání materiálů
  - Bude použit při full metadata migraci z localStorage do Supabase

  ---

  ### 2. Skeleton Loader Modularity Pattern 🎨

  **Problém**: MaterialCardSkeleton měl starý 2-column layout, MaterialCard používá nový 8-row single-column

  **Řešení**: Complete refactor to match current design

  **8-Row Single-Column Pattern**:
  ```javascript
  // MaterialCardSkeleton.jsx (152 lines)
  <Card sx={{ minHeight: 280, borderRadius: BORDER_RADIUS.card }}>
    <CardContent sx={{ p: 3, pr: 2.5 }}>
      {/* Row 1: Icons (large left + 4 action right) */}
      <Box display="flex" justifyContent="space-between" mb={1.5}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box display="flex" gap={0.75}>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="circular" width={22} height={22} />
          ))}
        </Box>
      </Box>

      {/* Row 2: Category chip */}
      <Box mb={1}>
        <Skeleton variant="rounded" width={80} height={16} />
      </Box>

      {/* Row 3: Metadata horizontal (duration + file size) */}
      <Box display="flex" gap={1.5} mb={1}>
        <Skeleton variant="text" width={60} height={16} />
        <Skeleton variant="text" width={50} height={16} />
      </Box>

      {/* Row 4: URL/fileName */}
      <Box sx={{ minHeight: '1.2em', mb: 1 }}>
        <Skeleton variant="text" width="70%" height={16} />
      </Box>

      {/* Row 5: Title (2 lines) */}
      <Box sx={{ minHeight: '2.6em', mb: 1 }}>
        <Skeleton variant="text" width="90%" height={20} />
        <Skeleton variant="text" width="70%" height={20} />
      </Box>

      {/* Row 6: Description (3 lines) */}
      <Box sx={{ minHeight: '4.2em', mb: 1 }}>
        <Skeleton variant="text" width="100%" height={14} />
        <Skeleton variant="text" width="95%" height={14} />
        <Skeleton variant="text" width="60%" height={14} />
      </Box>

      {/* Row 7: Taxonomy chips (3×) */}
      <Box display="flex" gap={0.5} mb={1.5}>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} variant="rounded" width={70} height={18} />
        ))}
      </Box>

      {/* Row 8: Button "Jak to vidí klientka" */}
      <Box mt={1.5}>
        <Skeleton variant="rounded" width={160} height={32} />
      </Box>
    </CardContent>
  </Card>

  Modular Pattern:
  - Tento pattern lze adaptovat pro ProgramCardSkeleton, ClientCardSkeleton
  - Responsive s isVeryNarrow breakpoint (420px)
  - Používá BORDER_RADIUS konstanty

  Kde se používá:
  - MaterialsLibrary.jsx line 331 (loading state)
  - Zobrazí se na 300ms při načítání materiálů

  ---
  3. Inline vs Modular Trade-offs 🤔

  Situace: Tlačítko "Přidat materiál" nebylo responsive, potřebovalo fix

  Dvě možnosti:
  1. Inline solution (rychlé fix) - přidat responsive padding přímo do komponenty
  2. Modular solution (full refactor) - vytvořit button modularity systém napříč celou aplikací

  Rozhodnutí uživatelky: Inline solution
  "no, jenže to bychom zas měli opravdu hodně práce s tím, viď?"

  Řešení:
  // MaterialsLibrary.jsx (lines 221-234)
  <Button
    variant="contained"
    startIcon={<AddIcon />}
    sx={{
      whiteSpace: 'nowrap',
      alignSelf: 'flex-start',      // Never fullWidth
      minWidth: 'fit-content',
      px: { xs: 2, sm: 3 },          // 16px → 24px (responsive!)
      py: { xs: 0.75, sm: 1 }        // 6px → 8px
    }}
  >
    Přidat materiál
  </Button>

  Future Task: Dokumentováno jako Sprint 18b v MASTER_TODO_V3.md pro později

  Key Insight: Někdy je lepší rychlé inline řešení než velký refactor, zvlášť když:
  - Čas je limitovaný
  - Feature je urgent
  - Full refactor lze udělat později
  - Trade-off je explicitně akceptován uživatelkou

  ---
  4. Documentation Best Practices 📝

  Pattern z této session:

  A) Completed Work → Changelog Section
  ## UI Polish & Modularity Cleanup (4.11.2025, večer)

  ### A) MaterialCardSkeleton Refactor ✅
  **Commit**: TBD
  **Problém**: ...
  **Řešení**: ...

  ### B) Button Responsive Fix ✅
  **Soubor**: MaterialsLibrary.jsx
  ...

  B) Future Work → Separate Sprint Section
  ## 🔘 Sprint 18b: Button Modularity System - Responsive & Consistent

  **Priorita**: MEDIUM
  **Odhad**: 6-8 hodin
  **Status**: ⏳ Pending - naplánováno na budoucnost

  ### Problém:
  Buttons nemají modulární systém → duplicitní kód, nekonzistentní responsive

  ### Řešení:
  5 modular functions:
  - createPrimaryButton(isDark)
  - createSecondaryButton(isDark)
  - createOutlinedButton(isDark)
  - createTextButton()
  - createCompactButton(isDark)

  ### 3 Implementation Phases:
  1. Critical buttons (Uložit, Zrušit, Smazat)
  2. Modal buttons
  3. Theme overrides cleanup

  Key Point: Uživatelka chtěla inline fix zadokumentovat jako HOTOVO, ale button modularity jako BUDOUCÍ ÚKOL (ne jako již hotovou
  práci)

  "já jsem ale chtěla, abys tam zapsal, že musíme udělat modularitu pro tlačítka a popsal, jak - jako úkol na později"

  ---
  5. Beta Badge Color Fix - Instructions Pattern 🎨

  Situace: User našla problém (Beta badge hardcoded orange místo theme secondary)

  AI přístup: Místo okamžité opravy, poskytnout instrukce pro user
  "dívej, to tlačítko BETA by mělo být v barvě secondary. Stačí opravit tenhle kód z header.jsx nebo to bude jinde? Pokud stačí, ukaž 
  jak, opravím sama."

  Odpověď:
  Header.jsx:
  - Line ~133: backgroundColor: '#FF9800' → 'secondary.main'
  - Line ~138: backgroundColor: '#F57C00' → 'secondary.dark'

  Pattern: Když user říká "ukaž jak, opravím sama" → poskytnout přesné instrukce místo automatické opravy

  ---
  🛠️ Technical Patterns z Session

  Pattern #1: Skeleton Loader Responsive Sizing

  const isVeryNarrow = useMediaQuery('(max-width:420px)');

  <Skeleton
    variant="circular"
    width={isVeryNarrow ? 28 : 40}
    height={isVeryNarrow ? 28 : 40}
  />

  Pattern #2: Responsive Button Padding

  sx={{
    px: { xs: 2, sm: 3 },   // 16px → 24px
    py: { xs: 0.75, sm: 1 }  // 6px → 8px
  }}

  Pattern #3: Fixed Height for Consistent Card Layout

  <Box sx={{ minHeight: '2.6em' }}>  // 2 lines × 1.3 lineHeight
    <Skeleton variant="text" width="90%" />
    <Skeleton variant="text" width="70%" />
  </Box>

  ---
  📂 Soubory Upravené v Session

  1. MaterialCardSkeleton.jsx (152 lines) - Complete rewrite
  2. MaterialsLibrary.jsx (lines 221-234) - Button responsive fix
  3. MASTER_TODO_V3.md - Changelog + Sprint 18b
  4. summary6.md - Session documentation

  ---
  ⚠️ Pro Budoucí AI Sessions

  VŽDY SI PAMATOVAT:

  1. ✅ Projekt JE v produkci na Supabase - není to "future integration"
  2. ✅ Inline vs Modular trade-offs - někdy je rychlé řešení lepší než velký refactor
  3. ✅ User může chtít opravit sama - poskytnout instrukce místo automatické opravy
  4. ✅ Dokumentovat future work ODDĚLENĚ - ne jako hotovou práci

  NIKDY NEDĚLAT:

  - ❌ Navrhovat "future Supabase integration" (už JE integrovaný)
  - ❌ Dokumentovat plánovanou práci jako dokončenou
  - ❌ Ignorovat user feedback o time constraints ("no, jenže to bychom zas měli opravdu hodně práce")

  ---

  ## 📋 Sprint 18c: BaseCard Feedback Modularity Fix (5.11.2025, večer)

  **Session**: BaseCard Feedback Feature Implementation
  **Status**: ✅ ProgramCard refactored, MaterialCard tech debt identified
  **Čas**: ~15 minut

  ---

  ### 🎯 Kontext - Kritická Modularity Violation

  **User feedback**: "k čemu ale máme baseCard.jsx, když to pak napíšeš natvrdo do ProgramCard?"

  **Problém**:
  V předchozí session jsem implementoval feedback button přímo do ProgramCard.jsx (47 řádků hardcoded UI), místo aby to byl modular feature v BaseCard.

  **Důsledek**:
  - Duplicitní kód napříč kartami (ProgramCard, MaterialCard)
  - Změny UI vyžadují update ve více souborech
  - Porušení DRY principu

  ---

  ### ✅ Implementované Řešení

  #### 1. BaseCard.jsx - Feedback jako Built-in Feature

  **Nové props** (lines 77-81):
  ```javascript
  feedbackData,      // Array - pole feedbacků (zobrazí button pokud existuje)
  onFeedbackClick,   // Handler pro klik na feedback button
  ```

  **Footer condition** (line 443):
  ```javascript
  {(onClientPreview || feedbackData || footer) && (
    // ← feedbackData přidán do podmínky
  ```

  **Auto-render feedback button** (lines 461-509):
  - MessageSquare ikona (14px)
  - Kompaktní design (px: 1.25, py: 0.5)
  - Primary barva (rgba(139, 188, 143, ...))
  - Hover efekt (translateY(-1px))
  - Text: "{feedbackData.length}× reflexe"

  **Benefit**:
  - Feedback UI centralizován v BaseCard
  - ProgramCard jen předává data (2 props místo 47 řádků)
  - Změny UI na jednom místě

  #### 2. ProgramCard.jsx - Modular Refactor

  **ODSTRANĚNO** (lines 193-240, 47 řádků):
  ```javascript
  // Footer - Reflexe od klientek (row 9) - kompaktní tlačítko
  const footer = program.programFeedback && program.programFeedback.length > 0 ? (
    <Box onClick={() => setFeedbackModalOpen(true)} sx={{ ... 40+ řádků }}>
      <MessageSquare ... />
      <Typography ...>{program.programFeedback.length}× reflexe</Typography>
    </Box>
  ) : null;
  ```

  **NAHRAZENO** (lines 230-233):
  ```javascript
  // Row 9: Footer (button "Jak to vidí klientka" + feedback button)
  onClientPreview={() => onPreview(program)}
  feedbackData={program.programFeedback}
  onFeedbackClick={() => setFeedbackModalOpen(true)}
  ```

  **Cleanup**:
  - Odstraněn unused MessageSquare import

  ---

  ### 🔍 Discovery: MaterialCard Technical Debt

  **Zjištění**: MaterialCard.jsx NEpoužívá BaseCard!
  - Má vlastní Card implementaci přímo z MUI
  - Obsahuje hardcoded feedback button (lines 677-724)
  - Identický problém jako ProgramCard měl

  **Dva přístupy**:
  1. **Quick fix** - nechat MaterialCard standalone (zachovává tech debt)
  2. **Proper refactor** - přepsat MaterialCard na BaseCard usage (časově náročné)

  **Status**: ⏳ Čeká na user rozhodnutí před implementací

  ---

  ### 🎓 Klíčové Lekce

  **1. Modularita musí být důsledně dodržena**
  ```javascript
  // ❌ ŠPATNĚ - hardcoded v specific card
  const footer = <Box sx={{ ... 40 řádků }}><MessageSquare /></Box>;

  // ✅ SPRÁVNĚ - modular v BaseCard
  <BaseCard
    feedbackData={data}
    onFeedbackClick={handler}
  />
  ```

  **2. BaseCard = Single Source of Truth**
  - Všechny karty (Program, Material, Client) by měly používat BaseCard
  - Specific cards jen předávají data, ne UI implementaci
  - Změny propagují automaticky všude

  **3. Tech Debt Visibility**
  - MaterialCard není na BaseCard → identifikováno jako tech debt
  - Dokumentováno v summary6.md + MASTER_TODO_V3.md
  - Pending rozhodnutí před refactorem

  ---

  ### 📊 Statistiky

  **Soubory upraveny**: 2
  - `BaseCard.jsx` - feedback feature (50+ řádků added)
  - `ProgramCard.jsx` - hardcoded footer removed (47 řádků deleted)

  **Net impact**: +3 řádky, ale výrazně lepší modularita!

  **Discovered tech debt**: MaterialCard needs BaseCard refactor (pending)

  ---

  ### ⚠️ Pro Budoucí AI Sessions

  **VŽDY SI PAMATOVAT**:
  1. ✅ BaseCard je základ pro VŠECHNY karty - ne jen pro některé
  2. ✅ Specific cards (ProgramCard, MaterialCard) NEIMPLEMENTUJÍ UI - jen předávají data
  3. ✅ Když user říká "k čemu máme X, když to děláš jinak?" → okamžitě refactor!
  4. ✅ Tech debt MUSÍ být identifikován a dokumentován (MaterialCard)

  **NIKDY NEDĚLAT**:
  - ❌ Hardcoded UI v specific cards (ProgramCard, MaterialCard)
  - ❌ Duplicitní implementace stejné funkce napříč kartami
  - ❌ Ignorovat existující modular systémy (BaseCard)

  ---
  📊 Pending Tasks

  Z této session:
  - MaterialCard refactor na BaseCard (čeká na user rozhodnutí)
  - Dokumentace (summary6.md ✅, MASTER_TODO_V3.md ✅, claude.md ✅)

  Z předchozích sessions:
  - Sprint 18b: Button Modularity System (6-8 hodin)
  - Beta badge color fix (user opraví sama)
  - Add Help buttons na ProgramsList a ClientsList

  ---
  Konec CLAUDE.md
  Další update: Po další významné session nebo na požádání
