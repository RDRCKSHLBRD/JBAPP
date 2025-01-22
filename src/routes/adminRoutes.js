const express = require('express');
const { fetchAllTables, resetAllTables } = require('../queries/admin'); // Import query functions

const router = express.Router();

// Route to fetch all tables
router.get('/tables', fetchAllTables);

// Route to reset all tables
router.delete('/reset/all', resetAllTables);

module.exports = router;
