import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../App";

export default function InstructorProfilePage() {
  const navigate = useNavigate();
  const showToast = useToastContext();
  const [activeMenu, setActiveMenu] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    employeeId: "",
    department: "",
    title: "",
    bio: "",
  });
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

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
      setCurrentUser(user);
      
      // Load saved profile or use defaults
      const savedProfile = JSON.parse(localStorage.getItem("instructorProfile") || "{}");
      setProfileData({
        name: savedProfile.name || user.name || "Instructor Name",
        email: user.email,
        employeeId: savedProfile.employeeId || user.employeeId || "EMP-2024-001",
        department: savedProfile.department || user.department || "Computer Science",
        title: savedProfile.title || user.title || "Professor",
        bio: savedProfile.bio || user.bio || "Dedicated educator passionate about student success.",
      });
      
      // Load notifications
      const savedNotifications = JSON.parse(localStorage.getItem("instructorNotifications") || "[]");
      setNotifications(savedNotifications);
      
      // Load dark mode preference
      const savedDarkMode = localStorage.getItem("darkMode") === "true";
      setDarkMode(savedDarkMode);
    } catch (error) {
      console.error("Error loading profile:", error);
      navigate("/instructor/login");
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

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("File size must be less than 5MB", "error");
        return;
      }
      if (!file.type.startsWith('image/')) {
        showToast("Please select an image file", "error");
        return;
      }
      setSelectedAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = () => {
    if (avatarPreview) {
      localStorage.setItem("instructorAvatar", avatarPreview);
      showToast("Avatar updated successfully!", "success");
      setShowAvatarModal(false);
      setSelectedAvatar(null);
      setAvatarPreview(null);
    }
  };

  const handleCancelAvatar = () => {
    setShowAvatarModal(false);
    setSelectedAvatar(null);
    setAvatarPreview(null);
  };

  const handleSaveProfile = () => {
    try {
      // Validation
      if (!profileData.name || profileData.name.trim() === "") {
        showToast("Name cannot be empty", "error");
        return;
      }
      if (!profileData.employeeId || profileData.employeeId.trim() === "") {
        showToast("Employee ID cannot be empty", "error");
        return;
      }
      if (!profileData.department || profileData.department.trim() === "") {
        showToast("Department cannot be empty", "error");
        return;
      }
      if (!profileData.title || profileData.title.trim() === "") {
        showToast("Title cannot be empty", "error");
        return;
      }
      if (profileData.bio && profileData.bio.length > 500) {
        showToast("Bio must be less than 500 characters", "error");
        return;
      }

      const profileToSave = {
        name: profileData.name.trim(),
        employeeId: profileData.employeeId.trim(),
        department: profileData.department.trim(),
        title: profileData.title.trim(),
        bio: profileData.bio.trim()
      };
      localStorage.setItem("instructorProfile", JSON.stringify(profileToSave));
      
      // Also update currentUser
      const updatedUser = { ...currentUser, ...profileToSave };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setIsEditing(false);
      showToast("Profile updated successfully!", "success");
    } catch (error) {
      console.error("Error saving profile:", error);
      showToast("Failed to save profile. Please try again.", "error");
    }
  };

  const handleCancelEdit = () => {
    const savedProfile = JSON.parse(localStorage.getItem("instructorProfile") || "{}");
    setProfileData({
      name: savedProfile.name || currentUser?.name || "Instructor Name",
      email: currentUser?.email || "",
      employeeId: savedProfile.employeeId || currentUser?.employeeId || "EMP-2024-001",
      department: savedProfile.department || currentUser?.department || "Computer Science",
      title: savedProfile.title || currentUser?.title || "Professor",
      bio: savedProfile.bio || currentUser?.bio || "Dedicated educator passionate about student success.",
    });
    setIsEditing(false);
  };

  // Calculate teaching stats
  const getStats = () => {
    const quizzes = JSON.parse(localStorage.getItem("instructorQuizzes") || "[]");
    const submissions = JSON.parse(localStorage.getItem("quizResults") || "[]");
    
    const totalQuizzes = quizzes.length;
    const uniqueStudents = new Set(submissions.map(s => s.studentEmail)).size;
    const totalQuestions = quizzes.reduce((acc, q) => acc + (q.questions?.length || 0), 0);
    const avgScore = submissions.length > 0
      ? submissions.reduce((acc, s) => acc + (s.score / s.totalQuestions * 100), 0) / submissions.length
      : 0;

    return { totalQuizzes, uniqueStudents, totalQuestions, avgScore };
  };
  
  const stats = getStats();

  // Theme based on dark mode - MUST be defined before any early returns
  const theme = darkMode ? {
    background: '#1a1a1a',
    card: '#2d2d2d',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    border: '#404040',
    sidebarBg: '#2d2d2d',
    sidebarText: '#ffffff',
    inputBg: '#3d3d3d',
    inputBorder: '#505050'
  } : {
    background: '#f0f0f0',
    card: 'white',
    text: '#1a1a1a',
    textSecondary: '#666',
    border: '#eee',
    sidebarBg: 'white',
    sidebarText: '#1a1a1a',
    inputBg: 'white',
    inputBorder: '#e0e0e0'
  };
  
  const savedAvatar = localStorage.getItem("instructorAvatar");

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
          <span style={{ fontSize: '20px', fontWeight: '900', color: theme.text }}>Menu</span>
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
                  color: activeMenu === menu ? 'white' : theme.text,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'left',
                  transition: 'all 0.2s ease-in-out',
                  transform: activeMenu === menu ? 'scale(1.02)' : 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  if (activeMenu !== menu) e.currentTarget.style.backgroundColor = darkMode ? '#3d3d3d' : '#f5f5f5';
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
                    borderBottom: '1px solid #f0f0f0',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>
                      {currentUser?.name || 'Instructor'}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {currentUser?.email}
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
          <div style={{ marginBottom: isMobile ? '20px' : '32px' }}>
            <h1 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: theme.text, margin: 0, transition: 'color 0.3s ease', fontFamily: 'var(--font-heading)' }}>
              Instructor Profile
            </h1>
            <p style={{ fontSize: '14px', color: theme.textSecondary, marginTop: '8px', transition: 'color 0.3s ease', fontFamily: 'var(--font-body)' }}>
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Card */}
          <div style={{
            backgroundColor: theme.card,
            borderRadius: '18px',
            padding: isMobile ? '24px' : '40px',
            boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
            animation: 'slideUp 0.4s ease-out',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
          }}>
            {/* Profile Header */}
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: '24px',
              marginBottom: '40px',
              paddingBottom: '32px',
              borderBottom: `2px solid ${theme.border}`
            }}>
              {/* Avatar */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: savedAvatar ? 'transparent' : '#6366F1',
                  backgroundImage: savedAvatar ? `url(${savedAvatar})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  color: 'white',
                  fontWeight: '700',
                  border: '4px solid #FFD700',
                  transition: 'all 0.3s ease-in-out',
                  cursor: 'pointer'
                }}
                onClick={() => setShowAvatarModal(true)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  {!savedAvatar && profileData.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={() => setShowAvatarModal(true)}
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#6366F1',
                    border: '3px solid ' + theme.card,
                    color: 'white',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.backgroundColor = '#5558E3';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = '#6366F1';
                  }}
                  title="Change Avatar"
                >
                  📷
                </button>
              </div>

              {/* Name and Info */}
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '28px', fontWeight: '700', color: theme.text, margin: 0, transition: 'color 0.3s ease', fontFamily: 'var(--font-heading)' }}>
                  {profileData.name}
                </h2>
                <p style={{ fontSize: '16px', color: theme.textSecondary, marginTop: '6px', marginBottom: '8px', transition: 'color 0.3s ease', fontFamily: 'var(--font-body)' }}>
                  {profileData.email}
                </p>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: darkMode ? '#3d3d3d' : '#f0f0f0',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: theme.text,
                  transition: 'background-color 0.3s ease, color 0.3s ease'
                }}>
                  Employee ID: {profileData.employeeId}
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
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
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            {/* Profile Information */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
              {/* Full Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#666',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      fontSize: '15px',
                      fontWeight: '500',
                      outline: 'none',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#6366F1';
                      e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                ) : (
                  <p style={{ fontSize: '16px', fontWeight: '500', color: theme.text, margin: 0, transition: 'color 0.3s ease' }}>
                    {profileData.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#666',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Email Address
                </label>
                <p style={{ fontSize: '16px', fontWeight: '500', color: '#666', margin: 0 }}>
                  {profileData.email} <span style={{ fontSize: '12px', color: '#999' }}>(Cannot be changed)</span>
                </p>
              </div>

              {/* Department */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#666',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Department
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.department}
                    onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      fontSize: '15px',
                      fontWeight: '500',
                      outline: 'none',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#6366F1';
                      e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                ) : (
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a', margin: 0 }}>
                    {profileData.department}
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#666',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Title / Position
                </label>
                {isEditing ? (
                  <select
                    value={profileData.title}
                    onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      fontSize: '15px',
                      fontWeight: '500',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      backgroundColor: theme.card,
                      color: theme.text,
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#6366F1';
                      e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.border;
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Instructor">Instructor</option>
                  </select>
                ) : (
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a', margin: 0 }}>
                    {profileData.title}
                  </p>
                )}
              </div>

              {/* Bio - Full Width */}
              <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#666',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      fontSize: '15px',
                      fontWeight: '500',
                      outline: 'none',
                      transition: 'all 0.2s ease-in-out',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#6366F1';
                      e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                ) : (
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a', margin: 0, lineHeight: '1.6' }}>
                    {profileData.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            {isEditing && (
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                marginTop: '32px',
                paddingTop: '32px',
                borderTop: '2px solid #f0f0f0'
              }}>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '12px',
                    border: `2px solid ${theme.border}`,
                    backgroundColor: 'transparent',
                    color: theme.text,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = darkMode ? '#3d3d3d' : '#f5f5f5';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#6366F1',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
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
                  💾 Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Teaching Stats */}
          <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: '16px' }}>
            <div style={{
              backgroundColor: theme.card,
              borderRadius: '18px',
              padding: '24px',
              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
              textAlign: 'center',
              transition: 'all 0.3s ease-in-out'
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
              <div style={{ fontSize: '42px', fontWeight: '900', color: '#6366F1', marginBottom: '8px' }}>
                {stats.totalQuizzes}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, transition: 'color 0.3s ease' }}>
                Quizzes Created
              </div>
            </div>

            <div style={{
              backgroundColor: theme.card,
              borderRadius: '18px',
              padding: '24px',
              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
              textAlign: 'center',
              transition: 'all 0.3s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(34, 197, 94, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
            >
              <div style={{ fontSize: '42px', fontWeight: '900', color: '#22C55E', marginBottom: '8px' }}>
                {stats.uniqueStudents}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, transition: 'color 0.3s ease' }}>
                Active Students
              </div>
            </div>

            <div style={{
              backgroundColor: theme.card,
              borderRadius: '18px',
              padding: '24px',
              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
              textAlign: 'center',
              transition: 'all 0.3s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(245, 158, 11, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
            >
              <div style={{ fontSize: '42px', fontWeight: '900', color: '#F59E0B', marginBottom: '8px' }}>
                {stats.totalQuestions}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, transition: 'color 0.3s ease' }}>
                Total Questions
              </div>
            </div>

            <div style={{
              backgroundColor: theme.card,
              borderRadius: '18px',
              padding: '24px',
              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
              textAlign: 'center',
              transition: 'all 0.3s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 215, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
            >
              <div style={{ fontSize: '42px', fontWeight: '900', color: '#FFD700', marginBottom: '8px' }}>
                {Math.round(stats.avgScore)}%
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, transition: 'color 0.3s ease' }}>
                Average Pass Rate
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Avatar Upload Modal */}
      {showAvatarModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          animation: 'fadeIn 0.3s ease'
        }}
        onClick={handleCancelAvatar}
        >
          <div style={{
            backgroundColor: theme.card,
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'scaleIn 0.3s ease',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: theme.text, 
              marginTop: 0, 
              marginBottom: '24px',
              transition: 'color 0.3s ease'
            }}>
              Change Profile Picture
            </h2>

            {/* Preview */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                backgroundColor: avatarPreview ? 'transparent' : '#6366F1',
                backgroundImage: avatarPreview ? `url(${avatarPreview})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '4px solid #FFD700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '60px',
                color: 'white',
                fontWeight: '700'
              }}>
                {!avatarPreview && profileData.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* File Input */}
            <div style={{
              border: `2px dashed ${theme.border}`,
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              marginBottom: '24px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: darkMode ? '#3d3d3d' : '#f9f9f9'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#6366F1';
              e.currentTarget.style.backgroundColor = darkMode ? '#4d4d4d' : '#f0f0ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.border;
              e.currentTarget.style.backgroundColor = darkMode ? '#3d3d3d' : '#f9f9f9';
            }}
            onClick={() => document.getElementById('avatar-input').click()}
            >
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📷</div>
              <p style={{ color: theme.text, fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', transition: 'color 0.3s ease' }}>
                Click to upload photo
              </p>
              <p style={{ color: theme.textSecondary, fontSize: '14px', margin: 0, transition: 'color 0.3s ease' }}>
                JPG, PNG or GIF (max 5MB)
              </p>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancelAvatar}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: `2px solid ${theme.border}`,
                  backgroundColor: 'transparent',
                  color: theme.text,
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode ? '#3d3d3d' : '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAvatar}
                disabled={!avatarPreview}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: avatarPreview ? '#6366F1' : '#ccc',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: avatarPreview ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  opacity: avatarPreview ? 1 : 0.6
                }}
                onMouseEnter={(e) => {
                  if (avatarPreview) e.currentTarget.style.backgroundColor = '#5558E3';
                }}
                onMouseLeave={(e) => {
                  if (avatarPreview) e.currentTarget.style.backgroundColor = '#6366F1';
                }}
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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
