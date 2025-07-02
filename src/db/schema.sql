-- Items table
CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Colors table
CREATE TABLE IF NOT EXISTS colors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Fabrics table
CREATE TABLE IF NOT EXISTS fabrics (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Item configurations (color+fabric per item)
CREATE TABLE IF NOT EXISTS item_configurations (
  id SERIAL PRIMARY KEY,
  item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
  color_id INTEGER REFERENCES colors(id),
  fabric_id INTEGER REFERENCES fabrics(id),
  UNIQUE(item_id, color_id, fabric_id)
);

-- Images table
CREATE TABLE IF NOT EXISTS images (
  id SERIAL PRIMARY KEY,
  item_configuration_id INTEGER REFERENCES item_configurations(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL
);
