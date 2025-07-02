const db = require('./index');

async function seed() {
  // Insert items
  await db.query("INSERT INTO items (name) VALUES ('Classic Tee'), ('Modern Fit') ON CONFLICT DO NOTHING;");
  // Insert colors
  await db.query("INSERT INTO colors (name) VALUES ('Red'), ('Blue'), ('Green') ON CONFLICT DO NOTHING;");
  // Insert fabrics
  await db.query("INSERT INTO fabrics (name) VALUES ('Cotton'), ('Polyester') ON CONFLICT DO NOTHING;");
  // Get ids
  const items = (await db.query('SELECT * FROM items')).rows;
  const colors = (await db.query('SELECT * FROM colors')).rows;
  const fabrics = (await db.query('SELECT * FROM fabrics')).rows;
  // Insert configurations for each item/color/fabric
  for (const item of items) {
    for (const color of colors) {
      for (const fabric of fabrics) {
        await db.query(
          'INSERT INTO item_configurations (item_id, color_id, fabric_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING;',
          [item.id, color.id, fabric.id]
        );
      }
    }
  }
  console.log('Seed complete.');
}

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}

module.exports = { seed };
