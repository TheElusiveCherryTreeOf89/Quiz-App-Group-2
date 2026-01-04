export default function SubmitConfirmModal({ onConfirm, onCancel }) {
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
        {/* Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 25px',
          backgroundColor: '#DCFCE7',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '40px' }}>📝</span>
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: '24px',
          fontWeight: '800',
          color: '#1a1a1a',
          marginBottom: '15px',
          letterSpacing: '-0.5px'
        }}>
          Submit Your Quiz?
        </h2>

        {/* Description */}
        <p style={{
          fontSize: '15px',
          color: '#6B7280',
          marginBottom: '30px',
          lineHeight: '1.7'
        }}>
          Are you sure you want to submit your quiz? Once submitted, you cannot make any changes to your answers.
        </p>

        {/* Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '15px',
          justifyContent: 'center'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '14px 30px',
              backgroundColor: 'white',
              color: '#4B5563',
              border: '2px solid #E5E7EB',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              flex: 1
            }}
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '14px 30px',
              backgroundColor: '#22C55E',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
              transition: 'all 0.2s',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>Submit</span>
            <span>✓</span>
          </button>
        </div>
      </div>
    </div>
  );
}
