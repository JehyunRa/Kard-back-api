DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  categories json,
  favorites json,
  name VARCHAR(255),
  age INTEGER,
  gender TEXT
);