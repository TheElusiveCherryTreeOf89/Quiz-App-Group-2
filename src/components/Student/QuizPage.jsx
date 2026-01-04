import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizStore } from "../../store/quizStore";
import QuestionCard from "./QuestionCard";
import ViolationModal from "./ViolationModal";
import SubmitConfirmModal from "./SubmitConfirmModal";
import TimeUpModal from "./TimeUpModal";
import MaxViolationsModal from "./MaxViolationsModal";

export default function QuizPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [showMaxViolationsModal, setShowMaxViolationsModal] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const {
    timeLeft,
    violations,
    isSubmitted,
    decreaseTime,
    addViolation,
    submitQuiz,
    questions,
    answers,
    showViolationModal,
    closeViolationModal,
    resetQuiz,
  } = useQuizStore();

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load saved progress from localStorage
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "student") {
      navigate("/login");
      return;
    }
    setUser(currentUser);

    const completedQuizzes = JSON.parse(localStorage.getItem("completedQuizzes") || "{}");
    if (completedQuizzes[currentUser.email]) {
      navigate("/student/result-pending");
      return;
    }

    // Load saved progress
    const savedProgress = localStorage.getItem(`quizProgress_${currentUser.email}`);
    if (savedProgress) {
      const { questionIndex, flagged } = JSON.parse(savedProgress);
      setCurrentQuestionIndex(questionIndex || 0);
      setFlaggedQuestions(new Set(flagged || []));
    } else {
      resetQuiz();
    }
  }, [navigate, resetQuiz]);

  // Save progress to localStorage whenever answers or current question changes
  useEffect(() => {
    if (user && !isSubmitted) {
      const progress = {
        questionIndex: currentQuestionIndex,
        flagged: Array.from(flaggedQuestions)
      };
      localStorage.setItem(`quizProgress_${user.email}`, JSON.stringify(progress));
    }
  }, [currentQuestionIndex, flaggedQuestions, user, isSubmitted]);

  // Prevent accidental navigation away from quiz
  useEffect(() => {
    if (isSubmitted || !user) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSubmitted, user]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 && !isSubmitted && user) {
      setShowTimeUpModal(true);
      submitQuiz(user.email, user.name);
      return;
    }

    if (isSubmitted || !user) return;

    const timer = setInterval(() => {
      decreaseTime();
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, decreaseTime, user]);

  // Tab switch detection
  useEffect(() => {
    if (isSubmitted || !user) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        addViolation();
      }
    };

    const handleBlur = () => {
      addViolation();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [addViolation, isSubmitted, user]);

  // Check for auto-submit on 3 violations
  useEffect(() => {
    if (violations >= 3 && !isSubmitted && user) {
      setShowMaxViolationsModal(true);
      submitQuiz(user.email, user.name);
    }
  }, [violations, isSubmitted, submitQuiz, user]);

  // Keyboard navigation
  useEffect(() => {
    if (isSubmitted || !user) return;

    const handleKeyPress = (e) => {
      // Arrow keys for navigation
      if (e.key === 'ArrowRight' && currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else if (e.key === 'ArrowLeft' && currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
      // Number keys 1-4 for answer selection
      else if (['1', '2', '3', '4'].includes(e.key) && currentQuestion) {
        const optionIndex = parseInt(e.key) - 1;
        if (currentQuestion.options[optionIndex]) {
          const { saveAnswer } = useQuizStore.getState();
          saveAnswer(currentQuestion.id, currentQuestion.options[optionIndex]);
        }
      }
      // F key to flag/unflag question
      else if (e.key === 'f' || e.key === 'F') {
        toggleFlag(currentQuestion.id);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestionIndex, questions.length, isSubmitted, user, currentQuestion]);

  const toggleFlag = (questionId) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleConfirmSubmit = () => {
    setShowSubmitConfirm(false);
    submitQuiz(user.email, user.name);
    
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      const completedQuizzes = JSON.parse(localStorage.getItem("completedQuizzes") || "{}");
      completedQuizzes[currentUser.email] = true;
      localStorage.setItem("completedQuizzes", JSON.stringify(completedQuizzes));
      // Clear quiz progress from localStorage
      localStorage.removeItem(`quizProgress_${currentUser.email}`);
    }
    
    navigate("/student/result-pending");
  };

  const handleViewStatus = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      const completedQuizzes = JSON.parse(localStorage.getItem("completedQuizzes") || "{}");
      completedQuizzes[currentUser.email] = true;
      localStorage.setItem("completedQuizzes", JSON.stringify(completedQuizzes));
      // Clear quiz progress from localStorage
      localStorage.removeItem(`quizProgress_${currentUser.email}`);
    }
    navigate("/student/result-pending");
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const currentQuestion = questions[currentQuestionIndex];

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        padding: '20px 40px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left - Logo and Quiz Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Logo */}
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #FF8800 0%, #FFD700 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255, 136, 0, 0.3)'
            }}>
              <span style={{ fontSize: '24px', fontWeight: '900', color: 'white' }}>F</span>
            </div>
            <div>
              <h1 style={{
                fontSize: '22px',
                fontWeight: '800',
                color: '#1a1a1a',
                marginBottom: '4px',
                letterSpacing: '-0.5px'
              }}>
                Quiz 3: Interface Design & Usability
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: violations > 0 ? '#FEE2E2' : '#F3F4F6',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: violations > 0 ? '#DC2626' : '#6B7280'
                }}>
                  <span style={{ fontSize: '14px' }}>⚠️</span>
                  Violations: <span style={{ color: '#DC2626', fontWeight: '700' }}>{violations}/3</span>
                </span>
                <span style={{
                  fontSize: '13px',
                  color: '#6B7280'
                }}>
                  {Object.keys(answers).length} of {questions.length} answered
                </span>
              </div>
            </div>
          </div>

          {/* Right - Timer */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: timeLeft <= 60 ? '#FEE2E2' : '#F9FAFB',
            padding: '12px 25px',
            borderRadius: '16px',
            border: timeLeft <= 60 ? '2px solid #FECACA' : '2px solid #E5E7EB',
            transition: 'all 0.3s'
          }}>
            <p style={{
              fontSize: '32px',
              fontWeight: '900',
              color: timeLeft <= 60 ? '#DC2626' : '#1a1a1a',
              fontFamily: 'monospace',
              letterSpacing: '2px',
              lineHeight: '1'
            }}>
              {formatTime(timeLeft)}
            </p>
            <p style={{ 
              fontSize: '11px', 
              color: timeLeft <= 60 ? '#DC2626' : '#9CA3AF', 
              marginTop: '4px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '600'
            }}>
              {timeLeft <= 60 ? '⏰ Time Running Out!' : 'Time Remaining'}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        padding: isMobile ? '20px 15px' : '30px 40px', 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '20px' : '30px', 
        maxWidth: '1400px', 
        margin: '0 auto' 
      }}>
        {/* Left Sidebar - Quiz Items */}
        <div style={{
          width: isMobile ? '100%' : '200px',
          flexShrink: 0
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: isMobile ? '20px' : '25px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            position: isMobile ? 'static' : 'sticky',
            top: '120px'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '700',
              marginBottom: '8px',
              textAlign: 'center',
              color: '#1a1a1a',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Quiz Items
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#9CA3AF',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              Click to navigate
            </p>

            {/* Question Indicators */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              justifyItems: 'center'
            }}>
              {questions.map((q, index) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = index === currentQuestionIndex;
                const isFlagged = flaggedQuestions.has(q.id);
                
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      border: isFlagged ? '2px solid #F59E0B' : 'none',
                      backgroundColor: isCurrent 
                        ? '#FF8800' 
                        : isAnswered 
                          ? '#22C55E' 
                          : '#F3F4F6',
                      color: (isCurrent || isAnswered) ? 'white' : '#6B7280',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '14px',
                      fontWeight: '700',
                      boxShadow: isCurrent ? '0 4px 12px rgba(255, 136, 0, 0.4)' : 'none',
                      transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                      position: 'relative'
                    }}
                    title={`Question ${index + 1}${isAnswered ? ' (Answered)' : ''}${isFlagged ? ' - Flagged' : ''}`}
                  >
                    {index + 1}
                    {isFlagged && (
                      <span style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        fontSize: '10px'
                      }}>🚩</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#F9FAFB', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: '#FF8800' }}></div>
                <span style={{ fontSize: '11px', color: '#6B7280' }}>Current</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: '#22C55E' }}></div>
                <span style={{ fontSize: '11px', color: '#6B7280' }}>Answered</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB' }}></div>
                <span style={{ fontSize: '11px', color: '#6B7280' }}>Unanswered</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '10px' }}>🚩</span>
                <span style={{ fontSize: '11px', color: '#6B7280' }}>Flagged</span>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#FEF3C7', borderRadius: '12px', border: '1px solid #FCD34D' }}>
              <p style={{ fontSize: '10px', fontWeight: '700', color: '#92400E', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ⌨️ Shortcuts
              </p>
              <div style={{ fontSize: '10px', color: '#78350F', lineHeight: '1.6' }}>
                <div>← → Navigate</div>
                <div>1-4 Select answer</div>
                <div>F Flag question</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Question Card */}
        <div style={{ flex: 1, maxWidth: '800px' }}>
          {currentQuestion && (
            <>
              <QuestionCard
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                isFlagged={flaggedQuestions.has(currentQuestion.id)}
                onToggleFlag={() => toggleFlag(currentQuestion.id)}
              />

              {/* Navigation Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '25px'
              }}>
                {/* Previous Button */}
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  style={{
                    padding: '14px 28px',
                    backgroundColor: currentQuestionIndex === 0 ? '#E5E7EB' : '#4B5563',
                    color: currentQuestionIndex === 0 ? '#9CA3AF' : 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    boxShadow: currentQuestionIndex === 0 ? 'none' : '0 4px 12px rgba(75, 85, 99, 0.3)'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>←</span>
                  Previous
                </button>

                {/* Next or Submit Button */}
                {isLastQuestion ? (
                  <button
                    onClick={() => setShowSubmitConfirm(true)}
                    style={{
                      padding: '14px 35px',
                      backgroundColor: '#22C55E',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
                      transition: 'all 0.2s'
                    }}
                  >
                    Submit Quiz
                    <span style={{ fontSize: '18px' }}>✓</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    style={{
                      padding: '14px 28px',
                      backgroundColor: '#1a1a1a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      transition: 'all 0.2s'
                    }}
                  >
                    Next Question
                    <span style={{ fontSize: '18px' }}>→</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      {showViolationModal && (
        <ViolationModal violations={violations} onClose={closeViolationModal} />
      )}

      {showSubmitConfirm && (
        <SubmitConfirmModal
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowSubmitConfirm(false)}
        />
      )}

      {showTimeUpModal && (
        <TimeUpModal onViewStatus={handleViewStatus} />
      )}

      {showMaxViolationsModal && (
        <MaxViolationsModal onViewStatus={handleViewStatus} />
      )}
    </div>
  );
}
