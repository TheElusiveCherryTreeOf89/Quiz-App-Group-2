# Backend Quick Reference

## 🚀 Backend is Working!

Both locations are synced and functional.

## 📍 Two Locations:

1. **Source (Git tracked):** `C:\BS_Projects\quiz-app\backend\`
2. **Running (XAMPP):** `C:\xampp\htdocs\quiz-api\`

## 🔄 How to Sync:

```powershell
# After editing files in .\backend\
.\sync-backend.ps1
```

## 🧪 Quick Tests:

### Test Login
```powershell
$body = @{ email = "student@example.com"; password = "password" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost/quiz-api/api/auth/login.php" -Method POST -Body $body -ContentType "application/json"
```

### Test Create Quiz
```powershell
$quiz = @{
    instructor_id = 1
    title = "Test Quiz"
    description = "Testing"
    timeLimit = 600
    passingScore = 70
    maxViolations = 3
    published = $true
    questions = @(
        @{ id = 1; type = "multiple-choice"; question = "2+2?"; options = @("3","4","5","6"); correctAnswer = 1; points = 1 }
    )
} | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri "http://localhost/quiz-api/api/instructor/create-quiz.php" -Method POST -Body $quiz -ContentType "application/json"
```

## 📊 All Endpoints:

### Auth
- POST `/api/auth/login.php`
- POST `/api/auth/register.php`

### Instructor Quiz CRUD
- POST `/api/instructor/create-quiz.php` ⭐
- GET `/api/instructor/get-quizzes.php?instructor_id={id}` ⭐
- POST `/api/instructor/edit-quiz.php` ⭐
- POST `/api/instructor/delete-quiz.php` ⭐

### Student
- GET `/api/quiz/get-quizzes.php`
- GET `/api/quiz/get-questions.php?quiz_id={id}`
- POST `/api/quiz/submit.php`
- GET `/api/student/results.php?student_id={id}`

### Instructor
- GET `/api/instructor/submissions.php`
- POST `/api/instructor/release-results.php`

### Notifications
- GET `/api/notifications/get.php?user_id={id}`
- POST `/api/notifications/mark-read.php`

## 🎯 Ready to Commit:

```bash
git add backend/ sync-backend.ps1 setup-backend.ps1 BACKEND_*.md
git commit -m "feat: Add complete PHP backend with instructor quiz CRUD"
git push origin main
```
