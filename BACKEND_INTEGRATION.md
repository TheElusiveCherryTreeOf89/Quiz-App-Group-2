# Backend Integration Guide

## React → PHP API Integration

### Step 1: Install Axios (Optional but Recommended)
```bash
npm install axios
```

### Step 2: Create API Service File

Create `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost/quiz-api/api';

export const api = {
  // Auth
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  register: async (email, password, name, role = 'student') => {
    const response = await fetch(`${API_BASE_URL}/auth/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role })
    });
    return response.json();
  },

  // Quizzes
  getQuizzes: async () => {
    const response = await fetch(`${API_BASE_URL}/quiz/get-quizzes.php`);
    return response.json();
  },

  getQuizQuestions: async (quizId) => {
    const response = await fetch(`${API_BASE_URL}/quiz/get-questions.php?quiz_id=${quizId}`);
    return response.json();
  },

  submitQuiz: async (studentId, quizId, answers, score, totalQuestions, violations, timeRemaining) => {
    const response = await fetch(`${API_BASE_URL}/quiz/submit.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId,
        quiz_id: quizId,
        answers,
        score,
        total_questions: totalQuestions,
        violations,
        time_remaining: timeRemaining
      })
    });
    return response.json();
  },

  checkSubmission: async (studentId, quizId) => {
    const response = await fetch(`${API_BASE_URL}/quiz/check-submission.php?student_id=${studentId}&quiz_id=${quizId}`);
    return response.json();
  },

  // Student Results
  getStudentResults: async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/student/results.php?student_id=${studentId}`);
    return response.json();
  },

  // Instructor
  getAllSubmissions: async () => {
    const response = await fetch(`${API_BASE_URL}/instructor/submissions.php`);
    return response.json();
  },

  releaseResults: async (quizId, instructorId) => {
    const response = await fetch(`${API_BASE_URL}/instructor/release-results.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quiz_id: quizId, instructor_id: instructorId })
    });
    return response.json();
  },

  // Notifications
  getNotifications: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/notifications/get.php?user_id=${userId}`);
    return response.json();
  },

  markNotificationRead: async (notificationId) => {
    const response = await fetch(`${API_BASE_URL}/notifications/mark-read.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notification_id: notificationId })
    });
    return response.json();
  }
};
```

### Step 3: Update LoginPage.jsx

Replace localStorage login with API call:

```javascript
import { api } from '../services/api';

const handleLogin = async (e) => {
  e.preventDefault();
  
  try {
    const result = await api.login(email, password);
    
    if (result.success) {
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      showToast('Login successful!', 'success');
      
      if (result.user.role === 'student') {
        navigate('/student/dashboard');
      } else if (result.user.role === 'instructor') {
        navigate('/instructor/dashboard');
      }
    } else {
      showToast(result.message, 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    showToast('Login failed. Please try again.', 'error');
  }
};
```

### Step 4: Update QuizPage Submit

In `src/components/Student/QuizPage.jsx`:

```javascript
import { api } from '../../services/api';

const handleSubmit = async () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  try {
    const result = await api.submitQuiz(
      currentUser.id,
      1, // quiz ID
      answers,
      score,
      questions.length,
      violations,
      timeLeft
    );
    
    if (result.success) {
      showToast('Quiz submitted successfully!', 'success');
      navigate('/student/result-pending');
    } else {
      showToast(result.message, 'error');
    }
  } catch (error) {
    console.error('Submit error:', error);
    showToast('Submission failed', 'error');
  }
};
```

### Step 5: Update StudentDashboard

Load quizzes from API:

```javascript
import { api } from '../services/api';
import { useEffect, useState } from 'react';

const [quizzes, setQuizzes] = useState([]);

useEffect(() => {
  const fetchQuizzes = async () => {
    try {
      const result = await api.getQuizzes();
      if (result.success) {
        setQuizzes(result.quizzes);
      }
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    }
  };
  
  fetchQuizzes();
}, []);
```

## Migration Checklist

- [ ] Create PHP backend in `C:\xampp\htdocs\quiz-api\`
- [ ] Run `database/schema.sql` in phpMyAdmin
- [ ] Test API endpoints in browser/Postman
- [ ] Create `src/services/api.js` in React
- [ ] Update LoginPage to use API
- [ ] Update RegistrationPage to use API
- [ ] Update QuizPage submit to use API
- [ ] Update StudentDashboard to load quizzes from API
- [ ] Update MyResultPage to fetch results from API
- [ ] Update InstructorDashboard to fetch submissions
- [ ] Test release results functionality
- [ ] Remove all localStorage CRUD (keep user session only)

## Important Notes

1. **Keep localStorage for**: User session (currentUser), dark mode preference
2. **Remove localStorage for**: Quiz data, submissions, results, notifications
3. **Test each page** after migration to ensure API calls work
4. **Add loading states** for API calls (spinners, skeletons)
5. **Add error handling** for failed API requests
