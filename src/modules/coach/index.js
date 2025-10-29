/**
 * CoachPro Module Exports
 *
 * Tento soubor exportuje všechny potřebné součásti CoachPro modulu
 * pro integraci do ProApp.
 */

// Pages
export { default as CoachLogin } from './pages/Login';
export { default as CoachDashboard } from './pages/CoachDashboard';
export { default as ClientView } from './pages/ClientView';

// Utils
export * from './utils/storage';
export * from './utils/generateCode';
export * from './utils/linkDetection';
export * from '@shared/styles/animations';
export * from './utils/supabaseStorage';

// Routes configuration pro ProApp
export const coachRoutes = [
  {
    path: '/coach',
    element: 'CoachDashboard', // ProApp bude lazy loadovat
    children: [
      { path: 'dashboard', element: 'CoachDashboard' },
      { path: 'programs', element: 'CoachDashboard' },
      { path: 'materials', element: 'CoachDashboard' },
      { path: 'clients', element: 'CoachDashboard' },
    ]
  },
  {
    path: '/client',
    element: 'ClientView',
    children: [
      { path: 'entry', element: 'ClientView' },
      { path: 'daily', element: 'ClientView' },
    ]
  }
];
