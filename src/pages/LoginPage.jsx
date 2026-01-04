import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
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
          role: formData.role,
          name: formData.email.split("@")[0],
        };
        
        localStorage.setItem("currentUser", JSON.stringify(userData));

        if (formData.role === "student") {
          navigate("/student/dashboard");
        } else {
          navigate("/instructor/dashboard");
        }
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
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(180deg, #FF8800 0%, #FFD700 100%)' }}>
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
            LOG IN
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
            {/* Username */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '10px',
                color: '#000'
              }}>
                Username
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '15px',
                  backgroundColor: '#D1D5DB',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '10px',
                color: '#000'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    paddingRight: '50px',
                    fontSize: '16px',
                    border: 'none',
                    borderRadius: '15px',
                    backgroundColor: '#D1D5DB',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}>
                  👁️
                </span>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <label style={{ 
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                <input 
                  type="checkbox" 
                  style={{ 
                    width: '16px',
                    height: '16px',
                    marginRight: '8px',
                    cursor: 'pointer'
                  }}
                />
                Remember Me
              </label>
              <button 
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Forgot Password
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '18px',
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: '#E64A19',
                border: 'none',
                borderRadius: '25px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.2s',
                marginBottom: '20px'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              {loading ? "LOGGING IN..." : "LOG IN"}
            </button>

            {/* Sign Up Link */}
            <div style={{ textAlign: 'center', fontSize: '15px' }}>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => navigate("/register")}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#E64A19',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
