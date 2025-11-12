// @digipro/design-system/examples/PaymentsAppIntegration.jsx
// Example integration of DigiPro Design System with PaymentsApp

import React, { useState } from 'react';
import { 
  DigiProThemeProvider, 
  useDigiProTheme,
  Button,
  Card,
  CardWithActions,
  CompactCard,
  Typography,
  Container,
  Grid,
  Box,
  Chip,
  IconButton
} from '@digipro/design-system';

// Import icons (assuming Material Icons)
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as BankIcon,
  Settings as SettingsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';

// PaymentsApp Header with theme toggle
function PaymentsHeader() {
  const { mode, toggleMode } = useDigiProTheme();

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 4,
      p: 3,
      background: 'var(--surface)',
      borderRadius: 2,
      boxShadow: 1,
    }}>
      <Typography variant="h4" component="h1">
        PaymentsPro Dashboard
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button 
          variant="outlined" 
          startIcon={<AddIcon />}
          size="medium"
        >
          New Payment
        </Button>
        
        <IconButton 
          onClick={toggleMode}
          size="medium"
        >
          {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Box>
    </Box>
  );
}

// Dashboard Stats Cards
function DashboardStats() {
  const statsData = [
    {
      title: 'Total Revenue',
      value: '€127,543',
      change: '+12.5%',
      changeType: 'positive',
      icon: <TrendingUpIcon />,
    },
    {
      title: 'Pending Payments',
      value: '23',
      change: '-3 from yesterday',
      changeType: 'neutral',
      icon: <PaymentIcon />,
    },
    {
      title: 'Active Accounts',
      value: '8',
      change: '+2 this month',
      changeType: 'positive',
      icon: <BankIcon />,
    },
    {
      title: 'Overdue',
      value: '€2,340',
      change: 'Needs attention',
      changeType: 'negative',
      icon: <PaymentIcon color="error" />,
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statsData.map((stat, index) => (
        <Grid item xs={12} sm={6} lg={3} key={index}>
          <CompactCard
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            interactive
            elevation="md"
          />
        </Grid>
      ))}
    </Grid>
  );
}

// Payment Card Component (using DigiPro styling)
function PaymentCard({ payment }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card 
      elevation="md" 
      interactive
      sx={{ height: '100%' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" component="h3">
          {payment.title}
        </Typography>
        <Chip 
          label={payment.status}
          color={getStatusColor(payment.status)}
          size="small"
        />
      </Box>
      
      <Typography variant="h4" sx={{ mb: 1, color: 'primary.main' }}>
        €{payment.amount.toLocaleString()}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Due: {new Date(payment.dueDate).toLocaleDateString()}
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 3 }}>
        {payment.description}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <IconButton size="small">
          <EditIcon />
        </IconButton>
        <IconButton size="small" color="error">
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
}

// Recent Payments List
function RecentPayments() {
  const samplePayments = [
    {
      id: 1,
      title: 'Office Rent',
      amount: 2500,
      status: 'completed',
      dueDate: '2024-08-15',
      description: 'Monthly office space rental payment',
    },
    {
      id: 2,
      title: 'Software Licenses',
      amount: 890,
      status: 'pending',
      dueDate: '2024-09-01',
      description: 'Annual software licensing fees',
    },
    {
      id: 3,
      title: 'Utility Bills',
      amount: 450,
      status: 'overdue',
      dueDate: '2024-08-20',
      description: 'Electricity and water bills',
    },
    {
      id: 4,
      title: 'Marketing Campaign',
      amount: 3200,
      status: 'pending',
      dueDate: '2024-09-05',
      description: 'Q3 digital marketing campaign',
    },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Recent Payments
      </Typography>
      
      <Grid container spacing={3}>
        {samplePayments.map((payment) => (
          <Grid item xs={12} md={6} lg={4} key={payment.id}>
            <PaymentCard payment={payment} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// Settings Card with Glassmorphism
function SettingsCard() {
  return (
    <Card 
      glassmorphism 
      elevation="lg"
      sx={{ mt: 4 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SettingsIcon sx={{ mr: 2, color: 'primary.main' }} />
        <Typography variant="h6">
          Quick Settings
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This card demonstrates glassmorphism effect from the DigiPro design system.
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="outlined" size="small">
          Currency Settings
        </Button>
        <Button variant="outlined" size="small">
          Notifications
        </Button>
        <Button variant="outlined" size="small">
          Export Data
        </Button>
      </Box>
    </Card>
  );
}

// Main PaymentsApp Component
function PaymentsAppDemo() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PaymentsHeader />
      <DashboardStats />
      <RecentPayments />
      <SettingsCard />
    </Container>
  );
}

// App wrapper with theme provider
function IntegratedPaymentsApp() {
  return (
    <DigiProThemeProvider 
      initialMode="light" 
      enableSystemTheme
    >
      <PaymentsAppDemo />
    </DigiProThemeProvider>
  );
}

export default IntegratedPaymentsApp;

// Usage instructions:
/*

1. Install the design system:
   npm install @digipro/design-system

2. Update your main App.jsx:
   
   import { DigiProThemeProvider } from '@digipro/design-system';
   import YourExistingPaymentsApp from './PaymentsApp';

   function App() {
     return (
       <DigiProThemeProvider initialMode="light" enableSystemTheme>
         <YourExistingPaymentsApp />
       </DigiProThemeProvider>
     );
   }

3. Gradually replace components:
   
   // Before:
   import { Card, Button } from '@mui/material';
   
   // After:
   import { Card, Button } from '@digipro/design-system';

4. Benefits you get:
   - Unified styling across DigiPro and PaymentsPro
   - Automatic dark/light mode switching
   - Glassmorphism effects
   - Enhanced hover states and interactions
   - Consistent spacing and typography
   - CSS variables for custom styling

*/