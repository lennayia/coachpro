# ProApp Monorepo - Průvodce migrací

**Datum:** 17.11.2025
**Účel:** Přesun CoachPro do ProApp monorepo struktury se sdíleným @proapp/shared package

---

## 📋 Přehled

Vytvoříme monorepo strukturu pro celý ProApp ekosystém:

```
📁 ~/Documents/Projekty/ProApp/
├── .git/                          # Jeden Git repo pro všechny moduly
├── .gitignore
├── package.json                   # Workspace config
├── README.md
├── packages/
│   ├── shared/                    # @proapp/shared package
│   │   ├── package.json
│   │   └── src/
│   ├── coachpro/                  # CoachPro aplikace
│   │   ├── package.json
│   │   ├── .env
│   │   └── src/
│   ├── contentpro/                # Budoucí
│   ├── paymentspro/               # Budoucí
│   ├── studypro/                  # Budoucí
│   ├── lifepro/                   # Budoucí
│   └── digipro/                   # Budoucí
└── .github/
    └── workflows/
        └── deploy-coachpro.yml
```

---

## 🚀 Krok 1: Záloha současného stavu

**DŮLEŽITÉ:** Před jakýmikoliv změnami si zálohuj současný projekt!

```bash
# Zajdi do současné CoachPro složky
cd ~/Documents/Projekty/coachpro

# Commitni všechny změny (pokud nějaké máš)
git add .
git commit -m "chore: backup before monorepo migration"
git push origin main

# Vytvoř záložní kopii (pro jistotu)
cd ~/Documents/Projekty
cp -r coachpro coachpro-backup-$(date +%Y%m%d)
```

✅ **Checkpoint:** Máš zálohu? Pokračuj na Krok 2.

---

## 🏗️ Krok 2: Vytvoř ProApp monorepo strukturu

```bash
# Vytvoř hlavní ProApp složku
mkdir -p ~/Documents/Projekty/ProApp/packages

# Vytvoř .github složku pro workflows
mkdir -p ~/Documents/Projekty/ProApp/.github/workflows
```

✅ **Checkpoint:** Složka `~/Documents/Projekty/ProApp/packages` existuje.

---

## 📦 Krok 3: Přesuň CoachPro do monorepo

```bash
# Přesuň celý CoachPro projekt
mv ~/Documents/Projekty/coachpro ~/Documents/Projekty/ProApp/packages/coachpro

# Přesuň shared package na správné místo
mv ~/Documents/Projekty/ProApp/packages/coachpro/packages/shared ~/Documents/Projekty/ProApp/packages/shared

# Smaž prázdnou packages složku v CoachPro
rmdir ~/Documents/Projekty/ProApp/packages/coachpro/packages
```

✅ **Checkpoint:** Struktura vypadá takto:
```
ProApp/
├── packages/
│   ├── shared/
│   └── coachpro/
```

---

## 📝 Krok 4: Vytvoř root package.json

```bash
cd ~/Documents/Projekty/ProApp
```

Vytvoř soubor `package.json` s tímto obsahem:

```json
{
  "name": "@proapp/root",
  "version": "1.0.0",
  "private": true,
  "description": "ProApp Ecosystem - Monorepo for all ProApp modules",
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev:coach": "npm run dev --workspace=@proapp/coachpro",
    "dev:content": "npm run dev --workspace=@proapp/contentpro",
    "dev:payments": "npm run dev --workspace=@proapp/paymentspro",
    "build:all": "npm run build --workspaces",
    "build:coach": "npm run build --workspace=@proapp/coachpro",
    "test:all": "npm run test --workspaces",
    "lint:all": "npm run lint --workspaces"
  },
  "keywords": [
    "proapp",
    "monorepo",
    "workspace"
  ],
  "author": "ProApp Team",
  "license": "MIT"
}
```

**Příkaz pro vytvoření:**
```bash
cat > package.json << 'EOF'
{
  "name": "@proapp/root",
  "version": "1.0.0",
  "private": true,
  "description": "ProApp Ecosystem - Monorepo for all ProApp modules",
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev:coach": "npm run dev --workspace=@proapp/coachpro",
    "dev:content": "npm run dev --workspace=@proapp/contentpro",
    "dev:payments": "npm run dev --workspace=@proapp/paymentspro",
    "build:all": "npm run build --workspaces",
    "build:coach": "npm run build --workspace=@proapp/coachpro",
    "test:all": "npm run test --workspaces",
    "lint:all": "npm run lint --workspaces"
  },
  "keywords": [
    "proapp",
    "monorepo",
    "workspace"
  ],
  "author": "ProApp Team",
  "license": "MIT"
}
EOF
```

✅ **Checkpoint:** Soubor `~/Documents/Projekty/ProApp/package.json` existuje.

---

## 🔧 Krok 5: Uprav CoachPro package.json

```bash
cd ~/Documents/Projekty/ProApp/packages/coachpro
```

Otevři `package.json` a změň:

**PŘED:**
```json
{
  "name": "coachpro",
  "version": "1.0.0",
  ...
}
```

**PO:**
```json
{
  "name": "@proapp/coachpro",
  "version": "1.0.0",
  ...
}
```

**Příkaz pro změnu:**
```bash
# Zálohuj původní
cp package.json package.json.backup

# Změň název
sed -i '' 's/"name": "coachpro"/"name": "@proapp\/coachpro"/' package.json
```

✅ **Checkpoint:** `package.json` obsahuje `"name": "@proapp/coachpro"`.

---

## ⚙️ Krok 6: Uprav vite.config.js

```bash
cd ~/Documents/Projekty/ProApp/packages/coachpro
```

Otevři `vite.config.js` a změň alias pro `@proapp/shared`:

**PŘED:**
```javascript
resolve: {
  alias: {
    '@proapp/shared': path.resolve(__dirname, './packages/shared/src'),
    '@shared': path.resolve(__dirname, './src/shared'),
    '@modules': path.resolve(__dirname, './src/modules'),
  }
}
```

**PO:**
```javascript
resolve: {
  alias: {
    '@proapp/shared': path.resolve(__dirname, '../shared/src'),
    '@shared': path.resolve(__dirname, './src/shared'),
    '@modules': path.resolve(__dirname, './src/modules'),
  }
}
```

**Změna:** `./packages/shared/src` → `../shared/src`

✅ **Checkpoint:** Cesta k shared package ukazuje na `../shared/src`.

---

## 📦 Krok 7: Reinstaluj dependencies

```bash
# Smaž staré node_modules v CoachPro
cd ~/Documents/Projekty/ProApp/packages/coachpro
rm -rf node_modules package-lock.json

# Smaž staré node_modules ve shared
cd ~/Documents/Projekty/ProApp/packages/shared
rm -rf node_modules package-lock.json

# Vrať se do root a nainstaluj vše
cd ~/Documents/Projekty/ProApp
npm install
```

**Co se stane:**
- NPM vytvoří workspace links mezi packages
- Všechny dependencies se nainstalují
- `@proapp/shared` bude automaticky dostupný v CoachPro

✅ **Checkpoint:** `node_modules` existuje v root i v packages.

---

## 🧪 Krok 8: Otestuj že to funguje

```bash
cd ~/Documents/Projekty/ProApp

# Spusť CoachPro dev server
npm run dev:coach
```

**Očekávaný výstup:**
```
> @proapp/root@1.0.0 dev:coach
> npm run dev --workspace=@proapp/coachpro

> @proapp/coachpro@1.0.0 dev
> vite

  VITE v5.4.21  ready in 136 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Otevři prohlížeč:** http://localhost:3000

✅ **Checkpoint:** CoachPro běží bez chyb.

---

## 🔄 Krok 9: Inicializuj Git repo

```bash
cd ~/Documents/Projekty/ProApp

# Inicializuj nový Git repo
git init

# Vytvoř .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json

# Environment
.env
.env.local
.env.production
.env.development

# Build outputs
dist/
build/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Temporary
*.tmp
*.temp
.cache/
EOF

# Přidej všechny soubory
git add .

# První commit
git commit -m "chore: initialize ProApp monorepo

- Move CoachPro to packages/coachpro
- Create @proapp/shared package
- Setup NPM workspaces
- Configure monorepo structure"
```

✅ **Checkpoint:** Git repo inicializováno, první commit vytvořen.

---

## 📤 Krok 10: Napoj na GitHub (pokud chceš)

### Varianta A: Nový GitHub repo

```bash
# Vytvoř nový repo na GitHubu: ProApp (nebo proapp)
# Pak:

cd ~/Documents/Projekty/ProApp

git remote add origin https://github.com/TVOJE_UZIVATELSKE_JMENO/ProApp.git
git branch -M main
git push -u origin main
```

### Varianta B: Použij existující CoachPro repo

```bash
cd ~/Documents/Projekty/ProApp

# Zkopíruj .git složku ze zálohy
cp -r ~/Documents/Projekty/coachpro-backup-*/.git .

# Přidej změny
git add .
git commit -m "refactor: migrate to monorepo structure

BREAKING CHANGE: Project restructured to monorepo
- CoachPro moved to packages/coachpro
- Shared package at packages/shared
- NPM workspaces configured"

# Push
git push origin main
```

✅ **Checkpoint:** Projekt nahrán na GitHub.

---

## 📚 Krok 11: Vytvoř README.md

```bash
cd ~/Documents/Projekty/ProApp

cat > README.md << 'EOF'
# ProApp Ecosystem

Monorepo pro všechny ProApp moduly postavené na React + Vite + Supabase.

## 🏗️ Struktura

```
ProApp/
├── packages/
│   ├── shared/          # @proapp/shared - Sdílené komponenty, hooks, utils
│   ├── coachpro/        # CoachPro - Koučovací platforma
│   ├── contentpro/      # ContentPro - Tvorba obsahu (budoucí)
│   ├── paymentspro/     # PaymentsPro - Platební systém (budoucí)
│   ├── studypro/        # StudyPro - Online kurzy (budoucí)
│   ├── lifepro/         # LifePro - Life coaching (budoucí)
│   └── digipro/         # DigiPro - Digitální produkty (budoucí)
```

## 🚀 Začínáme

### Instalace

```bash
npm install
```

### Development

```bash
# CoachPro
npm run dev:coach

# ContentPro (až bude)
npm run dev:content
```

### Build

```bash
# Build všech modulů
npm run build:all

# Build jen CoachPro
npm run build:coach
```

## 📦 Packages

### @proapp/shared

Sdílený package obsahující:
- React komponenty (FlipCard, AnimatedGradient, ...)
- Hooks (useSoundFeedback, useAsync, ...)
- Utils (czechGrammar, imageCompression, ...)
- Styles (BORDER_RADIUS, modernEffects, ...)
- Auth contexts (createClientAuthContext, createTesterAuthContext)
- Themes (natureTheme)

[Dokumentace](./packages/shared/README.md)

### @proapp/coachpro

Koučovací platforma pro kouče a klienty.

[Dokumentace](./packages/coachpro/README.md)

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite
- **UI:** Material-UI, Framer Motion
- **Backend:** Supabase (Auth, Database, Storage)
- **Deployment:** Vercel
- **Monorepo:** NPM Workspaces

## 📝 License

MIT
EOF
```

```bash
# Commit README
git add README.md
git commit -m "docs: add root README"
git push origin main
```

✅ **Checkpoint:** README vytvořen a commitnut.

---

## 🎯 Jak pracovat s monorepo

### Denní workflow

```bash
# Zajdi do ProApp složky
cd ~/Documents/Projekty/ProApp

# Spusť CoachPro
npm run dev:coach

# V jiném terminálu - dělej změny
code .  # VS Code otevře celý monorepo

# Změny v packages/coachpro/src/...
# Změny v packages/shared/src/...
```

### Commit změn

#### Jen CoachPro změny:
```bash
cd ~/Documents/Projekty/ProApp

git status
# modified:   packages/coachpro/src/App.jsx
# modified:   packages/coachpro/src/modules/client/ClientDashboard.jsx

git add packages/coachpro/
git commit -m "feat(coachpro): add new dashboard widget"
git push origin main
```

#### Jen shared package změny:
```bash
git add packages/shared/
git commit -m "feat(shared): add new FlipCard variant"
git push origin main
```

#### CoachPro + shared společně:
```bash
git add packages/coachpro/ packages/shared/
git commit -m "feat(coachpro): integrate new FlipCard component

- Add FlipCard variant to shared package
- Use FlipCard in CoachPro dashboard
- Update FlipCard documentation"
git push origin main
```

#### Všechny změny:
```bash
git add .
git commit -m "feat: update multiple packages

- CoachPro: add new feature
- Shared: update components
- Docs: update README"
git push origin main
```

---

## 🔍 Ověření úspěšné migrace

### Checklist:

- [ ] Struktura je `ProApp/packages/shared` a `ProApp/packages/coachpro`
- [ ] Root `package.json` obsahuje workspaces
- [ ] `npm run dev:coach` funguje
- [ ] CoachPro běží na http://localhost:3000
- [ ] @proapp/shared komponenty fungují (FlipCard, atd.)
- [ ] Git repo inicializován
- [ ] První commit vytvořen
- [ ] Projekt nahrán na GitHub (pokud chceš)
- [ ] README.md existuje

### Test že shared package funguje:

1. Otevři `packages/coachpro/src/App.jsx`
2. Přidej import:
   ```javascript
   import { FlipCard } from '@proapp/shared/components';
   ```
3. Použij komponentu
4. Uložit → HMR by měl automaticky reload
5. Komponenta funguje → ✅ Shared package je správně napojen

---

## 🆘 Troubleshooting

### Problem: "Cannot find module '@proapp/shared'"

**Řešení:**
```bash
cd ~/Documents/Projekty/ProApp
rm -rf node_modules package-lock.json
rm -rf packages/*/node_modules packages/*/package-lock.json
npm install
```

### Problem: Vite nenachází shared package

**Řešení:** Zkontroluj `vite.config.js`:
```javascript
'@proapp/shared': path.resolve(__dirname, '../shared/src'),  // Správná cesta
```

### Problem: Git push nefunguje

**Řešení:**
```bash
# Zkontroluj remote
git remote -v

# Pokud není nastavený:
git remote add origin https://github.com/TVOJE_JMENO/ProApp.git
git push -u origin main
```

### Problem: Dev server běží na špatném portu

**Řešení:** Zkontroluj `packages/coachpro/vite.config.js`:
```javascript
server: {
  port: 3000,
  host: true
}
```

---

## 📌 Další kroky

### Po úspěšné migraci:

1. **Smaž zálohu** (až si budeš jistá):
   ```bash
   rm -rf ~/Documents/Projekty/coachpro-backup-*
   ```

2. **Updatuj VS Code workspace:**
   - File → Add Folder to Workspace
   - Přidej `~/Documents/Projekty/ProApp`

3. **Nastav GitHub Actions** (pokud chceš):
   - `.github/workflows/deploy-coachpro.yml`

4. **Vytvoř další moduly** (až budeš připravená):
   ```bash
   mkdir packages/contentpro
   # ... setup
   ```

---

## 🎓 Co jsme získali

✅ **Centrální shared package** - komponenty použitelné ve všech modulech
✅ **Čistá struktura** - každý modul ve vlastní složce
✅ **Jednoduchý vývoj** - změny ve shared se okamžitě projeví
✅ **Jeden Git repo** - všechna historie na jednom místě
✅ **NPM workspaces** - automatické propojení packages
✅ **Škálovatelnost** - snadné přidání ContentPro, PaymentsPro, atd.

---

**Autor:** Claude AI
**Datum:** 17.11.2025
**Verze:** 1.0
EOF

git add .
git commit -m "docs: add monorepo migration guide"
git push origin main
```

✅ **HOTOVO!** Máš plně funkční ProApp monorepo!
