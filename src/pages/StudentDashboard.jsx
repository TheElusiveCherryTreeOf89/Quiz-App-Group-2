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
    } catch (error) {
      console.error("Error loading dashboard:", error);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
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

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
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
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 998,
            transition: 'opacity 0.3s'
          }}
        />
      )}

      {/* Left Sidebar */}
      <aside style={{
        width: isMobile ? '280px' : '200px',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 10px rgba(0,0,0,0.08)',
        flexShrink: 0,
        position: isMobile ? 'fixed' : 'relative',
        left: isMobile ? (sidebarOpen ? 0 : '-280px') : 0,
        top: 0,
        bottom: 0,
        zIndex: 999,
        transition: 'left 0.3s ease-in-out'
      }}>
        {/* Menu Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '20px', fontWeight: '900' }}>Menu</span>
            <span style={{ fontSize: '18px', cursor: 'pointer' }}>≡</span>
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
              color: activeMenu === "quizzes" ? 'white' : 'black',
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
              backgroundColor: 'transparent',
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
          <div style={{
            backgroundColor: 'white',
            padding: isMobile ? '6px 14px' : '8px 18px',
            borderRadius: '25px',
            border: '3px solid black',
            boxShadow: '0 3px 8px rgba(0,0,0,0.2)'
          }}>
            <span style={{ fontWeight: '900', fontSize: isMobile ? '12px' : '14px', fontFamily: 'Arial Black, sans-serif' }}>QuizApp</span>
          </div>

          {/* Right Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '18px' }}>
            <button 
              onClick={() => navigate("/student/profile")}
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
          </div>
        </header>

        {/* Content Area with Notification Panel */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', flexDirection: isMobile ? 'column' : 'row' }}>
          {/* Main Content */}
          <main style={{ 
            flex: 1, 
            padding: isMobile ? '16px' : '25px', 
            overflowY: 'auto', 
            backgroundColor: '#f0f0f0',
            marginLeft: isMobile ? 0 : 0
          }}>
            {/* Welcome Card - Black */}
            <div style={{
              backgroundColor: '#1a1a1a',
              borderRadius: isMobile ? '18px' : '25px',
              padding: isMobile ? '24px 20px' : '35px 40px',
              marginBottom: '25px'
            }}>
              <h1 style={{
                fontSize: isMobile ? '28px' : '42px',
                fontWeight: '900',
                color: 'white',
                marginBottom: '8px',
                fontFamily: 'Arial Black, sans-serif'
              }}>Welcome, User !</h1>
              <p style={{ color: '#aaa', fontSize: isMobile ? '14px' : '16px' }}>Ready to challenge yourself? Let's get started!</p>
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
                backgroundColor: 'white',
                borderRadius: '18px',
                padding: '22px',
                border: '4px solid #3B82F6',
                flex: 1
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
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Available Quizzes</span>
                </div>
                <div style={{ fontSize: '52px', fontWeight: '900', color: '#3B82F6' }}>3</div>
              </div>

              {/* Quizzes Taken - Green */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '18px',
                padding: '22px',
                border: '4px solid #22C55E',
                flex: 1
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
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Quizzes Taken</span>
                </div>
                <div style={{ fontSize: '52px', fontWeight: '900', color: '#22C55E' }}>5</div>
              </div>

              {/* Pending Results - Yellow/Orange */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '18px',
                padding: '22px',
                border: '4px solid #F59E0B',
                flex: 1
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
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Pending Results</span>
                </div>
                <div style={{ fontSize: '52px', fontWeight: '900', color: '#F59E0B' }}>1</div>
              </div>
            </div>

            {/* Available Quizzes List */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '25px',
              padding: '30px',
              boxShadow: '0 2px 15px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{ fontSize: '26px', fontWeight: '900', marginBottom: '25px' }}>Available Quizzes</h2>

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
                    border: '2px solid #e5e5e5',
                    fontSize: '14px',
                    fontWeight: '600',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FF6B00'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                />

                {/* Filter Dropdown */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '12px',
                    border: '2px solid #e5e5e5',
                    fontSize: '14px',
                    fontWeight: '600',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    outline: 'none',
                    minWidth: isMobile ? '100%' : '180px'
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
                        borderBottom: index < filteredQuizzes.length - 1 ? '1px solid #eee' : 'none',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? '12px' : '18px'
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
                          <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '5px' }}>{quiz.title}</h3>
                          <p style={{ fontSize: '13px', color: '#EF4444', fontWeight: '600', marginBottom: '2px' }}>Due: {quiz.due}</p>
                          <p style={{ fontSize: '12px', color: '#888' }}>Time Limit: {quiz.timeLimit}</p>
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
                          width: isMobile ? '100%' : 'auto'
                        }}
                      >{quiz.status === 'completed' ? 'Completed' : 'Attempt Quiz'}</button>
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <p style={{ fontSize: '16px', color: '#888', fontWeight: '600' }}>
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
                  textDecoration: 'underline'
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
              <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '20px' }}>Notification</h3>

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
                    <p style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px', lineHeight: '1.5', color: '#333' }}>{notif.text}</p>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: '#888' }}>{notif.time}</span>
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
