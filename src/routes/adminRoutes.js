//adminRoutes.js

const express = require('express');
const { fetchAllTables, resetAllTables } = require('../queries/admin');

const router = express.Router();

router.get('/tables', fetchAllTables);
router.delete('/reset/all', resetAllTables);

module.exports = router;
