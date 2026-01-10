# Backend Testing Checklist

## Before Committing - MUST TEST:

### ✅ Test 1: Basic PHP Works
1. Make sure XAMPP Apache & MySQL are running
2. Copy backend to XAMPP: `Copy-Item .\backend\* C:\xampp\htdocs\quiz-api\ -Recurse -Force`
3. Open: http://localhost/quiz-api/test.php
4. Should see: "✅ PHP is working!"

### ✅ Test 2: Database Setup
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Go to SQL tab
3. Copy/paste content from `backend/database/schema.sql`
4. Click "Go"
5. Should see: "quiz_app" database with 5 tables

### ✅ Test 3: Registration API
Tested via frontend, Postman, and test-suite.html:
- Registration request sent to `/api/auth/register.php`
- API response: `{ success: true, message: "Registration successful", user: { ... } }`
- New user appears in phpMyAdmin users table
- No errors in PHP logs

### ✅ Test 3: Login API
Open Postman or use this PowerShell:
```powershell
$body = @{
    email = "student@example.com"
    password = "password"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost/quiz-api/api/auth/login.php" -Method POST -Body $body -ContentType "application/json"
```
Should return: user object with success=true

### ✅ Test 4: Get Quizzes API
```powershell
Invoke-RestMethod -Uri "http://localhost/quiz-api/api/quiz/get-quizzes.php" -Method GET
```
Should return: array of quizzes

## ⚠️ ONLY COMMIT IF ALL TESTS PASS!

---

## Missing Features to Add:

### 🔴 CRITICAL (Before Production):
- [ ] Instructor create quiz endpoint (POST /api/instructor/create-quiz.php)
- [ ] Instructor edit quiz endpoint (PUT /api/instructor/edit-quiz.php)  
- [ ] Instructor delete quiz endpoint (DELETE /api/instructor/delete-quiz.php)
- [ ] Server-side quiz scoring (recalculate on submit, don't trust client)
- [ ] Input validation & sanitization
- [ ] Proper error handling

### 🟡 ADVANCED FEATURES:
- [ ] Question randomization
- [ ] Quiz categories/tags
- [ ] Time-based quiz availability
- [ ] Multiple quiz attempts tracking
- [ ] Detailed analytics per question
- [ ] Bulk import questions (CSV/JSON)
- [ ] Quiz templates

---

## Deployment Note:
Backend files stay in `backend/` folder in Git.
For deployment, copy to server's PHP directory (like htdocs).
