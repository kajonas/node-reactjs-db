node-reactjs-db
===============
A restaurant meal-management app using Node/Express backend with PostgreSQL
and a React + Vite frontend.

TECHNOLOGIES
  - Backend : Node.js (ESM), Express 4, node-postgres (pg), dotenv
  - Frontend: React 18, Vite 5
  - Database: PostgreSQL (>= 14 recommended)

PROJECT STRUCTURE
  backend/   Express REST API on port 3002
  frontend/  React + Vite SPA on port 5174

FIRST-TIME SETUP
  1. Install all dependencies from the repo root:
       npm install

  2. Create a PostgreSQL database:
       psql -U postgres -c "CREATE DATABASE restaurant_db;"

  3. Copy backend/.env.example to backend/.env and fill in your credentials:
       DB_HOST=localhost
       DB_PORT=5432
       DB_NAME=restaurant_db
       DB_USER=postgres
       DB_PASSWORD=your_password

  4. Run the database setup script (creates tables + seeds sample data):
       npm run db:setup
     or, from inside backend/:
       npm run db:setup

START DEVELOPMENT
  From repo root (opens two console windows):
    npm run dev

  Or individually:
    cd backend  && npm run dev    (port 3002)
    cd frontend && npm run dev    (port 5174)

API ENDPOINTS
  GET    /api/meals        - list all meals
  GET    /api/meals/:id    - get single meal
  POST   /api/meals        - create a meal
  PUT    /api/meals/:id    - update a meal
  DELETE /api/meals/:id    - delete a meal

  Meal JSON shape:
  {
    id          : number,
    name        : string,
    calories    : number,
    cost        : number,        // e.g. 16.99
    ingredients : string[]       // 1–10 items
  }

