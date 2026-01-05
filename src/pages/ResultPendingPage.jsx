import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizStore } from "../store/quizStore";

export default function ResultPendingPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { violations, questions } = useQuizStore();

  useEffect(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (!currentUser || currentUser.role !== "student") {
        navigate("/login");
        return;
      }
      setUser(currentUser);

      // Check if results have been released
      const checkResults = () => {
        try {
          const released = localStorage.getItem("resultsReleased") === "true";
          if (released) {
            navigate("/student/result");
          }
        } catch (error) {
        }
      };

      checkResults();
      const interval = setInterval(checkResults, 2000);
      return () => clearInterval(interval);
    } catch (error) {
      navigate("/login");
    }
  }, [navigate]);

  const handleReturnToQuizzes = () => {
    navigate("/student/manage-quizzes");
  };

  // Get current date/time for display
  const submittedDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  const submittedTime = new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });

  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      {/* Hourglass Icon */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{
          width: '100px',
          height: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* Hourglass SVG */}
          <svg width="80" height="100" viewBox="0 0 80 100" fill="none">
            {/* Top glass */}
            <path d="M10 5 L70 5 L70 15 L55 40 L25 40 L10 15 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="2"/>
            {/* Bottom glass */}
            <path d="M25 60 L55 60 L70 85 L70 95 L10 95 L10 85 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="2"/>
            {/* Sand in top */}
            <path d="M20 12 L60 12 L50 32 L30 32 Z" fill="#FCD34D"/>
            {/* Sand falling */}
            <rect x="38" y="42" width="4" height="16" fill="#FCD34D"/>
            {/* Sand in bottom */}
            <path d="M30 70 L50 70 L60 88 L20 88 Z" fill="#FCD34D"/>
            {/* Frame */}
            <rect x="5" y="0" width="70" height="6" rx="2" fill="#92400E"/>
            <rect x="5" y="94" width="70" height="6" rx="2" fill="#92400E"/>
            {/* Sparkles */}
            <circle cx="15" cy="20" r="2" fill="#FDE68A"/>
            <circle cx="65" cy="15" r="1.5" fill="#FDE68A"/>
            <circle cx="70" cy="30" r="1" fill="#FDE68A"/>
          </svg>
          {/* Shadow under hourglass */}
          <div style={{
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '10px',
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: '50%',
            filter: 'blur(3px)'
          }} />
        </div>
      </div>

      {/* Main Title */}
      <h1 style={{
        fontSize: '32px',
        fontWeight: '900',
        color: '#1a1a1a',
        marginBottom: '12px',
        textAlign: 'center'
      }}>
        Your answers have been submitted.
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: '18px',
        color: '#6B7280',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        Please wait for the instructor to release the results.
      </p>

      {/* Quiz Info Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '35px 40px',
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        {/* Quiz Title */}
        <h2 style={{
          fontSize: '22px',
          fontWeight: '800',
          color: '#1a1a1a',
          marginBottom: '25px'
        }}>
          Quiz 3: Interface Design & Usability
        </h2>

        {/* Info Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Questions Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <span style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a' }}>
              {questions.length} Questions
            </span>
          </div>

          {/* Submitted Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <span style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a' }}>
              Submitted: {submittedDate}  {submittedTime}
            </span>
          </div>

          {/* Violations */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <span style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a' }}>
              Violations: {violations}/3
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: '#E5E7EB',
          margin: '25px 0'
        }} />

        {/* Notice Text */}
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          You can only take this quiz once. Retakes are not allowed.
        </p>

        {/* Return Button */}
        <button
          onClick={handleReturnToQuizzes}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#1a1a1a',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '25px',
            transition: 'all 0.2s'
          }}
        >
          Return to Manage Quizzes
        </button>
      </div>
    </div>
  );
}
