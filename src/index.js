require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const apiRoutes = require('./routes/api');
const path = require('path');

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// Serve UI
app.use(express.static(path.join(__dirname, 'ui')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
