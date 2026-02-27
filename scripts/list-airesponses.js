// Load .env so DATABASE_URL is available when running this script directly
require('dotenv/config');

// Construct PrismaClient with the same Postgres adapter the app uses so the
// standalone script can connect the same way the running Nest app does.
const { PrismaClient } = require('@prisma/client');
// Load the official Postgres adapter factory (ESM/CJS interop safe)
const adapterPkg = require('@prisma/adapter-pg');
const PrismaPg = adapterPkg.PrismaPg ?? adapterPkg.default ?? adapterPkg;

(async () => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const p = new PrismaClient({ adapter });
  try {
    const rows = await p.aIResponse.findMany();
    console.log(JSON.stringify(rows, null, 2));
  } catch (e) {
    console.error('ERR', e);
  } finally {
    await p.$disconnect();
  }
})();
