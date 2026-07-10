const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const evs = await p.event.findMany({ select: { id: true, title: true, description: true, prizePool: true } });
  for (const e of evs) {
    console.log('ID:', e.id);
    console.log('  DESC :', (e.description || '').slice(0, 70).replace(/\n/g, ' '));
    console.log('  PRIZE:', (e.prizePool || 'NULL').slice(0, 70).replace(/\n/g, ' '));
  }
  await p.$disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
