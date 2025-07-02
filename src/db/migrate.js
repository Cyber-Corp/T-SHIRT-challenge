const db = require('./index');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await db.pool.query(schema);
  console.log('Database schema migrated.');
}

if (require.main === module) {
  runMigrations().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}

module.exports = { runMigrations };
