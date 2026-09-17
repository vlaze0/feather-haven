const { Client } = require('pg');

async function testPassword(pwd, label) {
  const enc = encodeURIComponent(pwd);
  const connStr = `postgresql://postgres.ropddwtxjpjpqxkyhhxz:${enc}@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres`;
  console.log(`Testing ${label}...`);
  const client = new Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    console.log(`✅ SUCCESS with ${label}!`);
    await client.end();
    return true;
  } catch (err) {
    console.log(`❌ Failed with ${label}:`, err.message);
    try { await client.end(); } catch (e) {}
    return false;
  }
}

async function main() {
  // Test 1: without brackets (most common)
  const pass1 = '005708Ashar@';
  const ok1 = await testPassword(pass1, '005708Ashar@ (without brackets)');
  if (ok1) process.exit(0);

  // Test 2: with brackets
  const pass2 = '[005708Ashar@]';
  const ok2 = await testPassword(pass2, '[005708Ashar@] (with brackets)');
  if (ok2) process.exit(0);

  // Test 3: with double brackets
  const pass3 = '[005708Ashar@]]';
  await testPassword(pass3, '[005708Ashar@]]');
}

main();
