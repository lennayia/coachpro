// Temporary script to list MailerLite groups and their IDs
// Run with: node list-mailerlite-groups.js

const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api';
const MAILERLITE_API_TOKEN = process.env.VITE_MAILERLITE_API_TOKEN;

async function listGroups() {
  if (!MAILERLITE_API_TOKEN) {
    console.error('❌ VITE_MAILERLITE_API_TOKEN not found in environment variables');
    console.log('💡 Run with: VITE_MAILERLITE_API_TOKEN=your-token node list-mailerlite-groups.js');
    process.exit(1);
  }

  try {
    const response = await fetch(`${MAILERLITE_API_URL}/groups`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const groups = data.data;

    console.log('\n📋 MailerLite Groups:\n');
    console.log('─'.repeat(80));

    groups.forEach(group => {
      console.log(`Name: ${group.name}`);
      console.log(`ID:   ${group.id}`);
      console.log(`Total subscribers: ${group.active_count}`);
      console.log('─'.repeat(80));
    });

    // Find CoachPro group
    const coachProGroup = groups.find(g => g.name.includes('CoachPro') || g.name.includes('Testování'));
    if (coachProGroup) {
      console.log('\n✅ Found CoachPro testing group:');
      console.log(`   Name: ${coachProGroup.name}`);
      console.log(`   ID:   ${coachProGroup.id}`);
      console.log('\n💡 Copy this ID and use it in TesterSignup.jsx');
    } else {
      console.log('\n⚠️  No group matching "CoachPro" or "Testování" found');
      console.log('💡 You may need to create this group in MailerLite dashboard first');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listGroups();
