/**
 * routes/meals.js
 *
 * Full CRUD REST routes for the `meals` table using Sequelize ORM.
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
import { Meal } from '../models/index.js';

const router = Router();

// ---------------------------------------------------------------------------
// GET /api/meals  – list every meal, ordered by primary key
// ---------------------------------------------------------------------------
router.get('/', async (_req, res) => {
  try {
    const meals = await Meal.findAll({
      order: [['id', 'ASC']],
      raw: true,
    });
    res.json(meals);
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
    const meal = await Meal.findByPk(id, { raw: true });
    if (!meal) {
      return res.status(404).json({ error: `Meal with id ${id} not found.` });
    }
    res.json(meal);
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
    const meal = await Meal.create({
      name,
      calories: Number(calories) || 0,
      cost: Number(cost) || 0,
      ingredients,
    });
    res.status(201).json(meal.toJSON());
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
    const meal = await Meal.findByPk(id);
    if (!meal) {
      return res.status(404).json({ error: `Meal with id ${id} not found.` });
    }
    await meal.update({
      name,
      calories: Number(calories) || 0,
      cost: Number(cost) || 0,
      ingredients,
    });
    res.json(meal.toJSON());
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
    const meal = await Meal.findByPk(id);
    if (!meal) {
      return res.status(404).json({ error: `Meal with id ${id} not found.` });
    }
    await meal.destroy();
    res.json({ message: `Meal ${id} deleted successfully.` });
  } catch (err) {
    console.error(`DELETE /api/meals/${id} error:`, err.message);
    res.status(500).json({ error: 'Failed to delete the meal.' });
  }
});

export default router;

