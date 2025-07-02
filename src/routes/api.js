const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for image uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// 1. List items with color/fabric/image counts
router.get('/items', async (req, res) => {
  try {
    const items = await db.query(`
      SELECT i.id, i.name,
        COUNT(DISTINCT ic.color_id) AS color_count,
        COUNT(DISTINCT ic.fabric_id) AS fabric_count,
        COUNT(img.id) AS image_count
      FROM items i
      LEFT JOIN item_configurations ic ON ic.item_id = i.id
      LEFT JOIN images img ON img.item_configuration_id = ic.id
      GROUP BY i.id
      ORDER BY i.id
    `);
    res.json(items.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. List configurations and images for an item
router.get('/items/:itemId/configurations', async (req, res) => {
  try {
    const { itemId } = req.params;
    const configs = await db.query(`
      SELECT ic.id AS config_id, c.name AS color, f.name AS fabric
      FROM item_configurations ic
      JOIN colors c ON ic.color_id = c.id
      JOIN fabrics f ON ic.fabric_id = f.id
      WHERE ic.item_id = $1
      ORDER BY c.name, f.name
    `, [itemId]);
    const images = await db.query(`
      SELECT img.id, img.item_configuration_id, img.image_url
      FROM images img
      JOIN item_configurations ic ON img.item_configuration_id = ic.id
      WHERE ic.item_id = $1
    `, [itemId]);
    res.json({ configurations: configs.rows, images: images.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Upload image for a configuration
router.post('/configurations/:configId/images', upload.single('image'), async (req, res) => {
  try {
    const { configId } = req.params;
    const imageUrl = '/uploads/' + req.file.filename;
    const result = await db.query(
      'INSERT INTO images (item_configuration_id, image_url) VALUES ($1, $2) RETURNING *',
      [configId, imageUrl]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Delete image
router.delete('/images/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    const img = await db.query('SELECT image_url FROM images WHERE id = $1', [imageId]);
    if (img.rows.length) {
      const filePath = path.join(__dirname, '..', img.rows[0].image_url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await db.query('DELETE FROM images WHERE id = $1', [imageId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Debugging endpoint to list all registered routes
router.get('/debug/routes', (req, res) => {
  const routes = [];
  req.app._router.stack.forEach(middleware => {
    if (middleware.route) {
      routes.push(middleware.route);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach(handler => {
        if (handler.route) routes.push(handler.route);
      });
    }
  });
  res.json(routes.map(r => ({ path: r.path, methods: r.methods })));
});

// Health endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;
