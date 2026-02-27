import { db } from './src/lib/db';
import { studentsSelections } from './src/lib/schema';
import { sql } from 'drizzle-orm';

async function cleanup() {
    console.log('Cleaning up existing data...');
    await db.delete(studentsSelections);
    console.log('Done.');
    process.exit(0);
}

cleanup();
