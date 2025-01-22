const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const path = require('path');
const { PORT } = require('../config/const.js');
const routeIndex = require('./routes/routeIndex'); // Use the consolidated router file
const { createClient } = require('redis'); // Redis client from redis@4.x
const { RedisStore } = require('connect-redis'); // Correct import for connect-redis@8.x

dotenv.config(); // Load environment variables

const app = express();
const PASSWORD = process.env.SITE_PASSWORD; // Password from .env file

// Ensure required environment variables are set
if (!PASSWORD) {
    throw new Error('SITE_PASSWORD is not set in the environment variables.');
}

// Create and connect Redis client
const redisClient = createClient({
    url: process.env.REDIS_URL,
});
redisClient.connect().catch(console.error); // Handle connection errors

// Create Redis store instance
const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'sess:',
});

// Middleware to parse JSON bodies and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Session middleware for authentication using Redis store
app.use(
    session({
        store: redisStore, // Use the Redis store
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Set to true if using HTTPS
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    })
);

// Middleware to enforce password protection
app.use((req, res, next) => {
    if (
        req.session.authenticated ||
        req.url.startsWith('/api') ||
        req.url.startsWith('/styles.css') ||
        req.url.startsWith('/js/')
    ) {
        return next();
    }

    if (req.url === '/' || req.url === '/login') {
        return next();
    }

    res.status(401).sendFile(path.join(__dirname, '../public/index.html'));
});

// Route to handle password login
app.post('/login', (req, res) => {
    const { password } = req.body;

    if (password === PASSWORD) {
        req.session.authenticated = true;
        res.status(200).json({ success: true, redirect: '/dashboard.html' });
    } else {
        res.status(401).json({ error: 'Invalid password' });
    }
});

// Mount the consolidated routes under `/api`
app.use('/api', routeIndex);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
