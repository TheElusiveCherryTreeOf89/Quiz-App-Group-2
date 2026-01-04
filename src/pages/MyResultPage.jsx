import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResultDetailsModal from "../components/Student/ResultDetailsModal";
import { useToastContext } from "../App";

export default function MyResultPage() {
  const navigate = useNavigate();
  const showToast = useToastContext();
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("results");
  const [activeTab, setActiveTab] = useState("available");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (!currentUser || currentUser.role !== "student") {
        navigate("/login");
        return;
      }
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading result page:", error);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const handleAttemptQuiz = (quizId) => {
    if (user) {
      const completedQuizzes = JSON.parse(localStorage.getItem("completedQuizzes") || "{}");
      if (completedQuizzes[user.email]) {
        showToast("You have already taken this quiz. Please wait for the instructor to release your score.", "warning");
        return;
      }
    }
    navigate("/student/quiz");
  };

  const handleViewResult = (quiz) => {
    // Check if results are released
    const resultsReleased = localStorage.getItem("resultsReleased") === "true";
    if (resultsReleased) {
      setSelectedQuiz(quiz);
      setShowResultModal(true);
    } else {
      navigate("/student/result-pending");
    }
  };

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    if (menuId === "dashboard") navigate("/student/dashboard");
    else if (menuId === "profile") navigate("/student/profile");
    else if (menuId === "manage-quizzes") navigate("/student/manage-quizzes");
    else if (menuId === "results") navigate("/student/result");
    else if (menuId === "notifications") navigate("/student/notifications");
  };

  // Sample quiz data
  const availableQuizzes = [
    {
      id: 1,
      title: "Quiz 3: Interface Design & Usability",
      items: 20,
      timeLimit: "1 hour",
      attempts: "1 attempt only",
      dueDate: "Today, 23:59",
      isUrgent: true
    },
    {
      id: 2,
      title: "Quiz 4: React Fundamentals",
      items: 20,
      timeLimit: "1 hour",
      attempts: "1 attempt only",
      dueDate: "Dec 20, 23:59",
      isUrgent: false
    },
    {
      id: 3,
      title: "Quiz 5: React Advanced Concept",
      items: 20,
      timeLimit: "1 hour",
      attempts: "1 attempt only",
      dueDate: "Dec 25, 23:59",
      isUrgent: false
    }
  ];

  const submittedQuizzes = [
    {
      id: 101,
      title: "Quiz 2: Requirements Engineering",
      items: 5,
      timeLimit: "10 mins",
      submittedDate: "Dec 8, 2024",
      score: 4,
      totalQuestions: 5,
      percentage: 80,
      passed: true,
      status: "Released"
    },
    {
      id: 102,
      title: "Quiz 1: Intro To Web App",
      items: 10,
      timeLimit: "1 hour",
      submittedDate: "Dec 1, 2024",
      score: 9,
      totalQuestions: 10,
      percentage: 90,
      passed: true,
      status: "Released"
    }
  ];

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f0f0f0' }}>
      {/* Left Sidebar */}
      <aside style={{
        width: '200px',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 10px rgba(0,0,0,0.08)',
        flexShrink: 0
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
          padding: '12px 25px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <div style={{
            backgroundColor: 'white',
            padding: '8px 18px',
            borderRadius: '25px',
            border: '3px solid black',
            boxShadow: '0 3px 8px rgba(0,0,0,0.2)'
          }}>
            <span style={{ fontWeight: '900', fontSize: '14px', fontFamily: 'Arial Black, sans-serif' }}>QuizApp</span>
          </div>

          {/* Right Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}>🌙</button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}>🔔</button>
            <button style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'black',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px'
            }}>👤</button>
          </div>
        </header>

        {/* Content Area */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Main Content */}
          <main style={{ flex: 1, padding: '25px', overflowY: 'auto', backgroundColor: '#f0f0f0' }}>
            {/* Page Title */}
            <h1 style={{
              fontSize: '36px',
              fontWeight: '900',
              fontStyle: 'italic',
              color: '#1a1a1a',
              marginBottom: '8px',
              fontFamily: 'Arial Black, sans-serif'
            }}>
              My Result
            </h1>
            <p style={{
              fontSize: '15px',
              color: '#666',
              marginBottom: '25px'
            }}>
              View your quizzes, track their status, and access quiz instructions.
            </p>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: '0',
              marginBottom: '20px',
              borderBottom: '2px solid #ddd'
            }}>
              <button
                onClick={() => setActiveTab("available")}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: activeTab === "available" ? '#1a1a1a' : '#999',
                  padding: '12px 20px',
                  borderBottom: activeTab === "available" ? '3px solid #1a1a1a' : '3px solid transparent',
                  cursor: 'pointer',
                  marginBottom: '-2px'
                }}
              >
                Available Quizzes
              </button>
              <button
                onClick={() => setActiveTab("submitted")}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: activeTab === "submitted" ? '#1a1a1a' : '#999',
                  padding: '12px 20px',
                  borderBottom: activeTab === "submitted" ? '3px solid #1a1a1a' : '3px solid transparent',
                  cursor: 'pointer',
                  marginBottom: '-2px'
                }}
              >
                Submitted Quizzes
              </button>
            </div>

            <div style={{ display: 'flex', gap: '25px' }}>
              {/* Quiz List */}
              <div style={{ flex: 1 }}>
                {activeTab === "available" && availableQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '18px',
                      padding: '20px 25px',
                      marginBottom: '15px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '18px'
                    }}
                  >
                    {/* Quiz Icon */}
                    <div style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#FFD700',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '26px',
                      fontWeight: '900',
                      color: '#1a1a1a'
                    }}>
                      ?
                    </div>

                    {/* Quiz Info */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        marginBottom: '4px'
                      }}>
                        {quiz.title}
                      </h3>
                      <p style={{
                        fontSize: '13px',
                        color: '#888',
                        marginBottom: '6px'
                      }}>
                        {quiz.items} Items
                      </p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '12px',
                        color: '#999'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>⏱️</span> Time Limit: {quiz.timeLimit}
                        </span>
                        <span>|</span>
                        <span>{quiz.attempts}</span>
                      </div>
                    </div>

                    {/* Right Side */}
                    <div style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleAttemptQuiz(quiz.id)}
                        style={{
                          padding: '10px 22px',
                          backgroundColor: '#1a1a1a',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          marginBottom: '8px'
                        }}
                      >
                        Attempt Quiz
                      </button>
                      <p style={{
                        fontSize: '12px',
                        color: '#DC2626',
                        fontWeight: '600'
                      }}>
                        Due: {quiz.dueDate}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Submitted Quizzes Tab */}
                {activeTab === "submitted" && submittedQuizzes.map(quiz => (
                  <div
                    key={quiz.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '18px',
                      padding: '24px 28px',
                      marginBottom: '16px',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      border: '1px solid #e5e5e5'
                    }}
                  >
                    {/* Quiz Icon */}
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: '#FFD700',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      fontWeight: '900',
                      color: 'white',
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
                    }}>
                      ?
                    </div>

                    {/* Quiz Info */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        marginBottom: '8px'
                      }}>
                        {quiz.title}
                      </h3>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '14px',
                        color: '#666',
                        marginBottom: '8px'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>⏱️</span> {quiz.timeLimit}
                        </span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>📝</span> {quiz.items} items
                        </span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>🔒</span> 1 attempt only
                        </span>
                      </div>
                      <p style={{
                        fontSize: '13px',
                        color: '#999',
                        margin: 0
                      }}>
                        Submitted: {quiz.submittedDate}
                      </p>
                    </div>

                    {/* Score Display */}
                    <div style={{
                      textAlign: 'center',
                      padding: '16px 20px',
                      backgroundColor: quiz.passed ? '#F0FDF4' : '#FEF2F2',
                      borderRadius: '14px',
                      minWidth: '120px',
                      border: `2px solid ${quiz.passed ? '#22C55E' : '#DC2626'}`
                    }}>
                      <div style={{
                        fontSize: '32px',
                        fontWeight: '900',
                        color: quiz.passed ? '#22C55E' : '#DC2626',
                        lineHeight: '1',
                        marginBottom: '4px'
                      }}>
                        {quiz.percentage}%
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#666',
                        fontWeight: '600'
                      }}>
                        {quiz.score}/{quiz.totalQuestions}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: quiz.passed ? '#22C55E' : '#DC2626',
                        fontWeight: '700',
                        marginTop: '4px'
                      }}>
                        {quiz.passed ? 'PASSED' : 'FAILED'}
                      </div>
                    </div>

                    {/* View Result Button */}
                    <button
                      onClick={() => handleViewResult(quiz)}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#1a1a1a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#1a1a1a'}
                    >
                      View Result
                    </button>
                  </div>
                ))}

                {activeTab === "submitted" && submittedQuizzes.length === 0 && (
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '18px',
                    padding: '40px',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}>
                    <p style={{ fontSize: '15px', color: '#888' }}>
                      No submitted quizzes yet.
                    </p>
                  </div>
                )}
              </div>

              {/* Quiz Rules Panel */}
              <div style={{
                width: '260px',
                backgroundColor: '#f8f8f8',
                borderRadius: '18px',
                padding: '22px',
                height: 'fit-content',
                flexShrink: 0
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '18px'
                }}>
                  <div style={{
                    width: '22px',
                    height: '22px',
                    backgroundColor: '#FEE2E2',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: '#DC2626', fontSize: '12px', fontWeight: '900' }}>!</span>
                  </div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '800',
                    color: '#1a1a1a'
                  }}>
                    Quiz Rules
                  </h3>
                </div>

                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  {[
                    "Each quiz can only be taken once.",
                    "Leaving the quiz tab, minimizing the browser, or switching applications may be counted as a violation.",
                    "Maximum of three (3) violations will auto-submit the quiz.",
                    "If the time runs out, the quiz will be automatically submitted.",
                    "Once submitted, answers are final and cannot be changed.",
                    "Quiz results will be released by the instructor only."
                  ].map((rule, index) => (
                    <li key={index} style={{
                      fontSize: '12px',
                      color: '#555',
                      lineHeight: '1.5',
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <span style={{ color: '#1a1a1a', fontWeight: '700' }}>•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>

                <p style={{
                  fontSize: '11px',
                  color: '#999',
                  marginTop: '18px',
                  fontStyle: 'italic'
                }}>
                  Follow the rules to avoid penalties.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Result Details Modal */}
      {showResultModal && selectedQuiz && (
        <ResultDetailsModal 
          quiz={selectedQuiz}
          onClose={() => {
            setShowResultModal(false);
            setSelectedQuiz(null);
          }}
        />
      )}
    </div>
  );
}
