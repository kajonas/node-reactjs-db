-- Database schema for the restaurant meal management app.
-- Run via:  node db/setup.js   (from the backend directory)

CREATE TABLE IF NOT EXISTS meals (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255)    NOT NULL,
  calories    INTEGER         NOT NULL DEFAULT 0,
  cost        NUMERIC(10, 2)  NOT NULL DEFAULT 0.00,
  ingredients TEXT[]          NOT NULL DEFAULT '{}'
);

