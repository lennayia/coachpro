/**
 * Help Content - Nápověda pro každou stránku
 *
 * Centralizovaný systém nápovědy pro CoachPro aplikaci
 * @created 4.11.2025
 */

export const HELP_CONTENT = {
  dashboard: {
    title: 'Dashboard - Přehled',
    icon: '📊',
    sections: [
      {
        title: 'Co je Dashboard?',
        content: 'Dashboard je tvoje hlavní řídící centrum. Vidíš zde přehled všech důležitých metrik a můžeš rychle přejít na další sekce aplikace.',
      },
      {
        title: 'Karty s metrikami',
        items: [
          'Celkem materiálů - Počet všech tvých vytvořených materiálů',
          'Aktivní programy - Kolik programů právě běží',
          'Celkem klientek - Počet všech registrovaných klientek',
          'Celkem programů - Celkový počet vytvořených programů',
        ],
      },
      {
        title: 'Rychlé akce',
        items: [
          'Tlačítko "Přidat materiál" - Rychlé vytvoření nového materiálu',
          'Tlačítko "Vytvořit program" - Vytvoření nového koučovacího programu',
          'Tlačítko "Spravovat klientky" - Přechod na seznam klientek',
        ],
      },
      {
        title: 'Tipy pro efektivní práci',
        items: [
          'Pravidelně kontroluj Dashboard pro přehled o svých aktivitách',
          'Používej rychlé akce pro časté úkony',
          'Sleduj metriky pro lepší pochopení své práce',
        ],
      },
    ],
  },

  materials: {
    title: 'Materiály - Knihovna',
    icon: '📚',
    sections: [
      {
        title: 'Co jsou Materiály?',
        content: 'Knihovna materiálů je tvoje centrální úložiště všech koučovacích obsahů. Můžeš zde nahrávat audio, PDF, videa, obrázky, dokumenty, texty a externí odkazy.',
      },
      {
        title: 'Podporované typy materiálů',
        items: [
          'Audio (MP3, WAV) - Meditace, nahrávky, podcasts',
          'Video (MP4, MOV) - Videa, záznamy z session',
          'PDF - Ebook, workbooky, pracovní listy',
          'Obrázky (JPG, PNG, WEBP, HEIC) - Grafiky, infografiky',
          'Dokumenty (DOC, XLS, PPT) - Dokumenty Microsoft Office',
          'Text - Psaný obsah, afirmace, úkoly',
          'Odkazy - YouTube, Spotify, Google Drive, Notion, atd.',
        ],
      },
      {
        title: 'Jak vytvořit materiál?',
        items: [
          '1. Klikni na tlačítko "Přidat materiál"',
          '2. Vyber typ materiálu (audio, PDF, text, atd.)',
          '3. Nahraj soubor nebo zadej odkaz',
          '4. Vyplň název, popis a kategorii',
          '5. Vyber koučovací oblast (POVINNÉ)',
          '6. Přidej témata (doporučeno 3-5)',
          '7. Volitelně: Zvol koučovací přístup a certifikaci',
          '8. Ulož materiál',
        ],
      },
      {
        title: 'Vyhledávání a filtry',
        items: [
          'Vyhledávání - Hledej podle názvu nebo popisu',
          'Kategorie - Filtruj podle typu (meditace, cvičení, atd.)',
          'Oblast koučinku - Filtruj podle oblasti (life, career, atd.)',
          'Témata - Kombinuj více témat najednou',
          'Koučovací přístup - Filtruj podle školy (ICF, NLP, atd.)',
          'Certifikace - Filtruj podle autority',
        ],
      },
      {
        title: 'Akce s materiálem',
        items: [
          'Zobrazit detail - Náhled materiálu',
          'Upravit - Změna názvu, popisu, taxonomie',
          'Sdílet - Sdílení s klientkou pomocí kódu',
          'Smazat - Odstranění materiálu (nelze vrátit)',
          'Jak to vidí klientka - Náhled klientského pohledu',
        ],
      },
      {
        title: 'Taxonomy System (Taxonomie)',
        items: [
          'Oblast koučinku - POVINNÉ (life, career, relationship, atd.)',
          'Témata - 3-5 doporučeno (Sebevědomí, Motivace, atd.)',
          'Koučovací přístup - VOLITELNÉ (ICF, NLP, ontologický, atd.)',
          'Certifikace - VOLITELNÉ (ICF, EMCC, AC, atd.)',
        ],
      },
      {
        title: 'Tipy pro organizaci',
        items: [
          'Používej výstižné názvy - Klientka vidí název',
          'Přidávaj popisky - Pomáhají s vyhledáváním',
          'Taguj témata - Snadnější filtrace a kombinace',
          'Využívej kategorie - Lepší struktura knihovny',
          'Pravidelně promazávej - Odstraň nepoužívané materiály',
        ],
      },
      {
        title: 'Limity a omezení',
        items: [
          'Max velikost souboru: 3 MB (audio, PDF, video)',
          'Obrázky: max 2 MB',
          'HEIC obrázky se automaticky konvertují na JPEG',
          'MOV videa jsou podporována',
          'Supabase Storage: 1 GB zdarma (200× více než localStorage)',
        ],
      },
    ],
  },

  programs: {
    title: 'Programy - Vytváření',
    icon: '🗓️',
    sections: [
      {
        title: 'Co jsou Programy?',
        content: 'Programy jsou strukturované koučovací cesty pro tvoje klientky. Každý program má definovanou délku (7, 14, 21 nebo 30 dní) a obsahuje denní materiály s instrukcemi.',
      },
      {
        title: 'Jak vytvořit program?',
        items: [
          '1. Klikni na "Vytvořit program"',
          '2. Zadej název programu',
          '3. Napiš krátký popis (zobrazí se klientce)',
          '4. Vyber délku programu (7-30 dní)',
          '5. Pro každý den zvol:',
          '   - Název dne',
          '   - Popis aktivit',
          '   - Materiály z knihovny',
          '   - Instrukce pro klientku',
          '6. Ulož program',
        ],
      },
      {
        title: 'Sdílení programu s klientkou',
        items: [
          '1. Klikni na "Sdílet program"',
          '2. Zkopíruj 6místný kód (např. ABC123)',
          '3. Nebo stáhni QR kód',
          '4. Pošli klientce kód nebo QR',
          '5. Klientka zadá kód na vstupní stránce',
        ],
      },
      {
        title: 'Editace programu',
        items: [
          'Můžeš měnit délku programu i po vytvoření',
          'Zvýšení délky - Přidají se nové prázdné dny',
          'Snížení délky - Odeberou se dny z konce',
          'Existující dny si zachovají všechna data',
          'Auto-save - Změny se ukládají každých 5 sekund',
          'Draft expire - Starší než 24 hodin se nenačítají',
        ],
      },
      {
        title: 'Akce s programem',
        items: [
          'Upravit - Změna názvu, dnů, materiálů',
          'Sdílet - Získání kódu a QR pro klientku',
          'Smazat - Odstranění programu (nelze vrátit)',
        ],
      },
      {
        title: 'Co vidí klientka?',
        items: [
          'Denní view - Jen aktuální den (ostatní dny skryté)',
          'Materiály - Audio player, PDF viewer, video přehrávač',
          'Progress - Vizualizace postupu 🌰→🌱→🌸',
          'Mood check - Volitelná nálada před/po',
          'Celebration - Konfety a oslava po dokončení dne',
          'Streak counter - Počet dní v řadě',
        ],
      },
      {
        title: 'Tipy pro tvorbu programů',
        items: [
          'Začni jednoduchým 7denním programem',
          'První den = úvod a nastavení očekávání',
          'Poslední den = shrnutí a reflexe',
          'Kombinuj různé typy materiálů',
          'Instrukce by měly být jasné a konkrétní',
          'Testuj program jako klientka (ADMIN1 kód)',
        ],
      },
      {
        title: 'Share Code systém',
        items: [
          'Kód: ABC123 (3 písmena + 3 čísla)',
          'Case-insensitive - "abc123" najde "ABC123"',
          'Unikátní - Každý program má vlastní kód',
          'QR kód - Alternativa pro rychlý vstup',
          'Platnost - Neomezeně, dokud program není smazán',
        ],
      },
    ],
  },

  clients: {
    title: 'Klientky - Správa',
    icon: '👥',
    sections: [
      {
        title: 'Co je Seznam klientek?',
        content: 'Přehled všech klientek, které se zaregistrovaly do tvých programů. Můžeš sledovat jejich pokrok, aktivitu a engagement.',
      },
      {
        title: 'Informace o klientce',
        items: [
          'Jméno - Jak se klientka zaregistrovala',
          'Program - Který program právě absolvuje',
          'Aktuální den - Na jakém dni se nachází',
          'Pokrok - Kolik dnů dokončila',
          'Streak - Počet dní v řadě',
          'Poslední aktivita - Kdy naposledy byla aktivní',
        ],
      },
      {
        title: 'Filtry a vyhledávání',
        items: [
          'Hledat podle jména klientky',
          'Filtrovat podle programu',
          'Filtrovat podle stavu (aktivní/dokončené)',
          'Řazení podle data registrace',
        ],
      },
      {
        title: 'Akce s klientkou',
        items: [
          'Zobrazit detail - Kompletní profil a statistiky',
          'Zobrazit progress - Vizuální progress bar',
          'Poslat zprávu - Kontaktování klientky (TODO)',
          'Odebrat přístup - Zakázání přístupu k programu',
        ],
      },
      {
        title: 'Mood Tracking',
        items: [
          'Volitelné - Klientka může zaznamenat náladu',
          'Před/Po - Nálada před a po absolvování dne',
          'Emoji škála - 😔😐😊😄😍',
          'Historie - Můžeš sledovat změny nálady',
        ],
      },
      {
        title: 'Tipy pro správu klientek',
        items: [
          'Pravidelně kontroluj pokrok',
          'Reaguj na nízkou aktivitu',
          'Oslavuj milestones (dokončení programu)',
          'Sbírej feedback pro zlepšení programů',
        ],
      },
    ],
  },

  profile: {
    title: 'Profil - Nastavení',
    icon: '👤',
    sections: [
      {
        title: 'Tvůj profil',
        content: 'Zde můžeš spravovat své osobní údaje, nastavení účtu a vidět informace o beta testování.',
      },
      {
        title: 'Editace profilu',
        items: [
          'Klikni na "Upravit profil"',
          'Změň jméno nebo email',
          'Klikni "Uložit" pro aplikování změn',
          'Nebo "Zrušit" pro vrácení zpět',
        ],
      },
      {
        title: 'Informace o účtu',
        items: [
          'Access kód - Tvůj unikátní přístupový kód',
          'Datum registrace - Kdy ses zaregistrovala',
          'Beta Tester badge - Potvrzení účasti v beta testování',
        ],
      },
      {
        title: 'Beta Testing Info',
        content: 'Kompletní informace o beta testování, včetně aktuálního stavu, známých problémů, plánovaných funkcí a roadmapy aplikace.',
      },
      {
        title: 'Zpětná vazba',
        items: [
          'Našla si bug? Nahlásit na GitHub Issues',
          'Máš nápad na novou funkci? Kontaktuj nás',
          'Zpětná vazba je pro nás velmi cenná!',
        ],
      },
    ],
  },

  general: {
    title: 'Obecná nápověda',
    icon: '💡',
    sections: [
      {
        title: 'Navigace v aplikaci',
        items: [
          'Sidebar - Hlavní navigační menu (vlevo)',
          'Header - Logo a přepínač light/dark mode',
          'Floating menu - Rychlý přístup k nastavení (vpravo nahoře)',
        ],
      },
      {
        title: 'Klávesové zkratky',
        items: [
          'Cmd/Ctrl + K - Rychlé vyhledávání (TODO)',
          'Cmd/Ctrl + N - Nový materiál (TODO)',
          'Cmd/Ctrl + P - Nový program (TODO)',
        ],
      },
      {
        title: 'Light/Dark Mode',
        items: [
          'Přepínač v headeru (Sun/Moon ikona)',
          'Nebo v Floating menu (druhá ikona)',
          'Nastavení se ukládá do localStorage',
        ],
      },
      {
        title: 'Supabase Storage',
        items: [
          'Všechny soubory uloženy v cloudu',
          '1 GB zdarma (200× více než localStorage)',
          'Automatický fallback na localStorage',
          'Sanitizované názvy souborů (á→a, č→c, atd.)',
        ],
      },
      {
        title: 'Známé problémy (Beta)',
        items: [
          'Žádná synchronizace mezi zařízeními (localStorage)',
          'Limit 5 MB pro localStorage (proto Supabase)',
          'QR Scanner není implementován (zadávat kód ručně)',
          'ClientsList je placeholder (TODO)',
        ],
      },
      {
        title: 'Kontakt a podpora',
        items: [
          'Email: lenkaroubalka@gmail.com',
          'GitHub: github.com/anthropics/coachpro (TODO)',
          'Discord: CoachPro Community (TODO)',
        ],
      },
    ],
  },

  shortcuts: {
    title: 'Klávesové zkratky',
    icon: '⌨️',
    sections: [
      {
        title: 'Globální zkratky',
        items: [
          'Cmd/Ctrl + K - Rychlé vyhledávání (TODO)',
          'Cmd/Ctrl + / - Nápověda (tato stránka)',
          'Esc - Zavřít dialog/modal',
        ],
      },
      {
        title: 'Materiály',
        items: [
          'Cmd/Ctrl + N - Nový materiál (TODO)',
          'Cmd/Ctrl + F - Vyhledávání v materiálech (TODO)',
          'Cmd/Ctrl + E - Upravit vybraný materiál (TODO)',
        ],
      },
      {
        title: 'Programy',
        items: [
          'Cmd/Ctrl + P - Nový program (TODO)',
          'Cmd/Ctrl + S - Uložit program (auto-save funguje)',
        ],
      },
    ],
  },
};

/**
 * Získání nápovědy pro konkrétní stránku
 */
export const getHelpForPage = (pageName) => {
  return HELP_CONTENT[pageName] || HELP_CONTENT.general;
};

/**
 * Získání všech dostupných nápověd
 */
export const getAllHelpPages = () => {
  return Object.keys(HELP_CONTENT);
};
