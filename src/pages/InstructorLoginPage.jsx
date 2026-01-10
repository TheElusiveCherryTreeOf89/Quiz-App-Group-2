import { useState, useEffect } from "react";
import { setCurrentUser, setToken } from "../utils/db";
import { fetchWithAuth } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function InstructorLoginPage() {
  const navigate = useNavigate();
  // mount debug
  useEffect(() => { console.log('[InstructorLoginPage] mounted'); }, []);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log('[InstructorLoginPage] handleSubmit called', formData.email);

    // Validation
    if (!formData.email || !formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!formData.password || !formData.password.trim()) {
      setError("Password is required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      console.log('[InstructorLoginPage] sending login request...');
      const resp = await fetchWithAuth('/api/instructor/login.php', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        })
      });
      console.log('[InstructorLoginPage] fetchWithAuth returned', resp && resp.status);

      let data = null;
      try {
        data = resp && resp.json ? await resp.json() : null;
      } catch (jsonErr) {
        console.warn('[InstructorLoginPage] failed to parse response json', jsonErr);
      }
      console.log('[InstructorLoginPage] login response data', data);

      if (data && data.success) {
        // Ensure role is instructor for instructor login
        if (data.user.role !== 'instructor') {
          data.user.role = 'instructor';
        }
        console.log('[InstructorLoginPage] user to persist', data.user);
        const tokenVal = data.token || btoa(JSON.stringify(data.user));
        try {
          console.log('[InstructorLoginPage] persisting user/token to IDB/localStorage');
          await setCurrentUser(data.user);
          await setToken(tokenVal);
          localStorage.setItem('token', tokenVal);
        } catch (e) {
          console.warn('Failed to persist auth to IndexedDB', e);
        }
        console.log('[InstructorLoginPage] navigation to instructor dashboard');
        navigate('/instructor/dashboard');
      } else {
        console.warn('[InstructorLoginPage] login not successful', data && data.message);
        setError((data && data.message) || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <style>
        {`
          @keyframes purpleGradient {
            0% { background: linear-gradient(180deg, #6366F1 0%, #8B5CF6 100%); }
            25% { background: linear-gradient(180deg, #7C3AED 0%, #A855F7 100%); }
            50% { background: linear-gradient(180deg, #8B5CF6 0%, #C084FC 100%); }
            75% { background: linear-gradient(180deg, #A855F7 0%, #D946EF 100%); }
            100% { background: linear-gradient(180deg, #6366F1 0%, #8B5CF6 100%); }
          }
        `}
      </style>
      <div className="min-h-screen relative" style={{ 
        background: 'linear-gradient(180deg, #6366F1 0%, #8B5CF6 100%)',
        animation: 'purpleGradient 8s ease-in-out infinite'
      }}>
      {/* Logo - Top Left */}
      <div className="absolute top-8 left-8">
        <img 
          src="/src/assets/1.svg" 
          alt="QuizApp Logo"
          style={{
            height: '56px',
            cursor: 'default',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        {/* Title Section - Outside the card */}
        <div className="text-center mb-10">
          <h1 style={{ 
            fontSize: '80px',
            fontWeight: '900',
            color: 'white',
            textShadow: '-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 0 20px rgba(0,0,0,0.3)',
            marginBottom: '10px',
            letterSpacing: '4px',
            fontFamily: 'var(--font-heading)'
          }}>
            INSTRUCTOR
          </h1>
          <p style={{ 
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            letterSpacing: '1px',
            fontFamily: 'var(--font-body)'
          }}>
            SIGN IN TO YOUR ACCOUNT
          </p>
        </div>

        {/* White Card */}
        <div style={{
          background: 'white',
          borderRadius: '30px',
          padding: '50px 40px',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          {error && (
            <div style={{
              marginBottom: '20px',
              padding: '14px 16px',
              backgroundColor: '#FEE2E2',
              border: '2px solid #DC2626',
              color: '#991B1B',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'center',
              fontFamily: 'var(--font-body)'
            }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '14px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '10px',
                letterSpacing: '0.5px',
                fontFamily: 'var(--font-body)'
              }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  fontSize: '15px',
                  border: '2px solid #ddd',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontWeight: '500',
                  fontFamily: 'var(--font-body)'
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                placeholder="instructor@example.com"
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '14px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '10px',
                letterSpacing: '0.5px',
                fontFamily: 'var(--font-body)'
              }}>
                PASSWORD
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  fontSize: '15px',
                  border: '2px solid #ddd',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontWeight: '500',
                  fontFamily: 'var(--font-body)'
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                placeholder="••••••••"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '32px'
            }}>
              <label style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                color: '#666',
                fontFamily: 'var(--font-body)'
              }}>
                <input
                  type="checkbox"
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#6366F1'
                  }}
                />
                Remember me
              </label>
              <a 
                href="#" 
                style={{ 
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6366F1',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body)'
                }}
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '900',
                color: 'white',
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                border: 'none',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '20px',
                transition: 'all 0.2s',
                letterSpacing: '1px',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                opacity: loading ? 0.7 : 1,
                fontFamily: 'var(--font-body)'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div style={{ flex: 1, height: '1px', background: '#ddd' }} />
              <span style={{ fontSize: '13px', color: '#999', fontWeight: '600', fontFamily: 'var(--font-body)' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#ddd' }} />
            </div>

            {/* Student Login Link */}
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '14px', color: '#666', fontWeight: '500', fontFamily: 'var(--font-body)' }}>
                Not an instructor?{' '}
              </span>
              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6366F1',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontFamily: 'var(--font-body)'
                }}
              >
                Student Login
              </button>
            </div>
          </form>
        </div>

        {/* Back to Home */}
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '30px',
            padding: '12px 30px',
            fontSize: '15px',
            fontWeight: '700',
            color: 'white',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '2px solid white',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: 'var(--font-body)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.5)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.3)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          ← BACK TO HOME
        </button>
      </div>
    </div>
    </>
  );
}
