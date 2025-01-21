const { Pool } = require('pg'); // Use destructuring from the CommonJS require
require('dotenv').config(); // Load environment variables

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const PORT = process.env.PORT || 3001; // Default to 3001 if PORT is not set in .env

module.exports = { pool, PORT }; // Export pool and PORT
