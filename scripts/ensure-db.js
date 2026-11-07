const { execSync } = require('child_process');

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

async function run() {
  try {
    console.log('📦 Ensuring database schema tables exist...');
    execSync('npx prisma db push --skip-generate --accept-data-loss', {
      stdio: 'inherit',
      env: process.env,
    });

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    try {
      const userCount = await prisma.user.count();
      if (userCount === 0) {
        console.log('🌱 Fresh deployment detected. Seeding initial birds, products, and owner account...');
        execSync('npx tsx prisma/seed.ts', {
          stdio: 'inherit',
          env: process.env,
        });
      } else {
        console.log(`✅ Database already initialized (${userCount} users).`);
      }
    } catch (seedErr) {
      console.warn('Seed verification notice:', seedErr.message);
    } finally {
      await prisma.$disconnect();
    }
  } catch (err) {
    console.warn('Database initialization warning:', err.message);
  }
}

run();
