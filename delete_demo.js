require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Use direct URL for one-off scripts to avoid pooler timeouts
process.env.DATABASE_URL = process.env.POSTGRES_URL_NON_POOLING;

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.deleteMany({
    where: { email: "demo@quizzify.local" }
  });
  console.log("Deleted count:", result.count);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
