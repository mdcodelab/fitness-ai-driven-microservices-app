require('dotenv/config');
(async ()=>{
  try{
    const { PrismaClient } = require('@prisma/client');
    const adapterPkg = require('@prisma/adapter-pg');
    const PrismaPg = adapterPkg.PrismaPg ?? adapterPkg.default ?? adapterPkg;
  const adapterInstance = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    const prisma = new PrismaClient({ adapter: adapterInstance });

    const db = await prisma.$queryRawUnsafe("SELECT table_schema, table_name FROM information_schema.tables WHERE table_name = 'User';");
    console.log('prisma raw result:', db);
    await prisma.$disconnect();
    process.exit(0);
  }catch(e){
    console.error('prisma raw failed:', e);
    process.exit(1);
  }
})();
