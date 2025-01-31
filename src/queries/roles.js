const { pool } = require('../../config/const.js');

const getAllRoles = async (req, res) => {
    try {
        console.log('📡 API `/api/profile/roles` was called...'); // ✅ Log when API is hit

        const result = await pool.query(
            'SELECT id, name, category FROM job_roles ORDER BY category, name ASC LIMIT 5'
        );

        console.log('✅ Query Success:', result.rows); // ✅ Log the result
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('🔥 Error fetching job roles:', error.message); // ✅ Show error details
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

module.exports = { getAllRoles };
