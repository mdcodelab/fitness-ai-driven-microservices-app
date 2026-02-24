// Small script to verify Prisma can query the User table
require('dotenv/config');

(async () => {
  try {
    // Import generated Prisma client
    const { PrismaClient } = require('@prisma/client');

    // Load adapter factory and create an adapter instance (Prisma v7)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const adapterPkg = require('@prisma/adapter-pg');
    const PrismaPg = adapterPkg.PrismaPg ?? adapterPkg.default ?? adapterPkg;
  const adapterInstance = new PrismaPg({ connectionString: process.env.DATABASE_URL });

    const prisma = new PrismaClient({ adapter: adapterInstance });

    const users = await prisma.user.findMany({ take: 5 });
    console.log('Found users:', users);

    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('DB check failed:', err);
    process.exit(1);
  }
})();
