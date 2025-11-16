/**
 * Google Calendar API Integration
 *
 * @created 16.11.2025
 * @purpose Sync calendar events to create sessions automatically
 */

import { supabase } from '@shared/config/supabase';

/**
 * Fetch events from Google Calendar
 * @param {string} accessToken - Google OAuth access token
 * @param {Object} options - Query options
 * @param {string} options.timeMin - Start time (ISO 8601)
 * @param {string} options.timeMax - End time (ISO 8601)
 * @param {number} options.maxResults - Max number of events (default: 50)
 * @returns {Promise<Array>} Calendar events
 */
export async function fetchGoogleCalendarEvents(accessToken, options = {}) {
  const {
    timeMin = new Date().toISOString(), // From now
    timeMax = null, // No end limit
    maxResults = 50,
  } = options;

  try {
    const params = new URLSearchParams({
      timeMin,
      maxResults: maxResults.toString(),
      singleEvents: 'true',
      orderBy: 'startTime',
    });

    if (timeMax) {
      params.append('timeMax', timeMax);
    }

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Google Calendar API error: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    throw error;
  }
}

/**
 * Parse Google Calendar event to session format
 * @param {Object} event - Google Calendar event
 * @param {string} coachId - Coach ID
 * @returns {Object|null} Parsed session data or null if invalid
 */
export function parseCalendarEventToSession(event, coachId) {
  // Skip all-day events
  if (!event.start?.dateTime) {
    return null;
  }

  // Extract event details
  const startDateTime = new Date(event.start.dateTime);
  const endDateTime = new Date(event.end.dateTime);

  // Calculate duration in minutes
  const durationMs = endDateTime - startDateTime;
  const durationMinutes = Math.round(durationMs / 60000);

  // Extract session details from event
  const title = event.summary || 'Sezení';
  const description = event.description || '';
  const location = event.location || '';

  // Try to extract client email from attendees or description
  let clientEmail = null;
  if (event.attendees && event.attendees.length > 0) {
    // Find first attendee that's not the organizer
    const attendee = event.attendees.find(a => !a.organizer);
    if (attendee) {
      clientEmail = attendee.email;
    }
  }

  // Session type based on location
  let sessionType = 'online';
  const locationLower = location.toLowerCase();
  if (locationLower.includes('zoom') || locationLower.includes('meet') || locationLower.includes('teams')) {
    sessionType = 'online';
  } else if (location && location.trim()) {
    sessionType = 'in-person';
  }

  return {
    coach_id: coachId,
    session_date: startDateTime.toISOString().split('T')[0], // YYYY-MM-DD
    session_time: startDateTime.toTimeString().slice(0, 5), // HH:MM
    duration: durationMinutes,
    title,
    description,
    location: location || (sessionType === 'online' ? 'Online' : null),
    session_type: sessionType,
    status: 'scheduled',
    client_email: clientEmail,
    google_event_id: event.id, // Store for future reference
    created_at: new Date().toISOString(),
  };
}

/**
 * Sync Google Calendar events to coachpro_sessions
 * @param {string} accessToken - Google OAuth access token
 * @param {string} coachId - Coach ID
 * @param {Object} options - Sync options
 * @returns {Promise<Object>} Sync results { created, skipped, errors }
 */
export async function syncGoogleCalendarToSessions(accessToken, coachId, options = {}) {
  const results = {
    created: 0,
    skipped: 0,
    errors: [],
  };

  try {
    // Fetch events from Google Calendar
    const events = await fetchGoogleCalendarEvents(accessToken, options);

    console.log(`📅 Fetched ${events.length} events from Google Calendar`);

    // Get existing sessions to avoid duplicates
    const { data: existingSessions, error: fetchError } = await supabase
      .from('coachpro_sessions')
      .select('google_event_id')
      .eq('coach_id', coachId)
      .not('google_event_id', 'is', null);

    if (fetchError) {
      throw fetchError;
    }

    const existingEventIds = new Set(
      (existingSessions || []).map(s => s.google_event_id)
    );

    // Process each event
    for (const event of events) {
      try {
        // Skip if already synced
        if (existingEventIds.has(event.id)) {
          results.skipped++;
          continue;
        }

        // Parse event to session
        const sessionData = parseCalendarEventToSession(event, coachId);

        if (!sessionData) {
          results.skipped++;
          continue;
        }

        // Create session in database
        const { error: insertError } = await supabase
          .from('coachpro_sessions')
          .insert(sessionData);

        if (insertError) {
          console.error('Error inserting session:', insertError);
          results.errors.push({
            event: event.summary,
            error: insertError.message,
          });
        } else {
          results.created++;
          console.log(`✅ Created session: ${sessionData.title} on ${sessionData.session_date}`);
        }
      } catch (err) {
        console.error('Error processing event:', err);
        results.errors.push({
          event: event.summary || 'Unknown',
          error: err.message,
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error syncing Google Calendar:', error);
    throw error;
  }
}
