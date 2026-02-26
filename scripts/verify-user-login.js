require('dotenv').config();
(async () => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const adapterPkg = require('@prisma/adapter-pg');
    const PrismaPg = adapterPkg.PrismaPg ?? adapterPkg.default ?? adapterPkg;
    const argon2 = require('argon2');
    const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
    await prisma.$connect();
    const user = await prisma.user.findUnique({ where: { email: 'guest@example.com' } });
    console.log('found user:', user ? user.email : 'not found');
    if (!user) process.exit(1);
    const ok = await argon2.verify(user.password, 'secret');
    console.log('verify result for plain "secret":', ok);
    await prisma.$disconnect();
  } catch (e) {
    console.error(e && e.stack ? e.stack : e);
    process.exitCode = 1;
  }
})();
