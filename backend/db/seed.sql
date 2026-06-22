-- Seed data: classic Italian-Latin restaurant menu items.
-- Each meal has between 3 and 15 ingredients.
-- Skipped if the table already contains rows to prevent duplicate seeding.

INSERT INTO meals (name, calories, cost, ingredients)
SELECT * FROM (VALUES
  (
    -- 3 ingredients (minimum)
    'Bruschetta Semplice',
    180,
    5.99::NUMERIC,
    ARRAY['Ciabatta Bread', 'Extra Virgin Olive Oil', 'Sea Salt']
  ),
  (
    -- 4 ingredients
    'Cacio e Pepe',
    580,
    13.99::NUMERIC,
    ARRAY['Spaghetti', 'Pecorino Romano', 'Parmigiano Reggiano', 'Cracked Black Pepper']
  ),
  (
    -- 5 ingredients
    'Aglio e Olio',
    490,
    11.99::NUMERIC,
    ARRAY['Spaghetti', 'Garlic', 'Extra Virgin Olive Oil', 'Red Pepper Flakes', 'Fresh Parsley']
  ),
  (
    -- 6 ingredients
    'Insalata Caprese',
    320,
    11.99::NUMERIC,
    ARRAY['Fresh Mozzarella di Bufala', 'Heirloom Tomatoes', 'Fresh Basil', 'Extra Virgin Olive Oil', 'Sea Salt', 'Cracked Black Pepper']
  ),
  (
    -- 7 ingredients
    'Pasta Carbonara',
    650,
    16.99::NUMERIC,
    ARRAY['Spaghetti', 'Guanciale', 'Eggs', 'Pecorino Romano', 'Parmigiano Reggiano', 'Black Pepper', 'Sea Salt']
  ),
  (
    -- 8 ingredients
    'Risotto ai Funghi',
    520,
    18.99::NUMERIC,
    ARRAY['Arborio Rice', 'Mixed Mushrooms', 'Dry White Wine', 'Parmigiano Reggiano', 'Unsalted Butter', 'Shallots', 'Chicken Broth', 'Fresh Thyme']
  ),
  (
    -- 9 ingredients
    'Bruschetta al Pomodoro',
    280,
    8.99::NUMERIC,
    ARRAY['Ciabatta Bread', 'Cherry Tomatoes', 'Garlic', 'Fresh Basil', 'Extra Virgin Olive Oil', 'Sea Salt', 'Balsamic Glaze', 'Red Onion', 'Cracked Black Pepper']
  ),
  (
    -- 10 ingredients
    'Ossobuco alla Milanese',
    720,
    32.99::NUMERIC,
    ARRAY['Veal Shanks', 'Dry White Wine', 'San Marzano Tomatoes', 'Carrots', 'Celery', 'Onion', 'Beef Broth', 'Gremolata', 'Unsalted Butter', 'All-Purpose Flour']
  ),
  (
    -- 11 ingredients
    'Pollo alla Parmigiana',
    680,
    22.99::NUMERIC,
    ARRAY['Chicken Breast', 'Marinara Sauce', 'Fresh Mozzarella', 'Parmigiano Reggiano', 'Breadcrumbs', 'Eggs', 'All-Purpose Flour', 'Olive Oil', 'Fresh Basil', 'Garlic', 'Sea Salt']
  ),
  (
    -- 12 ingredients
    'Pizza Margherita',
    800,
    14.99::NUMERIC,
    ARRAY['Pizza Dough', 'San Marzano Tomatoes', 'Fresh Mozzarella', 'Fresh Basil', 'Olive Oil', 'Sea Salt', 'Active Dry Yeast', 'All-Purpose Flour', 'Sugar', 'Water', 'Garlic', 'Dried Oregano']
  ),
  (
    -- 13 ingredients
    'Tiramisu',
    450,
    9.99::NUMERIC,
    ARRAY['Savoiardi Ladyfingers', 'Mascarpone Cheese', 'Espresso', 'Egg Yolks', 'Egg Whites', 'Sugar', 'Cocoa Powder', 'Marsala Wine', 'Heavy Cream', 'Vanilla Extract', 'Dark Rum', 'Sea Salt', 'Dark Chocolate Shavings']
  ),
  (
    -- 14 ingredients
    'Lasagna al Forno',
    850,
    24.99::NUMERIC,
    ARRAY['Lasagna Sheets', 'Ground Beef', 'Ground Pork', 'San Marzano Tomatoes', 'Tomato Paste', 'Whole Milk', 'Unsalted Butter', 'All-Purpose Flour', 'Fresh Mozzarella', 'Parmigiano Reggiano', 'Onion', 'Garlic', 'Dry Red Wine', 'Fresh Basil']
  ),
  (
    -- 15 ingredients (maximum)
    'Seafood Risotto',
    620,
    34.99::NUMERIC,
    ARRAY['Arborio Rice', 'Shrimp', 'Sea Scallops', 'Mussels', 'Clams', 'Dry White Wine', 'Fish Broth', 'Shallots', 'Garlic', 'Cherry Tomatoes', 'Fresh Parsley', 'Unsalted Butter', 'Extra Virgin Olive Oil', 'Saffron', 'Sea Salt']
  )
) AS v(name, calories, cost, ingredients)
WHERE NOT EXISTS (SELECT 1 FROM meals LIMIT 1);

