//roles.js


// Import database connection
const { pool } = require('../../config/const.js');

// Get all job roles
const getAllRoles = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, category, subcategory, keywords, qualifications, languages, software, processes FROM job_roles ORDER BY category, name ASC'
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching job roles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAllRoles };



