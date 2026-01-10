import { useState, useEffect } from "react";
import { getMeta } from "../../utils/db";

export default function SubmissionDetailsModal({ submission, onClose, darkMode: parentDarkMode }) {
  const [darkMode, setDarkMode] = useState(parentDarkMode || false);

  // Theme object - match InstructorDashboard theme
  const theme = darkMode ? {
    background: '#1a1a1a',
    card: '#2d2d2d',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    border: '#404040',
    sidebarBg: '#2d2d2d',
    sidebarText: '#ffffff',
    accent: '#6366F1',
    error: '#DC2626',
    success: '#22C55E',
    warning: '#F59E0B'
  } : {
    background: '#f0f0f0',
    card: 'white',
    text: '#1a1a1a',
    textSecondary: '#666',
    border: '#eee',
    sidebarBg: 'white',
    sidebarText: '#1a1a1a',
    accent: '#6366F1',
    error: '#DC2626',
    success: '#22C55E',
    warning: '#F59E0B'
  };

  useEffect(() => {
    // Sync with parent dark mode
    setDarkMode(parentDarkMode || false);
  }, [parentDarkMode]);

  const getQuestionType = (question) => {
    return question.type || "multiple-choice";
  };

  const isCorrect = (question, studentAnswer) => {
    const type = getQuestionType(question);

    if (type === "multiple-choice" || type === "dropdown" || type === "true-false") {
      const correctAnswer = question.correct || question.correctAnswer;
      return studentAnswer === correctAnswer;
    } else if (type === "multiple-correct") {
      const correct = question.correctAnswers || [];
      const student = studentAnswer || [];
      return JSON.stringify([...correct].sort()) === JSON.stringify([...student].sort());
    }
    // For text answers, return null (needs manual grading)
    return null;
  };

  if (!submission) {
    return null;
  }

  const stats = {
    correct: submission.questions?.filter((q, idx) => {
      const ans = submission.answers?.[q.id];
      return q && isCorrect(q, ans) === true;
    }).length || 0,
    incorrect: submission.questions?.filter((q, idx) => {
      const ans = submission.answers?.[q.id];
      return q && isCorrect(q, ans) === false;
    }).length || 0,
    needsGrading: submission.questions?.filter((q, idx) => {
      const ans = submission.answers?.[q.id];
      return q && isCorrect(q, ans) === null;
    }).length || 0
  };

  const renderQuestionContent = (question, studentAnswer) => {
    const type = getQuestionType(question);
    const correct = isCorrect(question, studentAnswer);

    switch (type) {
      case "multiple-choice":
      case "dropdown":
        return (
          <div style={{ marginTop: '12px' }}>
            {question.options?.map((option, optIdx) => {
              const isStudentAnswer = studentAnswer === option;
              const correctAnswer = question.correct || question.correctAnswer;
              const isCorrectAnswer = option === correctAnswer;
              return (
                <div
                  key={optIdx}
                  style={{
                    padding: '8px 12px',
                    marginBottom: '6px',
                    borderRadius: '6px',
                    border: `2px solid ${
                      isCorrectAnswer ? theme.success :
                      isStudentAnswer ? theme.error : theme.border
                    }`,
                    backgroundColor: isCorrectAnswer ? '#f0fdf4' : isStudentAnswer ? '#fef2f2' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: isCorrectAnswer ? theme.success : isStudentAnswer ? theme.error : theme.textSecondary
                  }}>
                    {String.fromCharCode(65 + optIdx)}.
                  </span>
                  <span style={{ flex: 1, color: theme.text }}>
                    {option}
                  </span>
                  {isCorrectAnswer && (
                    <span style={{ color: theme.success, fontSize: '16px' }}>✓</span>
                  )}
                  {isStudentAnswer && !isCorrectAnswer && (
                    <span style={{ color: theme.error, fontSize: '16px' }}>✗</span>
                  )}
                </div>
              );
            })}
          </div>
        );

      case "true-false":
        return (
          <div style={{ marginTop: '12px' }}>
            {["True", "False"].map((option, optIdx) => {
              const isStudentAnswer = studentAnswer === option;
              const correctAnswer = question.correct || question.correctAnswer;
              const isCorrectAnswer = option === correctAnswer;
              return (
                <div
                  key={optIdx}
                  style={{
                    padding: '8px 12px',
                    marginBottom: '6px',
                    borderRadius: '6px',
                    border: `2px solid ${
                      isCorrectAnswer ? theme.success :
                      isStudentAnswer ? theme.error : theme.border
                    }`,
                    backgroundColor: isCorrectAnswer ? '#f0fdf4' : isStudentAnswer ? '#fef2f2' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: isCorrectAnswer ? theme.success : isStudentAnswer ? theme.error : theme.textSecondary
                  }}>
                    {option}
                  </span>
                  {isCorrectAnswer && (
                    <span style={{ color: theme.success, fontSize: '16px', marginLeft: 'auto' }}>✓</span>
                  )}
                  {isStudentAnswer && !isCorrectAnswer && (
                    <span style={{ color: theme.error, fontSize: '16px', marginLeft: 'auto' }}>✗</span>
                  )}
                </div>
              );
            })}
          </div>
        );

      case "multiple-correct":
        return (
          <div style={{ marginTop: '12px' }}>
            {question.options?.map((option, optIdx) => {
              const isStudentAnswer = studentAnswer?.includes(optIdx);
              const isCorrectAnswer = question.correctAnswers?.includes(optIdx);
              return (
                <div
                  key={optIdx}
                  style={{
                    padding: '8px 12px',
                    marginBottom: '6px',
                    borderRadius: '6px',
                    border: `2px solid ${
                      isCorrectAnswer ? theme.success :
                      isStudentAnswer ? theme.error : theme.border
                    }`,
                    backgroundColor: isCorrectAnswer ? '#f0fdf4' : isStudentAnswer ? '#fef2f2' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: isCorrectAnswer ? theme.success : isStudentAnswer ? theme.error : theme.textSecondary
                  }}>
                    {String.fromCharCode(65 + optIdx)}.
                  </span>
                  <span style={{ flex: 1, color: theme.text }}>
                    {option}
                  </span>
                  {isCorrectAnswer && (
                    <span style={{ color: theme.success, fontSize: '16px' }}>✓</span>
                  )}
                  {isStudentAnswer && !isCorrectAnswer && (
                    <span style={{ color: theme.error, fontSize: '16px' }}>✗</span>
                  )}
                </div>
              );
            })}
          </div>
        );

      case "text":
      case "essay":
        return (
          <div style={{ marginTop: '12px' }}>
            <div style={{
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: theme.card,
              border: `1px solid ${theme.border}`,
              minHeight: '80px'
            }}>
              <p style={{
                margin: 0,
                color: theme.text,
                fontStyle: 'italic',
                whiteSpace: 'pre-wrap'
              }}>
                {studentAnswer || "No answer provided"}
              </p>
            </div>
            {correct === null && (
              <div style={{
                marginTop: '8px',
                padding: '8px 12px',
                backgroundColor: theme.warning,
                color: '#92400e',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                This answer requires manual grading
              </div>
            )}
          </div>
        );

      default:
        return (
          <div style={{ marginTop: '12px', color: theme.textSecondary }}>
            Unsupported question type
          </div>
        );
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={onClose}
      >
        {/* Modal Content */}
        <div
          style={{
            backgroundColor: theme.background,
            borderRadius: '18px',
            width: '90%',
            maxWidth: '1000px',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: darkMode ? '0 20px 40px rgba(0,0,0,0.5)' : '0 20px 40px rgba(0,0,0,0.15)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div style={{
            padding: '24px 28px',
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '900',
                color: theme.text,
                margin: '0 0 4px 0',
                fontFamily: 'var(--font-heading)'
              }}>
                Submission Details
              </h2>
              <p style={{
                fontSize: '16px',
                color: theme.textSecondary,
                margin: 0,
                fontFamily: 'var(--font-body)'
              }}>
                {submission.studentName} - {new Date(submission.submittedAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: theme.textSecondary,
                padding: '4px',
                borderRadius: '6px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = theme.border}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              ✕
            </button>
          </div>

          {/* Modal Body */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px'
          }}>
            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '32px'
            }}>
              <div style={{
                backgroundColor: theme.card,
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                border: `1px solid ${theme.border}`
              }}>
                <div style={{ fontSize: '32px', fontWeight: '900', color: theme.success, marginBottom: '8px' }}>
                  {stats.correct}
                </div>
                <div style={{ fontSize: '14px', color: theme.textSecondary, fontWeight: '600' }}>
                  Correct Answers
                </div>
              </div>

              <div style={{
                backgroundColor: theme.card,
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                border: `1px solid ${theme.border}`
              }}>
                <div style={{ fontSize: '32px', fontWeight: '900', color: theme.error, marginBottom: '8px' }}>
                  {stats.incorrect}
                </div>
                <div style={{ fontSize: '14px', color: theme.textSecondary, fontWeight: '600' }}>
                  Incorrect Answers
                </div>
              </div>

              <div style={{
                backgroundColor: theme.card,
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                border: `1px solid ${theme.border}`
              }}>
                <div style={{ fontSize: '32px', fontWeight: '900', color: theme.warning, marginBottom: '8px' }}>
                  {stats.needsGrading}
                </div>
                <div style={{ fontSize: '14px', color: theme.textSecondary, fontWeight: '600' }}>
                  Needs Grading
                </div>
              </div>

              <div style={{
                backgroundColor: theme.card,
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                border: `1px solid ${theme.border}`
              }}>
                <div style={{ fontSize: '32px', fontWeight: '900', color: theme.accent, marginBottom: '8px' }}>
                  {submission.score}/{submission.totalQuestions}
                </div>
                <div style={{ fontSize: '14px', color: theme.textSecondary, fontWeight: '600' }}>
                  Final Score
                </div>
              </div>
            </div>

            {/* Questions Review */}
            <div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '900',
                color: theme.text,
                marginBottom: '20px',
                fontFamily: 'var(--font-heading)'
              }}>
                Question-by-Question Review
              </h3>

              {submission.questions?.map((question, idx) => {
                const studentAnswer = submission.answers?.[question.id];
                const correct = isCorrect(question, studentAnswer);
                const type = getQuestionType(question);

                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: theme.card,
                      padding: '24px',
                      marginBottom: '20px',
                      borderRadius: '12px',
                      border: `3px solid ${
                        correct === true ? theme.success :
                        correct === false ? theme.error :
                        theme.warning
                      }`,
                      boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '900',
                        color: correct === true ? theme.success : correct === false ? theme.error : theme.warning,
                        flexShrink: 0
                      }}>
                        {correct === true ? '✓' : correct === false ? '✗' : '?'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: theme.text,
                          margin: '0 0 12px 0',
                          fontFamily: 'var(--font-heading)'
                        }}>
                          Question {idx + 1}
                        </h4>
                        <p style={{
                          fontSize: '16px',
                          color: theme.text,
                          margin: '0 0 16px 0',
                          lineHeight: '1.5',
                          fontFamily: 'var(--font-body)'
                        }}>
                          {question.question || question.text}
                        </p>

                        {renderQuestionContent(question, studentAnswer)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}