const { pool } = require('../../config/const'); // Correct path to import pool

const getAllJobs = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM jobs');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getJobById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createJob = async (req, res) => {
    const { title, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO jobs (title, description) VALUES ($1, $2) RETURNING *',
            [title, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateJob = async (req, res) => {
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
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteJob = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
};
