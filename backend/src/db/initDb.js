import { initDatabase } from '../config/db.js';

async function run() {
  console.log('🔄 Initializing PostgreSQL database...');
  const success = await initDatabase();
  if (success) {
    console.log('✅ Database setup completed successfully!');
    process.exit(0);
  } else {
    console.log('❌ Database setup was unable to reach PostgreSQL. Check your DATABASE_URL in .env');
    process.exit(1);
  }
}

run();
