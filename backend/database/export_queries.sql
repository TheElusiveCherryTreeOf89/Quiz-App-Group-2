-- Export queries to extract specific users and related data
-- Replace ? with actual email value or run separately for each email

-- 1) Export user by email
SELECT * FROM users WHERE email = 'bjv.jkv@gmail.com';
SELECT * FROM users WHERE email = 'pallerjohnbenedict@gmail.com';
SELECT * FROM users WHERE email = 'quizapp.instructor@gmail.com';

-- 2) Export quizzes created by instructor (by instructor email)
SELECT q.* FROM quizzes q
JOIN users u ON q.created_by = u.id
WHERE u.email = 'quizapp.instructor@gmail.com';

-- 3) Export submissions for the students and for those quizzes
SELECT s.* FROM submissions s
JOIN users u ON s.student_id = u.id
WHERE u.email IN ('bjv.jkv@gmail.com','pallerjohnbenedict@gmail.com');

-- 4) Export notifications for these users
SELECT n.* FROM notifications n
JOIN users u ON n.user_id = u.id
WHERE u.email IN ('bjv.jkv@gmail.com','pallerjohnbenedict@gmail.com','quizapp.instructor@gmail.com');

-- Optionally, to export full JSON dumps, use your DB client's export features to JSON or run SELECT ... FOR JSON (MySQL 8+ supports JSON_OBJECT etc).