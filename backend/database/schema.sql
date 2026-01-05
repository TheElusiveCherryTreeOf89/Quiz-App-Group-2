-- Quiz App Database Schema
-- Run this in phpMyAdmin SQL tab

CREATE DATABASE IF NOT EXISTS quiz_app;
USE quiz_app;

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('student', 'instructor') NOT NULL,
    bio TEXT,
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Quizzes Table
CREATE TABLE quizzes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    questions JSON NOT NULL,
    time_limit INT NOT NULL COMMENT 'in seconds',
    due_date DATETIME,
    attempts_allowed INT DEFAULT 1,
    items_count INT NOT NULL,
    passing_score INT DEFAULT 70,
    max_violations INT DEFAULT 3,
    shuffle_questions BOOLEAN DEFAULT FALSE,
    shuffle_options BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT FALSE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_created_by (created_by),
    INDEX idx_due_date (due_date),
    INDEX idx_published (published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Quiz Submissions Table
CREATE TABLE submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    quiz_id INT NOT NULL,
    answers JSON NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    violations INT DEFAULT 0,
    time_remaining INT COMMENT 'in seconds',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_submission (student_id, quiz_id),
    INDEX idx_student (student_id),
    INDEX idx_quiz (quiz_id),
    INDEX idx_submitted_at (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Results Released Table
CREATE TABLE results_released (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quiz_id INT NOT NULL,
    released_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    released_by INT NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (released_by) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_release (quiz_id),
    INDEX idx_quiz (quiz_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Notifications Table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin/instructor account
INSERT INTO users (email, password, name, role) VALUES
('instructor@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin Instructor', 'instructor'),
('student@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test Student', 'student');
-- Default password for both: "password"

-- Insert sample quiz
INSERT INTO quizzes (title, description, questions, time_limit, due_date, attempts_allowed, items_count, passing_score, max_violations, shuffle_questions, shuffle_options, published, created_by) VALUES
('Sample Quiz: General Knowledge', 'Test your general knowledge with this quiz.', 
'[{"id":1,"type":"multiple-choice","question":"What is the capital of France?","options":["Berlin","Madrid","Paris","Rome"],"correctAnswer":2,"points":1},{"id":2,"type":"multiple-choice","question":"Which planet is known as the Red Planet?","options":["Venus","Mars","Jupiter","Saturn"],"correctAnswer":1,"points":1},{"id":3,"type":"multiple-choice","question":"What is 2 + 2?","options":["3","4","5","6"],"correctAnswer":1,"points":1}]',
300, '2026-12-31 23:59:59', 1, 3, 70, 3, FALSE, FALSE, TRUE, 1);
