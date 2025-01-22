//routeIndex.js

const express = require('express');
const usersRoutes = require('./usersRoutes');
const jobsRoutes = require('./jobsRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.use('/users', usersRoutes);
router.use('/jobs', jobsRoutes);
router.use('/admin', adminRoutes); // For `/tables` and `/reset/all`

// Example: Add a ping route here
router.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
});

module.exports = router;
