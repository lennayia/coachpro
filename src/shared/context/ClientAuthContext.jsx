import { createAuthContext } from './GenericAuthContext';

// Create Client Auth Context
const { AuthContext: ClientAuthContext, useAuth: useClientAuth, AuthProvider: ClientAuthProvider } = createAuthContext({
  contextName: 'ClientAuth',
  tableName: 'coachpro_client_profiles',
  allowMissing: false, // Throws error if not found (single)
  onProfileLoaded: null, // No special callback for clients
});

export { useClientAuth, ClientAuthProvider };
export default ClientAuthContext;
