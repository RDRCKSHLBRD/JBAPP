const { pool } = require('../../config/const.js');
const bcrypt = require('bcrypt');

// Get all users (account-related information only)
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, email, subscription_status, created_at FROM users');
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
        const result = await pool.query('SELECT id, email, subscription_status, created_at FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create user (account creation)
const createUser = async (req, res) => {
    const { email, password, termsAgreed } = req.body;

    // Explicitly convert `termsAgreed` to a boolean
    const termsAgreedValue = termsAgreed === true;
    console.log("Received payload:", req.body);

    try {
        await pool.query('BEGIN'); // Start transaction

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into the users table
        const result = await pool.query(
            'INSERT INTO users (email, password, terms_agreed, subscription_status) VALUES ($1, $2, $3::BOOLEAN, $4) RETURNING *',
            [email, hashedPassword, termsAgreedValue, 'free']
        );

        await pool.query('COMMIT'); // Commit transaction
        res.status(201).json(result.rows[0]);
    } catch (err) {
        await pool.query('ROLLBACK'); // Rollback on error
        console.error("Error creating user:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update user account info
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, subscription_status } = req.body;

    try {
        const result = await pool.query(
            'UPDATE users SET email = $1, subscription_status = $2 WHERE id = $3 RETURNING *',
            [email, subscription_status, id]
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

// Delete user account
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
