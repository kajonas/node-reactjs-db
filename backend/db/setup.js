/**
 * db/setup.js
 *
 * One-time database initialisation script.
 * Reads schema.sql and seed.sql, then executes them against the configured
 * PostgreSQL database.
 *
 * Usage (from backend/):
 *   node db/setup.js
 *   -- or --
 *   npm run db:setup
 *
 * Prerequisites:
 *   1. PostgreSQL is running and the target database already exists.
 *   2. backend/.env contains the correct DB_* credentials.
 */

import 'dotenv/config';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';

const { Client } = pg;

// Resolve the directory that contains this file so we can find sibling .sql files.
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

async function setup() {
  // Connect directly (not via the shared pool) so we can reliably close after setup.
  const client = new Client({
    host:     process.env.DB_HOST     || 'localhost',
    port:     Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME     || 'restaurant_db',
    user:     process.env.DB_USER     || 'postgres',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    await client.connect();
    console.log('✔  Connected to PostgreSQL');

    // --- Apply schema ---
    const schemaSql = readFileSync(join(__dirname, 'schema.sql'), 'utf8');
    await client.query(schemaSql);
    console.log('✔  Schema applied (schema.sql)');

    // --- Seed sample data ---
    const seedSql = readFileSync(join(__dirname, 'seed.sql'), 'utf8');
    await client.query(seedSql);
    console.log('✔  Seed data inserted (seed.sql)');

    console.log('\n🎉  Database setup complete!');
  } catch (err) {
    console.error('✘  Setup failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setup();

