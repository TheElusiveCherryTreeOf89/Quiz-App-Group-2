import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function SubmissionDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("results");
  const [submission, setSubmission] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Theme object
  const theme = {
    background: darkMode ? '#1a1a1a' : '#f0f0f0',
    card: darkMode ? '#2d2d2d' : 'white',
    text: darkMode ? '#ffffff' : '#1a1a1a',
    textSecondary: darkMode ? '#a0a0a0' : '#666',
    border: darkMode ? '#404040' : '#eee',
    sidebarBg: darkMode ? '#2d2d2d' : 'white',
    sidebarText: darkMode ? '#ffffff' : '#1a1a1a',
    accent: '#6366F1',
    error: '#DC2626'
  };

  useEffect(() => {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    
    // Get submission data from navigation state
    if (location.state && location.state.submission) {
      setSubmission(location.state.submission);
    } else {
      // If no data, redirect back
      navigate("/instructor/dashboard");
    }
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const getQuestionType = (question) => {
    return question.type || "multiple-choice";
  };

  const isCorrect = (question, studentAnswer) => {
    const type = getQuestionType(question);
    
    if (type === "multiple-choice" || type === "dropdown" || type === "true-false") {
      return studentAnswer === question.correctAnswer;
    } else if (type === "multiple-correct") {
      const correct = question.correctAnswers || [];
      const student = studentAnswer || [];
      return JSON.stringify([...correct].sort()) === JSON.stringify([...student].sort());
    }
    // For text answers, return null (needs manual grading)
    return null;
  };

  if (!submission) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background }}>
        <div style={{ fontSize: '18px', color: theme.textSecondary }}>Loading...</div>
      </div>
    );
  }

  const stats = {
    correct: submission.answers?.filter((ans, idx) => {
      const q = submission.questions?.[idx];
      return q && isCorrect(q, ans) === true;
    }).length || 0,
    incorrect: submission.answers?.filter((ans, idx) => {
      const q = submission.questions?.[idx];
      return q && isCorrect(q, ans) === false;
    }).length || 0,
    needsGrading: submission.answers?.filter((ans, idx) => {
      const q = submission.questions?.[idx];
      return q && isCorrect(q, ans) === null;
    }).length || 0
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: theme.background }}>
      {/* Left Sidebar */}
      <aside style={{
        width: '200px',
        backgroundColor: theme.sidebarBg,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 10px rgba(0,0,0,0.08)',
        flexShrink: 0
      }}>
        <div style={{ padding: '20px', borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '20px', fontWeight: '900', color: theme.text }}>Menu</span>
            <span style={{ fontSize: '18px', cursor: 'pointer', color: theme.text }}>≡</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '15px 12px' }}>
          <button
            onClick={() => navigate("/instructor/dashboard")}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '6px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMenu === "results" ? theme.accent : 'transparent',
              color: activeMenu === "results" ? 'white' : theme.sidebarText,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '16px' }}>📊</span>
            <span>Results</span>
          </button>

          <button
            onClick={() => navigate("/instructor/quizzes")}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '6px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: 'transparent',
              color: theme.sidebarText,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '16px' }}>📝</span>
            <span>Quizzes</span>
          </button>

          <button
            onClick={() => setActiveMenu("students")}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '6px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: 'transparent',
              color: theme.sidebarText,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '16px' }}>👥</span>
            <span>Students</span>
          </button>

          <button
            onClick={() => setActiveMenu("analytics")}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '6px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: 'transparent',
              color: theme.sidebarText,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '16px' }}>📈</span>
            <span>Analytics</span>
          </button>
        </nav>

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
              backgroundColor: 'transparent',
              color: theme.error,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '16px' }}>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <header style={{
          backgroundColor: '#6366F1',
          padding: '16px 32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '8px 20px',
            borderRadius: '20px',
            border: '3px solid black',
            fontWeight: '700',
            fontSize: '16px'
          }}>
            QuizApp - Instructor
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ fontSize: '20px', cursor: 'pointer', filter: 'brightness(0) invert(1)' }}>🌙</span>
            <span style={{ fontSize: '20px', cursor: 'pointer', filter: 'brightness(0) invert(1)' }}>🔔</span>
            <span style={{ fontSize: '20px', cursor: 'pointer', filter: 'brightness(0) invert(1)' }}>👤</span>
          </div>
        </header>

        {/* Content Area */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Back Button & Header */}
            <div style={{ marginBottom: '32px' }}>
              <button
                onClick={() => navigate("/instructor/dashboard")}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: '2px solid #666',
                  backgroundColor: 'white',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                ← Back to Results
              </button>
              
              <h1 style={{
                fontSize: '32px',
                fontWeight: '900',
                color: '#1a1a1a',
                margin: '0 0 8px 0'
              }}>
                Submission Details
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: 0
              }}>
                Detailed review of student answers
              </p>
            </div>

            {/* Student Info Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '18px',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  margin: '0 0 8px 0'
                }}>
                  {submission.studentName || submission.email}
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  margin: '0 0 4px 0'
                }}>
                  Quiz: <strong>{submission.quizName}</strong>
                </p>
                <p style={{
                  fontSize: '13px',
                  color: '#999',
                  margin: 0
                }}>
                  Submitted: {new Date(submission.submittedAt).toLocaleString()}
                </p>
              </div>

              {/* Score Display */}
              <div style={{
                textAlign: 'center',
                padding: '20px 32px',
                borderRadius: '16px',
                backgroundColor: submission.score >= submission.totalQuestions * 0.7 ? '#f0fdf4' : '#fef2f2',
                border: `3px solid ${submission.score >= submission.totalQuestions * 0.7 ? '#22C55E' : '#DC2626'}`
              }}>
                <div style={{
                  fontSize: '48px',
                  fontWeight: '900',
                  color: submission.score >= submission.totalQuestions * 0.7 ? '#22C55E' : '#DC2626',
                  lineHeight: 1
                }}>
                  {Math.round((submission.score / submission.totalQuestions) * 100)}%
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#666',
                  marginTop: '8px'
                }}>
                  {submission.score} / {submission.totalQuestions}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#22C55E' }}>
                  {stats.correct}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>
                  Correct
                </div>
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#DC2626' }}>
                  {stats.incorrect}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>
                  Incorrect
                </div>
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#F59E0B' }}>
                  {stats.needsGrading}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>
                  Needs Grading
                </div>
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#DC2626' }}>
                  {submission.violations || 0}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>
                  Violations
                </div>
              </div>
            </div>

            {/* Questions Review */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '18px',
              padding: '32px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '24px' }}>📝</span>
                Question-by-Question Review
              </h2>

              {submission.questions?.map((question, idx) => {
                const studentAnswer = submission.answers?.[idx];
                const correct = isCorrect(question, studentAnswer);
                const type = getQuestionType(question);

                return (
                  <div
                    key={idx}
                    style={{
                      padding: '24px',
                      marginBottom: '20px',
                      borderRadius: '12px',
                      backgroundColor: '#f9f9f9',
                      border: `3px solid ${correct === true ? '#22C55E' : correct === false ? '#DC2626' : '#F59E0B'}`
                    }}
                  >
                    {/* Question Header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          backgroundColor: '#6366F1',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '700',
                          marginBottom: '8px'
                        }}>
                          Question {idx + 1}
                        </div>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          margin: '0 0 8px 0',
                          lineHeight: '1.5'
                        }}>
                          {question.question}
                        </h3>
                        {question.description && (
                          <p style={{
                            fontSize: '13px',
                            color: '#666',
                            fontStyle: 'italic',
                            margin: '0 0 8px 0'
                          }}>
                            {question.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Status Badge */}
                      <div style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        backgroundColor: correct === true ? '#f0fdf4' : correct === false ? '#fef2f2' : '#fef3c7',
                        border: `2px solid ${correct === true ? '#22C55E' : correct === false ? '#DC2626' : '#F59E0B'}`,
                        fontSize: '13px',
                        fontWeight: '700',
                        color: correct === true ? '#22C55E' : correct === false ? '#DC2626' : '#F59E0B',
                        marginLeft: '16px',
                        flexShrink: 0
                      }}>
                        {correct === true ? '✓ Correct' : correct === false ? '× Incorrect' : '⏳ Review'}
                      </div>
                    </div>

                    {/* Image if present */}
                    {question.imageUrl && (
                      <img 
                        src={question.imageUrl} 
                        alt="Question" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '200px', 
                          borderRadius: '8px',
                          marginBottom: '16px',
                          border: '2px solid #e0e0e0'
                        }} 
                      />
                    )}

                    {/* Answer Display based on type */}
                    {(type === "multiple-choice" || type === "dropdown") && (
                      <div style={{ marginTop: '16px' }}>
                        {question.options.map((option, optIdx) => {
                          const isStudentAnswer = studentAnswer === optIdx;
                          const isCorrectAnswer = question.correctAnswer === optIdx;
                          
                          return (
                            <div
                              key={optIdx}
                              style={{
                                padding: '12px 16px',
                                marginBottom: '8px',
                                borderRadius: '8px',
                                border: '2px solid',
                                borderColor: isCorrectAnswer ? '#22C55E' : isStudentAnswer ? '#DC2626' : '#e0e0e0',
                                backgroundColor: isCorrectAnswer ? '#f0fdf4' : isStudentAnswer ? '#fef2f2' : 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                              }}
                            >
                              <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                backgroundColor: '#6366F1',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '13px',
                                flexShrink: 0
                              }}>
                                {String.fromCharCode(65 + optIdx)}
                              </div>
                              <span style={{ flex: 1, fontSize: '14px', fontWeight: '500' }}>
                                {option}
                              </span>
                              {isCorrectAnswer && (
                                <span style={{ fontSize: '18px' }}>✓</span>
                              )}
                              {isStudentAnswer && !isCorrectAnswer && (
                                <span style={{ fontSize: '18px' }}>←</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {type === "true-false" && (
                      <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                        <div style={{
                          flex: 1,
                          padding: '16px',
                          borderRadius: '10px',
                          border: '3px solid',
                          borderColor: question.correctAnswer === 0 ? '#22C55E' : studentAnswer === 0 ? '#DC2626' : '#e0e0e0',
                          backgroundColor: question.correctAnswer === 0 ? '#f0fdf4' : studentAnswer === 0 ? '#fef2f2' : 'white',
                          textAlign: 'center',
                          fontWeight: '700'
                        }}>
                          True {question.correctAnswer === 0 && '✓'} {studentAnswer === 0 && !question.correctAnswer === 0 && '←'}
                        </div>
                        <div style={{
                          flex: 1,
                          padding: '16px',
                          borderRadius: '10px',
                          border: '3px solid',
                          borderColor: question.correctAnswer === 1 ? '#22C55E' : studentAnswer === 1 ? '#DC2626' : '#e0e0e0',
                          backgroundColor: question.correctAnswer === 1 ? '#f0fdf4' : studentAnswer === 1 ? '#fef2f2' : 'white',
                          textAlign: 'center',
                          fontWeight: '700'
                        }}>
                          False {question.correctAnswer === 1 && '✓'} {studentAnswer === 1 && !question.correctAnswer === 1 && '←'}
                        </div>
                      </div>
                    )}

                    {(type === "short-answer" || type === "long-answer") && (
                      <div style={{ marginTop: '16px' }}>
                        <div style={{
                          padding: '16px',
                          borderRadius: '10px',
                          backgroundColor: '#fef3c7',
                          border: '2px solid #F59E0B',
                          marginBottom: '12px'
                        }}>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: '#F59E0B', marginBottom: '8px' }}>
                            STUDENT ANSWER:
                          </div>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '500', whiteSpace: 'pre-wrap' }}>
                            {studentAnswer || '(No answer provided)'}
                          </div>
                        </div>
                        <div style={{
                          padding: '16px',
                          borderRadius: '10px',
                          backgroundColor: '#f0fdf4',
                          border: '2px solid #22C55E'
                        }}>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: '#22C55E', marginBottom: '8px' }}>
                            EXPECTED ANSWER:
                          </div>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '500', whiteSpace: 'pre-wrap' }}>
                            {question.answer}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Points */}
                    <div style={{
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '2px solid #e0e0e0',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#666'
                    }}>
                      Points: <span style={{ color: '#1a1a1a', fontSize: '15px' }}>{question.points}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
