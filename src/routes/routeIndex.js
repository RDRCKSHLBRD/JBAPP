const express = require('express');
const router = express.Router();

const usersRoutes = require('./usersRoutes');
const jobsRoutes = require('./jobsRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/users', usersRoutes);
router.use('/jobs', jobsRoutes);
router.use('/admin', adminRoutes);

router.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
});

module.exports = router;
