// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Loads .env if present
const app = express();

app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// Example route
app.get('/', (req, res) => {
  res.send('Hello from the University Connect backend!');
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
