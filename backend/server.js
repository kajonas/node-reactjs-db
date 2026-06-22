/**
 * server.js  –  Express application entry point
 *
 * Responsibilities:
 *   - Load environment variables from .env
 *   - Configure middleware (CORS, JSON body parsing)
 *   - Mount the /api/meals router
 *   - Start listening on PORT 3002
 */

import 'dotenv/config';
import cors    from 'cors';
import express from 'express';
import mealsRouter from './routes/meals.js';

const app  = express();
const PORT = 3002;

// Allow cross-origin requests from the Vite dev server (port 5174).
app.use(cors());

// Parse incoming JSON request bodies so req.body is populated.
app.use(express.json());

// Mount all meal CRUD endpoints under /api/meals.
app.use('/api/meals', mealsRouter);

// Health-check endpoint – handy for confirming the server is up.
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🍽️  Taberna Gustus backend running on http://localhost:${PORT}`);
});

