import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search,
  Users,
  CheckCircle2,
  Activity,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { getCurrentUser } from '../../utils/storage';
import { getClientsByCoachId, getPrograms, getProgramById } from '../../utils/storage';
import ClientCard from './ClientCard';
import BORDER_RADIUS from '@styles/borderRadius';

/**
 * ClientsList - Stránka se seznamem klientek kouče
 *
 * Features:
 * - Search (jméno klientky, program)
 * - Filtry (status, program)
 * - Statistiky (celkem, aktivní, dokončené)
 * - Grid layout s ClientCard komponentami
 * - Empty state
 */
const ClientsList = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery('(max-width:600px)');

  const currentUser = getCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, completed, new
  const [filterProgram, setFilterProgram] = useState('all');

  // Load data
  const clients = currentUser ? getClientsByCoachId(currentUser.id) : [];
  const programs = currentUser ? getPrograms(currentUser.id) : [];

  // Enrich clients with program data
  const enrichedClients = useMemo(() => {
    return clients.map((client) => {
      const program = getProgramById(client.programId);
      return {
        ...client,
        program,
      };
    });
  }, [clients]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = enrichedClients.length;
    const active = enrichedClients.filter((c) => {
      const completed = c.completedDays?.length || 0;
      const programDays = c.program?.duration || 0;
      return completed > 0 && completed < programDays;
    }).length;
    const completed = enrichedClients.filter((c) => {
      const completed = c.completedDays?.length || 0;
      const programDays = c.program?.duration || 0;
      return completed === programDays && programDays > 0;
    }).length;
    const newClients = enrichedClients.filter((c) => {
      const completed = c.completedDays?.length || 0;
      return completed === 0;
    }).length;

    return { total, active, completed, new: newClients };
  }, [enrichedClients]);

  // Filter & Search
  const filteredClients = useMemo(() => {
    let result = enrichedClients;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((c) => {
        const name = c.name?.toLowerCase() || '';
        const email = c.email?.toLowerCase() || '';
        const programTitle = c.program?.title?.toLowerCase() || '';
        return name.includes(query) || email.includes(query) || programTitle.includes(query);
      });
    }

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter((c) => {
        const completed = c.completedDays?.length || 0;
        const programDays = c.program?.duration || 0;

        if (filterStatus === 'active') {
          return completed > 0 && completed < programDays;
        }
        if (filterStatus === 'completed') {
          return completed === programDays && programDays > 0;
        }
        if (filterStatus === 'new') {
          return completed === 0;
        }
        return true;
      });
    }

    // Program filter
    if (filterProgram !== 'all') {
      result = result.filter((c) => c.programId === filterProgram);
    }

    return result;
  }, [enrichedClients, searchQuery, filterStatus, filterProgram]);

  // Empty state
  if (clients.length === 0) {
    return (
      <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 }, py: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Moje klientky
        </Typography>

        <Card
          sx={{
            mt: 4,
            borderRadius: BORDER_RADIUS.card,
            textAlign: 'center',
            py: 8,
            border: '1px solid',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          }}
        >
          <CardContent>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: isDark
                  ? 'rgba(139, 188, 143, 0.1)'
                  : 'rgba(85, 107, 47, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 3,
              }}
            >
              <Users size={40} color={theme.palette.primary.main} />
            </Box>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Zatím žádné klientky
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Když se klientka přihlásí pomocí kódu tvého programu, zobrazí se zde.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sdílej své programy pomocí QR kódu nebo 6místného kódu z sekce "Programy".
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 }, py: 3 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Moje klientky
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Přehled všech tvých klientek a jejich postupu v programech
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} mb={4}>
        <Grid item xs={6} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: BORDER_RADIUS.card,
              border: '1px solid',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: isDark
                    ? 'rgba(139, 188, 143, 0.15)'
                    : 'rgba(85, 107, 47, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                }}
              >
                <Users size={24} color={theme.palette.primary.main} />
              </Box>
              <Typography variant="h4" fontWeight={700} color="primary">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Celkem
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: BORDER_RADIUS.card,
              border: '1px solid',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: isDark
                    ? 'rgba(139, 188, 143, 0.15)'
                    : 'rgba(85, 107, 47, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                }}
              >
                <Activity size={24} color={theme.palette.primary.main} />
              </Box>
              <Typography variant="h4" fontWeight={700} color="primary">
                {stats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aktivní
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: BORDER_RADIUS.card,
              border: '1px solid',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: isDark
                    ? 'rgba(34, 139, 34, 0.15)'
                    : 'rgba(34, 139, 34, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                }}
              >
                <CheckCircle2 size={24} color={theme.palette.success.main} />
              </Box>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {stats.completed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dokončeno
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: BORDER_RADIUS.card,
              border: '1px solid',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: isDark
                    ? 'rgba(100, 149, 237, 0.15)'
                    : 'rgba(100, 149, 237, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                }}
              >
                <Clock size={24} color={theme.palette.info.main} />
              </Box>
              <Typography variant="h4" fontWeight={700} color="info.main">
                {stats.new}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nové
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search & Filters */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={2}
        mb={4}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: BORDER_RADIUS.card,
          backgroundColor: isDark
            ? 'rgba(255, 255, 255, 0.03)'
            : 'rgba(0, 0, 0, 0.02)',
          border: '1px solid',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Hledat podle jména, e-mailu nebo programu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color={theme.palette.text.secondary} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: BORDER_RADIUS.compact,
            },
          }}
        />

        {/* Status Filter */}
        <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Status"
            sx={{ borderRadius: BORDER_RADIUS.compact }}
          >
            <MenuItem value="all">Všechny</MenuItem>
            <MenuItem value="active">Aktivní</MenuItem>
            <MenuItem value="completed">Dokončené</MenuItem>
            <MenuItem value="new">Nové</MenuItem>
          </Select>
        </FormControl>

        {/* Program Filter */}
        <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
          <InputLabel>Program</InputLabel>
          <Select
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            label="Program"
            sx={{ borderRadius: BORDER_RADIUS.compact }}
          >
            <MenuItem value="all">Všechny programy</MenuItem>
            {programs.map((program) => (
              <MenuItem key={program.id} value={program.id}>
                {program.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Results count */}
      <Box mb={2}>
        <Typography variant="body2" color="text.secondary">
          Zobrazeno {filteredClients.length} z {clients.length} klientek
        </Typography>
      </Box>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <Card
          sx={{
            borderRadius: BORDER_RADIUS.card,
            textAlign: 'center',
            py: 6,
            border: '1px solid',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Žádné výsledky
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Zkus změnit filtry nebo vyhledávací dotaz
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
          {filteredClients.map((client) => (
            <Grid item xs={12} sm={6} md={4} key={client.id}>
              <ClientCard client={client} program={client.program} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ClientsList;
