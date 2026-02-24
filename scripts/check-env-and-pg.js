require('dotenv').config();
(async () => {
  try {
    console.log('process.env.DATABASE_URL:', process.env.DATABASE_URL);
    const { Client } = require('pg');
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const row = await client.query("select current_database() as db, current_user as user, current_schema() as schema");
    console.log('pg client result:', row.rows[0]);
    await client.end();
  } catch (e) {
    console.error('pg check failed:', e && e.stack ? e.stack : e);
    process.exitCode = 1;
  }
})();
