import React, { useMemo } from 'react';
import { useQuizStore } from "../../store/quizStore";

function QuestionCard({ question, questionNumber, totalQuestions, isFlagged, onToggleFlag }) {
  const { answers, saveAnswer } = useQuizStore();
  const selectedAnswer = useMemo(() => answers[question.id], [answers, question.id]);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '35px 40px',
      boxShadow: '0 4px 25px rgba(0,0,0,0.08)'
    }}>
      {/* Question Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '2px solid #F3F4F6'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{
            backgroundColor: '#FF8800',
            color: 'white',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '700'
          }}>
            Question {questionNumber} of {totalQuestions}
          </span>
          {selectedAnswer && (
            <span style={{
              backgroundColor: '#DCFCE7',
              color: '#22C55E',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>✓</span> Answered
            </span>
          )}
        </div>
        
        {/* Flag Button */}
        <button
          onClick={() => onToggleFlag(question.id)}
          style={{
            backgroundColor: isFlagged ? '#FEF3C7' : '#F3F4F6',
            color: isFlagged ? '#92400E' : '#6B7280',
            padding: '8px 14px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            border: isFlagged ? '1px solid #FCD34D' : '1px solid #E5E7EB',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          title="Flag for review (Press F)"
        >
          <span style={{ fontSize: '14px' }}>🚩</span>
          {isFlagged ? 'Flagged' : 'Flag'}
        </button>
      </div>

      {/* Question Text */}
      <h3 style={{
        fontSize: '22px',
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: '30px',
        lineHeight: '1.5'
      }}>
        {question.question || question.text}
      </h3>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {question.options.map((opt, index) => {
          const isSelected = selectedAnswer === opt;
          const optionLabels = ['A', 'B', 'C', 'D'];
          
          return (
            <div
              key={index}
              onClick={() => saveAnswer(question.id, opt)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '16px 20px',
                cursor: 'pointer',
                borderRadius: '14px',
                border: isSelected ? '2px solid #FF8800' : '2px solid #E5E7EB',
                backgroundColor: isSelected ? '#FFF7ED' : 'white',
                transition: 'all 0.2s ease',
                transform: isSelected ? 'scale(1.01)' : 'scale(1)'
              }}
            >
              {/* Option Label */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: isSelected ? '#FF8800' : '#F3F4F6',
                color: isSelected ? 'white' : '#6B7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px',
                fontWeight: '700',
                flexShrink: 0,
                transition: 'all 0.2s'
              }}>
                {optionLabels[index]}
              </div>
              
              {/* Option Text */}
              <span style={{
                fontSize: '16px',
                fontWeight: isSelected ? '600' : '500',
                color: isSelected ? '#1a1a1a' : '#4B5563',
                flex: 1
              }}>
                {opt}
              </span>

              {/* Check mark for selected */}
              {isSelected && (
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#22C55E',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700'
                }}>
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(QuestionCard);
