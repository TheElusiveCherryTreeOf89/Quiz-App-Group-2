import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../App";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const showToast = useToastContext();
  const [user, setUser] = useState(null);
  const [quizStatus, setQuizStatus] = useState(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  const notifications = [
    { id: 1, text: "A quiz has been posted!", time: "Now" },
    { id: 2, text: "A quiz has been posted!", time: "30 secs ago" },
    { id: 3, text: "A quiz has been posted!", time: "1 min ago" },
    { id: 4, text: 'Admin has posted an announcement: "Happy Holidays".', time: "4 hours ago" },
    { id: 5, text: "Admin has sent you a message.", time: "7 days ago" },
    { id: 6, text: 'Result Released: "Quiz 2: Requirements Engineering"', time: "1d ago" },
    { id: 7, text: 'Result Released: "Quiz 1: Intro To Web App"', time: "8d ago" }
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (!currentUser || currentUser.role !== "student") {
        navigate("/login");
        return;
      }
      setUser(currentUser);

      const completedQuizzes = JSON.parse(localStorage.getItem("completedQuizzes") || "{}");
      if (completedQuizzes[currentUser.email]) {
        setQuizStatus("completed");
      } else {
        setQuizStatus("available");
      }
      
      // Load dark mode preference
      const savedDarkMode = localStorage.getItem("darkMode") === "true";
      setDarkMode(savedDarkMode);
      
      // Trigger page load animation
      setTimeout(() => setPageLoaded(true), 50);
    } catch (error) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };
  
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    showToast(`Dark mode ${newMode ? 'enabled' : 'disabled'}`, "info");
  };

  const handleStartQuiz = () => {
    if (quizStatus === "completed") {
      showToast("You have already taken this quiz. Please wait for the instructor to release your score.", "warning");
      return;
    }
    navigate("/student/quiz");
  };

  // Sample quizzes data - replace with actual data from localStorage
  const allQuizzes = [
    { id: 1, title: "Quiz 3: Interface Design & Us...", due: "Dec 28, 11:59PM", timeLimit: "1 hour", status: "available" },
    { id: 2, title: "Quiz 4: React Fundamentals", due: "Dec 28, 11:59PM", timeLimit: "1 hour", status: "available" },
    { id: 3, title: "Quiz 5: React Advanced Con...", due: "Dec 28, 11:59PM", timeLimit: "1 hour", status: "available" },
    { id: 4, title: "Quiz 2: Requirements Engineering", due: "Dec 20, 11:59PM", timeLimit: "45 mins", status: "completed" },
    { id: 5, title: "Quiz 1: Intro To Web App", due: "Dec 15, 11:59PM", timeLimit: "30 mins", status: "completed" }
  ];

  // Filter quizzes based on search and status
  const filteredQuizzes = allQuizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || quiz.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  
  // Theme based on dark mode
  const theme = darkMode ? {
    background: '#1a1a1a',
    card: '#2d2d2d',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    border: '#404040',
    sidebarBg: '#2d2d2d',
    sidebarText: '#ffffff',
    welcomeCard: '#2d2d2d',
    quizCard: '#3d3d3d'
  } : {
    background: '#f0f0f0',
    card: 'white',
    text: '#1a1a1a',
    textSecondary: '#666',
    border: '#eee',
    sidebarBg: 'white',
    sidebarText: '#1a1a1a',
    welcomeCard: '#1a1a1a',
    quizCard: 'white'
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background, transition: 'background-color 0.3s ease' }}>
        <div style={{ fontSize: '18px', color: theme.textSecondary, transition: 'color 0.3s ease' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      backgroundColor: theme.background, 
      position: 'relative',
      opacity: pageLoaded ? 1 : 0,
      transform: pageLoaded ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.5s ease-out, transform 0.5s ease-out, background-color 0.3s ease'
    }}>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 998,
            transition: 'opacity 0.3s'
          }}
        />
      )}

      {/* Left Sidebar */}
      <aside style={{
        width: isMobile ? '280px' : '200px',
        backgroundColor: theme.sidebarBg,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: darkMode ? '2px 0 10px rgba(0,0,0,0.3)' : '2px 0 10px rgba(0,0,0,0.08)',
        flexShrink: 0,
        position: isMobile ? 'fixed' : 'relative',
        left: isMobile ? (sidebarOpen ? 0 : '-280px') : 0,
        top: 0,
        bottom: 0,
        zIndex: 999,
        transition: 'left 0.3s ease-in-out, background-color 0.3s ease'
      }}>
        {/* Menu Header */}
        <div style={{ padding: '20px', borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '20px', fontWeight: '900', fontFamily: 'var(--font-heading)', letterSpacing: '0.5px', color: theme.text, transition: 'color 0.3s ease' }}>Menu</span>
            <span style={{ fontSize: '18px', cursor: 'pointer', color: theme.text }}>≡</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1, padding: '15px 12px' }}>
          {/* Dashboard */}
          <button
            onClick={() => setActiveMenu("dashboard")}
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
              setSidebarOpen(false);
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
              setActiveMenu("quizzes");
              setSidebarOpen(false);
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
              backgroundColor: activeMenu === "quizzes" ? '#FF6B00' : 'transparent',
              color: activeMenu === "quizzes" ? 'white' : theme.sidebarText,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (activeMenu !== "quizzes") e.currentTarget.style.backgroundColor = darkMode ? '#3d3d3d' : '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              if (activeMenu !== "quizzes") e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '16px' }}>📝</span>
            <span>Manage Quizzes</span>
          </button>

          {/* My Result */}
          <button
            onClick={() => {
              setActiveMenu("results");
              setSidebarOpen(false);
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
              setSidebarOpen(false);
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

        {/* Log Out */}
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
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
          >
            <span style={{ fontSize: '16px' }}>🚪</span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Header - Yellow */}
        <header style={{
          backgroundColor: '#FFD700',
          padding: isMobile ? '12px 16px' : '12px 25px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          {/* Hamburger Menu (Mobile Only) */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'none',
                border: '2px solid black',
                cursor: 'pointer',
                fontSize: '24px',
                padding: '8px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1
              }}
            >
              ☰
            </button>
          )}

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

          {/* Right Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '18px', position: 'relative' }}>
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '24px',
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
                  backgroundColor: 'black',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
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
                      {user?.name || 'Student'}
                    </div>
                    <div style={{ fontSize: '13px', color: theme.textSecondary, fontFamily: 'var(--font-body)', transition: 'color 0.3s ease' }}>
                      {user?.email}
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
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/student/manage-quizzes");
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
                    <span>📝</span>
                    <span>My Quizzes</span>
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

        {/* Content Area with Notification Panel */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', flexDirection: isMobile ? 'column' : 'row' }}>
          {/* Main Content */}
          <main style={{ 
            flex: 1, 
            padding: isMobile ? '16px' : '25px', 
            overflowY: 'auto', 
            backgroundColor: theme.background,
            marginLeft: isMobile ? 0 : 0,
            transition: 'background-color 0.3s ease'
          }}>
            {/* Welcome Card - Black */}
            <div style={{
              backgroundColor: theme.welcomeCard,
              borderRadius: isMobile ? '18px' : '25px',
              padding: isMobile ? '24px 20px' : '35px 40px',
              marginBottom: '25px',
              transition: 'background-color 0.3s ease'
            }}>
              <h1 style={{
                fontSize: isMobile ? '28px' : '42px',
                fontWeight: '900',
                color: darkMode ? '#ffffff' : 'white',
                marginBottom: '8px',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.5px',
                transition: 'color 0.3s ease'
              }}>Welcome, {user?.name || 'User'} !</h1>
              <p style={{ color: darkMode ? '#aaa' : '#aaa', fontSize: isMobile ? '14px' : '16px', fontFamily: 'var(--font-body)', transition: 'color 0.3s ease' }}>Ready to challenge yourself? Let's get started!</p>
            </div>

            {/* Stats Cards Row */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px', 
              marginBottom: '25px' 
            }}>
              {/* Available Quizzes - Blue */}
              <div style={{
                backgroundColor: theme.quizCard,
                borderRadius: '18px',
                padding: '22px',
                border: '4px solid #3B82F6',
                flex: 1,
                transition: 'background-color 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: '#DBEAFE',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>📄</div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: theme.textSecondary, fontFamily: 'var(--font-body)', transition: 'color 0.3s ease' }}>Available Quizzes</span>
                </div>
                <div style={{ fontSize: '52px', fontWeight: '900', color: '#3B82F6', fontFamily: 'var(--font-heading)' }}>3</div>
              </div>

              {/* Quizzes Taken - Green */}
              <div style={{
                backgroundColor: theme.quizCard,
                borderRadius: '18px',
                padding: '22px',
                border: '4px solid #22C55E',
                flex: 1,
                transition: 'background-color 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: '#DCFCE7',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>✅</div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: theme.textSecondary, fontFamily: 'var(--font-body)', transition: 'color 0.3s ease' }}>Quizzes Taken</span>
                </div>
                <div style={{ fontSize: '52px', fontWeight: '900', color: '#22C55E', fontFamily: 'var(--font-heading)' }}>5</div>
              </div>

              {/* Pending Results - Yellow/Orange */}
              <div style={{
                backgroundColor: theme.quizCard,
                borderRadius: '18px',
                padding: '22px',
                border: '4px solid #F59E0B',
                flex: 1,
                transition: 'background-color 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: '#FEF3C7',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>⏳</div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: theme.textSecondary, fontFamily: 'var(--font-body)', transition: 'color 0.3s ease' }}>Pending Results</span>
                </div>
                <div style={{ fontSize: '52px', fontWeight: '900', color: '#F59E0B', fontFamily: 'var(--font-heading)' }}>1</div>
              </div>
            </div>

            {/* Available Quizzes List */}
            <div style={{
              backgroundColor: theme.card,
              borderRadius: '25px',
              padding: '30px',
              boxShadow: darkMode ? '0 2px 15px rgba(0,0,0,0.3)' : '0 2px 15px rgba(0,0,0,0.05)',
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
            }}>
              <h2 style={{ fontSize: '26px', fontWeight: '900', marginBottom: '25px', fontFamily: 'var(--font-heading)', letterSpacing: '0.5px', color: theme.text, transition: 'color 0.3s ease' }}>Available Quizzes</h2>

              {/* Search and Filter Row */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '25px',
                flexDirection: isMobile ? 'column' : 'row'
              }}>
                {/* Search Bar */}
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px 18px',
                    borderRadius: '12px',
                    border: `2px solid ${theme.border}`,
                    fontSize: '14px',
                    backgroundColor: theme.card,
                    color: theme.text,
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FF6B00';
                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 0, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.border;
                    e.target.style.boxShadow = 'none';
                  }}
                />

                {/* Filter Dropdown */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '12px',
                    border: `2px solid ${theme.border}`,
                    fontSize: '14px',
                    fontWeight: '600',
                    backgroundColor: theme.card,
                    color: theme.text,
                    cursor: 'pointer',
                    outline: 'none',
                    minWidth: isMobile ? '100%' : '180px',
                    fontFamily: 'var(--font-body)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <option value="all">All Quizzes</option>
                  <option value="available">Available</option>
                  <option value="completed">Completed</option>
                  <option value="due-soon">Due Soon</option>
                </select>
              </div>

              {/* Quiz List */}
              {filteredQuizzes.length > 0 ? (
                <>
                  {filteredQuizzes.map((quiz, index) => (
                    <div
                      key={quiz.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '18px 0',
                        borderBottom: index < filteredQuizzes.length - 1 ? `1px solid ${theme.border}` : 'none',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? '12px' : '18px',
                        opacity: pageLoaded ? 1 : 0,
                        transform: pageLoaded ? 'translateX(0)' : 'translateX(-20px)',
                        transition: `all 0.5s ease-out ${index * 0.1}s, border-bottom-color 0.3s ease`
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', width: isMobile ? '100%' : 'auto' }}>
                        <div style={{
                          width: '55px',
                          height: '55px',
                          backgroundColor: quiz.status === 'completed' ? '#22C55E' : '#FFD700',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '26px',
                          flexShrink: 0
                        }}>{quiz.status === 'completed' ? '✓' : '❓'}</div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '5px', fontFamily: 'var(--font-heading)', letterSpacing: '0.3px', color: theme.text, transition: 'color 0.3s ease' }}>{quiz.title}</h3>
                          <p style={{ fontSize: '13px', color: '#EF4444', fontWeight: '600', marginBottom: '2px', fontFamily: 'var(--font-body)' }}>Due: {quiz.due}</p>
                          <p style={{ fontSize: '12px', color: theme.textSecondary, fontFamily: 'var(--font-body)', transition: 'color 0.3s ease' }}>Time Limit: {quiz.timeLimit}</p>
                        </div>
                      </div>
                      <button
                        onClick={quiz.status === 'available' ? handleStartQuiz : null}
                        disabled={quiz.status === 'completed'}
                        style={{
                          padding: '12px 28px',
                          backgroundColor: quiz.status === 'completed' ? '#888' : '#1a1a1a',
                          color: 'white',
                          border: 'none',
                          borderRadius: '25px',
                          fontWeight: '700',
                          fontSize: '14px',
                          cursor: quiz.status === 'completed' ? 'not-allowed' : 'pointer',
                          whiteSpace: 'nowrap',
                          width: isMobile ? '100%' : 'auto',
                          fontFamily: 'var(--font-body)'
                        }}
                      >{quiz.status === 'completed' ? 'Completed' : 'Attempt Quiz'}</button>
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <p style={{ fontSize: '16px', color: theme.textSecondary, fontWeight: '600', fontFamily: 'var(--font-body)', transition: 'color 0.3s ease' }}>
                    No quizzes found{searchTerm && ` for "${searchTerm}"`}
                  </p>
                </div>
              )}

              {/* See All */}
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button style={{
                  background: 'none',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '15px',
                  color: '#333',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontFamily: 'var(--font-body)'
                }}>See All</button>
              </div>
            </div>
          </main>

          {/* Right Notification Panel */}
          {!isMobile && (
            <aside style={{
              width: '300px',
              backgroundColor: 'white',
              padding: '25px 20px',
              overflowY: 'auto',
              borderLeft: '1px solid #e5e5e5',
              flexShrink: 0
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '20px', fontFamily: 'var(--font-heading)', letterSpacing: '0.5px' }}>Notification</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    style={{
                      border: '2px solid #e0e0e0',
                      borderRadius: '15px',
                      padding: '14px 16px',
                      cursor: 'pointer'
                    }}
                  >
                    <p style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px', lineHeight: '1.5', color: '#333', fontFamily: 'var(--font-body)' }}>{notif.text}</p>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: '#888', fontFamily: 'var(--font-body)' }}>{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
