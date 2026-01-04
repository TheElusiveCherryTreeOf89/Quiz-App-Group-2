import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../App";

const ProfilePage = () => {
  const [activeMenu, setActiveMenu] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const showToast = useToastContext();

  // Get current user with error handling
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    studentId: "",
    program: "",
    year: "",
    bio: "",
  });

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
    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (!user || user.role !== "student") {
        navigate("/login");
        return;
      }
      setCurrentUser(user);
      setProfileData({
        name: user.name || "Student Name",
        email: user.email,
        studentId: user.studentId || "2024-00001",
        program: user.program || "Computer Science",
        year: user.year || "3rd Year",
        bio: user.bio || "Passionate learner focused on academic excellence.",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      navigate("/login");
    }
  }, [navigate]);

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

  const handleSaveProfile = () => {
    try {
      // Update current user in localStorage
      const updatedUser = { ...currentUser, ...profileData };
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
    // Reset to original data
    setProfileData({
      name: currentUser?.name || "Student Name",
      email: currentUser?.email || "",
      studentId: currentUser?.studentId || "2024-00001",
      program: currentUser?.program || "Computer Science",
      year: currentUser?.year || "3rd Year",
      bio: currentUser?.bio || "Passionate learner focused on academic excellence.",
    });
    setIsEditing(false);
  };

  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f0f0f0', position: 'relative' }}>
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
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 10px rgba(0,0,0,0.08)',
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
        <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '20px', fontWeight: '900' }}>Menu</span>
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
              color: activeMenu === "dashboard" ? 'white' : 'black',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left'
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
              color: activeMenu === "profile" ? 'white' : 'black',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left'
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
              color: activeMenu === "manage-quizzes" ? 'white' : 'black',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left'
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
              color: activeMenu === "results" ? 'white' : 'black',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left'
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
              color: activeMenu === "notifications" ? 'white' : 'black',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left'
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/student/profile')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '24px',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              👤
            </button>
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
            <h1 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
              Profile
            </h1>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
              Manage your personal information and settings
            </p>
          </div>

          {/* Profile Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '18px',
            padding: '40px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            {/* Profile Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              marginBottom: '40px',
              paddingBottom: '32px',
              borderBottom: '2px solid #f0f0f0'
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
                border: '4px solid #FFD700'
              }}>
                {profileData.name.charAt(0).toUpperCase()}
              </div>

              {/* Name and Email */}
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                  {profileData.name}
                </h2>
                <p style={{ fontSize: '16px', color: '#666', marginTop: '6px', marginBottom: '8px' }}>
                  {profileData.email}
                </p>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: '#f0f0f0',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#1a1a1a'
                }}>
                  Student ID: {profileData.studentId}
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
                      transition: 'border 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#FF6B00'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                ) : (
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a', margin: 0 }}>
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
                    value={profileData.program}
                    onChange={(e) => setProfileData({ ...profileData, program: e.target.value })}
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
                    {profileData.program}
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
                    value={profileData.year}
                    onChange={(e) => setProfileData({ ...profileData, year: e.target.value })}
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
                    {profileData.year}
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
                      transition: 'border 0.2s',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#FF6B00'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
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
