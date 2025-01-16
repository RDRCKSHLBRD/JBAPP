const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT, // Database port (PostgreSQL)
});

// Export the database pool and server port
module.exports = {
    pool,
    PORT: process.env.PORT || 3001, // Default to 3001 if PORT is not set in .env
};
