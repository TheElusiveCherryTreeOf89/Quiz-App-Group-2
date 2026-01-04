import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../App";

export default function ManageQuizzesPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("available");
  const [activeMenu, setActiveMenu] = useState("manage-quizzes");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "student") {
      navigate("/login");
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const availableQuizzes = [
    {
      id: 3,
      title: "Quiz 3: Interface Design & Usability",
      description: "Description description description description description description",
      items: 20,
      timeLimit: "1 hour",
      dueDate: "Today, 11:59 PM",
      attemptsAllowed: 1,
      status: "available"
    },
    {
      id: 4,
      title: "Quiz 4: React Fundamentals",
      description: "Test your knowledge of React core concepts and hooks",
      items: 20,
      timeLimit: "1 hour",
      dueDate: "Dec 20, 23:59",
      attemptsAllowed: 1,
      status: "available"
    },
    {
      id: 5,
      title: "Quiz 5: React Advanced Concept",
      description: "Advanced React patterns and performance optimization",
      items: 20,
      timeLimit: "1 hour",
      dueDate: "Dec 25, 23:59",
      attemptsAllowed: 1,
      status: "available"
    }
  ];

  const submittedQuizzes = [
    {
      id: 2,
      title: "Quiz 2: Requirements Engineering",
      items: 5,
      timeLimit: "10 mins",
      dueDate: "Dec 8, 23:59",
      attemptsAllowed: 0,
      status: "submitted"
    },
    {
      id: 1,
      title: "Quiz 1: Intro To Web App",
      items: 10,
      timeLimit: "1 hour",
      dueDate: "Dec 1, 23:59",
      attemptsAllowed: 0,
      status: "submitted"
    }
  ];

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

  const handleViewResult = (quizId) => {
    const resultsReleased = localStorage.getItem("resultsReleased") === "true";
    if (resultsReleased) {
      navigate("/student/result");
    } else {
      navigate("/student/result-pending");
    }
  };

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
            onClick={() => {
              setActiveMenu("dashboard");
              navigate("/student/dashboard");
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
            onClick={() => setActiveMenu("profile")}
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
            onClick={() => setActiveMenu("manage-quizzes")}
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
            onClick={() => {
              setActiveMenu("result");
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
              backgroundColor: activeMenu === "result" ? '#FF6B00' : 'transparent',
              color: activeMenu === "result" ? 'white' : 'black',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left'
            }}
          >
            <span style={{ fontSize: '16px' }}>📊</span>
            <span>My Result</span>
          </button>

          {/* Notification */}
          <button
            onClick={() => setActiveMenu("notification")}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '6px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMenu === "notification" ? '#FF6B00' : 'transparent',
              color: activeMenu === "notification" ? 'white' : 'black',
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
              backgroundColor: 'transparent',
              color: 'black',
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

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <header style={{
          backgroundColor: '#FFD700',
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {/* Logo */}
          <div style={{
            backgroundColor: 'white',
            padding: '8px 20px',
            borderRadius: '25px',
            border: '3px solid black',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '24px', fontWeight: '900', color: 'black' }}>QuizApp</span>
          </div>

          {/* Right Side Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px'
            }}>🌙</button>
            <button style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px'
            }}>🔔</button>
            <button style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px'
            }}>👤</button>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Title */}
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{
                fontSize: '42px',
                fontWeight: '900',
                fontStyle: 'italic',
                color: 'black',
                margin: '0 0 8px 0'
              }}>
                Manage Quizzes
              </h1>
              <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
                View your quizzes, track their status, and access quiz instructions.
              </p>
            </div>

            {/* Content Grid */}
            <div style={{ display: 'flex', gap: '24px' }}>
              {/* Left - Quizzes Section */}
              <div style={{ flex: 1 }}>
                {/* Tabs */}
                <div style={{
                  display: 'flex',
                  gap: '32px',
                  marginBottom: '24px',
                  borderBottom: '2px solid #e5e5e5'
                }}>
                  <button
                    onClick={() => setActiveTab("available")}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '18px',
                      fontWeight: '700',
                      color: activeTab === "available" ? 'black' : '#999',
                      cursor: 'pointer',
                      padding: '12px 0',
                      borderBottom: activeTab === "available" ? '3px solid #FFD700' : '3px solid transparent',
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
                      fontSize: '18px',
                      fontWeight: '700',
                      color: activeTab === "submitted" ? 'black' : '#999',
                      cursor: 'pointer',
                      padding: '12px 0',
                      borderBottom: activeTab === "submitted" ? '3px solid #FFD700' : '3px solid transparent',
                      marginBottom: '-2px'
                    }}
                  >
                    Submitted Quizzes
                  </button>
                </div>

                {/* Quiz Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {activeTab === "available" ? (
                    <>
                      {availableQuizzes.map(quiz => (
                        <div key={quiz.id} style={{
                          backgroundColor: 'white',
                          borderRadius: '18px',
                          padding: '28px',
                          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                          border: '1px solid #e5e5e5'
                        }}>
                          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                            {/* Yellow Question Mark Icon */}
                            <div style={{
                              width: '60px',
                              height: '60px',
                              borderRadius: '50%',
                              backgroundColor: '#FFD700',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              fontSize: '32px',
                              fontWeight: '900',
                              color: 'white',
                              boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
                            }}>
                              ?
                            </div>

                            {/* Quiz Info */}
                            <div style={{ flex: 1 }}>
                              <h3 style={{
                                fontSize: '22px',
                                fontWeight: '700',
                                color: 'black',
                                margin: '0 0 8px 0'
                              }}>
                                {quiz.title}
                              </h3>
                              <p style={{
                                fontSize: '14px',
                                color: '#666',
                                margin: '0 0 16px 0',
                                lineHeight: '1.4'
                              }}>
                                {quiz.description}
                              </p>

                              {/* Yellow Info Bar */}
                              <div style={{
                                backgroundColor: '#FFF9E6',
                                borderLeft: '4px solid #FFD700',
                                padding: '16px 20px',
                                marginBottom: '16px'
                              }}>
                                <div style={{ marginBottom: '8px' }}>
                                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'black' }}>
                                    Items: {quiz.items}
                                  </span>
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'black' }}>
                                    Time Limit: {quiz.timeLimit}
                                  </span>
                                </div>
                                <div>
                                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'black' }}>
                                    Due: <span style={{ color: '#DC2626' }}>{quiz.dueDate}</span>
                                  </span>
                                </div>
                              </div>

                              {/* Attempts and Button */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', color: '#666' }}>
                                  Attempts Allowed: {quiz.attemptsAllowed}
                                </span>
                                <button
                                  onClick={() => handleAttemptQuiz(quiz.id)}
                                  style={{
                                    backgroundColor: '#1a1a1a',
                                    color: 'white',
                                    padding: '10px 24px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = '#1a1a1a'}
                                >
                                  Attempt Quiz
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {submittedQuizzes.map(quiz => (
                        <div key={quiz.id} style={{
                          backgroundColor: 'white',
                          borderRadius: '18px',
                          padding: '28px',
                          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                          border: '1px solid #e5e5e5'
                        }}>
                          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                            {/* Yellow Question Mark Icon */}
                            <div style={{
                              width: '60px',
                              height: '60px',
                              borderRadius: '50%',
                              backgroundColor: '#FFD700',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              fontSize: '32px',
                              fontWeight: '900',
                              color: 'white',
                              boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
                            }}>
                              ?
                            </div>

                            {/* Quiz Info */}
                            <div style={{ flex: 1 }}>
                              <h3 style={{
                                fontSize: '22px',
                                fontWeight: '700',
                                color: 'black',
                                margin: '0 0 16px 0'
                              }}>
                                {quiz.title}
                              </h3>

                              {/* Info Row */}
                              <div style={{
                                display: 'flex',
                                gap: '24px',
                                marginBottom: '16px',
                                flexWrap: 'wrap'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '16px' }}>⏱️</span>
                                  <span style={{ fontSize: '14px', color: '#666' }}>
                                    Time Limit: {quiz.timeLimit}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '16px' }}>📝</span>
                                  <span style={{ fontSize: '14px', color: '#666' }}>
                                    {quiz.items} items
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '16px' }}>🔒</span>
                                  <span style={{ fontSize: '14px', color: '#666' }}>
                                    1 attempt only
                                  </span>
                                </div>
                              </div>

                              {/* Due Date and Button */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', color: '#DC2626', fontWeight: '600' }}>
                                  Due: {quiz.dueDate}
                                </span>
                                <button
                                  onClick={() => handleViewResult(quiz.id)}
                                  style={{
                                    backgroundColor: '#1a1a1a',
                                    color: 'white',
                                    padding: '10px 24px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = '#1a1a1a'}
                                >
                                  View Result
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Right - Quiz Rules Panel */}
              <div style={{ width: '320px', flexShrink: 0 }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '18px',
                  padding: '24px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  border: '1px solid #e5e5e5',
                  position: 'sticky',
                  top: '20px'
                }}>
                  {/* Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#FF6B00',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      ℹ️
                    </div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '900',
                      color: 'black',
                      margin: 0
                    }}>
                      Quiz Rules
                    </h3>
                  </div>

                  {/* Rules List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ fontSize: '16px', flexShrink: 0 }}>●</span>
                      <p style={{
                        fontSize: '14px',
                        color: '#333',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        Each quiz can only be taken once.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ fontSize: '16px', flexShrink: 0 }}>●</span>
                      <p style={{
                        fontSize: '14px',
                        color: '#333',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        Leaving the quiz tab, minimizing the browser, or switching applications may be counted as a violation.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ fontSize: '16px', flexShrink: 0 }}>●</span>
                      <p style={{
                        fontSize: '14px',
                        color: '#333',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        Maximum of three (3) violations will auto-submit the quiz.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ fontSize: '16px', flexShrink: 0 }}>●</span>
                      <p style={{
                        fontSize: '14px',
                        color: '#333',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        If the time runs out, the quiz will be automatically submitted.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ fontSize: '16px', flexShrink: 0 }}>●</span>
                      <p style={{
                        fontSize: '14px',
                        color: '#333',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        Once submitted, answers are final and cannot be changed.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ fontSize: '16px', flexShrink: 0 }}>●</span>
                      <p style={{
                        fontSize: '14px',
                        color: '#333',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        Quiz results will be released by the instructor only.
                      </p>
                    </div>
                  </div>

                  {/* Footer Note */}
                  <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    backgroundColor: '#FFF9E6',
                    borderRadius: '12px',
                    border: '1px solid #FFD700'
                  }}>
                    <p style={{
                      fontSize: '12px',
                      color: '#666',
                      margin: 0,
                      fontStyle: 'italic',
                      textAlign: 'center'
                    }}>
                      Follow the rules to avoid penalties.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
