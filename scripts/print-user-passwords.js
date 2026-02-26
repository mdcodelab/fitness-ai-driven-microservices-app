require('dotenv').config();
(async () => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const adapterPkg = require('@prisma/adapter-pg');
    const PrismaPg = adapterPkg.PrismaPg ?? adapterPkg.default ?? adapterPkg;
    const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
    await prisma.$connect();
    const users = await prisma.user.findMany({ select: { id: true, email: true, password: true } });
    for (const u of users) {
      console.log(u.email, 'passwordStartsWith$', typeof u.password === 'string' && u.password.startsWith('$'));
    }
    await prisma.$disconnect();
  } catch (e) {
    console.error(e && e.stack ? e.stack : e);
    process.exitCode = 1;
  }
})();
