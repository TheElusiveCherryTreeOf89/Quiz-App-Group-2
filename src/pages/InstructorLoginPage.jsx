import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InstructorLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

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
    
    setTimeout(() => {
      try {
        const userData = {
          email: formData.email.trim().toLowerCase(),
          role: "instructor",
          name: formData.email.split("@")[0],
        };
        
        localStorage.setItem("currentUser", JSON.stringify(userData));
        navigate("/instructor/dashboard");
      } catch (err) {
        setError("Login failed. Please try again.");
        setLoading(false);
      }
    }, 500);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(180deg, #6366F1 0%, #8B5CF6 100%)' }}>
      {/* Logo - Top Left */}
      <div className="absolute top-8 left-8">
        <div style={{ 
          width: '80px', 
          height: '50px',
          background: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'black',
          fontSize: '14px',
          border: '3px solid black',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
        }}>
          QuizApp
        </div>
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
            fontFamily: 'Arial Black, sans-serif'
          }}>
            INSTRUCTOR
          </h1>
          <p style={{ 
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            letterSpacing: '1px'
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
              textAlign: 'center'
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
                letterSpacing: '0.5px'
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
                  fontWeight: '500'
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
                letterSpacing: '0.5px'
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
                  fontWeight: '500'
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
                color: '#666'
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
                  textDecoration: 'none'
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
                opacity: loading ? 0.7 : 1
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
              <span style={{ fontSize: '13px', color: '#999', fontWeight: '600' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#ddd' }} />
            </div>

            {/* Student Login Link */}
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
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
                  textDecoration: 'underline'
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
            transition: 'all 0.2s'
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
  );
}
