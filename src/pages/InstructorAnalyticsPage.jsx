import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../App";

export default function InstructorAnalyticsPage() {
  const navigate = useNavigate();
  const showToast = useToastContext();
  const [activeMenu, setActiveMenu] = useState("analytics");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [analytics, setAnalytics] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

  // Handle window resize for mobile responsiveness
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
      const user = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (!user || user.role !== "instructor") {
        navigate("/instructor/login");
        return;
      }

      // Calculate analytics from quiz data
      const quizzes = JSON.parse(localStorage.getItem("instructorQuizzes") || "[]");
      const results = JSON.parse(localStorage.getItem("quizResults") || "[]");

      // Overall Stats
      const totalQuizzes = quizzes.length;
      const publishedQuizzes = quizzes.filter(q => q.published).length;
      const totalSubmissions = results.length;
      const uniqueStudents = new Set(results.map(r => r.studentEmail)).size;
      
      // Calculate average score
      const avgScore = results.length > 0
        ? results.reduce((acc, r) => acc + (r.score / r.totalQuestions * 100), 0) / results.length
        : 0;

      // Calculate completion rate
      const completionRate = totalQuizzes > 0 
        ? (totalSubmissions / (totalQuizzes * uniqueStudents || 1)) * 100
        : 0;

      // Score Distribution
      const scoreRanges = {
        '0-60': 0,
        '60-70': 0,
        '70-80': 0,
        '80-90': 0,
        '90-100': 0
      };

      results.forEach(result => {
        const score = (result.score / result.totalQuestions) * 100;
        if (score < 60) scoreRanges['0-60']++;
        else if (score < 70) scoreRanges['60-70']++;
        else if (score < 80) scoreRanges['70-80']++;
        else if (score < 90) scoreRanges['80-90']++;
        else scoreRanges['90-100']++;
      });

      // Pass/Fail Distribution
      const passCount = results.filter(r => (r.score / r.totalQuestions * 100) >= 60).length;
      const failCount = results.length - passCount;
      const passRate = results.length > 0 ? (passCount / results.length * 100) : 0;

      // Quiz Performance
      const quizPerformance = quizzes.map(quiz => {
        const quizResults = results.filter(r => r.quizTitle === quiz.title);
        const avgQuizScore = quizResults.length > 0
          ? quizResults.reduce((acc, r) => acc + (r.score / r.totalQuestions * 100), 0) / quizResults.length
          : 0;
        
        return {
          title: quiz.title,
          submissions: quizResults.length,
          avgScore: avgQuizScore
        };
      }).sort((a, b) => b.avgScore - a.avgScore);

      // Violation Analysis
      const violationTypes = {};
      results.forEach(result => {
        if (result.violations && result.violations.length > 0) {
          result.violations.forEach(v => {
            violationTypes[v.type] = (violationTypes[v.type] || 0) + 1;
          });
        }
      });

      // Load notifications
      const savedNotifications = JSON.parse(localStorage.getItem("instructorNotifications") || "[]");
      setNotifications(savedNotifications);
      
      // Load dark mode preference
      const savedDarkMode = localStorage.getItem("darkMode") === "true";
      setDarkMode(savedDarkMode);
      
      setUser(user);

      setAnalytics({
        totalQuizzes,
        publishedQuizzes,
        totalSubmissions,
        uniqueStudents,
        avgScore,
        completionRate,
        scoreRanges,
        passCount,
        failCount,
        passRate,
        quizPerformance,
        violationTypes
      });

    } catch (error) {
      console.error("Error loading analytics:", error);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/instructor/login");
  };

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    setSidebarOpen(false);
    if (menuId === "results") navigate("/instructor/dashboard");
    else if (menuId === "quizzes") navigate("/instructor/quizzes");
    else if (menuId === "students") navigate("/instructor/students");
    else if (menuId === "profile") navigate("/instructor/profile");
    else if (menuId === "analytics") navigate("/instructor/analytics");
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    showToast(`Dark mode ${newMode ? 'enabled' : 'disabled'}`, "info");
  };

  const markNotificationAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem("instructorNotifications", JSON.stringify(updated));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem("instructorNotifications", "[]");
    showToast("All notifications cleared", "success");
    setShowNotifications(false);
  };

  const handleExport = () => {
    try {
      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Headers
      csvContent += "Analytics Report\n";
      csvContent += `Generated: ${new Date().toLocaleString()}\n\n`;
      
      // Key Metrics
      csvContent += "KEY METRICS\n";
      csvContent += `Total Students,${analytics.totalStudents}\n`;
      csvContent += `Total Quizzes,${analytics.totalQuizzes}\n`;
      csvContent += `Average Score,${analytics.averageScore}%\n`;
      csvContent += `Completion Rate,${analytics.completionRate}%\n\n`;
      
      // Quiz Performance
      csvContent += "QUIZ PERFORMANCE\n";
      csvContent += "Quiz Title,Total Attempts,Average Score,Pass Rate\n";
      analytics.quizPerformance.forEach(quiz => {
        csvContent += `"${quiz.title}",${quiz.attempts},${quiz.avgScore}%,${quiz.passRate}%\n`;
      });
      csvContent += "\n";
      
      // Pass/Fail Analysis
      csvContent += "PASS/FAIL ANALYSIS\n";
      csvContent += `Passed,${analytics.passCount}\n`;
      csvContent += `Failed,${analytics.failCount}\n`;
      csvContent += `Pass Rate,${analytics.overallPassRate}%\n\n`;
      
      // Violations
      if (Object.keys(analytics.violationTypes).length > 0) {
        csvContent += "VIOLATIONS\n";
        csvContent += "Type,Count\n";
        Object.entries(analytics.violationTypes).forEach(([type, count]) => {
          csvContent += `${type},${count}\n`;
        });
      }
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast("Analytics report exported successfully!", "success");
    } catch (error) {
      showToast("Failed to export report", "error");
      console.error("Export error:", error);
    }
  };

  // Theme based on dark mode - MUST be defined before any early returns
  const theme = darkMode ? {
    background: '#1a1a1a',
    card: '#2d2d2d',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    border: '#404040',
    sidebarBg: '#2d2d2d'
  } : {
    background: '#f0f0f0',
    card: 'white',
    text: '#1a1a1a',
    textSecondary: '#666',
    border: '#eee',
    sidebarBg: 'white'
  };

  if (!analytics) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background, transition: 'background-color 0.3s ease' }}>
        <div style={{ fontSize: '18px', color: theme.textSecondary, transition: 'color 0.3s ease' }}>Loading analytics...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: theme.background, position: 'relative', transition: 'background-color 0.3s ease' }}>
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
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: isMobile ? '280px' : '200px',
        backgroundColor: theme.sidebarBg,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: darkMode ? '2px 0 10px rgba(0,0,0,0.5)' : '2px 0 10px rgba(0,0,0,0.08)',
        flexShrink: 0,
        position: isMobile ? 'fixed' : 'relative',
        left: isMobile ? (sidebarOpen ? 0 : '-280px') : 0,
        top: 0,
        bottom: 0,
        zIndex: 999,
        transition: 'left 0.3s ease-in-out, background-color 0.3s ease'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
          <span style={{ fontSize: '20px', fontWeight: '900' }}>Menu</span>
        </div>

        <nav style={{ flex: 1, padding: '15px 12px' }}>
          {['results', 'quizzes', 'students', 'profile', 'analytics'].map(menu => {
            const icons = { results: '📊', quizzes: '📝', students: '👥', profile: '👤', analytics: '📈' };
            const labels = { results: 'Results', quizzes: 'Quizzes', students: 'Students', profile: 'Profile', analytics: 'Analytics' };
            
            return (
              <button
                key={menu}
                onClick={() => handleMenuClick(menu)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  marginBottom: '6px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: activeMenu === menu ? '#6366F1' : 'transparent',
                  color: activeMenu === menu ? 'white' : 'black',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'left',
                  transition: 'all 0.2s ease-in-out',
                  transform: activeMenu === menu ? 'scale(1.02)' : 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  if (activeMenu !== menu) e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  if (activeMenu !== menu) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ fontSize: '16px' }}>{icons[menu]}</span>
                <span>{labels[menu]}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '15px 12px', borderTop: '1px solid #eee' }}>
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
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
          >
            <span style={{ fontSize: '16px' }}>🚪</span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{
          backgroundColor: '#FFD700',
          padding: isMobile ? '16px' : '20px 25px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  fontSize: '24px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'transform 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(90deg)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
              >
                ☰
              </button>
            )}
            <div style={{
              backgroundColor: theme.card,
              padding: '8px 20px',
              borderRadius: '25px',
              border: `3px solid ${theme.text}`,
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: '16px', fontWeight: '900', color: theme.text, transition: 'color 0.3s ease' }}>QuizApp</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
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

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '24px',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'transform 0.2s',
                  position: 'relative'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                🔔
                {notifications.filter(n => !n.read).length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    backgroundColor: '#DC2626',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}>
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: theme.card,
                  borderRadius: '12px',
                  boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.15)',
                  width: '320px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  animation: 'scaleIn 0.2s ease-out',
                  transition: 'background-color 0.3s ease'
                }}>
                  <div style={{
                    padding: '16px',
                    borderBottom: `1px solid ${theme.border}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: theme.text, transition: 'color 0.3s ease' }}>Notifications</h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        style={{
                          fontSize: '12px',
                          color: '#DC2626',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>
                      <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔕</div>
                      <p style={{ margin: 0, fontSize: '14px' }}>No notifications</p>
                    </div>
                  ) : (
                    <div>
                      {notifications.map(notification => (
                        <div
                          key={notification.id}
                          onClick={() => markNotificationAsRead(notification.id)}
                          style={{
                            padding: '14px 16px',
                            borderBottom: `1px solid ${theme.border}`,
                            cursor: 'pointer',
                            backgroundColor: notification.read ? theme.card : (darkMode ? '#2a3a4a' : '#f0f9ff'),
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#3d4d5d' : '#e5e7eb'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notification.read ? theme.card : (darkMode ? '#2a3a4a' : '#f0f9ff')}
                        >
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '20px' }}>{notification.icon || '📬'}</span>
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: theme.text, transition: 'color 0.3s ease' }}>
                                {notification.title}
                              </p>
                              <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: theme.textSecondary, transition: 'color 0.3s ease' }}>
                                {notification.message}
                              </p>
                              <p style={{ margin: 0, fontSize: '11px', color: darkMode ? '#888' : '#999', transition: 'color 0.3s ease' }}>
                                {new Date(notification.timestamp).toLocaleString()}
                              </p>
                            </div>
                            {!notification.read && (
                              <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#6366F1',
                                flexShrink: 0
                              }} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
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
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                👤
              </button>

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
                    <div style={{ fontSize: '16px', fontWeight: '700', color: theme.text, marginBottom: '4px', transition: 'color 0.3s ease' }}>
                      {user?.name || 'Instructor'}
                    </div>
                    <div style={{ fontSize: '13px', color: theme.textSecondary, transition: 'color 0.3s ease' }}>
                      {user?.email}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/instructor/profile");
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
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span>👤</span>
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      showToast("Settings coming soon!", "info");
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
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span>⚙️</span>
                    <span>Settings</span>
                  </button>

                  <div style={{ borderTop: '1px solid #f0f0f0' }}>
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
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
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

        {/* Page Content */}
        <main style={{
          flex: 1,
          padding: isMobile ? '16px' : '25px',
          overflowY: 'auto'
        }}>
          {/* Page Title */}
          <div style={{ marginBottom: isMobile ? '20px' : '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: theme.text, margin: 0, transition: 'color 0.3s ease' }}>
                Analytics Dashboard
              </h1>
              <p style={{ fontSize: '14px', color: theme.textSecondary, marginTop: '8px', transition: 'color 0.3s ease' }}>
                Comprehensive insights into quiz performance and student engagement
              </p>
            </div>
            <button
              onClick={handleExport}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: '2px solid #6366F1',
                backgroundColor: theme.card,
                color: '#6366F1',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#6366F1';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#6366F1';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              📥 Export Report
            </button>
          </div>

          {/* Key Metrics */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', 
            gap: '16px',
            marginBottom: '24px'
          }}>
            {[
              { label: 'Total Quizzes', value: analytics.totalQuizzes, color: '#6366F1', bg: '#f0f9ff' },
              { label: 'Active Students', value: analytics.uniqueStudents, color: '#22C55E', bg: '#f0fdf4' },
              { label: 'Submissions', value: analytics.totalSubmissions, color: '#F59E0B', bg: '#fef3c7' },
              { label: 'Avg Score', value: `${Math.round(analytics.avgScore)}%`, color: '#DC2626', bg: '#fef2f2' }
            ].map((metric, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: theme.card,
                  borderRadius: '18px',
                  padding: '24px',
                  boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  animation: `slideUp 0.4s ease-out ${index * 0.1}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = `0 8px 20px ${metric.color}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: metric.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  fontSize: '24px'
                }}>
                  {index === 0 ? '📝' : index === 1 ? '👥' : index === 2 ? '📊' : '🎯'}
                </div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: metric.color, marginBottom: '8px' }}>
                  {metric.value}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
            gap: '20px',
            marginBottom: '24px'
          }}>
            {/* Score Distribution */}
            <div style={{
              backgroundColor: theme.card,
              borderRadius: '18px',
              padding: '24px',
              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
              animation: 'slideUp 0.5s ease-out',
              transition: 'background-color 0.3s ease'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.text, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.3s ease' }}>
                <span>📊</span>
                Score Distribution
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(analytics.scoreRanges).map(([range, count], index) => {
                  const maxCount = Math.max(...Object.values(analytics.scoreRanges));
                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  const colors = ['#DC2626', '#F59E0B', '#FFD700', '#84CC16', '#22C55E'];
                  
                  return (
                    <div key={range} style={{ animation: `slideIn 0.5s ease-out ${index * 0.1}s both` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>{range}%</span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: colors[index] }}>{count}</span>
                      </div>
                      <div style={{ 
                        height: '28px', 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${percentage}%`, 
                          backgroundColor: colors[index],
                          borderRadius: '8px',
                          transition: 'width 1s ease-out',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '11px',
                          fontWeight: '700'
                        }}>
                          {count > 0 && count}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pass/Fail Analysis */}
            <div style={{
              backgroundColor: theme.card,
              borderRadius: '18px',
              padding: '24px',
              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
              animation: 'slideUp 0.5s ease-out 0.1s both',
              transition: 'background-color 0.3s ease'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.text, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.3s ease' }}>
                <span>🎯</span>
                Pass/Fail Analysis
              </h3>
              
              {/* Visual Circle Chart */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                <div style={{ position: 'relative', width: '180px', height: '180px' }}>
                  <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Background circle */}
                    <circle cx="90" cy="90" r="70" fill="none" stroke="#f0f0f0" strokeWidth="20"/>
                    {/* Pass portion */}
                    <circle 
                      cx="90" 
                      cy="90" 
                      r="70" 
                      fill="none" 
                      stroke="#22C55E" 
                      strokeWidth="20"
                      strokeDasharray={`${(analytics.passRate / 100) * 440} 440`}
                      style={{ 
                        transition: 'stroke-dasharray 1.5s ease-out',
                        animation: 'fillCircle 1.5s ease-out'
                      }}
                    />
                  </svg>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '36px', fontWeight: '900', color: '#22C55E' }}>
                      {Math.round(analytics.passRate)}%
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#666' }}>
                      Pass Rate
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', width: '100%', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: '900', color: '#22C55E' }}>
                      {analytics.passCount}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22C55E' }}></span>
                      Passed
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: '900', color: '#DC2626' }}>
                      {analytics.failCount}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#DC2626' }}></span>
                      Failed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Performance */}
          <div style={{
            backgroundColor: theme.card,
            borderRadius: '18px',
            padding: '24px',
            boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
            marginBottom: '24px',
            animation: 'slideUp 0.5s ease-out 0.2s both',
            transition: 'background-color 0.3s ease'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.text, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.3s ease' }}>
              <span>🏆</span>
              Quiz Performance Insights
            </h3>

            {analytics.quizPerformance.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: theme.textSecondary, transition: 'color 0.3s ease' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
                <p>No quiz performance data available yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Best Performing Quiz */}
                {analytics.quizPerformance[0] && (
                  <div style={{
                    padding: '20px',
                    borderRadius: '12px',
                    backgroundColor: '#f0fdf4',
                    border: '2px solid #22C55E'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '24px' }}>🥇</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#666' }}>BEST PERFORMING</span>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
                      {analytics.quizPerformance[0].title}
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <div>
                        <span style={{ fontSize: '24px', fontWeight: '900', color: '#22C55E' }}>
                          {Math.round(analytics.quizPerformance[0].avgScore)}%
                        </span>
                        <span style={{ fontSize: '12px', color: '#666', marginLeft: '6px' }}>avg score</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '24px', fontWeight: '900', color: '#6366F1' }}>
                          {analytics.quizPerformance[0].submissions}
                        </span>
                        <span style={{ fontSize: '12px', color: '#666', marginLeft: '6px' }}>submissions</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Most Challenging Quiz */}
                {analytics.quizPerformance[analytics.quizPerformance.length - 1] && analytics.quizPerformance.length > 1 && (
                  <div style={{
                    padding: '20px',
                    borderRadius: '12px',
                    backgroundColor: '#fef2f2',
                    border: '2px solid #DC2626'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '24px' }}>⚠️</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#666' }}>NEEDS ATTENTION</span>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
                      {analytics.quizPerformance[analytics.quizPerformance.length - 1].title}
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <div>
                        <span style={{ fontSize: '24px', fontWeight: '900', color: '#DC2626' }}>
                          {Math.round(analytics.quizPerformance[analytics.quizPerformance.length - 1].avgScore)}%
                        </span>
                        <span style={{ fontSize: '12px', color: '#666', marginLeft: '6px' }}>avg score</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '24px', fontWeight: '900', color: '#6366F1' }}>
                          {analytics.quizPerformance[analytics.quizPerformance.length - 1].submissions}
                        </span>
                        <span style={{ fontSize: '12px', color: '#666', marginLeft: '6px' }}>submissions</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Violation Summary */}
          {Object.keys(analytics.violationTypes).length > 0 && (
            <div style={{
              backgroundColor: theme.card,
              borderRadius: '18px',
              padding: '24px',
              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
              animation: 'slideUp 0.5s ease-out 0.3s both',
              transition: 'background-color 0.3s ease'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.text, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.3s ease' }}>
                <span>🔒</span>
                Proctoring Violations
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '12px' }}>
                {Object.entries(analytics.violationTypes).map(([type, count], index) => (
                  <div
                    key={type}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      backgroundColor: '#fef3c7',
                      border: '2px solid #F59E0B',
                      animation: `slideUp 0.4s ease-out ${0.3 + index * 0.1}s both`
                    }}
                  >
                    <div style={{ fontSize: '24px', fontWeight: '900', color: '#F59E0B', marginBottom: '4px' }}>
                      {count}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'capitalize' }}>
                      {type.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fillCircle {
          from {
            stroke-dasharray: 0 440;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
