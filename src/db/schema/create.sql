DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  categories json,
  favorites json,
  name VARCHAR(255),
  email TEXT,
  age INTEGER,
  gender TEXT,
  nickname VARCHAR(255)
);