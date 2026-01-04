export default function ResultDetailsModal({ quiz, onClose }) {
  if (!quiz) return null;

  // Mock result data - in real app this would come from props
  const resultData = {
    score: 18,
    totalQuestions: 20,
    percentage: 90,
    passed: true,
    timeSpent: "45 minutes",
    violations: 0,
    submittedDate: "December 8, 2024",
    correctAnswers: 18,
    incorrectAnswers: 2,
    questions: [
      { id: 1, question: "What is React?", userAnswer: "A JavaScript library", correctAnswer: "A JavaScript library", isCorrect: true },
      { id: 2, question: "What is JSX?", userAnswer: "JavaScript XML", correctAnswer: "JavaScript XML", isCorrect: true },
      // Add more as needed
    ]
  };

  const { score, totalQuestions, percentage, passed, timeSpent, violations, submittedDate, correctAnswers, incorrectAnswers } = resultData;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '32px',
          borderBottom: '2px solid #f0f0f0',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          borderRadius: '24px 24px 0 0',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '900',
                color: 'black',
                margin: '0 0 8px 0'
              }}>
                {quiz.title}
              </h2>
              <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                Submitted: {submittedDate}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#f0f0f0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e0e0e0'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f0f0f0'}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {/* Score Display */}
          <div style={{
            textAlign: 'center',
            padding: '32px',
            backgroundColor: passed ? '#F0FDF4' : '#FEF2F2',
            borderRadius: '18px',
            marginBottom: '32px',
            border: `2px solid ${passed ? '#22C55E' : '#DC2626'}`
          }}>
            <div style={{
              fontSize: '72px',
              fontWeight: '900',
              color: passed ? '#22C55E' : '#DC2626',
              lineHeight: '1',
              marginBottom: '12px'
            }}>
              {percentage}%
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: passed ? '#22C55E' : '#DC2626',
              marginBottom: '8px'
            }}>
              {passed ? 'Passed!' : 'Failed'}
            </div>
            <div style={{ fontSize: '16px', color: '#666', fontWeight: '600' }}>
              {score} out of {totalQuestions} correct
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {/* Correct Answers */}
            <div style={{
              padding: '20px',
              backgroundColor: '#F0FDF4',
              borderRadius: '14px',
              border: '2px solid #22C55E'
            }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: '600' }}>
                Correct Answers
              </div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#22C55E' }}>
                {correctAnswers}
              </div>
            </div>

            {/* Incorrect Answers */}
            <div style={{
              padding: '20px',
              backgroundColor: '#FEF2F2',
              borderRadius: '14px',
              border: '2px solid #DC2626'
            }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: '600' }}>
                Incorrect Answers
              </div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#DC2626' }}>
                {incorrectAnswers}
              </div>
            </div>

            {/* Time Spent */}
            <div style={{
              padding: '20px',
              backgroundColor: '#F0F9FF',
              borderRadius: '14px',
              border: '2px solid #3B82F6'
            }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: '600' }}>
                Time Spent
              </div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#3B82F6' }}>
                {timeSpent}
              </div>
            </div>

            {/* Violations */}
            <div style={{
              padding: '20px',
              backgroundColor: violations > 0 ? '#FEF3C7' : '#F9FAFB',
              borderRadius: '14px',
              border: `2px solid ${violations > 0 ? '#F59E0B' : '#E5E7EB'}`
            }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: '600' }}>
                Violations
              </div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: violations > 0 ? '#F59E0B' : '#9CA3AF' }}>
                {violations}
              </div>
            </div>
          </div>

          {/* Performance Message */}
          <div style={{
            padding: '20px',
            backgroundColor: '#F9FAFB',
            borderRadius: '14px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '24px' }}>
                {percentage >= 90 ? '🌟' : percentage >= 80 ? '✨' : percentage >= 70 ? '👍' : '📚'}
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'black', margin: 0 }}>
                {percentage >= 90 ? 'Excellent Work!' : percentage >= 80 ? 'Great Job!' : percentage >= 70 ? 'Good Effort!' : 'Keep Practicing!'}
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.5' }}>
              {percentage >= 90 
                ? 'Outstanding performance! You demonstrated excellent understanding of the material.'
                : percentage >= 80 
                ? 'Great job! You have a strong grasp of the concepts covered in this quiz.'
                : percentage >= 70
                ? 'Good work! You passed the quiz. Review the areas you found challenging.'
                : 'Unfortunately, you did not pass this quiz. Please review the material and consult with your instructor.'}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#1a1a1a',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#1a1a1a'}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
