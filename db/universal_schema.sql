-- Drop the table if it exists
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS user_jobs CASCADE;
DROP TABLE IF EXISTS resumes CASCADE;

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    subscription_status VARCHAR(50), -- e.g., 'free', 'premium', etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the profiles table
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE, -- Link profile to user
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    contact_number VARCHAR(15),
    country VARCHAR(100),
    city VARCHAR(100),
    job_preferences JSONB, -- e.g., {'fullTime': true, 'remote': false}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the companies table
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    location VARCHAR(100),
    industry VARCHAR(100),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the jobs table
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    company_id INT REFERENCES companies(id) ON DELETE CASCADE, -- Link job to company
    location VARCHAR(100),
    salary_range VARCHAR(50),
    job_type VARCHAR(50), -- e.g., 'full-time', 'remote'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the user_jobs table (bridge table for user-job interactions)
CREATE TABLE user_jobs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
    status VARCHAR(50), -- e.g., 'applied', 'saved'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the resumes table
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE, -- Link resume to user
    file_path VARCHAR(255) NOT NULL, -- Location of the uploaded file
    metadata JSONB, -- Metadata such as parsing info, keywords, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
