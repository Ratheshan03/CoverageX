-- CoverageX To-Do Application Database Initialization Script
-- MySQL 8.0

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS todoapp;

-- Use the database
USE todoapp;

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS task;

-- Create task table
CREATE TABLE task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_completed_created (completed, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for testing (optional)
INSERT INTO task (title, description, completed) VALUES
('Buy books', 'Buy books for the next school year', FALSE),
('Clean home', 'Need to clean the bed room', FALSE),
('Takehome assignment', 'Finish the mid-term assignment', FALSE),
('Play Cricket', 'Play the soft ball cricket match on next Sunday', FALSE),
('Help Saman', 'Saman need help with his software project', FALSE);

-- Verify table creation
SELECT 'Database initialized successfully!' AS message;
SELECT COUNT(*) AS sample_tasks_count FROM task;
