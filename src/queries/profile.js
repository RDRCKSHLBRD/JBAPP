//queries / profile.js

const { pool } = require('../../config/const.js');

// Get all profiles
const getAllProfiles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM profiles');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching profiles:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get profile by user ID
const getProfileByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM profiles WHERE user_id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create profile
const createProfile = async (req, res) => {
    const { user_id, first_name, last_name, contact_number, country, city, job_preferences } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO profiles (user_id, first_name, last_name, contact_number, country, city, job_preferences) VALUES ($1, $2, $3, $4, $5, $6, $7::JSONB) RETURNING *',
            [user_id, first_name, last_name, contact_number, country, city, job_preferences]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating profile:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update profile
const updateProfile = async (req, res) => {
    const { userId } = req.params;
    const { first_name, last_name, contact_number, country, city, job_preferences } = req.body;

    try {
        const result = await pool.query(
            'UPDATE profiles SET first_name = $1, last_name = $2, contact_number = $3, country = $4, city = $5, job_preferences = $6::JSONB WHERE user_id = $7 RETURNING *',
            [first_name, last_name, contact_number, country, city, job_preferences, userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getAllProfiles, getProfileByUserId, createProfile, updateProfile };
