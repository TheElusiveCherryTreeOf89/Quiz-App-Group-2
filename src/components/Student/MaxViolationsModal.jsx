export default function MaxViolationsModal({ onViewStatus }) {
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
        {/* Warning Icon */}
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
          <span style={{ 
            fontSize: '36px',
            fontWeight: '900',
            color: '#DC2626'
          }}>✕</span>
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: '22px',
          fontWeight: '800',
          color: '#DC2626',
          marginBottom: '15px',
          letterSpacing: '-0.5px'
        }}>
          MAXIMUM VIOLATIONS REACHED
        </h2>

        {/* Violations Count */}
        <div style={{
          backgroundColor: '#FEE2E2',
          padding: '16px 30px',
          borderRadius: '14px',
          marginBottom: '20px',
          display: 'inline-block'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#DC2626',
            fontWeight: '600',
            marginBottom: '4px'
          }}>
            Violations
          </p>
          <p style={{
            fontSize: '32px',
            fontWeight: '900',
            color: '#DC2626'
          }}>
            3/3
          </p>
        </div>

        {/* Description */}
        <p style={{
          fontSize: '15px',
          color: '#6B7280',
          marginBottom: '30px',
          lineHeight: '1.7'
        }}>
          You have reached the maximum number of violations. Your quiz has been automatically submitted.
        </p>

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
