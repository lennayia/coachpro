// 📥 Import koučovacích karet do Supabase
// Spuštění: node src/scripts/importCards.js

import { createClient } from '@supabase/supabase-js';

// Supabase konfigurace (TODO: přidat své credentials)
const SUPABASE_URL = 'https://qrnsrhrgjzijqphgehra.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFybnNyaHJnanppanFwaGdlaHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzg1MzEsImV4cCI6MjA3NTc1NDUzMX0.PvKCvlhQxWiacimicy8LINLKeWbMwQIKkwb5TOAwhAs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================================
// CSV DATA (30 karet)
// ============================================================================

const CSV_DATA = `ID Karty,Balíček (Motiv),Cyklus,Primární Emoce,Poznámka PŘED,Název Karty,Klíčové Téma,Mechanismus,Afirmace (A),Koučovací Text (B),Cílový Stav,Poznámka PO
J-C-01,Člověk,Jaro: Začátky a Růst,Hanba,"Cítím se malá a stydím se za své chyby. Ráda bych se schovala.",Bezpečí nedokonalosti,Přijetí sebe,Validace a sebeláska,"Jsem v bezpečí, abych byl/a nedokonalý/á.","Hanba je hlas, který nás chce izolovat. Kde v těle cítíš její tíhu? Připomeň si, že nejsi to, co jsi udělal/a, ani to, co se stalo. Všichni chybujeme a všichni jsme dost dobří. Co bys teď řekl/a svému příteli, kdyby to prožíval/a? Dej si to samé povolení a lásku.",Přijetí,"Přijímám se s chybami i nedokonalostmi. Jsem dost dobrá."
J-C-02,Člověk,Jaro: Začátky a Růst,Strach / Úzkost,"Cítím sevření v hrudi a nevím, jestli to zvládnu. Mám strach udělat první krok.",Objímám svou obavu,Volba akce před strachem,Mobilizace a přijetí strachu,"Strach mě jen informuje, ale neřídí. Jsem v bezpečí, i když se cítím zranitelně.","Polož ruku na srdce a řekni si: 'Tato emoce je jen návštěva, ne můj trvalý stav.' Co teď potřebuji nejvíc? Strach je informace, ne překážka. Jaká malá akce by mi pomohla cítit se o 1% odvážněji?",Odvaha,"Udělala jsem krok navzdory strachu. Cítím se odvážná."
J-C-03,Člověk,Jaro: Začátky a Růst,Zranitelnost,"Bojím se otevřít. Co když mě odmítnou? Co když jsem moc?",Odvaha být viděn/a,Otevření se,Přijetí rizika,"Otevřít se je moje největší síla.","Zranitelnost je most k hlubšímu spojení. Cítíš ten lehký strach z odhalení? To je odvaha v akci. Přijmi, že nemůžeš ovládat, jak zareagují ostatní. Udělal/a jsi krok vpřed a byl/a jsi upřímný/á. To je celé vítězství. Můžeš to teď uznat?",Spojení,"Otevřela jsem se a jsem v pohodě. Moje upřímnost je můj dar."
J-P-01,Příroda,Jaro: Začátky a Růst,Nejistota,"Nevím, kam jít dál. Cítím se ztracená a bez směru.",První výhonky,Důvěra v proces,Přijetí nejistoty a růst,"Moje cesta se odkrývá krok za krokem. Nemusím vidět celou cestu.","Jako semínko v zemi nevíš, kdy se objevíš na světle. Ale proces už začal. Co je ten jeden maličký krok, který můžeš udělat dnes? Důvěřuj, že každý krok má smysl, i když ho ještě nevidíš.",Důvěra,"Důvěřuji procesu. Krok za krokem se odkrývá má cesta."
J-P-02,Příroda,Jaro: Začátky a Růst,Strach z neúspěchu,"Co když se mi to nepovede? Co když promarním čas a energii?",Síla kořenů,Uzemnění a pevnost,Přijetí základů,"Moje kořeny jsou hluboké a pevné.","Uzemnění je spojení se současností. Udělej pomalé, hluboké nádechy. Vnímej, jak pevně stojíš na zemi. Co slyšíš, vidíš, cítíš ve své blízkosti? Pokaždé, když se myšlenky rozběhnou, vrať se k pocitu pevnosti pod tvými chodidly. Jsi tady a teď.",Stabilita,"Jsem pevně uzemněná. Mám sílu růst."
J-P-03,Příroda,Jaro: Začátky a Růst,Nejistota,"Cítím se jako na začátku. Je to vzrušující i děsivé zároveň.",Rozkvetlé poupě,Otevření se novému,Přijetí procesu,"Otevírám se životu a jeho možnostem.","Jaro je čas, kdy se příroda nebojí rozkvést. Co v tobě chce rozkvést? Jaká část tebe čeká na to správné světlo a teplo? Dovol si být v procesu – nemusíš být hned v plném květu.",Otevřenost,"Otevírám se životu s důvěrou. Je to vzrušující."
J-A-01,Abstrakt,Jaro: Začátky a Růst,Tma a nejistota,"Cítím se v temnotě. Nevím, co přijde.",Světlo v temnotě,Naděje a nový začátek,Přijetí světla,"I v temnotě roste světlo.","Tma není konec – je to prostor pro klíčení. Co kdyby tato tma byla půda, ve které roste něco nového? Najdi jedno malé světlo – myšlenku, vzpomínku, naději. Začni tam.",Naděje,"Vidím světlo. Začíná něco nového."
J-A-02,Abstrakt,Jaro: Začátky a Růst,Chaos,"Mám pocit, že je všechno roztříštěné a chaotické. Nevím, kde začít.",První linie,Tvorba struktury,Začátek pořádku,"Z chaosu tvořím řád, jeden krok po druhém.","Chaos není tvůj nepřítel – je to stav před tvorbou. Co je jedna věc, kterou dnes můžeš udělat? Jedna čára. Jeden krok. Začni tam a nech zbytek přijít.",Jasnost,"Mám první krok. Začínám vidět strukturu."
L-C-01,Člověk,Léto: Síla a Akce,Hněv / Vztek,"Cítím napětí a vztek. Někdo překročil hranici a já to nezvládám.",Energie hranic,Nastavení hranic,Mobilizace energie,"Dýchám. Reakci si vybírám sám/sama.","Hněv je energie, která ukazuje na porušenou hranici. Nejdřív dýchej. Jaké základní potřeby se ti nedostává (bezpečí, respekt, uznání)? Místo útoku nebo stažení pojmenuj tu potřebu. Jak bys mohl/a o svou potřebu laskavě požádat?",Pevnost,"Vím, co potřebuji. Nastavuję hranice s láskou."
L-C-02,Člověk,Léto: Síla a Akce,Frustrace / Netrpělivost,"Tlačím a tlačím a nic se neděje. Jsem frustrovaná a netrpělivá.",Čekám s důvěrou,Přijetí tempa,Uvolnění kontroly,"Někdy věci trvají déle. Místo tlačení na pilu praktikuji mírnost a přítomnost.","Co mohu udělat pro uklidnění svého nervového systému právě teď? Můžu na chvíli odejít od problému? Připomeň si: nejsi málo, když věci berou čas. Někdy je mírnost ta nejsilnější akce.",Trpělivost,"Uvolňuję kontrolu. Důvěřuję procesu."
L-C-03,Člověk,Léto: Síla a Akce,Vyhoření,"Dávám a dávám a cítím, že už nemám co dát. Jsem vyčerpaná.",Plamen péče o sebe,Obnova energie,Sebeláska v akci,"Naplňuję svou nádrž dřív, než dávám druhým.","Co tvé tělo potřebuje? Odpočinek? Pohyb? Ticho? Dej si to, bez pocitu viny. Neseš být silná pro všechny – můžeš být měkká pro sebe. Jak bys mohla dnes naplnit svou energii?",Obnova,"Pečuję o sebe. Mám právo na odpočinek."
L-P-01,Příroda,Léto: Síla a Akce,Přetížení,"Mám toho moc. Všechno na mě padá najednou.",Síla horského štítu,Pevnost a stabilita,Přijetí síly,"Jsem stabilní a pevná jako hora.","Hora stojí pevně, i když kolem ní běží bouře. Připomeň si svou vnitřní sílu. Co už jsi všechno zvládla? Udělej inventuru svých zdrojů – nejsi bez síly, jen potřebuješ se k ní připojit.",Stabilita,"Jsem pevná. Zvládnu to."
L-P-02,Příroda,Léto: Síla a Akce,Pochybnost o sobě,"Pochybuję o sobě. Nevím, jestli jsem dost dobrá.",Vzrůstný strom,Růst a síla,Uznání pokroku,"Rostú pomalu, ale jistě. Mám všechno, co potřebuję.","Strom neroste za den. Ale každý den roste. Kde jsi dnes oproti včerejšku? Kde jsi oproti minulému roku? Uznej svůj růst – není malý, jen postupný.",Sebedůvěra,"Rostú. Jsem silnější, než si myslím."
L-P-03,Příroda,Léto: Síla a Akce,Závist,"Vidím, co mají druzí, a já to nemám. Cítím závist.",Vlastní květina,Jedinečnost a hojnost,Přijetí své cesty,"Má cesta je jedinečná. Srovnávání není férové – každý má jiné podmínky.","Závist ukazuje, co toužíš mít. Co konkrétně chceš? Můžeš si to vytvořit po svém? Připomeň si: jejich květina není tvoje. Tvoje je jiná a stejně krásná.",Vděčnost,"Má cesta je moje. Jsem vděčná za to, co mám."
L-A-01,Abstrakt,Léto: Síla a Akce,Chaotická energie,"Cítím energii, ale nevím, kam s ní. Je to zmatené.",Ohnivé linie,Zaměření energie,Směrování síly,"Moje energie má směr a cíl.","Co kdyby tato energie byla palivem, ne problémem? Kam bys ji chtěla směřovat? Co by se stalo, kdybys ji nenechala rozptýlit, ale soustředila? Vyber jeden cíl na dnes.",Zaměření,"Má energie má směr. Jsem soustředěná."
L-A-02,Abstrakt,Léto: Síla a Akce,Napětí,"Cítím napětí ve svém těle. Jsem stažená.",Dynamické oblouky,Uvolnění napětí,Přijetí a výdech,"Dýchám skrz napětí. S každým výdechem uvolňuję.","Napětí je držená energie. Kde ho cítíš? Zkus tam dýchat. S každým výdechem představ, jak se uvolňuje. Co by pomohlo tvému tělu uvolnit se? Pohyb? Dotyk? Zvuk?",Uvolnění,"Uvolňuję napětí. Jsem volná."
P-C-01,Člověk,Podzim: Reflexe a Propuštění,Smutek / Žal,"Cítím smutek. Něco končí a já to oplakávám.",Dovolím si cítit,Truchlení,Validace smutku,"Cítit smutek je v pořádku a přirozené. Jsem silný/á, i když zrovna nejsem veselý/á.","Dovol si prožít smutek, abys mohl/a jít dál. Smutek je přirozená reakce na ztrátu, ať už velkou nebo malou. Nepotlačuj ho, ale ani se v něm neutápěj. Jaká myšlenka nebo představa ti teď pomůže cítit se jen o 1 % lépe? Dej si dnes úlevu a odpočinek.",Mír,"Dala jsem smutku prostor. Cítím mír."
P-C-02,Člověk,Podzim: Reflexe a Propuštění,Zklamání,"Doufala jsem v něco jiného. Cítím se zklamaná.",Cenná lekce,Učení z neúspěchu,Procesování a reflexe,"Můj pocit je platný. Je to jen dočasný stav.","Zklamání bolí, protože jsi měla naději. A to je krásné – odvážila ses doufat. Co ses z toho naučila? Co bys příště udělala jinak? Jaká lekce v tom je? Tvůj pocit je platný – dej si čas.",Moudrost,"Přijímám lekci. Jsem moudřejší."
P-C-03,Člověk,Podzim: Reflexe a Propuštění,Vina,"Cítím vinu za to, co jsem udělala nebo neudělala.",Odpuštění sobě,Sebeodpuštění,Přijetí a propuštění,"Udělala jsem to nejlepší, co jsem v té chvíli mohla.","Vina tě drží v minulosti. Co kdybys si odpustila? Co kdybys uznala, že jsi udělala to nejlepší s tím, co jsi měla? Jak by vypadalo odpuštění? Co by se změnilo, kdybys si dovolila jít dál?",Svoboda,"Odpustila jsem si. Jsem svobodná."
P-P-01,Příroda,Podzim: Reflexe a Propuštění,Ztráta,"Něco nebo někdo odešel. Cítím prázdnotu.",Padající listy,Přirozené propuštění,Přijetí konce,"Propouštím s vděčností. Konec je součástí života.","Stromy ztrácejí listy na podzim, ale přežívají. Co tě opustilo? Co to uvolnilo? Jaký prostor se otevřel? Můžeš poděkovat za to, co bylo, a zároveň propustit?",Vděčnost,"Děkuję za to, co bylo. Propouštím s láskou."
P-P-02,Příroda,Podzim: Reflexe a Propuštění,Únava z dávání,"Dávala jsem hodně. Teď potřebuję vzít zpátky svou energii.",Sklizeň,Přijetí plodů,Uznání hodnoty,"Sklidím, co jsem zasela. Mám právo odpočinout.","Co jsi za poslední období zasela? Co jsi vytvořila? Uznej svou práci – není malá. Teď je čas sklidit a odpočinout. Co bys chtěla vzít zpátky pro sebe?",Naplnění,"Uznávám svou práci. Odpočívám s klidem."
P-P-03,Příroda,Podzim: Reflexe a Propuštění,Nostalgic,"Vzpomínám na to, jak to bylo. Cítím melancholii.",Zlaté světlo podzimu,Krása v konci,Přijetí krásy,"V každém konci je krása.","Podzim je krásný právě proto, že končí. Co bylo krásného na tom, co skončilo? Můžeš držet vzpomínku a zároveň jít dál? Jak by vypadala vděčnost za to, co bylo?",Klid,"Vidím krásu v tom, co bylo. Jdu dál s láskou."
P-A-01,Abstrakt,Podzim: Reflexe a Propuštění,Tíha minulosti,"Cítím tíhu všeho, co jsem nesla. Je čas to položit.",Uvolněné linie,Propuštění břemene,Fyzické uvolnění,"S každým výdechem odkládám to, co mi nepatří.","Co neseš, co ti nepatří? Představ si, že s každým výdechem to odkládáš. Co by se stalo, kdybys to prostě položila? Kdo bys byla bez toho?",Lehkost,"Položila jsem, co mi nepatřilo. Jsem lehčí."
P-A-02,Abstrakt,Podzim: Reflexe a Propuštění,Rozpuštění,"Něco se ve mně rozpouští. Je to děsivé i osvobozující.",Mizející hranice,Transformace,Přijetí změny,"Rozpouštím staré, abych mohla přijmout nové.","Co se rozpouští? Staré přesvědčení? Identita? Vztah? Je to děsivé, protože nevíš, co přijde. Ale můžeš důvěřovat procesu? Co když je to správně?",Důvěra,"Důvěřuję procesu rozpuštění. Něco nového přichází."
Z-C-01,Člověk,Zima: Klid a Obnova,Únava,"Jsem unavená. Potřebuję odpočinek, ale nedovolím si ho.",Tiché útočiště,Odpočinek,Sebeláska v klidu,"Odpočinek je produktivní. Zasloužím si pauzu.","Tvé tělo říká STOP. Dokážeš poslouchat? Co by se stalo, kdybys dnes nedělala nic? Kdo by tě odsoudil? A kdyby ano – je to tvoje břemeno? Dej si odpočinek bez viny.",Odpočinek,"Odpočívám bez viny. Jsem v klidu."
Z-C-02,Člověk,Zima: Klid a Obnova,Osamění,"Cítím se sama. Nikdo mě nechápe.",Vnitřní společnost,Spojení se sebou,Introspekce,"Nejsem sama. Jsem se sebou.","Osamění bolí. Ale co když je to příležitost poznat sebe? Co kdybys strávila čas sama se sebou – ne v opuštění, ale v dobrém společenství? Co potřebuješ slyšet od sebe?",Spojení se sebou,"Jsem si dobrým společníkem. Nejsem sama."
Z-C-03,Člověk,Zima: Klid a Obnova,Prázdnota,"Cítím prázdnotu. Nevím, kdo jsem bez všeho toho dělání.",Prázdný prostor,Přijetí prázdnoty,Důvěra v ticho,"Prázdnota není problém – je to prostor pro nové.","Co když prázdnota není ztráta, ale příprava? Co když je to prostor, který čeká na naplnění? Co kdybys jen byla? Bez dělání, bez výkonu, jen přítomná?",Mír,"Přijímám prázdnotu. Je to prostor pro nové."
Z-P-01,Příroda,Zima: Klid a Obnova,Ticho a chlad,"Je ticho a chlad. Cítím se nehybná.",Zimní ticho,Odpočinek přírody,Přijetí klidu,"V klidu a tichu se obnovuję.","Zima je čas spánku. Stromy nevypadají mrtvé – odpočívají. Co kdybys i ty? Co by se stalo, kdybys si dovolila být nehybná? Není to smrt – je to příprava na jaro.",Klid,"Odpočívám jako příroda. Připravuję se na jaro."
Z-P-02,Příroda,Zima: Klid a Obnova,Temnota,"Je tma. Bojím se, že to nikdy neskončí.",Semínko v zemi,Klíčení v temnotě,Důvěra v proces,"V temnotě klíčím. Přijde světlo.","Semínko klíčí v temnotě – nevzdává se. Věří, že světlo přijde. Co kdybys věřila? Co když tato tma je jen půda pro tvůj růst?",Naděje,"Věřím, že světlo přijde. Klíčím."
Z-P-03,Příroda,Zima: Klid a Obnova,Čekání,"Čekám a čekám. Nic se neděje. Jsem netrpělivá.",Zamrzlý potok,Skrytý pohyb,Důvěra v načasování,"Pod povrchem se děje víc, než vidím.","Voda pod ledem stále teče. Pohyb není vždy viditelný. Co se děje pod povrchem tvého života? Co se připravuje? Důvěřuj, že to přijde ve správný čas.",Důvěra,"Důvěřuję skrytému pohybu. Vše přijde ve svůj čas."
Z-A-01,Abstrakt,Zima: Klid a Obnova,Stažení se,"Stáhla jsem se. Nechci být s lidmi.",Soustředné kruhy,Návrat k sobě,Introspekce,"Vracím se k sobě. Je to v pořádku.","Stažení se není slabost – je to obrana. Co potřebuješ? Prostor? Ticho? Bezpečí? Dej si to. A až budeš připravená, vrátíš se. Není to útěk – je to péče.",Sebeláska,"Dala jsem si prostor. Vrátím se, až budu připravená."
Z-A-02,Abstrakt,Zima: Klid a Obnova,Mlha,"Všechno je zamlžené. Nevím, co dál.",Mlha nejistoty,Přijetí nevědění,Důvěra,"Nevím, co přijde. A to je v pořádku.","Mlha se rozplyne. Vždy se rozplyne. Co kdybys věřila, že se to vyjasní? Co kdybys přijala, že nevíš? Že je to normální a lidské?",Důvěra,"Přijímám, že nevím. Důvěřuję, že se to vyjasní."`;

// ============================================================================
// PARSE CSV → Objekty
// ============================================================================

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map((line) => {
    const values = line.split(',');
    const card = {};

    headers.forEach((header, index) => {
      card[header.trim()] = values[index]?.trim() || '';
    });

    return card;
  });
}

// ============================================================================
// GENERUJ IMAGE PATH podle ID
// ============================================================================

function generateImagePath(cardId) {
  // J-C-01 → jaro/clovek/j-c-01.jpg
  // L-P-02 → leto/priroda/l-p-02.jpg

  const [cyklusCode, motivCode] = cardId.toLowerCase().split('-');

  const cyklusMap = {
    'j': 'jaro',
    'l': 'leto',
    'p': 'podzim',
    'z': 'zima'
  };

  const motivMap = {
    'c': 'clovek',
    'p': 'priroda',
    'a': 'abstrakt'
  };

  const cyklus = cyklusMap[cyklusCode];
  const motiv = motivMap[motivCode];

  return `/images/karty/${cyklus}/${motiv}/${cardId.toLowerCase()}.jpg`;
}

// ============================================================================
// CLEAN CYKLUS - odstranit ": popis"
// ============================================================================

function cleanCyklus(cyklusText) {
  // "Jaro: Začátky a Růst" → "Jaro"
  return cyklusText.split(':')[0].trim();
}

// ============================================================================
// IMPORT DO SUPABASE
// ============================================================================

async function importCards() {
  console.log('🚀 Začínám import koučovacích karet...\n');

  // 1. Parse CSV
  const cards = parseCSV(CSV_DATA);
  console.log(`📋 Načteno ${cards.length} karet z CSV\n`);

  // 2. Převeď na Supabase formát
  const supabaseCards = cards.map((card) => ({
    id: card['ID Karty'],
    motiv: card['Balíček (Motiv)'],
    cyklus: cleanCyklus(card['Cyklus']),
    primarni_emoce: card['Primární Emoce'],
    poznamka_pred: card['Poznámka PŘED'],
    nazev_karty: card['Název Karty'],
    klicove_tema: card['Klíčové Téma'],
    mechanismus: card['Mechanismus'],
    afirmace: card['Afirmace (A)'],
    koucovaci_text: card['Koučovací Text (B)'],
    cilovy_stav: card['Cílový Stav'],
    poznamka_po: card['Poznámka PO'],
    image_path: generateImagePath(card['ID Karty']),
  }));

  // 3. Insert do Supabase (batch)
  console.log('💾 Vkládám karty do Supabase...\n');

  const { data, error } = await supabase
    .from('coachpro_cards')
    .upsert(supabaseCards, { onConflict: 'id' });

  if (error) {
    console.error('❌ Chyba při importu:', error);
    return;
  }

  console.log(`✅ Úspěšně importováno ${supabaseCards.length} karet!\n`);

  // 4. Vypis statistiky
  const stats = {
    jaro: supabaseCards.filter(c => c.cyklus === 'Jaro').length,
    leto: supabaseCards.filter(c => c.cyklus === 'Léto').length,
    podzim: supabaseCards.filter(c => c.cyklus === 'Podzim').length,
    zima: supabaseCards.filter(c => c.cyklus === 'Zima').length,
    clovek: supabaseCards.filter(c => c.motiv === 'Člověk').length,
    priroda: supabaseCards.filter(c => c.motiv === 'Příroda').length,
    abstrakt: supabaseCards.filter(c => c.motiv === 'Abstrakt').length,
  };

  console.log('📊 Statistiky:');
  console.log(`   Jaro: ${stats.jaro} karet`);
  console.log(`   Léto: ${stats.leto} karet`);
  console.log(`   Podzim: ${stats.podzim} karet`);
  console.log(`   Zima: ${stats.zima} karet`);
  console.log(`   ---`);
  console.log(`   Člověk: ${stats.clovek} karet`);
  console.log(`   Příroda: ${stats.priroda} karet`);
  console.log(`   Abstrakt: ${stats.abstrakt} karet`);
  console.log('\n✨ Hotovo!');
}

// ============================================================================
// SPUŠTĚNÍ
// ============================================================================

importCards();
