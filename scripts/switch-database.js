const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const envPath = path.join(__dirname, '..', '.env');

const targetDb = process.argv[2] || 'postgres'; // 'postgres' or 'sqlite'
const cloudUrl = process.argv[3]; // Optional connection string passed as argument

if (!fs.existsSync(schemaPath)) {
  console.error('❌ schema.prisma not found!');
  process.exit(1);
}

let schemaContent = fs.readFileSync(schemaPath, 'utf8');

if (targetDb === 'postgres' || targetDb === 'postgresql') {
  console.log('🔄 Switching Prisma schema to PostgreSQL provider...');
  schemaContent = schemaContent.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  fs.writeFileSync(schemaPath, schemaContent, 'utf8');

  if (cloudUrl) {
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(/DATABASE_URL\s*=.*/g, `DATABASE_URL="${cloudUrl}"`);
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('✅ Updated DATABASE_URL in .env with your cloud connection string.');
  }

  console.log('⚡ Generating Prisma client for PostgreSQL...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  if (cloudUrl) {
    console.log('🚀 Pushing schema tables to cloud PostgreSQL database...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('🌱 Seeding cloud database with all birds, cages, toys & foods...');
    execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
    console.log('🎉 Cloud database is fully connected, migrated, and seeded!');
  } else {
    console.log('ℹ️ Switched schema to PostgreSQL. Please add your cloud DATABASE_URL in .env, then run:');
    console.log('   npx prisma db push && npx tsx prisma/seed.ts');
  }
} else if (targetDb === 'sqlite') {
  console.log('🔄 Switching Prisma schema back to SQLite provider...');
  schemaContent = schemaContent.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  fs.writeFileSync(schemaPath, schemaContent, 'utf8');

  let envContent = fs.readFileSync(envPath, 'utf8');
  envContent = envContent.replace(/DATABASE_URL\s*=.*/g, 'DATABASE_URL="file:./dev.db"');
  fs.writeFileSync(envPath, envContent, 'utf8');

  console.log('⚡ Generating Prisma client for SQLite...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Reverted back to local SQLite (dev.db)!');
}
