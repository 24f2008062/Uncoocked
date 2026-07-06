import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ datasourceUrl: "file:../dev.db" });

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

  // Ensure mock events have appropriate categories and tags for the recommendation engine
  const mockEvents = [
    {
      id: "cultural-fest",
      bannerUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=60",
      title: "Annual Cultural Fest 2026",
      type: "Fest",
      category: "Cultural Events",
      tags: JSON.stringify(["dance", "music", "fashion", "drama"]),
      keywords: JSON.stringify(["cultural", "fest", "bands", "show"]),
      popularityScore: 85,
      date: new Date("2026-06-20T09:00:00Z"),
      location: "Main Campus Arena",
      description: "Inter-college cultural showcase. Compete in street plays, battle of bands, classical dance, and fashion shows.",
      schedule: "## Day 1\n- 9:00 AM Registration\n- 6:00 PM Classical Music Solos",
      prizePool: "$20,000 + Trophies",
      ticketType: "Paid",
      price: 49.99,
      capacity: 2000,
      waitlistEnabled: true,
    },
    {
      id: "freshers-party",
      bannerUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=60",
      title: "Campus Freshers Welcome Party",
      type: "Party",
      category: "Entertainment",
      tags: JSON.stringify(["party", "music", "social", "freshers"]),
      keywords: JSON.stringify(["mixer", "welcome", "dj", "fun"]),
      popularityScore: 90,
      date: new Date("2026-07-15T17:00:00Z"),
      location: "Campus Green Lawn",
      description: "Join us for the official welcome mixer for incoming freshers. Live music, food courts, and network games.",
      schedule: "## Day 1\n- 5:00 PM Entry",
      prizePool: "$1,000 Vouchers",
      ticketType: "Free",
      price: 0,
      capacity: 1500,
      waitlistEnabled: false,
    },
    {
      id: "dandiya-night",
      bannerUrl: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=60",
      title: "Grand Dandiya Festive Night 2026",
      type: "Festive Night",
      category: "Cultural Events",
      tags: JSON.stringify(["dance", "traditional", "festival", "music"]),
      keywords: JSON.stringify(["garba", "dandiya", "festive", "gujarati"]),
      popularityScore: 70,
      date: new Date("2026-10-12T18:00:00Z"),
      location: "Auditorium Hall, Main Campus",
      description: "Celebrate the festive season with traditional Garba, live orchestra, authentic food stalls, and prizes.",
      schedule: "## Schedule\n- 6:00 PM Entry",
      prizePool: "$1,000 Vouchers",
      ticketType: "Paid",
      price: 15.0,
      capacity: 500,
      waitlistEnabled: true,
    },
    {
      id: "ai-workshop",
      bannerUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=60",
      title: "Generative AI & LLM Workshop",
      type: "Workshop",
      category: "AI & Machine Learning",
      tags: JSON.stringify(["ai", "machine learning", "llm", "programming", "technology"]),
      keywords: JSON.stringify(["pytorch", "agent", "prompt engineering", "tech"]),
      popularityScore: 95,
      date: new Date("2026-07-02T10:00:00Z"),
      location: "Tech Lab 102, Main Campus",
      description: "Learn prompt engineering, vector databases, embeddings, and building active AI agents with PyTorch.",
      schedule: "## Day 1\n- 10:00 AM Introduction",
      prizePool: "Certificates + Credits",
      ticketType: "Free",
      price: 0,
      capacity: 2,
      waitlistEnabled: true,
    },
    {
      id: "entrepreneur-meetup",
      bannerUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=60",
      title: "Founder & Startup Meetup",
      type: "Meetup",
      category: "Startups",
      tags: JSON.stringify(["startups", "business", "networking", "finance"]),
      keywords: JSON.stringify(["founder", "vc", "pitch", "angel"]),
      popularityScore: 80,
      date: new Date("2026-07-18T14:00:00Z"),
      location: "Incubation Center, Campus",
      description: "Connect with startup founders, exchange ideas, and network with active angel mentors and VC investors.",
      schedule: "## Day 1\n- 2:00 PM Networking",
      prizePool: "Incubator Fast-Track",
      ticketType: "Paid",
      price: 5.0,
      capacity: 50,
      waitlistEnabled: false,
    },
    {
      id: "hackathon-2026",
      bannerUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=60",
      title: "Campus Innovation Hackathon 2026",
      type: "Hackathon",
      category: "Programming",
      tags: JSON.stringify(["hackathon", "coding", "technology", "development"]),
      keywords: JSON.stringify(["code", "software", "innovation", "prize"]),
      popularityScore: 100,
      date: new Date("2026-06-20T09:00:00Z"),
      location: "Tech Hub Building, Main Campus",
      description: "Build prototypes, join project teams, and pitch ideas for a $50k prize pool. All skill levels welcome.",
      schedule: "## Schedule\n- 9:00 AM Registration",
      prizePool: "$50,000",
      ticketType: "Free",
      price: 0,
      capacity: 300,
      waitlistEnabled: true,
    },
  ];

  for (const eventData of mockEvents) {
    eventData.organizerId = demoUser.id;
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
