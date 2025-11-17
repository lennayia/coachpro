// Context providers for @proapp/shared

// Notification system (fully universal)
export * from './NotificationContext.jsx';

// Auth context factory (parametrizable for all modules)
export { createAuthContext } from './GenericAuthContext.jsx';
export { createClientAuthContext } from './ClientAuthContext.jsx';
export { createTesterAuthContext } from './TesterAuthContext.jsx';

/**
 * Usage in modules:
 *
 * // CoachPro:
 * import { supabase } from '@/config/supabase';
 * import { createClientAuthContext, createTesterAuthContext } from '@proapp/shared/context';
 *
 * const { ClientAuthProvider, useClientAuth } = createClientAuthContext({
 *   supabaseClient: supabase,
 *   tableName: 'coachpro_client_profiles',
 *   onLogout: clearCurrentUser
 * });
 *
 * // ContentPro:
 * import { supabase } from '@/config/supabase';
 * import { createClientAuthContext } from '@proapp/shared/context';
 *
 * const { ClientAuthProvider, useClientAuth } = createClientAuthContext({
 *   supabaseClient: supabase,
 *   tableName: 'contentpro_user_profiles',
 * });
 */
