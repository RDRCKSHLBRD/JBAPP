const express = require('express');
const dotenv = require('dotenv');
const path = require('path'); // Added to handle static files
const { PORT } = require('../config/const');
const mainRoutes = require('./routes/mainRoutes'); // Correct path to mainRoutes.js

dotenv.config(); // Load environment variables
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Mount main routes under the `/api` namespace
app.use('/api', mainRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
