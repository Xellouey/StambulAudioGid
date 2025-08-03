const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'dagestan_audio_guide',
  user: 'strapi_user',
  password: 'strapi_password',
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Successfully connected to PostgreSQL database!');

    // Test a simple query
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database query successful:', result.rows[0]);

    await client.end();
    console.log('✅ Database connection test completed successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
