/**
 * routes/meals.js
 *
 * Full CRUD REST routes for the `meals` table.
 *
 * Route summary:
 *   GET    /api/meals        - return all meals (ordered by id)
 *   GET    /api/meals/:id    - return a single meal by id
 *   POST   /api/meals        - insert a new meal
 *   PUT    /api/meals/:id    - replace all fields of an existing meal
 *   DELETE /api/meals/:id    - remove a meal
 *
 * Meal JSON shape sent / received:
 *   { id, name, calories, cost, ingredients }
 *   where `ingredients` is a string array (TEXT[] in PostgreSQL).
 */

import { Router } from 'express';
import { query }  from '../db/index.js';

const router = Router();

// ---------------------------------------------------------------------------
// GET /api/meals  – list every meal, ordered by primary key
// ---------------------------------------------------------------------------
router.get('/', async (_req, res) => {
  try {
    const result = await query('SELECT * FROM meals ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/meals error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve meals.' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/meals/:id  – fetch a single meal
// ---------------------------------------------------------------------------
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('SELECT * FROM meals WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Meal with id ${id} not found.` });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`GET /api/meals/${id} error:`, err.message);
    res.status(500).json({ error: 'Failed to retrieve the meal.' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/meals  – create a new meal
// Body: { name, calories, cost, ingredients }
// ---------------------------------------------------------------------------
router.post('/', async (req, res) => {
  const { name, calories, cost, ingredients } = req.body;

  // Basic validation
  if (!name || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: 'name and a non-empty ingredients array are required.' });
  }

  try {
    const result = await query(
      `INSERT INTO meals (name, calories, cost, ingredients)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, Number(calories) || 0, Number(cost) || 0, ingredients]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/meals error:', err.message);
    res.status(500).json({ error: 'Failed to create the meal.' });
  }
});

// ---------------------------------------------------------------------------
// PUT /api/meals/:id  – update every field of a meal
// Body: { name, calories, cost, ingredients }
// ---------------------------------------------------------------------------
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, calories, cost, ingredients } = req.body;

  if (!name || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: 'name and a non-empty ingredients array are required.' });
  }

  try {
    const result = await query(
      `UPDATE meals
       SET name = $1, calories = $2, cost = $3, ingredients = $4
       WHERE id = $5
       RETURNING *`,
      [name, Number(calories) || 0, Number(cost) || 0, ingredients, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Meal with id ${id} not found.` });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`PUT /api/meals/${id} error:`, err.message);
    res.status(500).json({ error: 'Failed to update the meal.' });
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/meals/:id  – remove a meal
// ---------------------------------------------------------------------------
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM meals WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Meal with id ${id} not found.` });
    }
    res.json({ message: `Meal ${id} deleted successfully.` });
  } catch (err) {
    console.error(`DELETE /api/meals/${id} error:`, err.message);
    res.status(500).json({ error: 'Failed to delete the meal.' });
  }
});

export default router;

