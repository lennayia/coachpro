# 🎥 Google OAuth Demo Video - Návod k natočení

**Účel:** Demo video pro Google OAuth Verification
**Délka:** 3-4 minuty
**Formát:** Screen recording (bez nutnosti natáčet sebe)
**Upload:** YouTube (Unlisted)

---

## 📋 Příprava (5 minut)

### 1. Vytvořte testovací události v Google Calendar

Jděte na https://calendar.google.com/ a vytvořte **3-5 událostí** pro příští dny:

**Příklad události 1:**
```
Název: Koučovací sezení s Janou Nováková
Datum: Zítra 10:00-11:00
Místo: https://meet.google.com/abc-defg-hij
Pozvánky: jana.novakova@gmail.com
```

**Příklad události 2:**
```
Název: Osobní konzultace - Petra Svobodová
Datum: Pozítří 14:00-15:00
Místo: Kavárna Slavia, Praha
Pozvánky: petra.svobodova@gmail.com
```

**Příklad události 3:**
```
Název: Online koučink - Marie Dvořáková
Datum: Za 3 dny 16:00-17:00
Místo: Zoom
Pozvánky: marie.dvorakova@gmail.com
```

### 2. Připravte prohlížeč

- ✅ Zavřete všechny nepotřebné taby
- ✅ Otevřete pouze: `https://coachpro.vercel.app/`
- ✅ **DŮLEŽITÉ:** Odhlaste se z CoachPro (pokud jste přihlášeni)
- ✅ Zvětšete okno na celou obrazovku (F11)
- ✅ Zoom prohlížeče nastavte na 100% (Ctrl+0)

### 3. Vyberte nástroj pro nahrávání

**Nejjednodušší - Loom (doporučuji):**
1. Jděte na https://www.loom.com/
2. Přihlaste se (free účet stačí)
3. Nainstalujte browser extension
4. Klikněte na Loom ikonu → **"Start Recording"**
5. Vyberte **"Screen Only"**
6. Vyberte **"Full Screen"** nebo jen browser window

**Alternativa - macOS QuickTime:**
1. Otevřete QuickTime Player
2. File → New Screen Recording
3. Klikněte na šipku vedle Record → vyberte mikrofon (pokud chcete komentář)
4. Klikněte Record

**Alternativa - Windows Game Bar:**
1. Stiskněte **Win+G**
2. Klikněte na tlačítko **Record**
3. Nebo **Win+Alt+R** pro start/stop

---

## 🎬 Natáčení - Scéna po scéně

### SCÉNA 1: Landing Page (30 sekund)

**Akce:**
1. ▶️ **START RECORDING**
2. Otevřete https://coachpro.vercel.app/
3. **Pomalu scrollujte dolů** - ukažte:
   - Hero sekce
   - Features (zastavte se u "Správa sezení" s Calendar ikonou)
   - "Jak to funguje" - sekce "Pro kouče"
   - Benefits
4. **Scroll zpět nahoru**

**Komentář (volitelný, lze přidat jako titulky):**
> "CoachPro is a platform for professional coaches and their clients. It helps manage coaching programs, materials, and sessions. One key feature is Google Calendar integration."

---

### SCÉNA 2: Google Sign-In & OAuth Consent (45 sekund)

**Akce:**
1. Klikněte na **"Jsem koučka-testerka"**
2. Klikněte **"Přihlásit se přes Google"**
3. Vyberte váš test user účet
4. **Consent Screen se zobrazí:**
   - ⚠️ Pokud vidíte "Google hasn't verified this app", klikněte **"Advanced"** → **"Go to CoachPro (unsafe)"**
   - **POZASTAVTE** na consent screen - ukažte oprávnění:
     ```
     ✓ View your email address
     ✓ View your basic profile info
     ✓ See and download calendars you can access using Google Calendar
     ```
5. Klikněte **"Continue"** / **"Povolit"**

**Komentář:**
> "Coaches sign in with their Google account. The app requests three permissions: email, profile, and read-only access to Google Calendar. We only read calendar events - we never modify or delete them."

---

### SCÉNA 3: Coach Dashboard (15 sekund)

**Akce:**
1. Po přihlášení → Coach Dashboard se zobrazí
2. **Krátká pauza** - ukažte dashboard
3. V navigaci klikněte na **"Správa sezení"**

**Komentář:**
> "After signing in, coaches access their dashboard. They can navigate to the Sessions Management page to sync their Google Calendar."

---

### SCÉNA 4: Calendar Sync - HLAVNÍ ČÁST (60-90 sekund)

**Akce:**
1. Na stránce `/coach/sessions`
2. **POZASTAVTE** - ukažte:
   - Instrukce nahoře
   - Tlačítko "Synchronizovat Google Calendar"
   - Seznam sezení (pokud už nějaká jsou)
3. Klikněte **"Synchronizovat Google Calendar"**
4. **Loading indikátor** se zobrazí (nechte běžet)
5. **Dialog s výsledky** se objeví:
   ```
   ✅ Synchronizace dokončena!
   Vytvořeno: 3 sezení
   Přeskočeno: 0
   Chyby: 0
   ```
6. **POZASTAVTE** na dialogu - přečtěte výsledky
7. Zavřete dialog
8. **Scroll dolů** - ukažte seznam nově vytvořených sezení:
   - Datum a čas
   - Název
   - Typ (online/osobně)
   - Email klientky

**Komentář:**
> "Coaches click the 'Sync Calendar' button. The app fetches events from Google Calendar and creates coaching sessions automatically. As you can see, 3 new sessions were created. The sync detects session type based on location - Zoom and Google Meet links are marked as online sessions."

---

### SCÉNA 5: Verify Read-Only (30 sekund)

**Akce:**
1. Otevřete **nový tab**
2. Jděte na https://calendar.google.com/
3. **Ukažte kalendář** - události jsou tam **nezměněné**
4. Klikněte na jednu z událostí - ukažte detail
5. **Zpět na CoachPro tab**
6. Ukažte synchronizovaná sezení

**Komentář:**
> "As you can see, the original Google Calendar remains completely unchanged. CoachPro only reads the calendar data - it's read-only access. This ensures coaches' calendars are never accidentally modified."

---

### SCÉNA 6: Závěr (15 sekund)

**Akce:**
1. Zpět na `/coach/sessions`
2. Scroll přes seznam sezení
3. Ukažte tlačítko "Synchronizovat" znovu (ale neklikejte)

**Komentář:**
> "This integration saves coaches time by eliminating manual data entry and keeping their coaching schedule automatically synchronized with Google Calendar. Thank you for watching."

### ⏹️ STOP RECORDING

---

## 📝 Po natočení

### 1. Přidejte titulky (volitelné, ale doporučuji)

**Online nástroj - Kapwing:**
1. Jděte na https://www.kapwing.com/subtitles
2. Upload your video
3. Klikněte **"Auto-generate"** (free)
4. Upravte/přeložte do angličtiny
5. Export video

**Nebo YouTube Studio:**
- Nahrajte video
- YouTube auto-generuje titulky
- Upravíte je tam

### 2. Upload na YouTube

1. Jděte na https://studio.youtube.com/
2. **Create** → **Upload video**
3. Vyberte soubor

**Nastavení:**

```
Title:
CoachPro - Google Calendar Integration Demo for OAuth Verification

Description:
Demo video showing CoachPro's Google Calendar integration for OAuth app verification.

CoachPro is a coaching management platform that helps professional coaches sync their Google Calendar events to automatically create coaching sessions.

This video demonstrates:
- Google OAuth sign-in with Calendar scope
- Read-only Calendar API access
- Manual sync trigger by coach
- Automatic session creation from calendar events
- Original Google Calendar remains unchanged

Submitted for Google OAuth Verification.
Website: https://coachpro.vercel.app

Visibility: ⚠️ UNLISTED (DŮLEŽITÉ!)
```

4. Zkopírujte **YouTube URL** videa

---

## ⏱️ Časování videa

```
0:00-0:30  Landing Page
0:30-1:15  Google Sign-In + OAuth Consent
1:15-1:30  Coach Dashboard
1:30-3:00  Calendar Sync (hlavní část)
3:00-3:30  Verify Read-Only
3:30-3:45  Závěr
---
TOTAL: ~3:45 (ideální délka)
```

---

## ✅ Checklist před natáčením

- [ ] 3-5 testovacích událostí v Google Calendar
- [ ] Odhlášeni z CoachPro
- [ ] Browser na fullscreen, zoom 100%
- [ ] Screen recording tool připraven
- [ ] Jen potřebné taby otevřené
- [ ] Wifi stabilní

---

## 💡 Tipy pro kvalitní video

✅ **Pohybujte myší pomalu** - divák musí číst text
✅ **Pozastavte na důležitých místech** - consent screen, výsledky syncu
✅ **Nescrollujte moc rychle**
✅ **Zvýrazněte kurzorem** důležité prvky (kalendář scope, výsledky)
✅ **Nevadí, když uděláte chybu** - můžete video sestříhat

---

## 🎯 Co Google chce vidět

1. ✅ **Účel aplikace** → Landing Page vysvětluje
2. ✅ **OAuth Consent Screen** → uživatel vidí, co povoluje
3. ✅ **Použití Calendar API** → sync v akci
4. ✅ **Read-only access** → žádné změny v Calendar
5. ✅ **Manuální trigger** → uživatel kontroluje, kdy sync běží

---

**Po nahrání na YouTube vložte URL do Google OAuth Verification form!**

*Vytvořeno: 16.11.2025*
