/**
 * db/index.js
 *
 * Shared PostgreSQL connection pool used by all route modules.
 *
 * The Pool automatically manages a set of open connections and recycles them
 * across requests — much more efficient than opening a new connection per query.
 *
 * Environment variables (set in backend/.env):
 *   DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
 */

import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

// Create a single pool instance for the entire application lifetime.
const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'restaurant_db',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

// Log pool-level errors (e.g. a client that errors while idle).
pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

/**
 * Thin wrapper around pool.query so callers don't need to import the pool
 * directly. Parameterised queries help prevent SQL injection.
 *
 * @param {string}  text   - SQL statement with $1, $2, … placeholders
 * @param {Array}  [params] - Values to substitute into the placeholders
 * @returns {Promise<pg.QueryResult>}
 */
export async function query(text, params) {
  return pool.query(text, params);
}

export default pool;

