require('dotenv').config();
(async () => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const adapterPkg = require('@prisma/adapter-pg');
    const PrismaPg = adapterPkg.PrismaPg ?? adapterPkg.default ?? adapterPkg;
    const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

    await prisma.$connect();
    const users = await prisma.user.findMany();
    const toUpdate = users.filter(u => typeof u.password === 'string' && !u.password.startsWith('$'));
    console.log('Users needing hashing:', toUpdate.map(u => ({ id: u.id, email: u.email })));

    const argon2 = require('argon2');
    for (const u of toUpdate) {
      const hashed = await argon2.hash(u.password);
      await prisma.user.update({ where: { id: u.id }, data: { password: hashed } });
      console.log('Updated password for', u.email);
    }

    await prisma.$disconnect();
  } catch (e) {
    console.error(e && e.stack ? e.stack : e);
    process.exitCode = 1;
  }
})();
