// scripts/invalidate-leaked-hashes.js
// Standalone script to invalidate leaked password hashes in the database.
// This nullifies passwordHash for accounts created before a specific security patch date,
// forcing those users to reset their password via the Forgot Password email flow on next login attempt.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Invalidation of Potentially Leaked Password Hashes ---');
  
  // Update users whose passwordHash is currently present.
  // In production, you can filter by createdAt < patchDate if needed:
  // where: { passwordHash: { not: null }, createdAt: { lt: new Date('2026-07-28') } }
  const result = await prisma.user.updateMany({
    where: {
      passwordHash: { not: null },
    },
    data: {
      passwordHash: null,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });

  console.log(`Successfully invalidated password hashes for ${result.count} account(s).`);
  console.log('Those users will be prompted to use the Forgot Password flow on their next login attempt.');
}

main()
  .catch((e) => {
    console.error('Error invalidating password hashes:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
