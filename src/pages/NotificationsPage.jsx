import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/api";
import { setMeta, removeCurrentUser, getCurrentUser, getMeta } from "../utils/db";

const NotificationsPage = () => {
  const [activeMenu, setActiveMenu] = useState("notifications");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [darkMode, setDarkMode] = useState(false);
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

  // Load dark mode preference and current user
  useEffect(() => {
    (async () => {
      try {
        const rawDark = await getMeta('darkMode').catch(()=>null);
        if (rawDark) setDarkMode(JSON.parse(rawDark));
        const u = await getCurrentUser().catch(()=>null);
        if (u) {
          // set nothing here; components can read notifications from API
        }
      } catch(e) {
        // ignore
      } finally {
        setTimeout(() => setPageLoaded(true), 50);
      }
    })();
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newValue = !prev;
      setMeta('darkMode', JSON.stringify(newValue)).catch(() => {});
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

  const [currentUser, setCurrentUser] = useState({ name: "Student", email: "student@example.com" });

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      try{
        const u = await getCurrentUser();
        if (mounted && u) setCurrentUser(u);
      }catch(e){/* ignore */}
    })();
    return ()=>{ mounted = false };
  },[]);

  // Notifications will be fetched from backend
  const [notifications, setNotifications] = useState([]);
  // Fetch notifications from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const resp = await fetchWithAuth('/api/notifications');
        const data = resp.data ?? (await resp.json().catch(() => null));
        setNotifications(Array.isArray(data) ? data : (data?.notifications || data?.data || []));
      } catch (err) {
        console.error('[NotificationsPage] load notifications error', err);
        setNotifications([]);
      }
    })();
  }, []);

  const handleLogout = () => {
    removeCurrentUser().catch(() => {});
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
