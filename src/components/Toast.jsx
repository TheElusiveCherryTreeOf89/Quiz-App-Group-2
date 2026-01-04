import { useState, useEffect } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return { toasts, showToast, removeToast };
};

export default function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null;

  const getToastStyles = (type) => {
    const baseStyles = {
      padding: '16px 20px',
      borderRadius: '12px',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '14px',
      fontWeight: '600',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      cursor: 'pointer',
      animation: 'slideIn 0.3s ease-out',
      minWidth: '300px',
      maxWidth: '500px'
    };

    const types = {
      success: {
        backgroundColor: '#f0fdf4',
        border: '2px solid #22C55E',
        color: '#166534'
      },
      error: {
        backgroundColor: '#fef2f2',
        border: '2px solid #DC2626',
        color: '#991B1B'
      },
      warning: {
        backgroundColor: '#fef3c7',
        border: '2px solid #F59E0B',
        color: '#92400E'
      },
      info: {
        backgroundColor: '#f0f9ff',
        border: '2px solid #3B82F6',
        color: '#1E40AF'
      }
    };

    return { ...baseStyles, ...types[type] };
  };

  const getIcon = (type) => {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || icons.info;
  };

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes slideOut {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }
        `}
      </style>
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
      }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={getToastStyles(toast.type)}
          >
            <span style={{ 
              fontSize: '20px',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.1)',
              flexShrink: 0
            }}>
              {getIcon(toast.type)}
            </span>
            <span style={{ flex: 1 }}>{toast.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}
