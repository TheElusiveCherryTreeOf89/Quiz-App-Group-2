import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../../App";
import { fetchWithAuth, getAuthToken, getAuthTokenAsync } from "../../utils/api";
import { setMeta, removeCurrentUser, removeToken, getCurrentUser, getMeta } from "../../utils/db";
import logo from "../../assets/1.svg";
import SubmissionDetailsModal from "./SubmissionDetailsModal";

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const showToast = useToastContext();
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [resultsReleased, setResultsReleased] = useState(false);
  const [activeMenu, setActiveMenu] = useState("results");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

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
    const loadDashboardData = async () => {
      try {
        const currentUser = await getCurrentUser().catch(()=>null);
        console.log('[InstructorDashboard] currentUser from IDB', JSON.stringify(currentUser));
        if (!currentUser || currentUser.role !== "instructor") {
          navigate("/instructor/login");
          return;
        }
        setUser(currentUser);
        // Check token before calling API (fast localStorage path, fallback to IndexedDB)
        const token = getAuthToken() || await getAuthTokenAsync();
        console.log('[InstructorDashboard] token check', token);
        if (!token) {
          console.warn('[InstructorDashboard] No auth token found, redirecting to login');
          navigate('/instructor/login');
          return;
        }

        // Load results from API (using submissions endpoint)
        const resultsResponse = await fetchWithAuth('/api/instructor/submissions.php');

        if (resultsResponse.ok) {
          const resultsData = resultsResponse.data ?? (await resultsResponse.json());
          const rawSubs = resultsData && (resultsData.submissions || resultsData.data || resultsData.submissions || []);
          
          // Transform submission data to match dashboard expectations
          const subs = (rawSubs || []).map(sub => ({
            studentName: sub.studentName || sub.student_name || 'Unknown',
            studentEmail: sub.studentEmail || sub.student_email || '',
            score: sub.score || 0,
            totalQuestions: sub.totalQuestions || sub.total_questions || 0,
            violations: sub.violations || 0,
            submittedAt: sub.submittedAt || sub.submitted_at || new Date().toISOString(),
            resultsReleased: sub.resultsReleased || false,
            quiz_id: sub.quiz_id || sub.quizId || '',
            answers: sub.answers || {},
            questions: (sub.questions || []).map((q, idx) => {
              const questionWithId = {
                ...q,
                id: q.id || `q_${idx + 1}`
              };
              
              // Convert correctAnswer index to actual option text if it's a number
              if (typeof questionWithId.correctAnswer === 'number' && questionWithId.options) {
                questionWithId.correctAnswer = questionWithId.options[questionWithId.correctAnswer];
              }
              
              // Convert correctAnswers indices to text for multiple correct questions
              if (Array.isArray(questionWithId.correctAnswers) && questionWithId.options) {
                questionWithId.correctAnswers = questionWithId.correctAnswers.map(index => 
                  typeof index === 'number' ? questionWithId.options[index] : index
                );
              }
              
              return questionWithId;
            })
          }));
          
          setResults(subs);
          
          // Check global results released status
          const globalReleased = await getMeta('resultsReleased').catch(() => null);
          const hasReleasedResults = globalReleased === 'true' || globalReleased === true || subs.some(sub => sub.resultsReleased);
          setResultsReleased(hasReleasedResults);
        } else {
          setResults([]);
          setResultsReleased(false);
        }

        // Load notifications
        const rawNotifs = await getMeta('instructorNotifications').catch(()=>null);
        setNotifications(rawNotifs ? JSON.parse(rawNotifs) : []);

        // Load dark mode preference
        const rawDark = await getMeta('darkMode').catch(()=>null);
        setDarkMode(rawDark === 'true');

        setTimeout(() => setPageLoaded(true), 50);
      } catch (error) {
        console.error('Load dashboard error:', error);
        navigate("/instructor/login");
      }
    };

    loadDashboardData();
  }, [navigate]);

  const loadResults = async () => {
    try {
      const token = getAuthToken() || await getAuthTokenAsync();
      if (!token) {
        console.warn('[InstructorDashboard] No auth token found for loadResults');
        setResults([]);
        setResultsReleased(false);
        return;
      }

      const response = await fetchWithAuth('/api/instructor/submissions.php');

      if (response.ok) {
        const resultsData = response.data ?? (await response.json());
        const rawSubs = resultsData && (resultsData.submissions || resultsData.data || []);
        
        // Transform submission data to match dashboard expectations
        const subs = (rawSubs || []).map(sub => {
          // Recalculate score based on answers and corrected questions
          let recalculatedScore = 0;
          const correctedQuestions = (sub.questions || []).map((q, idx) => {
            const questionWithId = {
              ...q,
              id: q.id || `q_${idx + 1}`
            };
            
            // Convert correctAnswer index to actual option text if it's a number
            if (typeof questionWithId.correctAnswer === 'number' && questionWithId.options) {
              questionWithId.correctAnswer = questionWithId.options[questionWithId.correctAnswer];
            }
            
            // Convert correctAnswers indices to text for multiple correct questions
            if (Array.isArray(questionWithId.correctAnswers) && questionWithId.options) {
              questionWithId.correctAnswers = questionWithId.correctAnswers.map(index => 
                typeof index === 'number' ? questionWithId.options[index] : index
              );
            }
            
            // Recalculate score for this question
            const studentAnswer = sub.answers?.[questionWithId.id];
            if (studentAnswer) {
              const correctAnswer = questionWithId.correct || questionWithId.correctAnswer;
              if (questionWithId.type === "multiple-correct") {
                const correct = questionWithId.correctAnswers || [];
                const student = Array.isArray(studentAnswer) ? studentAnswer : [studentAnswer];
                if (JSON.stringify([...correct].sort()) === JSON.stringify([...student].sort())) {
                  recalculatedScore += 1;
                }
              } else if (studentAnswer === correctAnswer) {
                recalculatedScore += 1;
              }
            }
            
            return questionWithId;
          });
          
          return {
            studentName: sub.studentName || sub.student_name || 'Unknown',
            studentEmail: sub.studentEmail || sub.student_email || '',
            score: recalculatedScore, // Use recalculated score
            totalQuestions: sub.totalQuestions || sub.total_questions || correctedQuestions.length,
            violations: sub.violations || 0,
            submittedAt: sub.submittedAt || sub.submitted_at || new Date().toISOString(),
            resultsReleased: sub.resultsReleased || false,
            quiz_id: sub.quiz_id || sub.quizId || '',
            answers: sub.answers || {},
            questions: correctedQuestions
          };
        });
        
        setResults(subs);
        
        // Check global results released status
        const globalReleased = await getMeta('resultsReleased').catch(() => null);
        const hasReleasedResults = globalReleased === 'true' || globalReleased === true || subs.some(sub => sub.resultsReleased);
        setResultsReleased(hasReleasedResults);
      } else {
        setResults([]);
        setResultsReleased(false);
      }
    } catch (error) {
      console.error('Load results error:', error);
      setResults([]);
      setResultsReleased(false);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    setMeta('darkMode', newMode.toString()).catch(() => {});
    showToast(`Dark mode ${newMode ? 'enabled' : 'disabled'}`, "info");
  };

  const markNotificationAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    setMeta('instructorNotifications', JSON.stringify(updated)).catch(() => {});
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setMeta('instructorNotifications', JSON.stringify([])).catch(() => {});
    showToast("All notifications cleared", "success");
    setShowNotifications(false);
  };

  const handleReleaseResults = async () => {
    if (window.confirm("Are you sure you want to release the results to all students?")) {
      try {
        // Attempt to call backend release endpoint; fallback to local marking
        const payload = { instructor_id: user?.id ?? null, quiz_id: 'all' };
        console.debug('[InstructorDashboard] release-results payload:', payload);
        const response = await fetchWithAuth('/api/instructor/release-results.php', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          setResultsReleased(true);
          setResults(prev => (prev || []).map(r => ({ ...r, resultsReleased: true })));
          showToast("Results have been released! Students can now view their scores.", "success");
        } else {
          const err = response.data ?? (await response.json().catch(() => null));
          throw new Error(err?.message || 'Failed to release results');
        }

      } catch (error) {
        console.error('Release results error:', error);
        showToast("Failed to release results. Please try again.", "error");
      }
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedResults = () => {
    if (!sortConfig.key) return results;

    const sorted = [...results].sort((a, b) => {
      let aVal, bVal;

      switch (sortConfig.key) {
        case 'name':
          aVal = a.studentName?.toLowerCase() || '';
          bVal = b.studentName?.toLowerCase() || '';
          break;
        case 'email':
          aVal = a.studentEmail?.toLowerCase() || '';
          bVal = b.studentEmail?.toLowerCase() || '';
          break;
        case 'score':
          aVal = a.score || 0;
          bVal = b.score || 0;
          break;
        case 'percentage':
          aVal = (a.score / a.totalQuestions) * 100 || 0;
          bVal = (b.score / b.totalQuestions) * 100 || 0;
          break;
        case 'status':
          aVal = getPassStatus(a.score, a.totalQuestions) ? 1 : 0;
          bVal = getPassStatus(b.score, b.totalQuestions) ? 1 : 0;
          break;
        case 'violations':
          aVal = a.violations || 0;
          bVal = b.violations || 0;
          break;
        case 'date':
          aVal = new Date(a.submittedAt || 0).getTime();
          bVal = new Date(b.submittedAt || 0).getTime();
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return ' ⇅';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const handleLogout = () => {
    // Remove session from IndexedDB
    try { removeCurrentUser(); } catch (e) {}
    try { removeToken(); } catch (e) {}
    navigate("/instructor/login");
  };

  const getPassStatus = (score, total) => {
    const percentage = (score / total) * 100;
    return percentage >= 70;
  };

  const calculateStats = () => {
    if (results.length === 0) {
      return { avgScore: 0, passRate: 0, avgViolations: 0 };
    }
    
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const passed = results.filter(r => getPassStatus(r.score, r.totalQuestions)).length;
    const totalViolations = results.reduce((sum, r) => sum + (r.violations || 0), 0);
    
    return {
      avgScore: (totalScore / results.length).toFixed(1),
      passRate: ((passed / results.length) * 100).toFixed(0),
      avgViolations: (totalViolations / results.length).toFixed(1)
    };
  };

  const stats = calculateStats();

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
            zIndex: 998
          }}
        />
      )}

      {/* Left Sidebar - Instructor Version */}
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
        {/* Menu Header */}
        <div style={{ padding: '20px', borderBottom: `1px solid ${theme.border}`, transition: 'border-color 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '20px', fontWeight: '900', color: theme.text, transition: 'color 0.3s ease', fontFamily: 'var(--font-heading)' }}>Menu</span>
            <span style={{ fontSize: '18px', cursor: 'pointer', color: theme.text, transition: 'color 0.3s ease' }}>≡</span>
          </div>
        </div>

        {/* Menu Items - Instructor Specific */}
        <nav style={{ flex: 1, padding: '15px 12px' }}>
          {/* Results */}
          <button
            onClick={() => {
              setActiveMenu("results");
              setSidebarOpen(false);
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
              backgroundColor: activeMenu === "results" ? '#6366F1' : 'transparent',
              color: activeMenu === "results" ? 'white' : theme.text,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-body)'
            }}
          >
            <span style={{ fontSize: '16px' }}>📊</span>
            <span>Results</span>
          </button>

          {/* Quizzes */}
          <button
            onClick={() => {
              setActiveMenu("quizzes");
              setSidebarOpen(false);
              navigate("/instructor/quizzes");
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
              backgroundColor: activeMenu === "quizzes" ? '#6366F1' : 'transparent',
              color: activeMenu === "quizzes" ? 'white' : theme.text,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-body)'
            }}
          >
            <span style={{ fontSize: '16px' }}>📝</span>
            <span>Quizzes</span>
          </button>

          {/* Students */}
          <button
            onClick={() => {
              setActiveMenu("students");
              setSidebarOpen(false);
              navigate("/instructor/students");
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
              backgroundColor: activeMenu === "students" ? '#6366F1' : 'transparent',
              color: activeMenu === "students" ? 'white' : theme.text,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-body)'
            }}
          >
            <span style={{ fontSize: '16px' }}>👥</span>
            <span>Students</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => {
              setActiveMenu("profile");
              setSidebarOpen(false);
              navigate("/instructor/profile");
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
              backgroundColor: activeMenu === "profile" ? '#6366F1' : 'transparent',
              color: activeMenu === "profile" ? 'white' : theme.text,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-body)'
            }}
          >
            <span style={{ fontSize: '16px' }}>👤</span>
            <span>Profile</span>
          </button>

          {/* Analytics */}
          <button
            onClick={() => {
              setActiveMenu("analytics");
              setSidebarOpen(false);
              navigate("/instructor/analytics");
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
              backgroundColor: activeMenu === "analytics" ? '#6366F1' : 'transparent',
              color: activeMenu === "analytics" ? 'white' : theme.text,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-body)'
            }}
          >
            <span style={{ fontSize: '16px' }}>📈</span>
            <span>Analytics</span>
          </button>
        </nav>

        {/* Logout Button */}
        <div style={{ padding: '15px 12px', borderTop: `1px solid ${theme.border}`, transition: 'border-color 0.3s ease' }}>
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

      {/* Main Content Area */}
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
            {/* Hamburger Menu (Mobile Only) */}
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

            {/* Logo */}
            <img 
              src={logo} 
              alt="QuizApp Logo" 
              onClick={() => navigate("/")}
              style={{ 
                width: '120px', 
                height: 'auto',
                cursor: 'pointer',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }} 
            />
          </div>

          {/* Profile Icon */}
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
                    <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: theme.text, transition: 'color 0.3s ease', fontFamily: 'var(--font-heading)' }}>Notifications</h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        style={{
                          fontSize: '12px',
                          color: '#DC2626',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontFamily: 'var(--font-body)'
                        }}
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>
                      <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔕</div>
                      <p style={{ margin: 0, fontSize: '14px', fontFamily: 'var(--font-body)' }}>No notifications</p>
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
                              <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: theme.text, transition: 'color 0.3s ease', fontFamily: 'var(--font-body)' }}>
                                {notification.title}
                              </p>
                              <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: theme.textSecondary, transition: 'color 0.3s ease', fontFamily: 'var(--font-body)' }}>
                                {notification.message}
                              </p>
                              <p style={{ margin: 0, fontSize: '11px', color: darkMode ? '#888' : '#999', transition: 'color 0.3s ease', fontFamily: 'var(--font-body)' }}>
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
                    <div style={{ fontSize: '16px', fontWeight: '700', color: theme.text, marginBottom: '4px', transition: 'color 0.3s ease', fontFamily: 'var(--font-heading)' }}>
                      {user?.name || 'Instructor'}
                    </div>
                    <div style={{ fontSize: '13px', color: theme.textSecondary, transition: 'color 0.3s ease', fontFamily: 'var(--font-body)' }}>
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
                      transition: 'background-color 0.2s',
                      fontFamily: 'var(--font-body)'
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
                      transition: 'background-color 0.2s',
                      fontFamily: 'var(--font-body)'
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
                        transition: 'background-color 0.2s',
                        fontFamily: 'var(--font-body)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
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

        {/* Main Content */}
        <main style={{ flex: 1, padding: isMobile ? '20px 16px' : '32px', overflowY: 'auto' }}>
          {/* Title with Create Button */}
          <div style={{ marginBottom: '28px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '16px' : '0' }}>
            <div>
              <h1 style={{
                fontSize: isMobile ? '28px' : '42px',
                fontWeight: '900',
                fontStyle: 'italic',
                color: theme.text,
                margin: '0 0 8px 0',
                transition: 'color 0.3s ease',
                fontFamily: 'var(--font-heading)'
              }}>
                Instructor Dashboard
              </h1>
              <p style={{ fontSize: '16px', color: theme.textSecondary, margin: 0, transition: 'color 0.3s ease', fontFamily: 'var(--font-body)' }}>
                Manage quiz results and student performance
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

          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            {/* Total Submissions */}
            <div style={{
              backgroundColor: theme.card,
              padding: '24px',
              borderRadius: '18px',
              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
              border: `1px solid ${theme.border}`,
              transition: 'background-color 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', color: theme.textSecondary, margin: '0 0 8px 0', fontWeight: '600', transition: 'color 0.3s ease', fontFamily: 'var(--font-body)' }}>
                    Total Submissions
                  </p>
                  <p style={{ fontSize: '36px', fontWeight: '900', color: theme.text, margin: 0, transition: 'color 0.3s ease', fontFamily: 'var(--font-heading)' }}>
                    {results.length}
                  </p>
                </div>
                <div style={{ fontSize: '48px' }}>📝</div>
              </div>
            </div>

            {/* Average Score */}
            <div style={{
              backgroundColor: theme.card,
              padding: '24px',
              borderRadius: '18px',
              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
              border: `1px solid ${theme.border}`,
              transition: 'background-color 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', color: theme.textSecondary, margin: '0 0 8px 0', fontWeight: '600', transition: 'color 0.3s ease', fontFamily: 'var(--font-body)' }}>
                    Average Score
                  </p>
                  <p style={{ fontSize: '36px', fontWeight: '900', color: theme.text, margin: 0, transition: 'color 0.3s ease', fontFamily: 'var(--font-heading)' }}>
                    {stats.avgScore}
                  </p>
                </div>
                <div style={{ fontSize: '48px' }}>🎯</div>
              </div>
            </div>

            {/* Pass Rate */}
            <div style={{
              backgroundColor: theme.card,
              padding: '24px',
              borderRadius: '18px',
              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
              border: `1px solid ${theme.border}`,
              transition: 'background-color 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', color: theme.textSecondary, margin: '0 0 8px 0', fontWeight: '600', transition: 'color 0.3s ease', fontFamily: 'var(--font-body)' }}>
                    Pass Rate
                  </p>
                  <p style={{ fontSize: '36px', fontWeight: '900', color: theme.text, margin: 0, transition: 'color 0.3s ease', fontFamily: 'var(--font-heading)' }}>
                    {stats.passRate}%
                  </p>
                </div>
                <div style={{ fontSize: '48px' }}>✅</div>
              </div>
            </div>

            {/* Results Status */}
            <div style={{
              backgroundColor: theme.card,
              padding: '24px',
              borderRadius: '18px',
              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
              border: `1px solid ${theme.border}`,
              transition: 'background-color 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', color: theme.textSecondary, margin: '0 0 8px 0', fontWeight: '600', transition: 'color 0.3s ease', fontFamily: 'var(--font-body)' }}>
                    Results Status
                  </p>
                  <p style={{
                    fontSize: '24px',
                    fontWeight: '900',
                    color: resultsReleased ? '#22C55E' : '#F59E0B',
                    margin: 0,
                    fontFamily: 'var(--font-heading)'
                  }}>
                    {resultsReleased ? 'Released' : 'Pending'}
                  </p>
                </div>
                <div style={{ fontSize: '48px' }}>{resultsReleased ? '🔓' : '🔒'}</div>
              </div>
            </div>
          </div>

          {/* Results Table Card */}
          <div style={{
            backgroundColor: theme.card,
            padding: '28px',
            borderRadius: '18px',
            boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
            border: `1px solid ${theme.border}`,
            marginBottom: '24px',
            transition: 'background-color 0.3s ease'
          }}>
            {/* Table Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <h2 style={{ fontSize: '28px', fontWeight: '900', color: theme.text, margin: 0, transition: 'color 0.3s ease', fontFamily: 'var(--font-heading)' }}>
                Student Results
              </h2>
              {!resultsReleased && results.length > 0 && (
                <button
                  onClick={handleReleaseResults}
                  style={{
                    backgroundColor: '#6366F1',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    fontFamily: 'var(--font-body)'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#4F46E5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#6366F1'}
                >
                  <span>🔓</span>
                  <span>Release Results</span>
                </button>
              )}
            </div>

            {/* Table Content */}
            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '72px', marginBottom: '16px' }}>📊</div>
                <p style={{ fontSize: '24px', fontWeight: '700', color: theme.textSecondary, margin: '0 0 8px 0', transition: 'color 0.3s ease', fontFamily: 'var(--font-heading)' }}>
                  No submissions yet
                </p>
                <p style={{ fontSize: '16px', color: theme.textSecondary, margin: 0, opacity: 0.7, transition: 'color 0.3s ease', fontFamily: 'var(--font-body)' }}>
                  Student quiz results will appear here once they submit
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                  <thead>
                    <tr style={{ backgroundColor: darkMode ? '#2d2d2d' : '#F9FAFB', borderBottom: `2px solid ${theme.border}`, transition: 'background-color 0.3s ease' }}>
                      <th 
                        onClick={() => handleSort('name')}
                        style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: theme.text,
                          cursor: 'pointer',
                          userSelect: 'none',
                          transition: 'color 0.3s ease'
                        }}
                      >Student Name{getSortIndicator('name')}</th>
                      <th 
                        onClick={() => handleSort('email')}
                        style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: theme.text,
                          cursor: 'pointer',
                          userSelect: 'none',
                          transition: 'color 0.3s ease'
                        }}
                      >Email{getSortIndicator('email')}</th>
                      <th 
                        onClick={() => handleSort('score')}
                        style={{
                          padding: '16px',
                          textAlign: 'center',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: theme.text,
                          cursor: 'pointer',
                          userSelect: 'none',
                          transition: 'color 0.3s ease'
                        }}
                      >Score{getSortIndicator('score')}</th>
                      <th 
                        onClick={() => handleSort('percentage')}
                        style={{
                          padding: '16px',
                          textAlign: 'center',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: theme.text,
                          cursor: 'pointer',
                          userSelect: 'none',
                          transition: 'color 0.3s ease'
                        }}
                      >Percentage{getSortIndicator('percentage')}</th>
                      <th 
                        onClick={() => handleSort('status')}
                        style={{
                          padding: '16px',
                          textAlign: 'center',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: theme.text,
                          cursor: 'pointer',
                          userSelect: 'none',
                          transition: 'color 0.3s ease'
                        }}
                      >Status{getSortIndicator('status')}</th>
                      <th 
                        onClick={() => handleSort('violations')}
                        style={{
                          padding: '16px',
                          textAlign: 'center',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: theme.text,
                          cursor: 'pointer',
                          userSelect: 'none',
                          transition: 'color 0.3s ease'
                        }}
                      >Violations{getSortIndicator('violations')}</th>
                      <th 
                        onClick={() => handleSort('date')}
                        style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: theme.text,
                          cursor: 'pointer',
                          userSelect: 'none',
                          transition: 'color 0.3s ease'
                        }}
                      >Submitted At{getSortIndicator('date')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSortedResults().map((result, idx) => {
                      const percentage = (result.score / result.totalQuestions) * 100;
                      const passed = getPassStatus(result.score, result.totalQuestions);
                      
                      return (
                        <tr 
                          key={idx} 
                          onClick={() => {
                            setSelectedSubmission(result);
                            setShowSubmissionModal(true);
                          }}
                          style={{ 
                            borderBottom: `1px solid ${theme.border}`,
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#3d3d3d' : '#f9fafb'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td style={{ padding: '16px', fontSize: '15px', fontWeight: '600', color: theme.text, transition: 'color 0.3s ease' }}>
                            {result.studentName}
                          </td>
                          <td style={{ padding: '16px', fontSize: '14px', color: theme.textSecondary, transition: 'color 0.3s ease' }}>
                            {result.studentEmail}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <span style={{ fontSize: '18px', fontWeight: '700', color: theme.text, transition: 'color 0.3s ease' }}>
                              {result.score} / {result.totalQuestions}
                            </span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <span style={{
                              fontSize: '20px',
                              fontWeight: '900',
                              color: passed ? '#22C55E' : '#DC2626'
                            }}>
                              {percentage.toFixed(0)}%
                            </span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <span style={{
                              backgroundColor: passed ? '#22C55E' : '#DC2626',
                              color: 'white',
                              padding: '6px 16px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '700',
                              display: 'inline-block'
                            }}>
                              {passed ? 'Passed' : 'Failed'}
                            </span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <span style={{
                              fontSize: '18px',
                              fontWeight: '700',
                              color: (result.violations || 0) >= 2 ? '#DC2626' : '#666'
                            }}>
                              {result.violations || 0}
                            </span>
                          </td>
                          <td style={{ padding: '16px', fontSize: '14px', color: '#666' }}>
                            {new Date(result.submittedAt).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Release Status Banner */}
          {resultsReleased && results.length > 0 && (
            <div style={{
              backgroundColor: theme.card,
              border: '2px solid #22C55E',
              padding: '24px',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              transition: 'background-color 0.3s ease'
            }}>
              <span style={{ fontSize: '48px' }}>✅</span>
              <div>
                <p style={{ fontSize: '20px', fontWeight: '900', color: theme.text, margin: '0 0 4px 0', transition: 'color 0.3s ease' }}>
                  Results Have Been Released
                </p>
                <p style={{ fontSize: '15px', color: theme.textSecondary, margin: 0, transition: 'color 0.3s ease' }}>
                  Students can now view their quiz scores and detailed results.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Submission Details Modal */}
      {showSubmissionModal && selectedSubmission && (
        <SubmissionDetailsModal
          submission={selectedSubmission}
          onClose={() => {
            setShowSubmissionModal(false);
            setSelectedSubmission(null);
          }}
          darkMode={darkMode}
        />
      )}
      
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
