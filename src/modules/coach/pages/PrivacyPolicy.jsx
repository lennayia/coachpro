import { Container, Box, Card, CardContent, Typography, Link } from '@mui/material';
import { Shield } from 'lucide-react';
import BORDER_RADIUS from '@styles/borderRadius';

const PrivacyPolicy = () => {
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
              <Shield size={32} color="#8FBC8F" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Zásady ochrany osobních údajů
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={4}>
            Poslední aktualizace: 14. listopadu 2025
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={3}>
            Tyto zásady se vztahují na webovou aplikaci CoachPro dostupnou na{' '}
            <Link href="https://coachpro.cz" underline="hover" sx={{ color: 'primary.main', fontWeight: 600 }}>https://coachpro.cz</Link>.
            Používáním aplikace souhlasíte se zpracováním vašich osobních údajů
            v souladu s těmito zásadami a platnými právními předpisy (GDPR).
          </Typography>

          {/* 1. Úvod */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            1. Úvod
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            CoachPro ("my", "nás", "naše") respektuje vaše soukromí a zavazuje se chránit vaše osobní údaje.
            Tyto zásady vysvětlují, jaké osobní údaje shromažďujeme, jak je používáme a jaká máte práva.
          </Typography>

          {/* 2. Správce osobních údajů */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            2. Správce osobních údajů
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Správcem osobních údajů je Lenka Roubalová, IČ: 49266896, se sídlem Jiřice 104, Lysá nad Labem, provozovatel aplikace CoachPro.
            <br />
            Webové stránky: <Link href="https://coachpro.cz" underline="hover" sx={{ color: 'primary.main', fontWeight: 600 }}>https://coachpro.cz</Link>
            <br />
            Kontakt: <Link href="mailto:lenna@online-byznys.cz" underline="hover" sx={{ color: 'primary.main', fontWeight: 600 }}>lenna@online-byznys.cz</Link>
          </Typography>

          {/* 3. Jaké údaje sbíráme */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            3. Jaké osobní údaje sbíráme
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Při používání aplikace CoachPro sbíráme následující údaje:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Registrační údaje:</strong> jméno a příjmení, e-mailová adresa, heslo (šifrované)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Profilové údaje:</strong> telefonní číslo (volitelně), fotografie profilu (volitelně),
                sociální sítě (volitelně), webové stránky (volitelně)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Koučovací data:</strong> programy, materiály, poznámky, záznamy o sezeních
                (pouze pro kouče a jejich klienty)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Technické údaje:</strong> IP adresa, user agent (typ prohlížeče),
                datum a čas přístupu
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Autentizační údaje:</strong> Google OAuth ID (pokud se přihlašujete přes Google)
              </Typography>
            </li>
          </Box>

          {/* 4. Účel zpracování */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            4. Účel zpracování osobních údajů
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Vaše osobní údaje zpracováváme pro následující účely:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Poskytování služby:</strong> vytvoření a správa uživatelského účtu,
                přístup k aplikaci, ukládání vašich dat
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Koučovací činnost:</strong> umožnění koučovacího vztahu mezi koučem a klientem,
                správa programů, materiálů a záznamů o sezeních
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Autentizace:</strong> ověření vaší identity při přihlášení,
                zabezpečení přístupu k vašemu účtu
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Komunikace:</strong> zasílání důležitých informací o aplikaci,
                odpovědi na vaše dotazy
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Beta testování:</strong> testování nových funkcí, sběr zpětné vazby
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Technická podpora:</strong> řešení problémů s aplikací, zlepšování výkonu
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Marketing (pouze s vaším souhlasem):</strong> zasílání novinek,
                tipů a nabídek týkajících se CoachPro
              </Typography>
            </li>
          </Box>

          {/* 5. Právní základ */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            5. Právní základ zpracování
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Vaše osobní údaje zpracováváme na základě:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Plnění smlouvy</strong> (čl. 6 odst. 1 písm. b) GDPR) - poskytování služby,
                správa účtu
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Váš souhlas</strong> (čl. 6 odst. 1 písm. a) GDPR) - marketing,
                volitelné údaje v profilu
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Oprávněný zájem</strong> (čl. 6 odst. 1 písm. f) GDPR) - technická podpora,
                zabezpečení aplikace
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Souhlas můžete kdykoliv odvolat zasláním e-mailu na{' '}
            <Link href="mailto:lenna@online-byznys.cz" underline="hover" sx={{ color: 'primary.main', fontWeight: 600 }}>lenna@online-byznys.cz</Link>.
            Odvolání souhlasu nemá vliv na zákonnost zpracování před jeho odvoláním.
          </Typography>

          {/* 6. Sdílení údajů */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            6. Sdílení osobních údajů
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Vaše osobní údaje sdílíme pouze s následujícími zpracovateli:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Supabase (Supabase Inc.)</strong> - hosting databáze a autentizační služby
                (USA, GDPR-compliant, standardní smluvní doložky)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Vercel Inc.</strong> - hosting webové aplikace (USA, GDPR-compliant)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Google LLC</strong> - OAuth autentizace (pouze pokud používáte přihlášení přes Google)
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" color="text.secondary" mb={3}>
            S třetími stranami nesdílíme vaše údaje pro účely jejich vlastního marketingu.
            Vaše koučovací data (programy, materiály, poznámky) jsou přístupná pouze vám
            a vašemu koučovi/klientům v rámci koučovacího vztahu.
          </Typography>

          {/* 7. Doba uložení */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            7. Doba uložení osobních údajů
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Uživatelský účet:</strong> po dobu aktivního užívání služby nebo do smazání účtu
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Koučovací data:</strong> po dobu trvání koučovacího vztahu nebo do smazání koučem/klientem
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Technické logy:</strong> maximálně 90 dnů
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Marketingové účely:</strong> do odvolání souhlasu se zasíláním novinek
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Po smazání účtu:</strong> všechna osobní data jsou trvale smazána do 30 dnů
              </Typography>
            </li>
          </Box>

          {/* 8. Vaše práva */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            8. Vaše práva
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Máte následující práva:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Právo na přístup:</strong> získat kopii svých osobních údajů
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Právo na opravu:</strong> opravit nepřesné nebo neúplné údaje
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Právo na výmaz:</strong> požádat o smazání vašich údajů
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Právo na odvolání souhlasu:</strong> kdykoliv odvolat souhlas se zpracováním
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Právo podat stížnost:</strong> u Úřadu pro ochranu osobních údajů (www.uoou.cz)
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Pro uplatnění svých práv nás kontaktujte na <Link href="mailto:lenna@online-byznys.cz" underline="hover" sx={{ color: 'primary.main', fontWeight: 600 }}>lenna@online-byznys.cz</Link>.
          </Typography>

          {/* 9. Zabezpečení */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            9. Zabezpečení osobních údajů
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Vaše osobní údaje chráníme pomocí moderních technických a organizačních opatření:
            šifrování dat, zabezpečená databáze (Supabase), přístup pouze oprávněným osobám.
          </Typography>

          {/* 10. Cookies */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            10. Cookies
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Aplikace CoachPro používá pouze nezbytné technické cookies pro funkčnost aplikace (localStorage pro ukládání dat).
            Nepoužíváme analytické ani marketingové cookies třetích stran.
          </Typography>

          {/* 11. Změny zásad */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            11. Změny těchto zásad
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Tyto zásady můžeme čas od času aktualizovat. O významných změnách vás budeme informovat e-mailem.
          </Typography>

          {/* 12. Související dokumenty */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            12. Související dokumenty
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Používání aplikace se řídí našimi{' '}
            <Link href="/terms-of-service" underline="hover" sx={{ color: 'primary.main', fontWeight: 600 }}>Obchodními podmínkami</Link>.
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
              Máte otázku ohledně zpracování osobních údajů?
              <br />
              Napište nám na: <Link href="mailto:lenna@online-byznys.cz" underline="hover" sx={{ color: 'primary.main', fontWeight: 600 }}>lenna@online-byznys.cz</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PrivacyPolicy;
