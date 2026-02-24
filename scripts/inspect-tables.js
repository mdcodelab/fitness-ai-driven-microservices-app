require('dotenv/config');
const { Client } = require('pg');

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query("SELECT table_schema, table_name FROM information_schema.tables WHERE table_name ILIKE '%user%' OR table_name ILIKE '%activity%' OR table_name ILIKE '%airesponse%';");
    console.log('tables:', res.rows);
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('pg query failed:', err);
    try { await client.end(); } catch(e){}
    process.exit(1);
  }
})();
