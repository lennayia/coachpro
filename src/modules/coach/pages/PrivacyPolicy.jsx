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
            Poslední aktualizace: 1. listopadu 2025
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
            Správcem osobních údajů je provozovatel aplikace CoachPro.
            <br />
            Kontakt: <Link href="mailto:info@coachpro.cz" underline="hover">info@coachpro.cz</Link>
          </Typography>

          {/* 3. Jaké údaje sbíráme */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            3. Jaké osobní údaje sbíráme
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Při registraci do beta testování sbíráme následující údaje:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Kontaktní údaje:</strong> jméno a příjmení, e-mailová adresa, telefonní číslo (volitelně)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Technické údaje:</strong> IP adresa, user agent (typ prohlížeče)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Další údaje:</strong> důvod zájmu o testování (volitelně)
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
                <strong>Beta testování:</strong> identifikace testerek, správa přístupových kódů, komunikace o aplikaci
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Marketing (pouze s vaším souhlasem):</strong> zasílání novinek, tipů a nabídek týkajících se CoachPro
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Technická podpora:</strong> řešení problémů s aplikací
              </Typography>
            </li>
          </Box>

          {/* 5. Právní základ */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            5. Právní základ zpracování
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Vaše osobní údaje zpracováváme na základě <strong>vašeho výslovného souhlasu</strong> (čl. 6 odst. 1 písm. a) GDPR).
            Souhlas můžete kdykoliv odvolat zasláním e-mailu na <Link href="mailto:info@coachpro.cz" underline="hover">info@coachpro.cz</Link>.
          </Typography>

          {/* 6. Sdílení údajů */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            6. Sdílení osobních údajů
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Vaše osobní údaje sdílíme pouze s následujícími subjekty:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Supabase</strong> - hosting databáze (USA, GDPR-compliant)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>MailerLite</strong> - e-mailový marketing (pouze pokud jste udělila souhlas se zasíláním novinek)
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" color="text.secondary" mb={3}>
            S třetími stranami nesdílíme vaše údaje pro účely jejich vlastního marketingu.
          </Typography>

          {/* 7. Doba uložení */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            7. Doba uložení osobních údajů
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Účet testera:</strong> po dobu trvání beta testování nebo do odvolání souhlasu
              </Typography>
            </li>
            <li>
              <Typography variant="body1" color="text.secondary">
                <strong>Marketingové účely:</strong> do odvolání souhlasu se zasíláním novinek
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
            Pro uplatnění svých práv nás kontaktujte na <Link href="mailto:info@coachpro.cz" underline="hover">info@coachpro.cz</Link>.
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
              Napište nám na: <Link href="mailto:info@coachpro.cz" underline="hover">info@coachpro.cz</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PrivacyPolicy;
