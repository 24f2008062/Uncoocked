import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Demo/mock events were removed. The app relies on real database events,
  // so there is nothing to seed here. Add real event seeding when needed.
  console.log('No seed data configured. The app uses real database events.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
