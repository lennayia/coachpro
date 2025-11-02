// MailerLite Classic API Integration (API v2)
// Docs: https://developers.mailerlite.com/v2/reference

const MAILERLITE_API_URL = 'https://api.mailerlite.com/api/v2';
const MAILERLITE_API_TOKEN = import.meta.env.VITE_MAILERLITE_API_TOKEN;

// Group ID for "CoachPro: Testování"
const COACHPRO_TESTING_GROUP_ID = '113093284';

/**
 * Add subscriber to MailerLite Classic (API v2)
 * @param {Object} subscriber - Subscriber data
 * @param {string} subscriber.email - Email address
 * @param {string} subscriber.name - Full name
 * @param {string} subscriber.phone - Phone number (optional)
 * @returns {Promise<Object>} - MailerLite subscriber object
 */
export const addSubscriberToMailerLite = async ({ email, name, phone }) => {
  if (!MAILERLITE_API_TOKEN) {
    console.warn('MailerLite API token not configured');
    return null;
  }

  try {
    // Split name into first and last (MailerLite expects separate fields)
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const payload = {
      email,
      name: firstName,
      fields: {
        last_name: lastName,
        phone: phone || '',
      },
      type: 'active', // active, unsubscribed, unconfirmed, bounced, junk
    };

    // API v2 uses group-specific endpoint
    const response = await fetch(`${MAILERLITE_API_URL}/groups/${COACHPRO_TESTING_GROUP_ID}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MailerLite-ApiKey': MAILERLITE_API_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('MailerLite API error:', error);
      throw new Error(error.error?.message || 'Failed to add subscriber to MailerLite');
    }

    const data = await response.json();
    console.log('✅ Subscriber added to MailerLite:', data.email);

    return data; // Returns subscriber object with id
  } catch (error) {
    console.error('Error adding subscriber to MailerLite:', error);
    throw error;
  }
};

/**
 * Get MailerLite groups (Classic API v2)
 * @returns {Promise<Array>} - Array of groups
 */
export const getMailerLiteGroups = async () => {
  if (!MAILERLITE_API_TOKEN) {
    console.warn('MailerLite API token not configured');
    return [];
  }

  try {
    const response = await fetch(`${MAILERLITE_API_URL}/groups`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-MailerLite-ApiKey': MAILERLITE_API_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch MailerLite groups');
    }

    const data = await response.json();
    return data; // API v2 returns array directly
  } catch (error) {
    console.error('Error fetching MailerLite groups:', error);
    return [];
  }
};

/**
 * Check if email exists in MailerLite (Classic API v2)
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} - True if exists
 */
export const checkEmailExistsInMailerLite = async (email) => {
  if (!MAILERLITE_API_TOKEN) {
    return false;
  }

  try {
    // API v2 uses search endpoint
    const response = await fetch(`${MAILERLITE_API_URL}/subscribers/search?query=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-MailerLite-ApiKey': MAILERLITE_API_TOKEN,
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking email in MailerLite:', error);
    return false;
  }
};

export default {
  addSubscriberToMailerLite,
  getMailerLiteGroups,
  checkEmailExistsInMailerLite,
};
