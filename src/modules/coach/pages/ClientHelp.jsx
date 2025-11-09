import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Divider,
} from '@mui/material';
import { ArrowLeft, Phone, Mail, Globe, HelpCircle, ChevronDown, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { useTheme } from '@mui/material';
import ClientAuthGuard from '@shared/components/ClientAuthGuard';

const ClientHelp = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const faqs = [
    {
      question: 'Jak mohu přistupovat k mým materiálům?',
      answer: 'Materiály najdete v sekci "Materiály" na hlavním dashboardu. Klikněte na kartu "Materiály" a zobrazí se vám všechny materiály, které s vámi sdílí vaše koučka.',
    },
    {
      question: 'Jak fungují přístupové kódy?',
      answer: 'Přístupové kódy vám umožňují přihlásit se bez Google účtu. Jednoduše zadejte 6místný kód, který jste obdrželi od vaší koučky, a budete mít přístup ke svým programům a materiálům.',
    },
    {
      question: 'Mohu sdílet materiály s jinými lidmi?',
      answer: 'Ne, materiály jsou určeny pouze pro vás a jsou chráněny přístupovými právy. Pokud chcete sdílet materiály s někým jiným, kontaktujte prosím vaši koučku.',
    },
    {
      question: 'Co dělat, když zapomenu své přihlašovací údaje?',
      answer: 'Pokud se přihlašujete přes Google, použijte svůj Google účet. Pokud používáte přístupový kód a zapomněli jste ho, kontaktujte prosím vaši koučku, která vám poskytne nový kód.',
    },
    {
      question: 'Jak často se přidávají nové materiály?',
      answer: 'Vaše koučka s vámi sdílí nové materiály podle vašeho individuálního koučovacího plánu. Pokud máte dotazy ohledně frekvence nebo obsahu materiálů, kontaktujte ji přímo.',
    },
    {
      question: 'Je má data v bezpečí?',
      answer: 'Ano, všechna vaše data jsou chráněna pomocí moderních bezpečnostních standardů. Používáme šifrování SSL/TLS a databázové zabezpečení na úrovni řádků (RLS) pro ochranu vašich osobních informací.',
    },
  ];

  return (
    <ClientAuthGuard requireProfile={true}>
      <Box
        sx={{
          minHeight: '100vh',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? `
                radial-gradient(circle at 20% 20%, rgba(143, 188, 143, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(85, 107, 47, 0.15) 0%, transparent 50%),
                linear-gradient(135deg, #0a0f0a 0%, #1a2410 100%)
              `
              : `
                radial-gradient(circle at 20% 20%, rgba(143, 188, 143, 0.4) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(85, 107, 47, 0.3) 0%, transparent 50%),
                linear-gradient(135deg, #e8ede5 0%, #d4ddd0 100%)
              `,
          p: 3,
          pr: 15, // Space for FloatingMenu
        }}
      >
        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          {/* Header with Back Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <IconButton
              onClick={() => navigate('/client/dashboard')}
              sx={{
                mr: 2,
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(139, 188, 143, 0.15)'
                      : 'rgba(85, 107, 47, 0.1)',
                },
              }}
            >
              <ArrowLeft size={24} />
            </IconButton>
            <Box>
              <Typography variant="h3" fontWeight={700}>
                Nápověda a Kontakt
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Jak vám můžeme pomoci?
              </Typography>
            </Box>
          </Box>

          {/* Contact Card */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <Card
              elevation={0}
              sx={{
                mb: 4,
                borderRadius: BORDER_RADIUS.card,
                border: '1px solid',
                borderColor: 'divider',
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(26, 36, 16, 0.8)'
                    : 'rgba(255, 255, 255, 0.95)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Kontaktujte svou koučku
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Máte-li jakékoli dotazy nebo potřebujete pomoc, neváhejte se obrátit přímo na Lenku.
                </Typography>

                <Divider sx={{ my: 3 }} />

                {/* Coach Contact Info */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(139, 188, 143, 0.15)'
                            : 'rgba(85, 107, 47, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      <Typography variant="h3" fontWeight={700} color="primary.main">
                        L
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Lenka Roubalová
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Online Byznys - koučování
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(139, 188, 143, 0.1)'
                              : 'rgba(85, 107, 47, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Phone size={18} color={theme.palette.primary.main} />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Telefon
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          +420 123 456 789
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(139, 188, 143, 0.1)'
                              : 'rgba(85, 107, 47, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Mail size={18} color={theme.palette.primary.main} />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Email
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          lenka@online-byznys.cz
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(139, 188, 143, 0.1)'
                              : 'rgba(85, 107, 47, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Globe size={18} color={theme.palette.primary.main} />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Web
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          Online Byznys - koučování
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <Card
              elevation={0}
              sx={{
                mb: 4,
                borderRadius: BORDER_RADIUS.card,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <HelpCircle size={32} color={theme.palette.primary.main} />
                  <Typography variant="h5" fontWeight={600}>
                    Často kladené otázky
                  </Typography>
                </Box>

                {faqs.map((faq, index) => (
                  <Accordion
                    key={index}
                    elevation={0}
                    sx={{
                      mb: 1,
                      '&:before': { display: 'none' },
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: `${BORDER_RADIUS.compact}px !important`,
                      '&:first-of-type': {
                        borderRadius: `${BORDER_RADIUS.compact}px !important`,
                      },
                      '&:last-of-type': {
                        borderRadius: `${BORDER_RADIUS.compact}px !important`,
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ChevronDown size={20} />}
                      sx={{
                        '& .MuiAccordionSummary-content': {
                          my: 1,
                        },
                      }}
                    >
                      <Typography variant="body1" fontWeight={600}>
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy Policy Link */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <Card
              elevation={0}
              sx={{
                borderRadius: BORDER_RADIUS.card,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Shield size={32} color={theme.palette.text.secondary} style={{ marginBottom: 16 }} />
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Ochrana osobních údajů
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Vaše soukromí je pro nás prioritou. Všechna vaše data jsou chráněna podle GDPR.
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: BORDER_RADIUS.button,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                  onClick={() => {
                    // TODO: Link to privacy policy
                    window.open('https://www.online-byznys.cz/privacy-policy', '_blank');
                  }}
                >
                  Zobrazit zásady ochrany osobních údajů
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </Box>
    </ClientAuthGuard>
  );
};

export default ClientHelp;
