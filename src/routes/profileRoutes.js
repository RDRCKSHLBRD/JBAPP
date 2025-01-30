const express = require('express');
const multer = require('multer');  // Import multer for handling file uploads

const {
    getAllProfiles,
    getProfileByUserId,
    createProfile,
    updateProfile,
} = require('../queries/profile'); // Import profile query functions

const router = express.Router();

// Configure multer storage (stores files in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all profiles
router.get('/', getAllProfiles);

// Get a profile by user ID
router.get('/:userId', getProfileByUserId);

// Create a new profile
router.post('/', createProfile);

// Update an existing profile by user ID
router.put('/:userId', updateProfile);

// New: File Upload Endpoint
router.post('/upload', upload.single('resume'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`Received file: ${req.file.originalname}`);

    res.status(200).json({
        message: 'File uploaded successfully',
        filename: req.file.originalname
    });
});

module.exports = router;
