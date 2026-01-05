# Quiz API - PHP + MySQL Backend

## Setup Instructions

### 1. Start XAMPP
- Open XAMPP Control Panel
- Start **Apache** server
- Start **MySQL** database

### 2. Create Database
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Click "SQL" tab
3. Copy and paste the entire content from `database/schema.sql`
4. Click "Go" to execute

This will create:
- Database: `quiz_app`
- Tables: `users`, `quizzes`, `submissions`, `results_released`, `notifications`
- Default accounts:
  - Instructor: `instructor@example.com` / `password`
  - Student: `student@example.com` / `password`

### 3. Test API
Open browser and go to: `http://localhost/quiz-api/api/auth/login.php`

You should see CORS headers in the response.

## API Endpoints

### Authentication
- `POST /api/auth/login.php` - User login
- `POST /api/auth/register.php` - User registration

### Quiz (Student)
- `GET /api/quiz/get-quizzes.php` - Get all quizzes
- `GET /api/quiz/get-questions.php?quiz_id=1` - Get quiz questions
- `POST /api/quiz/submit.php` - Submit quiz answers
- `GET /api/quiz/check-submission.php?student_id=1&quiz_id=1` - Check if submitted

### Results (Student)
- `GET /api/student/results.php?student_id=1` - Get student's results

### Instructor
- `GET /api/instructor/submissions.php` - Get all submissions
- `POST /api/instructor/release-results.php` - Release quiz results

### Notifications
- `GET /api/notifications/get.php?user_id=1` - Get user notifications
- `POST /api/notifications/mark-read.php` - Mark notification as read

## Example API Calls

### Login
```javascript
fetch('http://localhost/quiz-api/api/auth/login.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'student@example.com',
    password: 'password'
  })
})
```

### Submit Quiz
```javascript
fetch('http://localhost/quiz-api/api/quiz/submit.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    student_id: 1,
    quiz_id: 1,
    answers: { 1: "Paris", 2: "Mars", 3: "4" },
    score: 3,
    total_questions: 3,
    violations: 0,
    time_remaining: 120
  })
})
```

## Testing with Postman
1. Import the API endpoints
2. Set base URL: `http://localhost/quiz-api`
3. Test each endpoint with sample data

## Troubleshooting

### CORS Errors
- Make sure Apache is running
- Check `.htaccess` file exists
- Verify `mod_rewrite` is enabled in XAMPP

### Database Connection Fails
- Check MySQL is running in XAMPP
- Verify credentials in `config/database.php`
- Default: username=`root`, password=`` (empty)

### 404 Not Found
- Confirm files are in `C:\xampp\htdocs\quiz-api\`
- Check file paths are correct
- Apache must be running
