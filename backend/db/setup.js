/**
 * db/setup.js
 *
 * Database initialization script using Sequelize ORM.
 * Syncs Sequelize models and seeds sample data if the table is empty.
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
import sequelize from './sequelize.js';
import { Meal } from '../models/index.js';

const seedData = [
  { name: 'Bruschetta Semplice', calories: 180, cost: 5.99, ingredients: ['Ciabatta Bread', 'Extra Virgin Olive Oil', 'Sea Salt'] },
  { name: 'Cacio e Pepe', calories: 580, cost: 13.99, ingredients: ['Spaghetti', 'Pecorino Romano', 'Parmigiano Reggiano', 'Cracked Black Pepper'] },
  { name: 'Aglio e Olio', calories: 490, cost: 11.99, ingredients: ['Spaghetti', 'Garlic', 'Extra Virgin Olive Oil', 'Red Pepper Flakes', 'Fresh Parsley'] },
  { name: 'Insalata Caprese', calories: 320, cost: 11.99, ingredients: ['Fresh Mozzarella di Bufala', 'Heirloom Tomatoes', 'Fresh Basil', 'Extra Virgin Olive Oil', 'Sea Salt', 'Cracked Black Pepper'] },
  { name: 'Pasta Carbonara', calories: 650, cost: 16.99, ingredients: ['Spaghetti', 'Guanciale', 'Eggs', 'Pecorino Romano', 'Parmigiano Reggiano', 'Black Pepper', 'Sea Salt'] },
  { name: 'Risotto ai Funghi', calories: 520, cost: 18.99, ingredients: ['Arborio Rice', 'Mixed Mushrooms', 'Dry White Wine', 'Parmigiano Reggiano', 'Unsalted Butter', 'Shallots', 'Chicken Broth', 'Fresh Thyme'] },
  { name: 'Bruschetta al Pomodoro', calories: 280, cost: 8.99, ingredients: ['Ciabatta Bread', 'Cherry Tomatoes', 'Garlic', 'Fresh Basil', 'Extra Virgin Olive Oil', 'Sea Salt', 'Balsamic Glaze', 'Red Onion', 'Cracked Black Pepper'] },
  { name: 'Ossobuco alla Milanese', calories: 720, cost: 32.99, ingredients: ['Veal Shanks', 'Dry White Wine', 'San Marzano Tomatoes', 'Carrots', 'Celery', 'Onion', 'Beef Broth', 'Gremolata', 'Unsalted Butter', 'All-Purpose Flour'] },
  { name: 'Pollo alla Parmigiana', calories: 680, cost: 22.99, ingredients: ['Chicken Breast', 'Marinara Sauce', 'Fresh Mozzarella', 'Parmigiano Reggiano', 'Breadcrumbs', 'Eggs', 'All-Purpose Flour', 'Olive Oil', 'Fresh Basil', 'Garlic', 'Sea Salt'] },
  { name: 'Pizza Margherita', calories: 800, cost: 14.99, ingredients: ['Pizza Dough', 'San Marzano Tomatoes', 'Fresh Mozzarella', 'Fresh Basil', 'Olive Oil', 'Sea Salt', 'Active Dry Yeast', 'All-Purpose Flour', 'Sugar', 'Water', 'Garlic', 'Dried Oregano'] },
  { name: 'Tiramisu', calories: 450, cost: 9.99, ingredients: ['Savoiardi Ladyfingers', 'Mascarpone Cheese', 'Espresso', 'Egg Yolks', 'Egg Whites', 'Sugar', 'Cocoa Powder', 'Marsala Wine', 'Heavy Cream', 'Vanilla Extract', 'Dark Rum', 'Sea Salt', 'Dark Chocolate Shavings'] },
  { name: 'Lasagna al Forno', calories: 850, cost: 24.99, ingredients: ['Lasagna Sheets', 'Ground Beef', 'Ground Pork', 'San Marzano Tomatoes', 'Tomato Paste', 'Whole Milk', 'Unsalted Butter', 'All-Purpose Flour', 'Fresh Mozzarella', 'Parmigiano Reggiano', 'Onion', 'Garlic', 'Dry Red Wine', 'Fresh Basil'] },
  { name: 'Seafood Risotto', calories: 620, cost: 34.99, ingredients: ['Arborio Rice', 'Shrimp', 'Sea Scallops', 'Mussels', 'Clams', 'Dry White Wine', 'Fish Broth', 'Shallots', 'Garlic', 'Cherry Tomatoes', 'Fresh Parsley', 'Unsalted Butter', 'Extra Virgin Olive Oil', 'Saffron', 'Sea Salt'] },
];

async function setup() {
  try {
    // Sync the models with the database
    console.log('🔄  Syncing database models...');
    await sequelize.sync();
    console.log('✔  Database synced successfully');

    // Check if meals table is empty
    const mealCount = await Meal.count();
    if (mealCount === 0) {
      console.log('📝  Seeding sample meal data...');
      await Meal.bulkCreate(seedData);
      console.log(`✔  ${seedData.length} meals inserted`);
    } else {
      console.log(`⏭️  Table already contains ${mealCount} meals, skipping seed`);
    }

    console.log('\n🎉  Database setup complete!');
  } catch (err) {
    console.error('✘  Setup failed:', err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

setup();

