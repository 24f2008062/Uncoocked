import { PrismaClient } from '@prisma/client';
import { mockEvents } from '../lib/mockData.js';

const prisma = new PrismaClient();

// Map the canonical mock event shape (lib/mockData.js) to the Prisma Event model.
function toEventCreate(mock, organizerId) {
  return {
    id: mock.id,
    title: mock.title,
    type: mock.type,
    category: mock.category,
    date: new Date(mock.dateISO),
    location: mock.location,
    zone: mock.zone,
    city: mock.city,
    state: mock.state,
    country: mock.country,
    description: mock.description,
    schedule: mock.schedule,
    prizePool: mock.prizePool,
    bannerUrl: mock.bannerUrl,
    tags: JSON.stringify(mock.tags || []),
    keywords: JSON.stringify(mock.keywords || []),
    popularityScore: mock.popularityScore || 0,
    ticketType: mock.ticketType || "Free",
    price: mock.price ? parseFloat(mock.price) : 0,
    capacity: mock.capacity || 100,
    waitlistEnabled: mock.waitlistEnabled ?? true,
    status: mock.status || "Active",
    archived: mock.archived ?? false,
    organizerId,
  };
}

async function main() {
  console.log('Seeding events...');

  console.log('Seeding users...');
  
  // Seed a demo user for testing and give them the Organizer role
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@campus.edu' },
    update: { role: 'Organizer' },
    create: {
      email: 'demo@campus.edu',
      passwordHash: 'dummyhash',
      fullName: 'Demo Student',
      role: 'Organizer',
      interests: JSON.stringify(['AI & Machine Learning', 'Programming']),
      onboardingCompleted: true
    }
  });

  for (const mock of mockEvents) {
    const eventData = toEventCreate(mock, demoUser.id);
    await prisma.event.upsert({
      where: { id: eventData.id },
      update: eventData,
      create: eventData,
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
