import { Container, Box, Card, CardContent, Typography, Link } from '@mui/material';
import { FileText } from 'lucide-react';
import BORDER_RADIUS from '@styles/borderRadius';

const TermsOfService = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Card
        sx={{
          borderRadius: BORDER_RADIUS.card,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'rgba(139, 188, 143, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={32} color="#8FBC8F" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Obchodní podmínky
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={4}>
            Poslední aktualizace: 14. listopadu 2025
          </Typography>

          {/* 1. Úvodní ustanovení */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            1. Úvodní ustanovení
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Tyto obchodní podmínky upravují užívání webové aplikace CoachPro ("Aplikace"),
            provozované Lenkou Roubalovou, IČ: 49266896, se sídlem Jiřice 104, Lysá nad Labem ("Provozovatel").
            Používáním Aplikace vyjadřujete souhlas s těmito podmínkami.
          </Typography>

          {/* 2. Definice pojmů */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            2. Definice pojmů
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Koučka/kouč:</strong> osoba poskytující koučovací služby prostřednictvím Aplikace
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Klientka/klient:</strong> osoba využívající koučovací služby prostřednictvím Aplikace
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Beta tester:</strong> osoba testující nové funkce Aplikace před jejich zveřejněním
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Uživatelský účet:</strong> souhrn dat o uživateli, včetně přístupových údajů
              </Typography>
            </li>
          </Box>

          {/* 3. Registrace a uživatelský účet */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            3. Registrace a uživatelský účet
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Pro využívání Aplikace je nutná registrace. Při registraci se uživatel zavazuje:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <li>
              <Typography variant="body1" color="text.secondary">
                Uvádět pravdivé a aktuální údaje
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                Chránit své přístupové údaje před zneužitím třetími osobami
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                Neposkytovat přístup k účtu jiným osobám
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                Neprodleně informovat Provozovatele o jakémkoli podezření na zneužití účtu
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Uživatelský účet je osobní a nepřenosný. Uživatel odpovídá za veškeré aktivity
            provedené z jeho účtu.
          </Typography>

          {/* 4. Práva a povinnosti uživatelů */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            4. Práva a povinnosti uživatelů
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Uživatel se zavazuje:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <li>
              <Typography variant="body1" color="text.secondary">
                Používat Aplikaci v souladu s právními předpisy ČR a EU
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                Nepoužívat Aplikaci k nezákonným nebo neetickým účelům
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                Nenahrávat obsah porušující autorská práva třetích stran
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                Neprovádět útoky na bezpečnost nebo stabilitu Aplikace
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                Respektovat ostatní uživatele a nevytvářet urážlivý obsah
              </Typography>
            </li>
          </Box>

          {/* 5. Beta testování */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            5. Beta testování
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Aplikace je v současné době v režimu beta testování. Beta testerky berou na vědomí,
            že Aplikace může obsahovat chyby, nestabilní funkce nebo dočasná omezení.
            Provozovatel nenese odpovědnost za případné výpadky nebo ztrátu dat během beta fáze.
            Beta testerky se zavazují poskytovat zpětnou vazbu a hlásit chyby na{' '}
            <Link href="mailto:lenna@online-byznys.cz" underline="hover" sx={{ color: 'primary.main', fontWeight: 600 }}>lenna@online-byznys.cz</Link>.
          </Typography>

          {/* 6. Ceny a platby */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            6. Ceny a platby
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Během beta testování je užívání Aplikace <strong>bezplatné</strong>.
            Provozovatel si vyhrazuje právo zavést zpoplatněné služby v budoucnu.
            O případných změnách cenové politiky budou uživatelé informováni minimálně
            30 dnů předem e-mailem.
          </Typography>

          {/* 7. Duševní vlastnictví */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            7. Duševní vlastnictví
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Veškerý obsah Aplikace vytvořený Provozovatelem (design, zdrojový kód, texty rozhraní,
            grafika, loga, instruktážní texty, dokumentace) je chráněn autorským právem
            a je majetkem Provozovatele nebo poskytnut na základě licence. Uživatel nesmí:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <li>
              <Typography variant="body1" color="text.secondary">
                Kopírovat, distribuovat nebo upravovat zdrojový kód Aplikace bez souhlasu
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                Provádět reverzní inženýrství nebo dekompilaci zdrojového kódu
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                Kopírovat design, grafiku, loga nebo textový obsah rozhraní Aplikace
                pro účely vytváření vlastního produktu
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                Vydávat obsah vytvořený Provozovatelem za vlastní
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                Používat Aplikaci k vytváření konkurenčního produktu
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" color="text.secondary" mb={3}>
            <strong>Obsah vytvořený uživateli</strong> (koučovací programy, materiály, poznámky,
            záznamy o sezeních, nahrané dokumenty) zůstává jejich výhradním majetkem.
            Provozovatel získává pouze nevýhradní licenci k ukládání a zobrazování
            tohoto obsahu pro účely poskytování služby a nezneužije jej pro jiné účely.
            Uživatel může svůj obsah kdykoliv exportovat nebo smazat.
          </Typography>

          {/* 8. Odpovědnost za škody */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            8. Odpovědnost za škody
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Provozovatel nenese odpovědnost za:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <li>
              <Typography variant="body1" color="text.secondary">
                Škody vzniklé nesprávným použitím Aplikace
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                Obsah vytvořený třetími stranami (kouči, klienti)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                Dočasnou nedostupnost služby z důvodu údržby nebo technických problémů
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                Ztrátu dat způsobenou akcemi uživatele nebo vyšší mocí
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Koučovací služby poskytované prostřednictvím Aplikace jsou výhradní
            odpovědností jednotlivých koučů. Provozovatel není stranou koučovacího vztahu
            a nezodpovídá za kvalitu nebo výsledky koučování.
          </Typography>

          {/* 9. Ochrana osobních údajů */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            9. Ochrana osobních údajů
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Zpracování osobních údajů se řídí našimi{' '}
            <Link href="/privacy-policy" underline="hover" sx={{ color: 'primary.main', fontWeight: 600 }}>Zásadami ochrany osobních údajů</Link>,
            které jsou nedílnou součástí těchto obchodních podmínek.
          </Typography>

          {/* 10. Ukončení užívání */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            10. Ukončení užívání
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Uživatel může kdykoliv ukončit užívání Aplikace zasláním žádosti o smazání účtu na{' '}
            <Link href="mailto:lenna@online-byznys.cz" underline="hover" sx={{ color: 'primary.main', fontWeight: 600 }}>lenna@online-byznys.cz</Link>.
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Provozovatel si vyhrazuje právo zrušit uživatelský účet v případě:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <li>
              <Typography variant="body1" color="text.secondary">
                Porušení těchto obchodních podmínek
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                Neaktivity účtu po dobu delší než 12 měsíců
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                Ukončení beta testování (s výpovědní lhůtou 30 dnů)
              </Typography>
            </li>
          </Box>

          {/* 11. Změny obchodních podmínek */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            11. Změny obchodních podmínek
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Provozovatel si vyhrazuje právo tyto podmínky změnit. O významných změnách
            budou uživatelé informováni e-mailem minimálně 14 dnů předem. Pokračováním
            v užívání Aplikace po datu účinnosti změn vyjadřujete souhlas s novými podmínkami.
          </Typography>

          {/* 12. Závěrečná ustanovení */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            12. Závěrečná ustanovení
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Tyto obchodní podmínky se řídí právním řádem České republiky. Případné spory
            mezi Provozovatelem a uživatelem budou řešeny obecnými soudy České republiky.
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Pokud se některé ustanovení těchto podmínek stane neplatným nebo nevymahatelným,
            ostatní ustanovení zůstávají v platnosti.
          </Typography>

          {/* Vstup do aplikace */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" mb={2}>
              <Link
                href="/"
                underline="hover"
                sx={{
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Vstup do aplikace CoachPro
              </Link>
            </Typography>
          </Box>

          {/* Kontakt */}
          <Box
            sx={{
              mt: 4,
              p: 3,
              borderRadius: BORDER_RADIUS.compact,
              backgroundColor: 'rgba(139, 188, 143, 0.1)',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Kontakt
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Máte dotaz k obchodním podmínkám?
              <br />
              Napište nám na: <Link href="mailto:lenna@online-byznys.cz" underline="hover" sx={{ color: 'primary.main', fontWeight: 600 }}>lenna@online-byznys.cz</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TermsOfService;
