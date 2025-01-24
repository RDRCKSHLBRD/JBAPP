-- Drop the table if it exists
DROP TABLE IF EXISTS users CASCADE;

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,                           -- Unique identifier for each user
    username VARCHAR(100),                          -- Username (optional)
    email VARCHAR(100) UNIQUE NOT NULL,             -- Email address (unique and required)
    password VARCHAR(255) NOT NULL,                 -- Encrypted password (required)
    first_name VARCHAR(100),                        -- First name (optional)
    last_name VARCHAR(100),                         -- Last name (optional)
    terms_agreed BOOLEAN NOT NULL DEFAULT FALSE,    -- Terms and conditions agreement (default false)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Record creation timestamp (default now)
);

-- Insert sample data
INSERT INTO users (username, email, password, first_name, last_name, terms_agreed)
VALUES 
    (NULL, 'jdoe@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John', 'Doe', TRUE),
    (NULL, 'asmith@example.com', '$2a$10$IgMNeWXzv1vD3V7mQjQpquasMUAay9vQBIS6CSeoT6/HixxY7rsTi', 'Alice', 'Smith', FALSE);
