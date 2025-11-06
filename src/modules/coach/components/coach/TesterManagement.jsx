import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Search, CheckCircle, XCircle, Mail, Phone, Calendar, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@shared/config/supabase';
import { useNotification } from '@shared/context/NotificationContext';
import { getCurrentUser } from '../../utils/storage';
import BORDER_RADIUS from '@styles/borderRadius';

const TesterManagement = () => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.isAdmin === true;

  const [testers, setTesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect non-admin users
  useEffect(() => {
    if (!isAdmin) {
      showError('Přístup odepřen', 'Tato stránka je dostupná pouze pro administrátory');
      navigate('/coach/dashboard', { replace: true });
    }
  }, [isAdmin, navigate, showError]);

  // Fetch testers from Supabase
  useEffect(() => {
    fetchTesters();
  }, []);

  const fetchTesters = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('testers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTesters(data || []);
    } catch (err) {
      console.error('Error fetching testers:', err);
      showError('Chyba', 'Nepodařilo se načíst seznam testerů');
    } finally {
      setLoading(false);
    }
  };

  // Filter testers based on search query
  const filteredTesters = testers.filter((tester) => {
    const query = searchQuery.toLowerCase();
    return (
      tester.name?.toLowerCase().includes(query) ||
      tester.email?.toLowerCase().includes(query) ||
      tester.access_code?.toLowerCase().includes(query)
    );
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Don't render if not admin (while redirect is in progress)
  if (!isAdmin) {
    return null;
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, pr: { xs: 2, sm: 15 } }}>
      {/* Header */}
      <Box mb={3}>
        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
          <ShieldAlert size={28} color="#BC8F8F" />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 0 }}>
            Správa testerů
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Přehled všech registrací do beta testování (pouze admin)
        </Typography>
      </Box>

      {/* Search */}
      <Box mb={3}>
        <TextField
          placeholder="Hledat podle jména, emailu nebo access code..."
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 600,
            '& .MuiOutlinedInput-root': {
              borderRadius: BORDER_RADIUS.compact,
            },
          }}
        />
      </Box>

      {/* Stats Cards */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Card sx={{ minWidth: 200, borderRadius: BORDER_RADIUS.card }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Celkem registrací
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {testers.length}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, borderRadius: BORDER_RADIUS.card }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Marketing consent
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {testers.filter((t) => t.marketing_consent).length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Table */}
      <Card sx={{ borderRadius: BORDER_RADIUS.card }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={8}>
              <CircularProgress />
            </Box>
          ) : filteredTesters.length === 0 ? (
            <Box py={8} textAlign="center">
              <Alert severity="info" sx={{ maxWidth: 400, mx: 'auto', borderRadius: BORDER_RADIUS.compact }}>
                {searchQuery
                  ? 'Žádné výsledky nenalezeny'
                  : 'Zatím nejsou žádní registrovaní testeři'}
              </Alert>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: BORDER_RADIUS.card }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'action.hover' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Jméno</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Telefon</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Access Code</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>GDPR</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Marketing</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Registrace</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTesters.map((tester) => (
                    <TableRow
                      key={tester.id}
                      sx={{
                        '&:hover': { backgroundColor: 'action.hover' },
                      }}
                    >
                      {/* Name */}
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {tester.name}
                        </Typography>
                        {tester.reason && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: 'block',
                              mt: 0.5,
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {tester.reason}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Email */}
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Mail size={14} />
                          <Typography variant="body2">{tester.email}</Typography>
                        </Box>
                      </TableCell>

                      {/* Phone */}
                      <TableCell>
                        {tester.phone ? (
                          <Box display="flex" alignItems="center" gap={1}>
                            <Phone size={14} />
                            <Typography variant="body2">{tester.phone}</Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>

                      {/* Access Code */}
                      <TableCell>
                        <Chip
                          label={tester.access_code}
                          size="small"
                          sx={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            backgroundColor: 'primary.main',
                            color: 'white',
                          }}
                        />
                      </TableCell>

                      {/* GDPR Terms */}
                      <TableCell>
                        <Tooltip
                          title={
                            tester.terms_accepted
                              ? `Přijato: ${formatDate(tester.terms_accepted_date)}`
                              : 'Nepřijato'
                          }
                        >
                          <Box display="inline-flex">
                            {tester.terms_accepted ? (
                              <CheckCircle size={20} color="#4caf50" />
                            ) : (
                              <XCircle size={20} color="#f44336" />
                            )}
                          </Box>
                        </Tooltip>
                      </TableCell>

                      {/* Marketing Consent */}
                      <TableCell>
                        <Tooltip
                          title={
                            tester.marketing_consent
                              ? `Přijato: ${formatDate(tester.marketing_consent_date)}`
                              : 'Nepřijato'
                          }
                        >
                          <Box display="inline-flex">
                            {tester.marketing_consent ? (
                              <CheckCircle size={20} color="#4caf50" />
                            ) : (
                              <XCircle size={20} color="#9e9e9e" />
                            )}
                          </Box>
                        </Tooltip>
                      </TableCell>

                      {/* Created At */}
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Calendar size={14} />
                          <Typography variant="body2">{formatDate(tester.created_at)}</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TesterManagement;
