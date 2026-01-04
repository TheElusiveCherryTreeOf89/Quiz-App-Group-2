export default function TimeUpModal({ onViewStatus }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
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
        padding: '45px 50px',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 25px 60px rgba(0,0,0,0.25)'
      }}>
        {/* Clock Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 25px',
          backgroundColor: '#FEE2E2',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '40px' }}>⏰</span>
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: '28px',
          fontWeight: '900',
          color: '#DC2626',
          marginBottom: '15px',
          letterSpacing: '-0.5px'
        }}>
          TIME'S UP!
        </h2>

        {/* Description */}
        <p style={{
          fontSize: '15px',
          color: '#6B7280',
          marginBottom: '15px',
          lineHeight: '1.7'
        }}>
          Your quiz time has expired.
        </p>

        {/* Info Box */}
        <div style={{
          backgroundColor: '#FEF3C7',
          padding: '16px 25px',
          borderRadius: '14px',
          marginBottom: '30px'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#92400E',
            fontWeight: '500'
          }}>
            Your answers have been automatically submitted for review.
          </p>
        </div>

        {/* View Status Button */}
        <button
          onClick={onViewStatus}
          style={{
            padding: '16px 45px',
            backgroundColor: '#1a1a1a',
            color: 'white',
            border: 'none',
            borderRadius: '14px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'block',
            width: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'all 0.2s'
          }}
        >
          View Submission Status
        </button>
      </div>
    </div>
  );
}
