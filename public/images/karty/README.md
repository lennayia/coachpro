# 🎴 Koučovací Karty - Struktura Obrázků

## 📁 Struktura složek

```
/public/images/karty/
├── deck-a/
│   ├── human/
│   │   ├── radost.webp
│   │   ├── vdecnost.webp
│   │   ├── sila.webp
│   │   └── ...
│   ├── nature/
│   │   ├── radost.webp
│   │   ├── vdecnost.webp
│   │   └── ...
│   ├── abstract/
│   │   ├── radost.webp
│   │   └── ...
│   └── mix/
│       ├── radost.webp
│       └── ...
├── deck-b/
│   ├── human/
│   ├── nature/
│   ├── abstract/
│   └── mix/
├── deck-c/
│   ├── human/
│   ├── nature/
│   ├── abstract/
│   └── mix/
└── deck-d/
    ├── human/
    ├── nature/
    ├── abstract/
    └── mix/
```

---

## 🎨 Požadavky na obrázky

### Formát
- **WebP** (REQUIRED)
- Kvalita: 85% (ideální poměr velikost/kvalita)

### Rozměry
- **Poměr stran**: 2:3 (poker card ratio)
- **Doporučeno**: 800×1200px
- **Minimum**: 600×900px
- **Maximum**: 1200×1800px

### Velikost souboru
- **Cíl**: 60-100 KB per karta
- **Maximum**: 150 KB per karta

### Styl
- ČB minimalistické obrázky
- Systém automaticky přidá:
  - Barevný overlay podle motivu
  - CSS filtry (sepia, duotone, atd.)
  - Logo CoachPro (vlevo dole)
  - Copyright © online-byznys.cz (vpravo dole)

---

## 🔄 Konverze do WebP

### Online nástroj (nejjednodušší)
1. Otevři [Squoosh.app](https://squoosh.app)
2. Nahraj obrázek (JPG/PNG)
3. Vyber WebP format
4. Nastav kvalitu 85%
5. Stáhni a ulož do správné složky

### CLI (pro hromadnou konverzi)
```bash
# Instalace cwebp (macOS)
brew install webp

# Konverze jednoho obrázku
cwebp input.jpg -q 85 -o radost.webp

# Hromadná konverze všech JPG
for file in *.jpg; do
  cwebp "$file" -q 85 -o "${file%.jpg}.webp"
done
```

---

## 📝 Pojmenování

### Pravidla
- **Lowercase** (pouze malá písmena)
- **Bez diakritiky** (radost, ne rádost)
- **Bez mezer** (pouzij-pomlcky)
- **Bez speciálních znaků**

### Příklady správných názvů ✅
- `radost.webp`
- `vdecnost.webp`
- `sila.webp`
- `odvaha.webp`
- `laskavost.webp`
- `klid.webp`
- `kreativita.webp`
- `spojeni.webp`

### Příklady špatných názvů ❌
- `Radost.webp` (velké písmeno)
- `vděčnost.webp` (diakritika)
- `vděčnost náhled.webp` (mezera)
- `radost&klid.webp` (speciální znak)

---

## 🎯 Motivy

### Člověk 👤
- Teplé, lidské tóny
- Automatický overlay: **Korálová/Terakota**
- Filter: Sepia warm

### Příroda 🌿
- Přirozené zelené tóny
- Automatický overlay: **Zelená**
- Filter: Green duotone

### Abstrakt 🎨
- Moderní, živé barvy
- Automatický overlay: **Fialová**
- Filter: Purple duotone

### Mix 🔀
- Kombinace všech motivů
- Automatický overlay: **Rainbow gradient**
- Filter: Saturace boost

---

## ✅ Checklist před nahráním

- [ ] Obrázek je ve formátu **WebP**
- [ ] Kvalita je nastavena na **85%**
- [ ] Rozměry jsou **2:3 poměr** (např. 800×1200px)
- [ ] Velikost souboru je **< 150 KB**
- [ ] Název je **lowercase bez diakritiky**
- [ ] Obrázek je uložen do **správné složky** (deck/motif)

---

## 🚀 Po nahrání

Systém automaticky:
1. Načte obrázky z této struktury
2. Přidá barevný overlay podle motivu
3. Aplikuje CSS filtry
4. Přidá watermark (logo + copyright)
5. Optimalizuje loading (lazy loading v gridu)

**Žádná další akce není potřeba!** 🎉

---

**Vytvořeno**: 8.11.2025
**Autor**: CoachPro Team
