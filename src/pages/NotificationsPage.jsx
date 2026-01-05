import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotificationsPage = () => {
  const [activeMenu, setActiveMenu] = useState("notifications");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  // Handle window resize for mobile responsiveness
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

  // Load dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) {
      setDarkMode(JSON.parse(saved));
    }
    setTimeout(() => setPageLoaded(true), 50);
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

  // Sample notifications with read/unread status
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "quiz",
      icon: "📝",
      title: "New Quiz Available",
      message: "DCIT 26 Final Exam is now available to attempt.",
      time: "5 minutes ago",
      isRead: false,
      color: "#FF6B00"
    },
    {
      id: 2,
      type: "result",
      icon: "🎯",
      title: "Quiz Result Released",
      message: "Your result for Midterm Exam has been released.",
      time: "2 hours ago",
      isRead: false,
      color: "#22C55E"
    },
    {
      id: 3,
      type: "deadline",
      icon: "⏰",
      title: "Deadline Reminder",
      message: "Quiz 3 - Arrays and Strings deadline is in 24 hours.",
      time: "5 hours ago",
      isRead: true,
      color: "#F59E0B"
    },
    {
      id: 4,
      type: "announcement",
      icon: "📢",
      title: "Course Announcement",
      message: "Class will be held online next week due to maintenance.",
      time: "1 day ago",
      isRead: true,
      color: "#3B82F6"
    },
    {
      id: 5,
      type: "result",
      icon: "🏆",
      title: "Excellent Performance!",
      message: "You scored 95% in Quiz 2 - Functions. Keep it up!",
      time: "2 days ago",
      isRead: true,
      color: "#22C55E"
    },
    {
      id: 6,
      type: "quiz",
      icon: "📝",
      title: "Quiz Updated",
      message: "Quiz 4 - Pointers has been updated with additional questions.",
      time: "3 days ago",
      isRead: true,
      color: "#FF6B00"
    },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    setSidebarOpen(false); // Close mobile sidebar on navigation
    if (menuId === "dashboard") navigate("/student/dashboard");
    else if (menuId === "profile") navigate("/student/profile");
    else if (menuId === "manage-quizzes") navigate("/student/manage-quizzes");
    else if (menuId === "results") navigate("/student/result");
    else if (menuId === "notifications") navigate("/student/notifications");
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: isMobile ? '280px' : '200px',
        backgroundColor: theme.sidebarBg,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: darkMode ? '2px 0 10px rgba(0,0,0,0.3)' : '2px 0 10px rgba(0,0,0,0.08)',
        flexShrink: 0,
        ...(isMobile && {
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: sidebarOpen ? 0 : '-280px',
          transition: 'left 0.3s ease-in-out',
          zIndex: 999
        })
      }}>
        {/* Menu Header */}
        <div style={{ padding: '20px', borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '20px', fontWeight: '900', fontFamily: 'var(--font-heading)', letterSpacing: '0.5px', color: theme.sidebarText, transition: 'color 0.3s ease' }}>Menu</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1, padding: '15px 12px' }}>
          {/* Dashboard */}
          <button
            onClick={() => handleMenuClick("dashboard")}
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
            onClick={() => handleMenuClick("manage-quizzes")}
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
            onClick={() => handleMenuClick("notifications")}
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
              fontFamily: 'var(--font-body)'
            }}
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
          padding: isMobile ? '12px 16px' : '12px 25px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
            <img 
              src="/src/assets/1.svg" 
              alt="QuizApp Logo"
              style={{
                height: isMobile ? '48px' : '56px',
                cursor: 'default',
                transition: 'transform 0.2s'
              }}
            />
          </div>

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

        {/* Page Content */}
        <main style={{
          flex: 1,
          padding: isMobile ? '16px' : '25px',
          overflowY: 'auto'
        }}>
          {/* Page Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h1 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: theme.text, margin: 0, fontFamily: 'var(--font-heading)', transition: 'color 0.3s ease' }}>
                Notifications
              </h1>
              <p style={{ fontSize: '14px', color: theme.textSecondary, marginTop: '8px', transition: 'color 0.3s ease' }}>
                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up! 🎉'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: '2px solid #FF6B00',
                  backgroundColor: theme.card,
                  color: '#FF6B00',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#FF6B00';
                  e.target.style.color = theme.background;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = theme.card;
                  e.target.style.color = '#FF6B00';
                }}
              >
                ✓ Mark All as Read
              </button>
            )}
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div style={{
              backgroundColor: theme.card,
              borderRadius: '18px',
              padding: '60px 40px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'background-color 0.3s ease'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: theme.text, margin: 0, transition: 'color 0.3s ease' }}>
                No Notifications
              </h3>
              <p style={{ fontSize: '14px', color: theme.textSecondary, marginTop: '8px', transition: 'color 0.3s ease' }}>
                You don't have any notifications yet.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    backgroundColor: notif.isRead ? theme.card : '#FFF8F0',
                    borderRadius: '18px',
                    padding: isMobile ? '16px' : '20px 24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: notif.isRead ? `1px solid ${theme.border}` : '2px solid #FFD700',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    position: 'relative',
                    transition: 'all 0.2s'
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: `${notif.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0
                  }}>
                    {notif.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '6px'
                    }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: theme.text,
                        margin: 0,
                        transition: 'color 0.3s ease'
                      }}>
                        {notif.title}
                        {!notif.isRead && (
                          <span style={{
                            display: 'inline-block',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#FF6B00',
                            marginLeft: '8px'
                          }}></span>
                        )}
                      </h3>
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: theme.textSecondary,
                          cursor: 'pointer',
                          fontSize: '18px',
                          padding: '0',
                          lineHeight: 1,
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#DC2626'}
                        onMouseLeave={(e) => e.target.style.color = theme.textSecondary}
                      >
                        ×
                      </button>
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: theme.textSecondary,
                      margin: 0,
                      marginBottom: '8px',
                      lineHeight: '1.5',
                      transition: 'color 0.3s ease'
                    }}>
                      {notif.message}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        color: theme.textSecondary,
                        fontWeight: '500'
                      }}>
                        {notif.time}
                      </span>
                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#FF6B00',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            padding: 0,
                            textDecoration: 'underline'
                          }}
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;
