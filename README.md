# 📝 Quiz Application - DCIT 26 Project

A comprehensive, full-stack web application designed for creating, managing, and taking online quizzes with real-time monitoring and analytics. Built with modern web technologies and a focus on user experience, security, and performance.

---

## 🎯 Project Overview

This Quiz Application is a React-based platform that serves two distinct user roles: **Students** and **Instructors**. The system provides an intuitive interface for quiz creation, administration, and completion, complete with advanced features like tab monitoring, violation detection, dark mode support, and comprehensive analytics.

The project was developed as part of the **DCIT 26: Application Development and Emerging Technologies** course, demonstrating modern web development practices, collaborative Git workflows, and responsive design principles.

### ✨ Key Highlights

- **Dual-Role System**: Separate interfaces for students and instructors with role-based access control
- **Real-Time Monitoring**: Tab-switching detection and violation tracking during quiz attempts
- **Dark Mode Support**: Fully integrated theme system with smooth transitions across all pages
- **Responsive Design**: Mobile-friendly interface that adapts to all screen sizes
- **State Management**: Centralized state using Zustand for predictable data flow
- **Modern UI/UX**: Clean, intuitive design with smooth animations and transitions
- **Analytics Dashboard**: Comprehensive reporting for instructors with score distributions and performance metrics

---

## 👥 Development Team

This project was collaboratively developed by a team of 7 developers, each contributing their expertise:

| Team Member | Role | Responsibilities |
|------------|------|------------------|
| **Von Zymon Raphael B. Patagnan** | Lead Developer / Full-Stack | Overall architecture, backend integration, state management, Git workflow management |
| **Mary Strelline R. Magdamit** | Lead Designer | UI/UX design, visual assets, branding, design system |
| **John Benedict C. Paller** | Backend & Debugging Specialist | Backend logic, API integration, bug fixes, testing |
| **Dianne F. Nataya** | Documentation Lead | Technical documentation, README, user guides, project documentation |
| **Lester C. Pajarillo** | UX Specialist | User experience optimization, usability testing, interface improvements |
| **Sean Hanray Miguel** | Backend & UX Support | Backend assistance, user flow optimization, feature implementation |
| **Rose Ann G. Niorales** | UI & Documentation Support | Interface refinement, documentation assistance, content creation |

---

## 🚀 Development Journey

### Project Inception (December 2025)
Our journey began with a clear vision: to create a comprehensive quiz application that would serve both students and instructors while maintaining academic integrity. As a team of 7 developers from DCIT 26, we started with basic wireframes and a shared understanding of the core requirements.

**Initial Challenges:**
- Coordinating 7 developers across different schedules and time zones
- Establishing a solid Git workflow for collaborative development
- Balancing feature complexity with development time constraints
- Ensuring consistent UI/UX across all pages

### Sprint 1: Foundation & Authentication (Early December)
We began by setting up the project foundation with React, Vite, and Tailwind CSS. The first major milestone was implementing a dual-role authentication system that clearly separated student and instructor interfaces.

**Key Achievements:**
- ✅ Basic React setup with routing
- ✅ Separate login pages for students and instructors
- ✅ Role-based navigation and access control
- ✅ Initial Git workflow establishment

**Lessons Learned:**
- The importance of early planning and clear role definitions
- Setting up proper branch protection rules from day one
- Regular standup meetings to maintain team alignment

### Sprint 2: Core Quiz Functionality (Mid-December)
With authentication working, we focused on the heart of the application: quiz creation and taking. This involved complex state management and real-time features like timers and violation detection.

**Major Features Implemented:**
- ✅ Quiz creation interface with multiple question types
- ✅ Student quiz-taking experience with countdown timers
- ✅ Tab-switching detection and violation tracking
- ✅ Auto-save functionality for progress persistence
- ✅ Question navigation and progress tracking

**Technical Challenges Overcome:**
- Implementing accurate countdown timers that persist across page refreshes
- Creating reliable tab-monitoring using browser APIs
- Managing complex quiz state with Zustand
- Ensuring responsive design across all screen sizes

### Sprint 3: Analytics & Results (Late December)
As we approached the holiday season, we shifted focus to instructor tools and analytics. This involved creating comprehensive dashboards and result management systems.

**Dashboard Features Added:**
- ✅ Instructor analytics with score distributions and charts
- ✅ Results management with sorting and filtering
- ✅ Student management interface
- ✅ Dark mode implementation across all pages
- ✅ Export functionality for reports

**Data Visualization Challenges:**
- Creating meaningful charts that adapt to different data sets
- Implementing responsive chart components
- Ensuring accessibility in data presentation

### Sprint 4: Polish & Deployment Preparation (January 2026)
The final sprint focused on refinement, bug fixes, and preparing for deployment. We conducted extensive testing, improved UI/UX, and added professional touches.

**Final Enhancements:**
- ✅ Landing page with team showcase and professional branding
- ✅ Comprehensive documentation and README updates
- ✅ Performance optimizations and code cleanup
- ✅ Cross-browser compatibility testing
- ✅ Mobile responsiveness improvements

**Deployment Preparation:**
- Vercel configuration and build optimization
- Environment variable setup for production
- Final security audits and code reviews
- Performance testing and optimization

### Technical Evolution
Throughout the project, our codebase evolved significantly:

**Architecture Improvements:**
- Migrated from basic React hooks to Zustand for state management
- Implemented proper component separation and reusability
- Added comprehensive error handling and loading states
- Established consistent styling patterns with Tailwind CSS

**Code Quality Focus:**
- ESLint configuration for consistent code standards
- Regular code reviews and pair programming sessions
- Documentation of components and functions
- Performance monitoring and optimization

### Team Dynamics & Collaboration
Working as a team of 7 required excellent communication and organization:

**Collaboration Highlights:**
- Daily standup meetings to track progress and blockers
- Clear division of responsibilities based on team member strengths
- Regular code reviews to maintain quality standards
- Documentation of decisions and architectural choices

**Git Workflow Excellence:**
- Feature branch workflow with clear naming conventions
- Pull request reviews before merging to main
- Regular commits with descriptive messages
- Conflict resolution and merge management

### Challenges & Solutions
Every great project faces challenges, and ours was no exception:

**Major Roadblocks:**
1. **State Management Complexity**: Solved by implementing Zustand stores
2. **Real-time Timer Accuracy**: Resolved with proper event handling and persistence
3. **Cross-browser Compatibility**: Addressed through extensive testing and fallbacks
4. **Team Coordination**: Managed with clear communication channels and regular updates

**Key Success Factors:**
- Strong leadership from our Lead Developer
- Dedicated team members committed to quality
- Regular feedback loops and iterative improvements
- Focus on both functionality and user experience

### Final Reflections
As we approach deployment, we're proud of what we've accomplished:

**Project Impact:**
- Demonstrated modern web development skills
- Created a functional, professional application
- Learned the importance of collaborative development
- Gained experience with real-world project management

**Future Vision:**
While this marks the completion of our DCIT 26 project, the QuizApp has potential for future enhancements like real-time collaboration, mobile apps, and advanced analytics.

**Team Growth:**
Each team member has grown significantly through this project, gaining experience in full-stack development, UI/UX design, project management, and collaborative workflows.

---

## 🚀 Features

### For Students

#### 📚 Quiz Management
- Browse available quizzes with detailed information
- View quiz titles, descriptions, time limits, and question counts
- Check quiz availability status before attempting

#### ✍️ Quiz Taking Experience
- **Countdown Timer**: Real-time timer display with visual warnings
- **Tab Monitoring**: Automatic detection of tab switches during quiz attempts
- **Violation Tracking**: Three-strike system for academic integrity
- **Question Navigation**: Jump to any question using the question palette
- **Answer Selection**: Multiple choice, true/false, and dropdown question types
- **Progress Tracking**: Visual indicators showing answered vs unanswered questions
- **Auto-Submit**: Quiz automatically submits when time expires

#### 📊 Results & Analytics
- View detailed quiz results after instructor releases them
- See score breakdowns with percentage and pass/fail status
- Access question-by-question review with correct/incorrect indicators
- Track violation history and quiz completion status

#### 🎨 Additional Features
- Dark mode toggle for comfortable viewing
- Profile management with editable information
- Notification system for quiz updates and results
- Responsive sidebar navigation
- Real-time toast notifications for actions

### For Instructors

#### 🎓 Quiz Creation & Management
- Create quizzes with customizable settings:
  - Quiz title and description
  - Time limits and deadlines
  - Passing percentage threshold
  - Randomization options
- Add multiple question types:
  - Multiple choice (single answer)
  - Multiple correct answers
  - True/False questions
  - Dropdown selections
- Bulk quiz operations (publish, unpublish, delete)
- Quiz duplication for easy template creation
- Search and filter quizzes by status

#### 📈 Student Management
- View complete list of registered students
- Search students by name or email
- Export student data for reporting
- Track student quiz participation

#### 📊 Analytics Dashboard
- **Score Distribution**: Visual charts showing grade ranges
- **Pass/Fail Rates**: Circular progress indicators with percentages
- **Quiz Performance**: Identify best and worst performing quizzes
- **Violation Tracking**: Monitor academic integrity across all quizzes
- **Metric Cards**: Quick overview of total quizzes, students, and submissions
- **Export Functionality**: Generate PDF reports of analytics data

#### 🎯 Results Management
- Dashboard view of all student submissions
- Sort results by name, score, percentage, status, violations, or date
- Release results to students when ready
- View detailed submission breakdowns with question-level analysis
- Track violation counts per student

#### 🌙 Dark Mode
- Consistent dark theme across all instructor pages
- Smooth color transitions
- Optimized readability in low-light conditions
- Theme persistence across sessions

---

## 🛠️ Technology Stack

### Frontend
- **React 19.2.0** - Modern UI library with hooks and concurrent features
- **React Router DOM 7.11.0** - Client-side routing and navigation
- **Vite 7.2.4** - Fast build tool and development server
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **Zustand 5.0.9** - Lightweight state management
- **Heroicons 2.2.0** - Beautiful hand-crafted SVG icons

### Development Tools
- **ESLint 9.39.1** - Code linting and style enforcement
- **PostCSS 8.5.6** - CSS processing and optimization
- **Autoprefixer 10.4.22** - Automatic vendor prefix addition

### Backend (Planned/In Progress)
- **PHP 8.2.12** - Server-side logic
- **MySQL** - Database management
- **XAMPP** - Local development environment

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Git for version control
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/quiz-app.git
cd quiz-app
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Configure Environment (Optional)
Create a `.env` file in the root directory if you need custom configurations:
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Quiz Application
```

### Step 4: Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Step 5: Build for Production
```bash
npm run build
# or
yarn build
```

Production files will be generated in the `dist/` directory.

---

## 🎮 Usage Guide

### For Students

1. **Registration/Login**
   - Navigate to the student login page
   - Enter your credentials or register as a new student
   - Access is limited to students only

2. **Taking a Quiz**
   - Browse available quizzes from the dashboard
   - Click "Take Quiz" on any available quiz
   - Read the instructions carefully before starting
   - Answer questions within the time limit
   - Avoid switching tabs (triggers violations)
   - Submit when finished or wait for auto-submit

3. **Viewing Results**
   - Check the Results page after instructor releases scores
   - Review your answers and see correct solutions
   - Track your performance over time

### For Instructors

1. **Login**
   - Use instructor credentials to access the instructor dashboard
   - Separate login page ensures role segregation

2. **Creating Quizzes**
   - Navigate to "Create Quiz" from the sidebar
   - Fill in quiz details (title, description, time limit)
   - Add questions with multiple choice or other formats
   - Set correct answers and point values
   - Publish when ready

3. **Managing Students**
   - View all registered students in the Students page
   - Search and filter student lists
   - Export data for external use

4. **Releasing Results**
   - Go to Results Dashboard
   - Review all student submissions
   - Click "Release Results" when ready
   - Students will be notified and can view their scores

5. **Analytics**
   - Access the Analytics page for detailed insights
   - View score distributions, pass rates, and trends
   - Identify quizzes needing improvement
   - Export reports for documentation

---

## 📁 Project Structure

```
quiz-app/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, logos, icons
│   ├── components/
│   │   ├── Instructor/       # Instructor-specific components
│   │   │   └── InstructorDashboard.jsx
│   │   └── Student/          # Student-specific components
│   │       ├── QuizPage.jsx
│   │       ├── QuestionCard.jsx
│   │       ├── ResultDetailsModal.jsx
│   │       ├── TimeUpModal.jsx
│   │       ├── ViolationModal.jsx
│   │       ├── SubmitConfirmModal.jsx
│   │       └── MaxViolationsModal.jsx
│   ├── pages/                # Main application pages
│   │   ├── CreateQuizPage.jsx
│   │   ├── InstructorAnalyticsPage.jsx
│   │   ├── InstructorLoginPage.jsx
│   │   ├── InstructorProfilePage.jsx
│   │   ├── InstructorStudentsPage.jsx
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ManageInstructorQuizzesPage.jsx
│   │   ├── ManageQuizzesPage.jsx
│   │   ├── MyResultPage.jsx
│   │   ├── NotificationsPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── RegistrationPage.jsx
│   │   ├── ResultPendingPage.jsx
│   │   └── StudentDashboard.jsx
│   ├── store/
│   │   └── quizStore.js       # Zustand state management
│   ├── App.jsx                # Main app component with routing
│   ├── App.css                # Global styles
│   ├── index.css              # Tailwind imports
│   └── main.jsx               # Application entry point
├── .gitignore                 # Git ignore rules
├── eslint.config.js           # ESLint configuration
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── vite.config.js             # Vite configuration
└── README.md                  # This file
```

---

## 🎨 Design Features

### Color Palette
- **Primary**: Indigo (#6366F1) - Buttons, active states, accents
- **Success**: Green (#22C55E) - Pass indicators, success messages
- **Error**: Red (#DC2626) - Fail indicators, delete actions, violations
- **Warning**: Orange (#FF6B00) - Student accent color, alerts
- **Neutral**: Grays - Text, borders, backgrounds

### Dark Mode Implementation
- Toggle available in all authenticated pages
- Persistent theme preference stored in localStorage
- Smooth 0.3s transitions between themes
- Optimized color contrast for readability
- All charts and graphs adapt to theme

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

---

## 🔒 Security Features

### Authentication
- Role-based access control (Student vs Instructor)
- Separate login endpoints for each role
- Session persistence using localStorage
- Automatic redirects for unauthorized access

### Quiz Integrity
- Tab-switching detection during quizzes
- Three-strike violation system with automatic disqualification
- Violation timestamps and logging
- Randomization options for questions and answers

### Data Protection
- Environment variables for sensitive data
- `.gitignore` configured to exclude secrets
- Client-side validation before submission
- Secure state management

---

## 🐛 Known Issues & Future Improvements

### Current Limitations
- Backend integration is local-only (XAMPP required)
- No real-time collaboration features
- Limited question types (no essay questions yet)
- File upload functionality not implemented
- Email notifications not configured

### Planned Features
- Live quiz sessions with real-time updates
- More question types (essay, file upload, matching)
- Email notifications for quiz releases and deadlines
- Advanced analytics with time-series graphs
- Quiz templates and question banks
- Integration with Learning Management Systems (LMS)
- Mobile app versions (iOS/Android)
- Proctoring features with webcam monitoring

---

## 📊 Git Workflow & Collaboration

This project demonstrates professional version control practices:

### Branching Strategy
- `main` branch for production-ready code
- Feature branches for new developments
- Bugfix branches for issue resolution
- Documentation branches for README and guides

### Commit Convention
- **feat**: New feature additions
- **fix**: Bug fixes and corrections
- **refactor**: Code restructuring without feature changes
- **style**: UI/UX improvements and CSS updates
- **docs**: Documentation updates
- **chore**: Maintenance tasks and dependency updates

### Collaboration Process
1. Pull latest changes from main
2. Create feature branch
3. Develop and test locally
4. Commit with clear messages
5. Push to GitHub
6. Create pull request for review
7. Merge after approval

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Student can register and login
- [ ] Student can view available quizzes
- [ ] Quiz timer counts down correctly
- [ ] Tab switching triggers violations
- [ ] Quiz auto-submits on time expiration
- [ ] Instructor can create quizzes with questions
- [ ] Instructor can publish/unpublish quizzes
- [ ] Results dashboard displays accurate data
- [ ] Dark mode toggles correctly on all pages
- [ ] Responsive design works on mobile devices

---

## 📄 License

This project is developed for educational purposes as part of the DCIT 26 course. All rights reserved by the development team.

---

## 🙏 Acknowledgments

- **Edan Belgica**: For guidance and project requirements
- **Cavite State University - Bacoor Campus**: For providing the learning environment
- **React & Vite Communities**: For excellent documentation and tools
- **Open Source Contributors**: For the libraries and frameworks used

---

## 📞 Contact & Support

For questions, issues, or contributions, please contact the development team:

- **Lead Developer**: Von Zymon Raphael B. Patagnan
- **Project Repository**: [\[GitHub Link\]](https://github.com/TheElusiveCherryTreeOf89/Quiz-App-Group-2)
- **Documentation**: See `docs/` folder for detailed guides

---

## 🎓 Course Information

- **Course**: DCIT 26 - Application Development and Emerging Technologies
- **Institution**: Cavite State University - Bacoor Campus
- **Academic Year**: 2025-2026
- **Submission Date**: January 5, 2026

---

**Built with ❤️ by the DCIT 26 Quiz App Development Team**
