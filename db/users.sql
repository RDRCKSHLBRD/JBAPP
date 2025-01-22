-- Drop the table if it exists
DROP TABLE IF EXISTS users CASCADE;

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,                           -- Unique identifier for each user
    username VARCHAR(100) NOT NULL,                 -- Username (required)
    email VARCHAR(100) UNIQUE NOT NULL,             -- Email address (unique and required)
    password VARCHAR(255) NOT NULL,                 -- Encrypted password (required)
    terms_agreed BOOLEAN NOT NULL DEFAULT FALSE,    -- Terms and conditions agreement (default false)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Record creation timestamp (default now)
);

-- Insert sample data
INSERT INTO users (username, email, password, terms_agreed)
VALUES 
    ('jdoe', 'jdoe@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
    ('asmith', 'asmith@example.com', '$2a$10$IgMNeWXzv1vD3V7mQjQpquasMUAay9vQBIS6CSeoT6/HixxY7rsTi', FALSE);
