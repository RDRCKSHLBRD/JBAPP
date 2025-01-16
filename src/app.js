const express = require('express');
const dotenv = require('dotenv');
const mainRoutes = require('./routes/mainRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Parse JSON bodies
app.use('/api', mainRoutes); // Mount the main routes

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
