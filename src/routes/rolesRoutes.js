// rolesRoutes.js
const express = require('express');
const { getAllRoles } = require('../queries/roles'); // Import the query function

const router = express.Router();

// ✅ Correct: This ensures `/api/roles` is correctly mapped
router.get('/', getAllRoles);

module.exports = router;
