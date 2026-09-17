const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const birds = await prisma.bird.findMany();
  console.log(`Total birds in database: ${birds.length}`);
  birds.forEach((b) => {
    console.log(`- [${b.birdCode}] ${b.name} (${b.species} | Variety: ${b.variety}) -> images: ${b.images}`);
  });
}

check().then(() => prisma.$disconnect());
