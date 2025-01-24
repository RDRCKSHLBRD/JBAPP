const { pool } = require('../../config/const.js');
const bcrypt = require('bcrypt');

// Get all users (account-related information only)
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, email, password, terms_agreed, subscription_status, created_at FROM users'
        );
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
    const { email, password, firstName, lastName, termsAgreed } = req.body;

    try {
        console.log('Request payload:', req.body); // Log the payload
        await pool.query('BEGIN');
        console.log('Transaction started');

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword); // Log the hashed password

        // Insert into users table
        const userResult = await pool.query(
            `INSERT INTO users (email, password, terms_agreed, subscription_status) VALUES ($1, $2, $3::BOOLEAN, $4) RETURNING id`,
            [email, hashedPassword, termsAgreed, 'free']
        );
        console.log('User insertion result:', userResult.rows[0]); // Log user insertion

        const userId = userResult.rows[0].id;

        // Insert into profiles table
        const profileResult = await pool.query(
            `INSERT INTO profiles (user_id, first_name, last_name) VALUES ($1, $2, $3) RETURNING *`,
            [userId, firstName, lastName]
        );
        console.log('Profile insertion result:', profileResult.rows[0]); // Log profile insertion

        await pool.query('COMMIT');
        console.log('Transaction committed');
        res.status(201).json({ message: 'User created successfully', userId });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error in createUser route:', err); // Log the error
        res.status(500).json({ error: 'Internal server error', details: err.message }); // Send detailed error response
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
