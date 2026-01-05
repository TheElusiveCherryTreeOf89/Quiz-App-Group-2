import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../App";

export default function ManageQuizzesPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("available");
  const [activeMenu, setActiveMenu] = useState("manage-quizzes");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "student") {
      navigate("/login");
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  // Load dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) {
      setDarkMode(JSON.parse(saved));
    }
  }, []);

  // Handle window resize for mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem("darkMode", JSON.stringify(newValue));
      return newValue;
    });
  };

  // Theme object
  const theme = {
    background: darkMode ? '#1a1a1a' : '#f0f0f0',
    card: darkMode ? '#2d2d2d' : 'white',
    text: darkMode ? '#ffffff' : '#1a1a1a',
    textSecondary: darkMode ? '#a0a0a0' : '#666',
    border: darkMode ? '#404040' : '#eee',
    sidebarBg: darkMode ? '#2d2d2d' : 'white',
    sidebarText: darkMode ? '#ffffff' : '#1a1a1a'
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || { name: "Student", email: "student@example.com" };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const availableQuizzes = [
    {
      id: 3,
      title: "Quiz 3: Interface Design & Usability",
      description: "Description description description description description description",
      items: 20,
      timeLimit: "1 hour",
      dueDate: "Today, 11:59 PM",
      attemptsAllowed: 1,
      status: "available"
    },
    {
      id: 4,
      title: "Quiz 4: React Fundamentals",
      description: "Test your knowledge of React core concepts and hooks",
      items: 20,
      timeLimit: "1 hour",
      dueDate: "Dec 20, 23:59",
      attemptsAllowed: 1,
      status: "available"
    },
    {
      id: 5,
      title: "Quiz 5: React Advanced Concept",
      description: "Advanced React patterns and performance optimization",
      items: 20,
      timeLimit: "1 hour",
      dueDate: "Dec 25, 23:59",
      attemptsAllowed: 1,
      status: "available"
    }
  ];

  const submittedQuizzes = [
    {
      id: 2,
      title: "Quiz 2: Requirements Engineering",
      items: 5,
      timeLimit: "10 mins",
      dueDate: "Dec 8, 23:59",
      attemptsAllowed: 0,
      status: "submitted"
    },
    {
      id: 1,
      title: "Quiz 1: Intro To Web App",
      items: 10,
      timeLimit: "1 hour",
      dueDate: "Dec 1, 23:59",
      attemptsAllowed: 0,
      status: "submitted"
    }
  ];

  const handleAttemptQuiz = (quizId) => {
    if (user) {
      const completedQuizzes = JSON.parse(localStorage.getItem("completedQuizzes") || "{}");
      if (completedQuizzes[user.email]) {
        showToast("You have already taken this quiz. Please wait for the instructor to release your score.", "warning");
        return;
      }
    }
    navigate("/student/quiz");
  };

  const handleViewResult = (quizId) => {
    const resultsReleased = localStorage.getItem("resultsReleased") === "true";
    if (resultsReleased) {
      navigate("/student/result");
    } else {
      navigate("/student/result-pending");
    }
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background, transition: 'background-color 0.3s ease' }}>
        <div style={{ fontSize: '18px', color: theme.textSecondary, transition: 'color 0.3s ease' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: theme.background, position: 'relative', transition: 'background-color 0.3s ease' }}>
      {/* Left Sidebar */}
      <aside style={{
        width: '200px',
        backgroundColor: theme.sidebarBg,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: darkMode ? '2px 0 10px rgba(0,0,0,0.3)' : '2px 0 10px rgba(0,0,0,0.08)',
        flexShrink: 0
      }}>
        {/* Menu Header */}
        <div style={{ padding: '20px', borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '20px', fontWeight: '900', fontFamily: 'var(--font-heading)', letterSpacing: '0.5px', color: theme.sidebarText, transition: 'color 0.3s ease' }}>Menu</span>
            <span style={{ fontSize: '18px', cursor: 'pointer', color: theme.sidebarText, transition: 'color 0.3s ease' }}>≡</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1, padding: '15px 12px' }}>
          {/* Dashboard */}
          <button
            onClick={() => {
              setActiveMenu("dashboard");
              navigate("/student/dashboard");
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '6px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMenu === "dashboard" ? '#FF6B00' : 'transparent',
              color: activeMenu === "dashboard" ? 'white' : theme.sidebarText,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (activeMenu !== "dashboard") e.currentTarget.style.backgroundColor = darkMode ? '#3d3d3d' : '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              if (activeMenu !== "dashboard") e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '16px' }}>🏠</span>
            <span>Dashboard</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => {
              setActiveMenu("profile");
              navigate("/student/profile");
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '6px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMenu === "profile" ? '#FF6B00' : 'transparent',
              color: activeMenu === "profile" ? 'white' : theme.sidebarText,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (activeMenu !== "profile") e.currentTarget.style.backgroundColor = darkMode ? '#3d3d3d' : '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              if (activeMenu !== "profile") e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '16px' }}>👤</span>
            <span>Profile</span>
          </button>

          {/* Manage Quizzes */}
          <button
            onClick={() => {
              setActiveMenu("manage-quizzes");
              navigate("/student/manage-quizzes");
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '6px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMenu === "manage-quizzes" ? '#FF6B00' : 'transparent',
              color: activeMenu === "manage-quizzes" ? 'white' : theme.sidebarText,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (activeMenu !== "manage-quizzes") e.currentTarget.style.backgroundColor = darkMode ? '#3d3d3d' : '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              if (activeMenu !== "manage-quizzes") e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '16px' }}>📝</span>
            <span>Manage Quizzes</span>
          </button>

          {/* My Result */}
          <button
            onClick={() => {
              setActiveMenu("results");
              navigate("/student/result");
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '6px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMenu === "results" ? '#FF6B00' : 'transparent',
              color: activeMenu === "results" ? 'white' : theme.sidebarText,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (activeMenu !== "results") e.currentTarget.style.backgroundColor = darkMode ? '#3d3d3d' : '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              if (activeMenu !== "results") e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '16px' }}>🏆</span>
            <span>My Result</span>
          </button>

          {/* Notification */}
          <button
            onClick={() => {
              setActiveMenu("notifications");
              navigate("/student/notifications");
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '6px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMenu === "notifications" ? '#FF6B00' : 'transparent',
              color: activeMenu === "notifications" ? 'white' : theme.sidebarText,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (activeMenu !== "notifications") e.currentTarget.style.backgroundColor = darkMode ? '#3d3d3d' : '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              if (activeMenu !== "notifications") e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '16px' }}>🔔</span>
            <span>Notification</span>
          </button>
        </nav>

        {/* Logout Button */}
        <div style={{ padding: '15px 12px', borderTop: `1px solid ${theme.border}` }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#DC2626',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              fontFamily: 'var(--font-body)',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B91C1C'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
          >
            <span style={{ fontSize: '16px' }}>🚪</span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <header style={{
          backgroundColor: '#FFD700',
          padding: isMobile ? '12px 16px' : '12px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          gap: '12px'
        }}>
          {/* Logo */}
          <img 
            src="/src/assets/1.svg" 
            alt="QuizApp Logo"
            style={{
              height: isMobile ? '48px' : '56px',
              cursor: 'default',
              transition: 'transform 0.2s'
            }}
          />

          {/* Right Side Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '18px', position: 'relative' }}>
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* Profile Icon with Dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  width: isMobile ? '36px' : '40px',
                  height: isMobile ? '36px' : '40px',
                  borderRadius: '50%',
                  backgroundColor: theme.text,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.background,
                  fontSize: isMobile ? '16px' : '20px',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >👤</button>
              
              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: theme.card,
                  borderRadius: '12px',
                  boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.15)',
                  width: '220px',
                  zIndex: 1000,
                  animation: 'scaleIn 0.2s ease-out',
                  overflow: 'hidden',
                  transition: 'background-color 0.3s ease'
                }}>
                  <div style={{
                    padding: '16px',
                    borderBottom: `1px solid ${theme.border}`,
                    backgroundColor: darkMode ? '#3d3d3d' : '#f9f9f9'
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: theme.text, marginBottom: '4px', fontFamily: 'var(--font-heading)', transition: 'color 0.3s ease' }}>
                      {currentUser?.name || 'Student'}
                    </div>
                    <div style={{ fontSize: '13px', color: theme.textSecondary, fontFamily: 'var(--font-body)', transition: 'color 0.3s ease' }}>
                      {currentUser?.email}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/student/profile");
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: theme.text,
                      transition: 'background-color 0.2s',
                      fontFamily: 'var(--font-body)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#3d3d3d' : '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span>👤</span>
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/student/dashboard");
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: theme.text,
                      transition: 'background-color 0.2s',
                      fontFamily: 'var(--font-body)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#3d3d3d' : '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span>📊</span>
                    <span>Dashboard</span>
                  </button>

                  <div style={{ borderTop: `1px solid ${theme.border}` }}>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleLogout();
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: 'none',
                        background: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: '#DC2626',
                        transition: 'background-color 0.2s',
                        fontFamily: 'var(--font-body)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#3d3d3d' : '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span>🚪</span>
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Title */}
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{
                fontSize: '42px',
                fontWeight: '900',
                fontStyle: 'italic',
                color: theme.text,
                margin: '0 0 8px 0',
                fontFamily: 'var(--font-heading)',
                transition: 'color 0.3s ease'
              }}>
                Manage Quizzes
              </h1>
              <p style={{ fontSize: '16px', color: theme.textSecondary, margin: 0, transition: 'color 0.3s ease' }}>
                View your quizzes, track their status, and access quiz instructions.
              </p>
            </div>

            {/* Content Grid */}
            <div style={{ display: 'flex', gap: '24px' }}>
              {/* Left - Quizzes Section */}
              <div style={{ flex: 1 }}>
                {/* Tabs */}
                <div style={{
                  display: 'flex',
                  gap: '32px',
                  marginBottom: '24px',
                  borderBottom: `2px solid ${theme.border}`,
                  transition: 'border-color 0.3s ease'
                }}>
                  <button
                    onClick={() => setActiveTab("available")}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '18px',
                      fontWeight: '700',
                      color: activeTab === "available" ? theme.text : theme.textSecondary,
                      cursor: 'pointer',
                      padding: '12px 0',
                      borderBottom: activeTab === "available" ? `3px solid ${theme.text}` : '3px solid transparent',
                      marginBottom: '-2px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Available Quizzes
                  </button>
                  <button
                    onClick={() => setActiveTab("submitted")}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '18px',
                      fontWeight: '700',
                      color: activeTab === "submitted" ? theme.text : theme.textSecondary,
                      cursor: 'pointer',
                      padding: '12px 0',
                      borderBottom: activeTab === "submitted" ? `3px solid ${theme.text}` : '3px solid transparent',
                      marginBottom: '-2px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Submitted Quizzes
                  </button>
                </div>

                {/* Quiz Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {activeTab === "available" ? (
                    <>
                      {availableQuizzes.map(quiz => (
                        <div key={quiz.id} style={{
                          backgroundColor: theme.card,
                          borderRadius: '18px',
                          padding: '28px',
                          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                          border: `1px solid ${theme.border}`,
                          transition: 'background-color 0.3s ease, border-color 0.3s ease'
                        }}>
                          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                            {/* Yellow Question Mark Icon */}
                            <div style={{
                              width: '60px',
                              height: '60px',
                              borderRadius: '50%',
                              backgroundColor: '#FFD700',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              fontSize: '32px',
                              fontWeight: '900',
                              color: 'white',
                              boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
                            }}>
                              ?
                            </div>

                            {/* Quiz Info */}
                            <div style={{ flex: 1 }}>
                              <h3 style={{
                                fontSize: '22px',
                                fontWeight: '700',
                                color: theme.text,
                                margin: '0 0 8px 0',
                                fontFamily: 'var(--font-heading)',
                                transition: 'color 0.3s ease'
                              }}>
                                {quiz.title}
                              </h3>
                              <p style={{
                                fontSize: '14px',
                                color: theme.textSecondary,
                                margin: '0 0 16px 0',
                                lineHeight: '1.4',
                                transition: 'color 0.3s ease'
                              }}>
                                {quiz.description}
                              </p>

                              {/* Yellow Info Bar */}
                              <div style={{
                                backgroundColor: darkMode ? '#3a3000' : '#FFF9E6',
                                borderLeft: '4px solid #FFD700',
                                padding: '16px 20px',
                                marginBottom: '16px',
                                transition: 'background-color 0.3s ease'
                              }}>
                                <div style={{ marginBottom: '8px' }}>
                                  <span style={{ fontSize: '14px', fontWeight: '600', color: theme.text, transition: 'color 0.3s ease' }}>
                                    Items: {quiz.items}
                                  </span>
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                  <span style={{ fontSize: '14px', fontWeight: '600', color: theme.text, transition: 'color 0.3s ease' }}>
                                    Time Limit: {quiz.timeLimit}
                                  </span>
                                </div>
                                <div>
                                  <span style={{ fontSize: '14px', fontWeight: '600', color: theme.text, transition: 'color 0.3s ease' }}>
                                    Due: <span style={{ color: '#DC2626' }}>{quiz.dueDate}</span>
                                  </span>
                                </div>
                              </div>

                              {/* Attempts and Button */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', color: theme.textSecondary, transition: 'color 0.3s ease' }}>
                                  Attempts Allowed: {quiz.attemptsAllowed}
                                </span>
                                <button
                                  onClick={() => handleAttemptQuiz(quiz.id)}
                                  style={{
                                    backgroundColor: theme.text,
                                    color: theme.background,
                                    padding: '10px 24px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = darkMode ? '#eee' : '#000'}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = theme.text}
                                >
                                  Attempt Quiz
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {submittedQuizzes.map(quiz => (
                        <div key={quiz.id} style={{
                          backgroundColor: theme.card,
                          borderRadius: '18px',
                          padding: '28px',
                          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                          border: `1px solid ${theme.border}`,
                          transition: 'background-color 0.3s ease, border-color 0.3s ease'
                        }}>
                          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                            {/* Yellow Question Mark Icon */}
                            <div style={{
                              width: '60px',
                              height: '60px',
                              borderRadius: '50%',
                              backgroundColor: '#FFD700',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              fontSize: '32px',
                              fontWeight: '900',
                              color: 'white',
                              boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
                            }}>
                              ?
                            </div>

                            {/* Quiz Info */}
                            <div style={{ flex: 1 }}>
                              <h3 style={{
                                fontSize: '22px',
                                fontWeight: '700',
                                color: theme.text,
                                margin: '0 0 16px 0',
                                fontFamily: 'var(--font-heading)',
                                transition: 'color 0.3s ease'
                              }}>
                                {quiz.title}
                              </h3>

                              {/* Info Row */}
                              <div style={{
                                display: 'flex',
                                gap: '24px',
                                marginBottom: '16px',
                                flexWrap: 'wrap'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '16px' }}>⏱️</span>
                                  <span style={{ fontSize: '14px', color: theme.textSecondary, transition: 'color 0.3s ease' }}>
                                    Time Limit: {quiz.timeLimit}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '16px' }}>📝</span>
                                  <span style={{ fontSize: '14px', color: theme.textSecondary, transition: 'color 0.3s ease' }}>
                                    {quiz.items} items
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '16px' }}>🔒</span>
                                  <span style={{ fontSize: '14px', color: theme.textSecondary, transition: 'color 0.3s ease' }}>
                                    1 attempt only
                                  </span>
                                </div>
                              </div>

                              {/* Due Date and Button */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', color: '#DC2626', fontWeight: '600' }}>
                                  Due: {quiz.dueDate}
                                </span>
                                <button
                                  onClick={() => handleViewResult(quiz.id)}
                                  style={{
                                    backgroundColor: theme.text,
                                    color: theme.background,
                                    padding: '10px 24px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = darkMode ? '#eee' : '#000'}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = theme.text}
                                >
                                  View Result
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Right - Quiz Rules Panel */}
              <div style={{ width: '320px', flexShrink: 0 }}>
                <div style={{
                  backgroundColor: theme.card,
                  borderRadius: '18px',
                  padding: '24px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  border: `1px solid ${theme.border}`,
                  position: 'sticky',
                  top: '20px'
                }}>
                  {/* Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#FF6B00',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      ℹ️
                    </div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '900',
                      color: theme.text,
                      margin: 0,
                      fontFamily: 'var(--font-heading)',
                      transition: 'color 0.3s ease'
                    }}>
                      Quiz Rules
                    </h3>
                  </div>

                  {/* Rules List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ fontSize: '16px', flexShrink: 0 }}>●</span>
                      <p style={{
                        fontSize: '14px',
                        color: theme.textSecondary,
                        margin: 0,
                        lineHeight: '1.5',
                        transition: 'color 0.3s ease'
                      }}>
                        Each quiz can only be taken once.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ fontSize: '16px', flexShrink: 0 }}>●</span>
                      <p style={{
                        fontSize: '14px',
                        color: theme.textSecondary,
                        margin: 0,
                        lineHeight: '1.5',
                        transition: 'color 0.3s ease'
                      }}>
                        Leaving the quiz tab, minimizing the browser, or switching applications may be counted as a violation.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ fontSize: '16px', flexShrink: 0 }}>●</span>
                      <p style={{
                        fontSize: '14px',
                        color: theme.textSecondary,
                        margin: 0,
                        lineHeight: '1.5',
                        transition: 'color 0.3s ease'
                      }}>
                        Maximum of three (3) violations will auto-submit the quiz.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ fontSize: '16px', flexShrink: 0 }}>●</span>
                      <p style={{
                        fontSize: '14px',
                        color: theme.textSecondary,
                        margin: 0,
                        lineHeight: '1.5',
                        transition: 'color 0.3s ease'
                      }}>
                        If the time runs out, the quiz will be automatically submitted.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ fontSize: '16px', flexShrink: 0 }}>●</span>
                      <p style={{
                        fontSize: '14px',
                        color: theme.textSecondary,
                        margin: 0,
                        lineHeight: '1.5',
                        transition: 'color 0.3s ease'
                      }}>
                        Once submitted, answers are final and cannot be changed.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ fontSize: '16px', flexShrink: 0 }}>●</span>
                      <p style={{
                        fontSize: '14px',
                        color: '#333',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        Quiz results will be released by the instructor only.
                      </p>
                    </div>
                  </div>

                  {/* Footer Note */}
                  <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    backgroundColor: darkMode ? '#3a3000' : '#FFF9E6',
                    borderRadius: '12px',
                    border: '1px solid #FFD700',
                    transition: 'background-color 0.3s ease'
                  }}>
                    <p style={{
                      fontSize: '12px',
                      color: theme.textSecondary,
                      margin: 0,
                      fontStyle: 'italic',
                      textAlign: 'center'
                    }}>
                      Follow the rules to avoid penalties.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
