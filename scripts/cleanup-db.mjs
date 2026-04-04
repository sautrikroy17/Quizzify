// One-time cleanup script — delete offensive/test users from the DB
// Run with: node scripts/cleanup-db.mjs

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete the abusive/test user permanently from DB
  const deleted = await prisma.user.deleteMany({
    where: {
      name: {
        contains: 'chutia',
        mode: 'insensitive',
      },
    },
  });
  console.log(`✅ Deleted ${deleted.count} offensive user(s) from database.`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
