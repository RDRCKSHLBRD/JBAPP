const express = require('express');
const router = express.Router();
const { pool } = require('../../config/const');

/** ===PING=== **/
router.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
});

/** Users CRUD Operations **/

// Get all users
router.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a single user by ID
router.get('/users/:id', async (req, res) => {
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
});

// Add a new user
router.post('/users', async (req, res) => {
    const { username, email } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *',
            [username, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a user by ID
router.put('/users/:id', async (req, res) => {
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
});

// Delete a user by ID
router.delete('/users/:id', async (req, res) => {
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
});

/** Jobs CRUD Operations **/

// Get all jobs
router.get('/jobs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM jobs');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a single job by ID
router.get('/jobs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching job:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a new job
router.post('/jobs', async (req, res) => {
    const { title, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO jobs (title, description) VALUES ($1, $2) RETURNING *',
            [title, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding job:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a job by ID
router.put('/jobs/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const result = await pool.query(
            'UPDATE jobs SET title = $1, description = $2 WHERE id = $3 RETURNING *',
            [title, description, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating job:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a job by ID
router.delete('/jobs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json({ message: 'Job deleted successfully', job: result.rows[0] });
    } catch (err) {
        console.error('Error deleting job:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
