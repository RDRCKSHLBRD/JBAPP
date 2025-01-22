// admin.js

const { pool } = require('../../config/const'); // Import the pool for database queries

// Fetch all tables and their data
const fetchAllTables = async (req, res) => {
    try {
        const tables = await pool.query(`
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public';
        `);

        const tableData = {};
        for (const row of tables.rows) {
            const tableName = row.tablename;
            const data = await pool.query(`SELECT * FROM ${tableName}`);
            tableData[tableName] = data.rows;
        }

        res.status(200).json(tableData);
    } catch (err) {
        console.error('Error fetching tables:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Reset all tables dynamically
const resetAllTables = async (req, res) => {
    const { password } = req.body;

    // Check if the provided password matches the environment variable
    if (password !== process.env.DB_RESET_PASS) {
        return res.status(403).json({ error: 'Unauthorized: Incorrect password.' });
    }

    try {
        await pool.query(`
            DO $$ 
            DECLARE
                table_name TEXT;
            BEGIN
                FOR table_name IN
                    SELECT tablename 
                    FROM pg_tables 
                    WHERE schemaname = 'public'
                LOOP
                    EXECUTE format('TRUNCATE TABLE %I RESTART IDENTITY CASCADE', table_name);
                END LOOP;
            END $$;
        `);

        res.status(200).json({ message: 'All tables reset successfully' });
    } catch (err) {
        console.error('Error resetting tables:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    fetchAllTables,
    resetAllTables,
};
