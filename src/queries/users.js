// queries // user.js

const { pool } = require('../../config/const.js');
const bcrypt = require('bcrypt');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create user
const createUser = async (req, res) => {
    const { username, email, password, termsAgreed } = req.body; // Use `termsAgreed` as sent by the frontend

    // Explicitly convert `termsAgreed` to a boolean
    const termsAgreedValue = termsAgreed === true; // Ensure true/false
    console.log("Received payload:", req.body);
    console.log("Processed terms_agreed value:", termsAgreedValue);

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password generated successfully.");

        // Insert into the database with the correctly mapped value
        const result = await pool.query(
            'INSERT INTO users (username, email, password, terms_agreed) VALUES ($1, $2, $3, $4::BOOLEAN) RETURNING *',
            [username, email, hashedPassword, termsAgreedValue]
        );

        console.log("User inserted into database:", result.rows[0]);

        // Respond with the created user
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating user:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};




// Update user
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *',
            [username, email, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully', user: result.rows[0] });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
