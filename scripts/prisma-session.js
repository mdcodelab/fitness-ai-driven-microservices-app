require('dotenv/config');
(async ()=>{
  try{
    const { PrismaClient } = require('@prisma/client');
    const adapterPkg = require('@prisma/adapter-pg');
    const PrismaPg = adapterPkg.PrismaPg ?? adapterPkg.default ?? adapterPkg;
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

    const res = await prisma.$queryRawUnsafe("SELECT current_schema(), current_database(), current_user();");
    console.log('prisma session:', res);
    await prisma.$disconnect();
    process.exit(0);
  }catch(e){
    console.error('prisma session failed:', e);
    process.exit(1);
  }
})();
