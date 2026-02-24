// scripts/prisma-searchpath.js
require('dotenv').config();
(async () => {
  try {
    const { PrismaClient } = require('@prisma/client');
    // adapter export may be default or named
    const adapterPkg = require('@prisma/adapter-pg');
  const PrismaPg = adapterPkg.PrismaPg ?? adapterPkg.default ?? adapterPkg;

  // Use connectionString so the adapter's pg.Pool connects to Neon as intended
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

    const res = await prisma.$queryRawUnsafe(
      "SELECT current_setting('search_path') as search_path, current_schema() as current_schema, current_database() as current_database, current_user as current_user;"
    );

    console.log('prisma raw result:', res);
    await prisma.$disconnect();
  } catch (e) {
    console.error('prisma check failed:');
    console.error(e && e.stack ? e.stack : e);
    process.exitCode = 1;
  }
})();
