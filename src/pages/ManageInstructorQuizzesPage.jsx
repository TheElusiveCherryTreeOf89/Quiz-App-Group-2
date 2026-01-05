import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../App";

export default function ManageInstructorQuizzesPage() {
  const navigate = useNavigate();
  const showToast = useToastContext();
  const [activeMenu, setActiveMenu] = useState("quizzes");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
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
      // Check authentication first
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (!currentUser || currentUser.role !== "instructor") {
        navigate("/instructor/login");
        return;
      }
      
      setUser(currentUser);
      loadQuizzes();
      
      // Load notifications
      const savedNotifications = JSON.parse(localStorage.getItem("instructorNotifications") || "[]");
      setNotifications(savedNotifications);
      
      // Load dark mode preference
      const savedDarkMode = localStorage.getItem("darkMode") === "true";
      setDarkMode(savedDarkMode);
    } catch (error) {
      console.error("Error loading quizzes page:", error);
      navigate("/instructor/login");
    }
  }, [navigate]);

  const loadQuizzes = () => {
    try {
      const savedQuizzes = JSON.parse(localStorage.getItem("instructorQuizzes") || "[]");
      setQuizzes(savedQuizzes);
    } catch (error) {
      console.error("Error loading quizzes:", error);
      setQuizzes([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/instructor/login");
  };

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    setSidebarOpen(false); // Close mobile sidebar on navigation
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

  const handleDeleteQuiz = (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
      try {
        const updatedQuizzes = quizzes.filter(q => q.id !== quizId);
        localStorage.setItem("instructorQuizzes", JSON.stringify(updatedQuizzes));
        setQuizzes(updatedQuizzes);
        showToast("Quiz deleted successfully", "success");
      } catch (error) {
        console.error("Error deleting quiz:", error);
        showToast("Failed to delete quiz. Please try again.", "error");
      }
    }
  };

  const handleToggleStatus = (quizId) => {
    try {
      const updatedQuizzes = quizzes.map(q => {
        if (q.id === quizId) {
          return { ...q, published: !q.published };
        }
        return q;
      });
      localStorage.setItem("instructorQuizzes", JSON.stringify(updatedQuizzes));
      setQuizzes(updatedQuizzes);
      const quiz = updatedQuizzes.find(q => q.id === quizId);
      showToast(`Quiz ${quiz.published ? 'published' : 'unpublished'} successfully`, "success");
    } catch (error) {
      console.error("Error toggling quiz status:", error);
      showToast("Failed to update quiz status. Please try again.", "error");
    }
  };

  const handleDuplicateQuiz = (quizId) => {
    try {
      const quizToDuplicate = quizzes.find(q => q.id === quizId);
      if (!quizToDuplicate) {
        showToast("Quiz not found!", "error");
        return;
      }
      const newQuiz = {
        ...quizToDuplicate,
        id: Date.now(),
        title: quizToDuplicate.title + " (Copy)",
        published: false,
        createdAt: new Date().toISOString()
      };
      const updatedQuizzes = [...quizzes, newQuiz];
      localStorage.setItem("instructorQuizzes", JSON.stringify(updatedQuizzes));
      setQuizzes(updatedQuizzes);
      showToast("Quiz duplicated successfully", "success");
    } catch (error) {
      console.error("Error duplicating quiz:", error);
      showToast("Failed to duplicate quiz. Please try again.", "error");
    }
  };

  const handleCopyLink = (quizId) => {
    const quizLink = `${window.location.origin}/student/quiz?id=${quizId}`;
    navigator.clipboard.writeText(quizLink).then(() => {
      showToast("Quiz link copied to clipboard!", "success");
    }).catch(() => {
      showToast("Failed to copy link", "error");
    });
  };

  const handleSelectQuiz = (quizId) => {
    setSelectedQuizzes(prev => {
      if (prev.includes(quizId)) {
        return prev.filter(id => id !== quizId);
      } else {
        return [...prev, quizId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedQuizzes.length === filteredQuizzes.length) {
      setSelectedQuizzes([]);
    } else {
      setSelectedQuizzes(filteredQuizzes.map(q => q.id));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedQuizzes.length} quiz(zes)? This action cannot be undone.`)) {
      try {
        const updatedQuizzes = quizzes.filter(q => !selectedQuizzes.includes(q.id));
        localStorage.setItem("instructorQuizzes", JSON.stringify(updatedQuizzes));
        setQuizzes(updatedQuizzes);
        showToast(`${selectedQuizzes.length} quiz(zes) deleted successfully`, "success");
        setSelectedQuizzes([]);
      } catch (error) {
        console.error("Error deleting quizzes:", error);
        showToast("Failed to delete quizzes. Please try again.", "error");
      }
    }
  };

  const handleBulkPublish = () => {
    try {
      const updatedQuizzes = quizzes.map(q => {
        if (selectedQuizzes.includes(q.id)) {
          return { ...q, published: true };
        }
        return q;
      });
      localStorage.setItem("instructorQuizzes", JSON.stringify(updatedQuizzes));
      setQuizzes(updatedQuizzes);
      showToast(`${selectedQuizzes.length} quiz(zes) published successfully`, "success");
      setSelectedQuizzes([]);
    } catch (error) {
      console.error("Error publishing quizzes:", error);
      showToast("Failed to publish quizzes. Please try again.", "error");
    }
  };

  const handleBulkUnpublish = () => {
    try {
      const updatedQuizzes = quizzes.map(q => {
        if (selectedQuizzes.includes(q.id)) {
          return { ...q, published: false };
        }
        return q;
      });
      localStorage.setItem("instructorQuizzes", JSON.stringify(updatedQuizzes));
      setQuizzes(updatedQuizzes);
      showToast(`${selectedQuizzes.length} quiz(zes) unpublished successfully`, "success");
      setSelectedQuizzes([]);
    } catch (error) {
      console.error("Error unpublishing quizzes:", error);
      showToast("Failed to unpublish quizzes. Please try again.", "error");
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (quiz.description && quiz.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesFilter = true;
    if (filterStatus === "published") {
      matchesFilter = quiz.published === true;
    } else if (filterStatus === "draft") {
      matchesFilter = quiz.published !== true;
    }
    
    return matchesSearch && matchesFilter;
  });

  const getQuizStats = (quiz) => {
    return {
      totalQuestions: quiz.questions.length,
      totalPoints: quiz.questions.reduce((sum, q) => sum + q.points, 0)
    };
  };

  // Theme based on dark mode
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
            zIndex: 998
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
        <div style={{ padding: '20px', borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '20px', fontWeight: '900', color: theme.text, fontFamily: 'var(--font-heading)' }}>Menu</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '15px 12px' }}>
          {/* Results */}
          <button
            onClick={() => handleMenuClick("results")}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '6px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMenu === "results" ? '#6366F1' : 'transparent',
              color: activeMenu === "results" ? 'white' : 'black',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '16px' }}>📊</span>
            <span>Results</span>
          </button>

          {/* Quizzes */}
          <button
            onClick={() => handleMenuClick("quizzes")}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '6px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMenu === "quizzes" ? '#6366F1' : 'transparent',
              color: activeMenu === "quizzes" ? 'white' : 'black',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '16px' }}>📝</span>
            <span>Quizzes</span>
          </button>

          {/* Students */}
          <button
            onClick={() => handleMenuClick("students")}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '6px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMenu === "students" ? '#6366F1' : 'transparent',
              color: activeMenu === "students" ? 'white' : 'black',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '16px' }}>👥</span>
            <span>Students</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => handleMenuClick("profile")}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '6px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMenu === "profile" ? '#6366F1' : 'transparent',
              color: activeMenu === "profile" ? 'white' : 'black',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '16px' }}>👤</span>
            <span>Profile</span>
          </button>

          {/* Analytics */}
          <button
            onClick={() => handleMenuClick("analytics")}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '6px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMenu === "analytics" ? '#6366F1' : 'transparent',
              color: activeMenu === "analytics" ? 'white' : 'black',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '16px' }}>📈</span>
            <span>Analytics</span>
          </button>
        </nav>

        {/* Logout Button */}
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
              textAlign: 'left'
            }}
          >
            <span style={{ fontSize: '16px' }}>🚪</span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
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
                  alignItems: 'center'
                }}
              >
                ☰
              </button>
            )}
            <div style={{
              backgroundColor: 'white',
              padding: '8px 20px',
              borderRadius: '25px',
              border: '3px solid #1a1a1a',
              display: 'inline-flex',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '16px', fontWeight: '900', color: '#1a1a1a' }}>QuizApp</span>
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
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
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

        {/* Content Area */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: isMobile ? '16px' : '32px'
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Page Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px'
            }}>
              <div>
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: '900',
                  color: '#1a1a1a',
                  margin: 0,
                  fontFamily: 'var(--font-heading)'
                }}>
                  Manage Quizzes
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  marginTop: '8px',
                  fontFamily: 'var(--font-body)'
                }}>
                  {quizzes.length} total quiz{quizzes.length !== 1 ? 'es' : ''} created
                </p>
              </div>
              <button
                onClick={() => navigate("/instructor/create-quiz")}
                style={{
                  padding: '14px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#6366F1',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '700',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                  fontFamily: 'var(--font-body)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#5558dd';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#6366F1';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                }}
              >
                ➕ Create New Quiz
              </button>
            </div>

            {/* Quick Stats Overview */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {/* Total Quizzes */}
              <div style={{
                backgroundColor: theme.card,
                borderRadius: '18px',
                padding: '20px',
                boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                borderLeft: '4px solid #6366F1',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ fontSize: '14px', color: theme.textSecondary, fontWeight: '600', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                  Total Quizzes
                </div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: theme.text, transition: 'color 0.3s ease' }}>
                  {quizzes.length}
                </div>
              </div>

              {/* Published */}
              <div style={{
                backgroundColor: theme.card,
                borderRadius: '18px',
                padding: '20px',
                boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                borderLeft: '4px solid #22C55E',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ fontSize: '14px', color: theme.textSecondary, fontWeight: '600', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                  Published
                </div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#22C55E', transition: 'color 0.3s ease' }}>
                  {quizzes.filter(q => q.published).length}
                </div>
              </div>

              {/* Drafts */}
              <div style={{
                backgroundColor: theme.card,
                borderRadius: '18px',
                padding: '20px',
                boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                borderLeft: '4px solid #F59E0B',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ fontSize: '14px', color: theme.textSecondary, fontWeight: '600', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                  Drafts
                </div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#F59E0B', transition: 'color 0.3s ease' }}>
                  {quizzes.filter(q => !q.published).length}
                </div>
              </div>

              {/* Total Questions */}
              <div style={{
                backgroundColor: theme.card,
                borderRadius: '18px',
                padding: '20px',
                boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                borderLeft: '4px solid #3B82F6',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ fontSize: '14px', color: theme.textSecondary, fontWeight: '600', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                  Total Questions
                </div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#3B82F6', transition: 'color 0.3s ease' }}>
                  {quizzes.reduce((sum, q) => sum + (q.items || 0), 0)}
                </div>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '18px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              {/* Select All Checkbox */}
              {filteredQuizzes.length > 0 && (
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#6366F1'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedQuizzes.length === filteredQuizzes.length && filteredQuizzes.length > 0}
                    onChange={handleSelectAll}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer'
                    }}
                  />
                  Select All
                </label>
              )}

              <div style={{ flex: 1, display: 'flex', gap: '16px' }}>
                <input
                  type="text"
                  placeholder="🔍 Search quizzes by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '2px solid #e0e0e0',
                    fontSize: '14px',
                    fontWeight: '500',
                    outline: 'none',
                    transition: 'border 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '2px solid #e0e0e0',
                    fontSize: '14px',
                    fontWeight: '600',
                    outline: 'none',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    minWidth: '150px'
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedQuizzes.length > 0 && (
              <div style={{
                backgroundColor: '#6366F1',
                borderRadius: '18px',
                padding: '20px 24px',
                marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{
                  fontSize: '15px',
                  fontWeight: '700',
                  color: 'white'
                }}>
                  {selectedQuizzes.length} quiz{selectedQuizzes.length !== 1 ? 'zes' : ''} selected
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleBulkPublish}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: '2px solid white',
                      backgroundColor: 'white',
                      color: '#22C55E',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '700',
                      transition: 'all 0.2s'
                    }}
                  >
                    ✓ Publish All
                  </button>
                  <button
                    onClick={handleBulkUnpublish}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: '2px solid white',
                      backgroundColor: 'white',
                      color: '#F59E0B',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '700',
                      transition: 'all 0.2s'
                    }}
                  >
                    ⏸ Unpublish All
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: '2px solid white',
                      backgroundColor: 'white',
                      color: '#DC2626',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '700',
                      transition: 'all 0.2s'
                    }}
                  >
                    🗑️ Delete All
                  </button>
                </div>
              </div>
            )}

            {/* Quizzes Grid */}
            {filteredQuizzes.length === 0 ? (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '18px',
                padding: '60px 40px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                  {searchTerm || filterStatus !== "all" ? "No quizzes found" : "No quizzes yet"}
                </h3>
                <p style={{ fontSize: '14px', color: '#666', marginTop: '8px', marginBottom: '24px' }}>
                  {searchTerm || filterStatus !== "all" 
                    ? "Try adjusting your search or filter" 
                    : "Create your first quiz to get started"}
                </p>
                {!searchTerm && filterStatus === "all" && (
                  <button
                    onClick={() => navigate("/instructor/create-quiz")}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: '#6366F1',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Create First Quiz
                  </button>
                )}
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                gap: '20px'
              }}>{ filteredQuizzes.map((quiz) => {
                  const stats = getQuizStats(quiz);
                  const isPublished = quiz.published === true;
                  
                  return (
                    <div
                      key={quiz.id}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '18px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        border: selectedQuizzes.includes(quiz.id) ? '3px solid #6366F1' : (isPublished ? '2px solid #22C55E' : '2px solid #e0e0e0'),
                        transition: 'all 0.3s',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        if (!selectedQuizzes.includes(quiz.id)) {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                      }}
                    >
                      {/* Selection Checkbox */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        zIndex: 10
                      }}>
                        <input
                          type="checkbox"
                          checked={selectedQuizzes.includes(quiz.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectQuiz(quiz.id);
                          }}
                          style={{
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer'
                          }}
                        />
                      </div>

                      {/* Status Badge */}
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        backgroundColor: isPublished ? '#f0fdf4' : '#f9fafb',
                        border: `2px solid ${isPublished ? '#22C55E' : '#9CA3AF'}`,
                        fontSize: '11px',
                        fontWeight: '700',
                        color: isPublished ? '#22C55E' : '#6B7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '16px'
                      }}>
                        {isPublished ? '✓ Published' : '📝 Draft'}
                      </div>

                      {/* Quiz Title */}
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        margin: '0 0 8px 0',
                        lineHeight: '1.3'
                      }}>
                        {quiz.title}
                      </h3>

                      {/* Description */}
                      <p style={{
                        fontSize: '14px',
                        color: '#666',
                        margin: '0 0 16px 0',
                        lineHeight: '1.5',
                        maxHeight: '42px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {quiz.description || 'No description provided'}
                      </p>

                      {/* Stats */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '12px',
                        marginBottom: '20px',
                        paddingBottom: '20px',
                        borderBottom: '2px solid #f0f0f0'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '24px', fontWeight: '900', color: '#6366F1' }}>
                            {stats.totalQuestions}
                          </div>
                          <div style={{ fontSize: '11px', color: '#666', fontWeight: '600' }}>
                            Questions
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '24px', fontWeight: '900', color: '#F59E0B' }}>
                            {stats.totalPoints}
                          </div>
                          <div style={{ fontSize: '11px', color: '#666', fontWeight: '600' }}>
                            Points
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '24px', fontWeight: '900', color: '#22C55E' }}>
                            {quiz.timeLimit}
                          </div>
                          <div style={{ fontSize: '11px', color: '#666', fontWeight: '600' }}>
                            Minutes
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/instructor/create-quiz");
                          }}
                          style={{
                            flex: 1,
                            minWidth: '100px',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: '2px solid #6366F1',
                            backgroundColor: 'white',
                            color: '#6366F1',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#6366F1';
                            e.target.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.color = '#6366F1';
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateQuiz(quiz.id);
                          }}
                          style={{
                            flex: 1,
                            minWidth: '100px',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: '2px solid #F59E0B',
                            backgroundColor: 'white',
                            color: '#F59E0B',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#F59E0B';
                            e.target.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.color = '#F59E0B';
                          }}
                        >
                          📋 Duplicate
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(quiz.id);
                          }}
                          style={{
                            flex: 1,
                            minWidth: '100px',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: `2px solid ${isPublished ? '#9CA3AF' : '#22C55E'}`,
                            backgroundColor: 'white',
                            color: isPublished ? '#9CA3AF' : '#22C55E',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = isPublished ? '#9CA3AF' : '#22C55E';
                            e.target.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.color = isPublished ? '#9CA3AF' : '#22C55E';
                          }}
                        >
                          {isPublished ? '📦 Unpublish' : '🚀 Publish'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyLink(quiz.id);
                          }}
                          style={{
                            flex: 1,
                            minWidth: '100px',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: '2px solid #3B82F6',
                            backgroundColor: 'white',
                            color: '#3B82F6',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#3B82F6';
                            e.target.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.color = '#3B82F6';
                          }}
                        >
                          🔗 Copy Link
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuiz(quiz.id);
                          }}
                          style={{
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: '2px solid #DC2626',
                            backgroundColor: 'white',
                            color: '#DC2626',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#DC2626';
                            e.target.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.color = '#DC2626';
                          }}
                        >
                          🗑️
                        </button>
                      </div>

                      {/* Created Date */}
                      <div style={{
                        fontSize: '11px',
                        color: '#999',
                        marginTop: '16px',
                        fontStyle: 'italic'
                      }}>
                        Created: {new Date(quiz.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      <style>{`
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
