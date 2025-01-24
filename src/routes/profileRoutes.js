//profileRoutes.js


const express = require('express');
const {
    getAllProfiles,
    getProfileByUserId,
    createProfile,
    updateProfile,
} = require('../queries/profile'); // Import queries from profile.js

const router = express.Router();

// Get all profiles
router.get('/', getAllProfiles);

// Get a profile by user ID
router.get('/:userId', getProfileByUserId);

// Create a new profile
router.post('/', createProfile);

// Update an existing profile by user ID
router.put('/:userId', updateProfile);

module.exports = router;
