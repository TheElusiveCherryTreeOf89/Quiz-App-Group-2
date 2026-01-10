import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../App";
import { fetchWithAuth } from "../utils/api";
import { setCurrentUser as setCurrentUserMeta, setMeta, removeCurrentUser, getCurrentUser, getMeta } from "../utils/db";

const ProfilePage = () => {
  const [activeMenu, setActiveMenu] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const showToast = useToastContext();

  // Get current user and profile from backend
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    studentId: '',
    program: '',
    year: '',
    bio: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  // Fetch profile data from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const resp = await fetchWithAuth('/api/profile');
        const data = resp.data ?? (await resp.json().catch(() => null));
        if (data) {
          setProfileData(prev => ({ ...prev, ...data }));
          setProfilePictureUrl(data.profilePictureUrl || null);
        }
      } catch (err) {
        console.warn('[ProfilePage] load profile error, falling back to defaults', err);
        setProfilePictureUrl(null);
      }
    })();
  }, []);

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

  useEffect(() => {
    (async ()=>{
      try{
        const user = await getCurrentUser().catch(()=>null);
        if (!user || user.role !== "student") {
          navigate("/login");
          return;
        }
        setCurrentUser(user);
        setProfileData(prev => ({
          ...prev,
          name: user.name || "Student Name",
          email: user.email,
          studentId: user.studentId || "2024-00001",
          program: user.program || "Computer Science",
          year: user.year || "3rd Year",
          bio: user.bio || "Passionate learner focused on academic excellence.",
        }));

        const rawDark = await getMeta('darkMode').catch(()=>null);
        setDarkMode(rawDark === 'true');

        setTimeout(() => setPageLoaded(true), 50);
      }catch(e){
        navigate("/login");
      }
    })();
  }, [navigate]);

  const handleLogout = () => {
    removeCurrentUser().catch(() => {});
    navigate("/login");
  };
  
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    setMeta('darkMode', newMode.toString()).catch(() => {});
    showToast(`Dark mode ${newMode ? 'enabled' : 'disabled'}`, "info");
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

  const handleSaveProfile = async () => {
    try {
      let apiSuccess = false;

      try {
        // Try to save to API first
        const response = await fetchWithAuth('/api/profile', {
          method: 'PUT',
          body: JSON.stringify(profileData)
        });

        if (response.ok) {
          const updatedProfile = response.data ?? (await response.json().catch(() => null));
          setProfileData(prev => ({ ...prev, ...updatedProfile }));
          apiSuccess = true;
        }
      } catch (apiError) {
        console.warn('API not available, falling back to localStorage:', apiError);
      }

      // If API succeeded and there's a selected file, try to upload picture
      if (apiSuccess && selectedFile) {
        try {
          const formData = new FormData();
          formData.append('profilePicture', selectedFile);

          const uploadResponse = await fetchWithAuth('/api/profile/picture', {
            method: 'POST',
            body: formData
          });

          if (uploadResponse.ok) {
            const uploadResult = uploadResponse.data ?? (await uploadResponse.json().catch(() => null));
            setProfilePictureUrl(uploadResult?.profilePictureUrl || null);
          }
        } catch (uploadError) {
          console.warn('Picture upload failed:', uploadError);
        }
      }

      // Persist updated currentUser to IndexedDB and state
      const updatedUser = { ...currentUser, ...profileData };
      setCurrentUser(updatedUser);
      // Persist currentUser to IndexedDB
      setCurrentUserMeta(updatedUser).catch(() => {});

      setIsEditing(false);
      setSelectedFile(null);
      showToast("Profile updated successfully!", "success");
    } catch (error) {
      console.error('Save profile error:', error);
      showToast("Failed to save profile. Please try again.", "error");
    }
  };

  const handleCancelEdit = () => {
    // Reset to current profileData (which includes any loaded data)
    setProfileData(prev => ({ ...prev }));
    setSelectedFile(null);
    setIsEditing(false);
  };
  
  // Theme based on dark mode
  const theme = darkMode ? {
    background: '#1a1a1a',
    card: '#2d2d2d',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    border: '#404040',
    sidebarBg: '#2d2d2d',
    sidebarText: '#ffffff'
  } : {
    background: '#f0f0f0',
    card: 'white',
    text: '#1a1a1a',
    textSecondary: '#666',
    border: '#eee',
    sidebarBg: 'white',
    sidebarText: '#1a1a1a'
  };

  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background, transition: 'background-color 0.3s ease' }}>
        <div style={{ fontSize: '18px', color: theme.textSecondary, transition: 'color 0.3s ease' }}>Loading...</div>
      </div>
    );
  }

  // Use profileData directly since it's always defined
  const safeProfile = profileData;

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
            
            {/* Profile Icon with Dropdown removed */}
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
            <h1 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: theme.text, margin: 0, fontFamily: 'var(--font-heading)', transition: 'color 0.3s ease' }}>
              Profile
            </h1>
            <p style={{ fontSize: '14px', color: theme.textSecondary, marginTop: '8px', fontFamily: 'var(--font-body)', transition: 'color 0.3s ease' }}>
              Manage your personal information and settings
            </p>
          </div>

          {/* Profile Card */}
          <div style={{
            backgroundColor: theme.card,
            borderRadius: '18px',
            padding: '40px',
            boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease'
          }}>
            {/* Profile Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              marginBottom: '40px',
              paddingBottom: '32px',
              borderBottom: `2px solid ${theme.border}`,
              transition: 'border-color 0.3s ease'
            }}>
              {/* Avatar */}
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#FF6B00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                color: 'white',
                fontWeight: '700',
                border: '4px solid #FFD700',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {profilePictureUrl ? (
                  <img 
                    src={profilePictureUrl} 
                    alt="Profile" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%'
                    }}
                  />
                ) : (
                  safeProfile.name ? safeProfile.name.charAt(0).toUpperCase() : '?'
                )}
                {isEditing && (
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    backgroundColor: '#FF6B00',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: '2px solid white'
                  }}>
                    <label htmlFor="profile-picture-input" style={{ cursor: 'pointer', fontSize: '16px' }}>📷</label>
                    <input
                      id="profile-picture-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                  </div>
                )}
              </div>

              {/* Name and Email */}
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '28px', fontWeight: '700', color: theme.text, margin: 0, fontFamily: 'var(--font-heading)', transition: 'color 0.3s ease' }}>
                  {safeProfile.name || <span style={{color: theme.textSecondary}}>No name set</span>}
                </h2>
                <p style={{ fontSize: '16px', color: theme.textSecondary, marginTop: '6px', marginBottom: '8px', fontFamily: 'var(--font-body)', transition: 'color 0.3s ease' }}>
                  {safeProfile.email || <span style={{color: theme.textSecondary}}>No email set</span>}
                </p>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: darkMode ? '#3d3d3d' : '#f0f0f0',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: theme.text,
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.3s ease'
                }}>
                  Student ID: {safeProfile.studentId || <span style={{color: theme.textSecondary}}>Not set</span>}
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: '2px solid #FF6B00',
                    backgroundColor: 'white',
                    color: '#FF6B00',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#FF6B00';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.color = '#FF6B00';
                  }}
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            {/* Profile Information */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
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
                    value={safeProfile.name}
                    onChange={(e) => setProfileData({ ...(profileData || {}), name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      fontSize: '15px',
                      fontWeight: '500',
                      outline: 'none',
                      transition: 'border 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#FF6B00'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                ) : (
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a', margin: 0 }}>
                    {safeProfile.name || <span style={{color: theme.textSecondary}}>No name set</span>}
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
                  {safeProfile.email || <span style={{color: theme.textSecondary}}>No email set</span>} <span style={{ fontSize: '12px', color: '#999' }}>(Cannot be changed)</span>
                </p>
              </div>

              {/* Program */}
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
                  Program
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={safeProfile.program}
                    onChange={(e) => setProfileData({ ...(profileData || {}), program: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      fontSize: '15px',
                      fontWeight: '500',
                      outline: 'none',
                      transition: 'border 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#FF6B00'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                ) : (
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a', margin: 0 }}>
                    {safeProfile.program || <span style={{color: theme.textSecondary}}>Not set</span>}
                  </p>
                )}
              </div>

              {/* Year Level */}
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
                  Year Level
                </label>
                {isEditing ? (
                  <select
                    value={safeProfile.year}
                    onChange={(e) => setProfileData({ ...(profileData || {}), year: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      fontSize: '15px',
                      fontWeight: '500',
                      outline: 'none',
                      transition: 'border 0.2s',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#FF6B00'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                ) : (
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a', margin: 0 }}>
                    {safeProfile.year || <span style={{color: theme.textSecondary}}>Not set</span>}
                  </p>
                )}
              </div>

              {/* Bio - Full Width */}
              <div style={{ gridColumn: '1 / -1' }}>
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
                    value={safeProfile.bio}
                    onChange={(e) => setProfileData({ ...(profileData || {}), bio: e.target.value })}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      fontSize: '15px',
                      fontWeight: '500',
                      outline: 'none',
                      transition: 'border 0.2s',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#FF6B00'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                ) : (
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a', margin: 0, lineHeight: '1.6' }}>
                    {safeProfile.bio || <span style={{color: theme.textSecondary}}>No bio set</span>}
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
                    border: '2px solid #e0e0e0',
                    backgroundColor: 'white',
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white';
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
                    backgroundColor: '#FF6B00',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e55d00';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#FF6B00';
                  }}
                >
                  💾 Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Account Statistics */}
          <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '42px', fontWeight: '900', color: '#FF6B00', marginBottom: '8px' }}>
                5
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#666' }}>
                Quizzes Completed
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '42px', fontWeight: '900', color: '#22C55E', marginBottom: '8px' }}>
                87%
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#666' }}>
                Average Score
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '42px', fontWeight: '900', color: '#FFD700', marginBottom: '8px' }}>
                12
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#666' }}>
                Days Active
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
