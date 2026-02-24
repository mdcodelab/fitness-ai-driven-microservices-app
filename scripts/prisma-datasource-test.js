require('dotenv').config();
(async () => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });
    const res = await prisma.$queryRawUnsafe("SELECT current_database() as db, current_user as user, current_schema() as schema, current_setting('search_path') as search_path;");
    console.log('prisma (datasources override) result:', res);
    await prisma.$disconnect();
  } catch (e) {
    console.error('prisma datasources test failed:', e && e.stack ? e.stack : e);
    process.exitCode = 1;
  }
})();
