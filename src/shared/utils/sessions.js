/**
 * sessions.js - Session management utilities
 *
 * Modular functions for working with coaching sessions
 * Used across: Client dashboard, Coach dashboard, Session management, etc.
 *
 * Features:
 * - Fetch sessions from database
 * - Calculate time until session
 * - Format session details
 * - Session status helpers
 */

import { supabase } from '@shared/config/supabase';
import { formatDistanceToNow, format, isBefore, isAfter, addMinutes } from 'date-fns';
import { cs } from 'date-fns/locale';

/**
 * Fetch next scheduled session for a client
 *
 * @param {string} clientId - Client profile ID
 * @returns {Promise<Object|null>} - Next session with coach details, or null
 */
export const getNextSession = async (clientId) => {
  try {
    const { data, error } = await supabase
      .from('coachpro_sessions')
      .select('*')
      .eq('client_id', clientId)
      .eq('status', 'scheduled')
      .gte('session_date', new Date().toISOString())
      .order('session_date', { ascending: true })
      .limit(1);

    if (error) throw error;

    // No sessions found
    if (!data || data.length === 0) {
      return null;
    }

    const session = data[0];

    // Fetch coach details separately if coach_id exists
    if (session && session.coach_id) {
      const { data: coachData, error: coachError } = await supabase
        .from('coachpro_coaches')
        .select('id, name, email, phone')
        .eq('id', session.coach_id)
        .maybeSingle();

      if (!coachError && coachData) {
        session.coach = coachData;
      }
    }

    return session;
  } catch (err) {
    console.error('sessions.getNextSession error:', err);
    return null;
  }
};

/**
 * Fetch all sessions for a client
 *
 * @param {string} clientId - Client profile ID
 * @param {Object} options - Query options
 * @param {string} options.status - Filter by status (optional)
 * @param {boolean} options.upcoming - Only future sessions (default: false)
 * @param {boolean} options.past - Only past sessions (default: false)
 * @returns {Promise<Array>} - Array of sessions with coach details
 */
export const getClientSessions = async (clientId, options = {}) => {
  const { status, upcoming = false, past = false } = options;

  try {
    let query = supabase
      .from('coachpro_sessions')
      .select('*')
      .eq('client_id', clientId);

    // Filter by status
    if (status) {
      query = query.eq('status', status);
    }

    // Filter by time
    if (upcoming) {
      query = query.gte('session_date', new Date().toISOString());
    } else if (past) {
      query = query.lt('session_date', new Date().toISOString());
    }

    // Order by date (newest first for past, soonest first for upcoming)
    query = query.order('session_date', { ascending: upcoming });

    const { data, error } = await query;

    if (error) throw error;

    if (!data || data.length === 0) return [];

    // Fetch coach details for all sessions
    const coachIds = [...new Set(data.map(s => s.coach_id).filter(Boolean))];

    if (coachIds.length > 0) {
      const { data: coaches, error: coachError } = await supabase
        .from('coachpro_coaches')
        .select('id, name, email, phone')
        .in('id', coachIds);

      if (!coachError && coaches) {
        // Map coaches to sessions
        const coachMap = {};
        coaches.forEach(coach => {
          coachMap[coach.id] = coach;
        });

        data.forEach(session => {
          if (session.coach_id && coachMap[session.coach_id]) {
            session.coach = coachMap[session.coach_id];
          }
        });
      }
    }

    return data;
  } catch (err) {
    console.error('sessions.getClientSessions error:', err);
    return [];
  }
};

/**
 * Fetch all sessions for a coach
 *
 * @param {string} coachId - Coach ID
 * @param {Object} options - Query options (same as getClientSessions)
 * @returns {Promise<Array>} - Array of sessions with client details
 */
export const getCoachSessions = async (coachId, options = {}) => {
  const { status, upcoming = false, past = false } = options;

  try {
    let query = supabase
      .from('coachpro_sessions')
      .select('*')
      .eq('coach_id', coachId);

    // Filter by status
    if (status) {
      query = query.eq('status', status);
    }

    // Filter by time
    if (upcoming) {
      query = query.gte('session_date', new Date().toISOString());
    } else if (past) {
      query = query.lt('session_date', new Date().toISOString());
    }

    // Order by date
    query = query.order('session_date', { ascending: upcoming });

    const { data, error } = await query;

    if (error) throw error;

    if (!data || data.length === 0) return [];

    // Fetch client details for all sessions
    const clientIds = [...new Set(data.map(s => s.client_id).filter(Boolean))];

    if (clientIds.length > 0) {
      const { data: clients, error: clientError } = await supabase
        .from('coachpro_client_profiles')
        .select('id, name, email, phone, photo_url')
        .in('id', clientIds);

      if (!clientError && clients) {
        // Map clients to sessions
        const clientMap = {};
        clients.forEach(client => {
          clientMap[client.id] = client;
        });

        data.forEach(session => {
          if (session.client_id && clientMap[session.client_id]) {
            session.client = clientMap[session.client_id];
          }
        });
      }
    }

    return data;
  } catch (err) {
    console.error('sessions.getCoachSessions error:', err);
    return [];
  }
};

/**
 * Calculate time until session
 *
 * @param {string|Date} sessionDate - Session date
 * @returns {string} - Human-readable time (e.g., "za 2 dny", "za 3 hodiny")
 */
export const getTimeUntilSession = (sessionDate) => {
  try {
    return formatDistanceToNow(new Date(sessionDate), {
      addSuffix: true,
      locale: cs,
    });
  } catch (err) {
    console.error('sessions.getTimeUntilSession error:', err);
    return '';
  }
};

/**
 * Format session date for display
 *
 * @param {string|Date} sessionDate - Session date
 * @param {string} formatStr - Date format (default: 'PPPp')
 * @returns {string} - Formatted date
 */
export const formatSessionDate = (sessionDate, formatStr = 'PPPp') => {
  try {
    return format(new Date(sessionDate), formatStr, { locale: cs });
  } catch (err) {
    console.error('sessions.formatSessionDate error:', err);
    return '';
  }
};

/**
 * Check if session is happening now
 *
 * @param {Object} session - Session object with session_date and duration_minutes
 * @returns {boolean} - True if session is happening now
 */
export const isSessionNow = (session) => {
  const now = new Date();
  const sessionStart = new Date(session.session_date);
  const sessionEnd = addMinutes(sessionStart, session.duration_minutes || 60);

  return isAfter(now, sessionStart) && isBefore(now, sessionEnd);
};

/**
 * Check if session is in the past
 *
 * @param {string|Date} sessionDate - Session date
 * @returns {boolean} - True if session is in the past
 */
export const isSessionPast = (sessionDate) => {
  return isBefore(new Date(sessionDate), new Date());
};

/**
 * Get session status label
 *
 * @param {string} status - Session status (scheduled/completed/cancelled/rescheduled)
 * @returns {Object} - { label: string, color: string }
 */
export const getSessionStatusLabel = (status) => {
  const statusMap = {
    scheduled: { label: 'Naplánováno', color: 'primary' },
    completed: { label: 'Dokončeno', color: 'success' },
    cancelled: { label: 'Zrušeno', color: 'error' },
    rescheduled: { label: 'Přesunuto', color: 'warning' },
  };

  return statusMap[status] || { label: status, color: 'default' };
};

/**
 * Get session location label
 *
 * @param {string} location - Session location (online/in-person/phone)
 * @returns {Object} - { label: string, icon: string }
 */
export const getSessionLocationLabel = (location) => {
  const locationMap = {
    online: { label: 'Online', icon: 'Video' },
    'in-person': { label: 'Osobně', icon: 'MapPin' },
    phone: { label: 'Telefon', icon: 'Phone' },
  };

  return locationMap[location] || { label: location, icon: 'Calendar' };
};

/**
 * Create a new session
 *
 * @param {Object} sessionData - Session data
 * @param {string} sessionData.client_id - Client profile ID
 * @param {string} sessionData.coach_id - Coach ID
 * @param {string} sessionData.session_date - Session date (ISO string)
 * @param {number} sessionData.duration_minutes - Duration in minutes (default: 60)
 * @param {string} sessionData.location - Location (online/in-person/phone)
 * @param {string} sessionData.coach_notes - Coach notes (optional)
 * @param {string} sessionData.created_by - Who created it (coach/client)
 * @returns {Promise<Object>} - Created session
 */
export const createSession = async (sessionData) => {
  try {
    const { data, error } = await supabase
      .from('coachpro_sessions')
      .insert({
        client_id: sessionData.client_id,
        coach_id: sessionData.coach_id,
        session_date: sessionData.session_date,
        duration_minutes: sessionData.duration_minutes || 60,
        location: sessionData.location || 'online',
        status: 'scheduled',
        coach_notes: sessionData.coach_notes || '',
        created_by: sessionData.created_by || 'coach',
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (err) {
    console.error('sessions.createSession error:', err);
    throw err;
  }
};

/**
 * Update session
 *
 * @param {string} sessionId - Session ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} - Updated session
 */
export const updateSession = async (sessionId, updates) => {
  try {
    const { data, error } = await supabase
      .from('coachpro_sessions')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (err) {
    console.error('sessions.updateSession error:', err);
    throw err;
  }
};

/**
 * Cancel session
 *
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} - Updated session
 */
export const cancelSession = async (sessionId) => {
  return await updateSession(sessionId, { status: 'cancelled' });
};

/**
 * Complete session
 *
 * @param {string} sessionId - Session ID
 * @param {string} sessionSummary - Session summary (optional)
 * @returns {Promise<Object>} - Updated session
 */
export const completeSession = async (sessionId, sessionSummary = '') => {
  return await updateSession(sessionId, {
    status: 'completed',
    session_summary: sessionSummary,
  });
};
