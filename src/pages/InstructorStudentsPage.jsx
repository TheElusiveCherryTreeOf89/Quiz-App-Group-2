import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../App";

export default function InstructorStudentsPage() {
  const navigate = useNavigate();
  const showToast = useToastContext();
  const [activeMenu, setActiveMenu] = useState("students");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, score, quizzes
  const [filterBy, setFilterBy] = useState("all"); // all, active, high, low
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
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

      // Extract unique students from quiz results
      const results = JSON.parse(localStorage.getItem("quizResults") || "[]");
      const studentMap = new Map();

      results.forEach(result => {
        if (!studentMap.has(result.studentEmail)) {
          studentMap.set(result.studentEmail, {
            name: result.studentName,
            email: result.studentEmail,
            studentId: result.studentId || "N/A",
            quizzesTaken: 0,
            totalScore: 0,
            lastActivity: result.submittedAt
          });
        }

        const student = studentMap.get(result.studentEmail);
        student.quizzesTaken++;
        student.totalScore += (result.score / result.totalQuestions * 100);
        
        if (new Date(result.submittedAt) > new Date(student.lastActivity)) {
          student.lastActivity = result.submittedAt;
        }
      });

      const studentsList = Array.from(studentMap.values()).map(student => ({
        ...student,
        averageScore: student.quizzesTaken > 0 ? student.totalScore / student.quizzesTaken : 0
      }));

      setStudents(studentsList);
      
      // Load notifications
      const savedNotifications = JSON.parse(localStorage.getItem("instructorNotifications") || "[]");
      setNotifications(savedNotifications);
      
      // Load dark mode preference
      const savedDarkMode = localStorage.getItem("darkMode") === "true";
      setDarkMode(savedDarkMode);
      
      setUser(user);
    } catch (error) {
      console.error("Error loading students:", error);
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

  // Filter and sort students
  const getFilteredAndSortedStudents = () => {
    let filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply filter
    if (filterBy === "active") {
      filtered = filtered.filter(s => s.quizzesTaken > 0);
    } else if (filterBy === "high") {
      filtered = filtered.filter(s => s.averageScore >= 70);
    } else if (filterBy === "low") {
      filtered = filtered.filter(s => s.averageScore < 70 && s.quizzesTaken > 0);
    }

    // Apply sort
    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "score") {
      filtered.sort((a, b) => b.averageScore - a.averageScore);
    } else if (sortBy === "quizzes") {
      filtered.sort((a, b) => b.quizzesTaken - a.quizzesTaken);
    }

    return filtered;
  };

  const filteredStudents = getFilteredAndSortedStudents();

  const viewStudentDetails = (student) => {
    setSelectedStudent(student);
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
          <span style={{ fontSize: '20px', fontWeight: '900', fontFamily: 'var(--font-heading)' }}>Menu</span>
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

        {/* Page Content */}
        <main style={{
          flex: 1,
          padding: isMobile ? '16px' : '25px',
          overflowY: 'auto'
        }}>
          {/* Page Title & Search */}
          <div style={{ marginBottom: isMobile ? '20px' : '24px' }}>
            <h1 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: theme.text, margin: 0, transition: 'color 0.3s ease', fontFamily: 'var(--font-heading)' }}>
              Manage Students
            </h1>
            <p style={{ fontSize: '14px', color: theme.textSecondary, marginTop: '8px', marginBottom: '16px', transition: 'color 0.3s ease', fontFamily: 'var(--font-body)' }}>
              View and manage your students' progress and performance
            </p>

            {/* Search, Sort & Filter Controls */}
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              gap: '12px',
              marginBottom: '8px',
              alignItems: isMobile ? 'stretch' : 'center'
            }}>
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search by name, email, or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  maxWidth: isMobile ? '100%' : '400px',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: `2px solid ${theme.border}`,
                  backgroundColor: theme.card,
                  color: theme.text,
                  fontSize: '15px',
                  fontWeight: '500',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366F1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border;
                  e.target.style.boxShadow = 'none';
                }}
              />

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: `2px solid ${theme.border}`,
                  backgroundColor: theme.card,
                  color: theme.text,
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '150px',
                  transition: 'all 0.3s ease'
                }}
              >
                <option value="name">Sort by Name</option>
                <option value="score">Sort by Score</option>
                <option value="quizzes">Sort by Quizzes</option>
              </select>

              {/* Filter Dropdown */}
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: `2px solid ${theme.border}`,
                  backgroundColor: theme.card,
                  color: theme.text,
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '150px',
                  transition: 'all 0.3s ease'
                }}
              >
                <option value="all">All Students</option>
                <option value="active">Active Only</option>
                <option value="high">High Performers</option>
                <option value="low">Needs Help</option>
              </select>
            </div>

            {/* Results count */}
            <p style={{ fontSize: '13px', color: theme.textSecondary, marginTop: '8px', transition: 'color 0.3s ease' }}>
              Showing {filteredStudents.length} of {students.length} students
            </p>
          </div>

          {/* Students Overview Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '16px',
            marginBottom: '24px'
          }}>
            {filteredStudents.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                backgroundColor: theme.card,
                borderRadius: '18px',
                padding: '60px',
                textAlign: 'center',
                boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'background-color 0.3s ease'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>👥</div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: theme.text, margin: '0 0 8px 0', transition: 'color 0.3s ease' }}>
                  No Students Found
                </h2>
                <p style={{ fontSize: '14px', color: theme.textSecondary, margin: 0, transition: 'color 0.3s ease' }}>
                  {searchTerm ? 'Try adjusting your search criteria' : 'Students will appear here after taking quizzes'}
                </p>
              </div>
            ) : (
              filteredStudents.map((student, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: theme.card,
                    borderRadius: '18px',
                    padding: '24px',
                    boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    animation: `slideUp 0.4s ease-out ${index * 0.05}s both`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  }}
                >
                  {/* Student Avatar & Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#6366F1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      fontWeight: '700',
                      color: 'white',
                      border: '3px solid #FFD700'
                    }}>
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.text, margin: '0 0 4px 0', transition: 'color 0.3s ease' }}>
                        {student.name}
                      </h3>
                      <p style={{ fontSize: '13px', color: theme.textSecondary, margin: 0, transition: 'color 0.3s ease' }}>
                        {student.email}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      padding: '12px',
                      borderRadius: '10px',
                      backgroundColor: '#f0f9ff',
                      border: '2px solid #6366F1'
                    }}>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: '#6366F1' }}>
                        {student.quizzesTaken}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#666' }}>
                        Quizzes
                      </div>
                    </div>
                    <div style={{
                      padding: '12px',
                      borderRadius: '10px',
                      backgroundColor: '#f0fdf4',
                      border: '2px solid #22C55E'
                    }}>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: '#22C55E' }}>
                        {Math.round(student.averageScore)}%
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#666' }}>
                        Avg Score
                      </div>
                    </div>
                  </div>

                  {/* Last Activity */}
                  <div style={{
                    fontSize: '12px',
                    color: '#999',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>🕐</span>
                    <span>Last active: {new Date(student.lastActivity).toLocaleDateString()}</span>
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => viewStudentDetails(student)}
                    style={{
                      width: '100%',
                      padding: '12px',
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
                    View Details
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Student Details Modal */}
          {selectedStudent && (
            <div
              onClick={() => setSelectedStudent(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px',
                animation: 'fadeIn 0.3s ease-in-out'
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: theme.card,
                  borderRadius: '20px',
                  padding: isMobile ? '24px' : '40px',
                  maxWidth: '600px',
                  width: '100%',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  boxShadow: darkMode ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.3)',
                  animation: 'scaleIn 0.3s ease-out',
                  transition: 'background-color 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: theme.text, margin: 0, transition: 'color 0.3s ease' }}>
                    Student Details
                  </h2>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    style={{
                      fontSize: '24px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: '#666',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'rotate(90deg) scale(1.2)';
                      e.target.style.color = '#DC2626';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'rotate(0) scale(1)';
                      e.target.style.color = '#666';
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Student Info */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: '#6366F1',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '42px',
                    fontWeight: '700',
                    color: 'white',
                    border: '4px solid #FFD700',
                    marginBottom: '16px'
                  }}>
                    {selectedStudent.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 8px 0' }}>
                    {selectedStudent.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: '0 0 4px 0' }}>
                    {selectedStudent.email}
                  </p>
                  <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>
                    Student ID: {selectedStudent.studentId}
                  </p>
                </div>

                {/* Performance Summary */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    padding: '20px',
                    borderRadius: '14px',
                    backgroundColor: '#f0f9ff',
                    border: '3px solid #6366F1',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: '900', color: '#6366F1', marginBottom: '8px' }}>
                      {selectedStudent.quizzesTaken}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>
                      Quizzes Completed
                    </div>
                  </div>

                  <div style={{
                    padding: '20px',
                    borderRadius: '14px',
                    backgroundColor: '#f0fdf4',
                    border: '3px solid #22C55E',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: '900', color: '#22C55E', marginBottom: '8px' }}>
                      {Math.round(selectedStudent.averageScore)}%
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>
                      Average Score
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div style={{
                  padding: '20px',
                  borderRadius: '14px',
                  backgroundColor: '#f9f9f9',
                  marginBottom: '24px'
                }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#666', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Last Activity
                  </h4>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>
                    {new Date(selectedStudent.lastActivity).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedStudent(null)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#6366F1',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#4f46e5';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#6366F1';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Close
                </button>
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

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
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
