# 📋 MANUÁLNÍ KROKY PO REFAKTORINGU

## ⚠️ DŮLEŽITÉ: Tyto kroky proveď MANUÁLNĚ

Protože Claude Code nemůže spolehlivě mazat a přesouvat soubory, tyto úkony musíš udělat sám/sama.

---

## 🗂️ KROK 1: Přesun starého PaymentDialog

### Současný stav:
```
frontend/src/components/payments/
├── PaymentDialog.jsx (1,486 řádků) ← STARÝ
└── PaymentDialogNew.jsx (50 řádků) ← NOVÝ
```

### Co udělat:

1. **Přejmenuj starý soubor:**
   ```bash
   cd frontend/src
   mv components/payments/PaymentDialog.jsx _deprecated/PaymentDialog.jsx.old
   ```

2. **Přejmenuj nový soubor:**
   ```bash
   mv components/payments/PaymentDialogNew.jsx components/payments/PaymentDialog.jsx
   ```

3. **Aktualizuj import v PaymentsModule.jsx:**

   Najdi řádek:
   ```javascript
   import PaymentDialog from "../components/payments/PaymentDialog.jsx";
   ```

   Ten už bude ukazovat na správný soubor (protože jsme přejmenovali PaymentDialogNew → PaymentDialog).

---

## 🧪 KROK 2: Testování

Po přesunu otestuj:

1. **Spusť dev server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Otestuj PaymentDialog:**
   - Otevři aplikaci
   - Klikni na "Přidat platbu"
   - Zkontroluj, že se zobrazí všechny 4 záložky
   - Vyplň formulář a ulož
   - Zkontroluj, že edit funguje

3. **Pokud NĚCO NEFUNGUJE:**
   - Obnov starý soubor:
   ```bash
   mv _deprecated/PaymentDialog.jsx.old components/payments/PaymentDialog.jsx
   rm components/payments/PaymentDialogNew.jsx
   ```

---

## 📦 KROK 3: Po úspěšném testu (volitelné)

Pokud vše funguje 1 týden bez problémů, můžeš:

1. **Smazat celou _deprecated složku:**
   ```bash
   rm -rf frontend/src/_deprecated
   ```

---

## 🎯 ALTERNATIVA: Ponechat oba soubory dočasně

Pokud chceš být opatrný:

1. **Nech oba soubory vedle sebe:**
   - `PaymentDialog.jsx` (starý) - funguje
   - `PaymentDialogNew.jsx` (nový) - připravený

2. **V PaymentsModule.jsx změň import:**
   ```javascript
   // Zkus nový
   import PaymentDialog from "../components/payments/PaymentDialogNew.jsx";

   // Pokud nefunguje, vrať zpět na:
   // import PaymentDialog from "../components/payments/PaymentDialog.jsx";
   ```

3. **Po týdnu testování:**
   - Smažeš starý PaymentDialog.jsx
   - Přejmenuješ PaymentDialogNew → PaymentDialog

---

## 📊 SOUHRN ZMĚN:

### Před refaktoringem:
```
App.jsx: 1,126 řádků (monolitický)
PaymentDialog.jsx: 1,486 řádků (monolitický)
```

### Po refaktoringu:
```
App.jsx: 207 řádků (clean routing)
modules/PaymentsModule.jsx: 787 řádků (izolovaný modul)
components/shared/UniversalDialog/: 670 řádků (univerzální systém)
config/dialogs/paymentDialogConfig.js: 350 řádků (konfigurace)
components/payments/PaymentDialog.jsx: 50 řádků (wrapper)
```

### Výsledek:
- **Celková úspora:** ~2,350 řádků monolitního kódu
- **Nové univerzální komponenty:** Použitelné pro LifePro, Rezervy, Wishlist
- **Udržovatelnost:** Soubory < 800 řádků

---

## ❓ Otázky?

Pokud něco nefunguje nebo máš dotazy:
1. Zkontroluj console v prohlížeči (F12)
2. Podívej se na chybové hlášky
3. Obnov starý soubor z _deprecated
4. Napiš mi, co se stalo

---

**Datum vytvoření:** 2025-10-12
**Autor refaktoringu:** Claude Code
**Status:** ⏳ Čeká na manuální provedení
