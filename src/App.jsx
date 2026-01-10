import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { createContext, useContext } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import InstructorLoginPage from "./pages/InstructorLoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import StudentDashboard from "./pages/StudentDashboard";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import ManageQuizzesPage from "./pages/ManageQuizzesPage";
import QuizPage from "./components/Student/QuizPage";
import ResultPendingPage from "./pages/ResultPendingPage";
import MyResultPage from "./pages/MyResultPage";
import InstructorDashboard from "./components/Instructor/InstructorDashboard";
import ManageInstructorQuizzesPage from "./pages/ManageInstructorQuizzesPage";
import RequireInstructorAuth from "./components/RequireInstructorAuth";
import InstructorProfilePage from "./pages/InstructorProfilePage";
import InstructorStudentsPage from "./pages/InstructorStudentsPage";
import InstructorAnalyticsPage from "./pages/InstructorAnalyticsPage";
import ToastContainer, { useToast } from "./components/Toast";

export const ToastContext = createContext(null);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
};

function App() {
  const { toasts, showToast, removeToast } = useToast();

  return (
    <ToastContext.Provider value={showToast}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/instructor/login" element={<InstructorLoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<ProfilePage />} />
          <Route path="/student/notifications" element={<NotificationsPage />} />
          <Route path="/student/manage-quizzes" element={<ManageQuizzesPage />} />
          <Route path="/student/quiz" element={<QuizPage />} />
          <Route path="/student/result-pending" element={<ResultPendingPage />} />
          <Route path="/student/result" element={<MyResultPage />} />
          <Route path="/instructor/dashboard" element={<RequireInstructorAuth><InstructorDashboard /></RequireInstructorAuth>} />
          <Route path="/instructor/quizzes" element={<RequireInstructorAuth><ManageInstructorQuizzesPage /></RequireInstructorAuth>} />
          <Route path="/instructor/profile" element={<RequireInstructorAuth><InstructorProfilePage /></RequireInstructorAuth>} />
          <Route path="/instructor/students" element={<RequireInstructorAuth><InstructorStudentsPage /></RequireInstructorAuth>} />
          <Route path="/instructor/analytics" element={<RequireInstructorAuth><InstructorAnalyticsPage /></RequireInstructorAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </Router>
    </ToastContext.Provider>
  );
}

export default App;
