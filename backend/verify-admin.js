const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'dagestan_audio_guide',
  user: 'strapi_user',
  password: 'strapi_password',
});

async function verifyAdmin() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL database');

    // Check if admin_users table exists and has records
    const result = await client.query(
      'SELECT id, firstname, lastname, email, created_at FROM admin_users LIMIT 5'
    );

    if (result.rows.length > 0) {
      console.log('✅ Admin account(s) found:');
      result.rows.forEach((admin, index) => {
        console.log(
          `   ${index + 1}. ${admin.firstname} ${admin.lastname} (${admin.email}) - Created: ${admin.created_at}`
        );
      });
    } else {
      console.log('❌ No admin accounts found');
    }

    await client.end();
  } catch (error) {
    console.error('❌ Error checking admin accounts:', error.message);
    process.exit(1);
  }
}

verifyAdmin();
