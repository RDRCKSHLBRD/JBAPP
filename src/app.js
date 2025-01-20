const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const path = require('path');
const { PORT } = require('../config/const');
const mainRoutes = require('./routes/mainRoutes'); // Correct path to mainRoutes.js

dotenv.config(); // Load environment variables

const app = express();
const PASSWORD = process.env.SITE_PASSWORD; // Password from .env file

// Ensure the SITE_PASSWORD is set
if (!PASSWORD) {
    throw new Error('SITE_PASSWORD is not set in the environment variables.');
}

// Middleware to parse JSON bodies and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Session middleware for authentication
app.use(
    session({
        secret: 'your-secret-key', // Use a strong secret in production
        resave: false,
        saveUninitialized: true,
    })
);

// Middleware to enforce password protection
app.use((req, res, next) => {
    // Allow static files and API routes without authentication
    if (
        req.session.authenticated ||
        req.url.startsWith('/api') ||
        req.url.startsWith('/styles.css') ||
        req.url.startsWith('/js/')
    ) {
        return next();
    }

    // Allow access to the password prompt page
    if (req.url === '/' || req.url === '/login') {
        return next();
    }

    // Deny access to other routes
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

// Mount main routes under the `/api` namespace
app.use('/api', mainRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
