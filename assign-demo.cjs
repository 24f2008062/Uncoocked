const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@campus.edu' }
    });

    if (!demoUser) {
      console.error("Demo user 'demo@campus.edu' not found!");
      return;
    }

    const updated = await prisma.event.updateMany({
      where: {
        organizerId: null
      },
      data: {
        organizerId: demoUser.id
      }
    });

    console.log(`Successfully assigned ${updated.count} unowned events to demo@campus.edu.`);
  } catch (error) {
    console.error("Error updating events:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
