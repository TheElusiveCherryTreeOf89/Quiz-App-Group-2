import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.name || !formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (!formData.email || !formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    // Simulate brief loading
    setTimeout(() => {
      try {
        const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        
        // Check if user already exists
        const normalizedEmail = formData.email.trim().toLowerCase();
        if (existingUsers.some(user => user.email.toLowerCase() === normalizedEmail)) {
          setError("User with this email already exists");
          setLoading(false);
          return;
        }

        // Add new user
        existingUsers.push({
          name: formData.name.trim(),
          email: normalizedEmail,
          password: formData.password,
          role: "student",
          createdAt: new Date().toISOString()
        });

        localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));
        setSuccess("Registration successful! Redirecting to login...");
        setLoading(false);
        
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } catch (err) {
        setError("Registration failed. Please try again.");
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
    <div style={{ 
      minHeight: '100vh',
      position: 'relative',
      background: 'linear-gradient(180deg, #FF8800 0%, #FFD700 100%)'
    }}>
      {/* Logo - Top Left */}
      <div style={{ position: 'absolute', top: '32px', left: '32px' }}>
        <img 
          src="/src/assets/1.svg" 
          alt="QuizApp Logo" 
          onClick={() => navigate("/")}
          style={{ 
            width: '120px', 
            height: 'auto',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
            cursor: 'pointer'
          }} 
        />
      </div>

      {/* Main Content */}
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px'
      }}>
        {/* Title Section - Outside the card */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '72px',
            fontWeight: '900',
            color: 'white',
            textShadow: '-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 0 20px rgba(0,0,0,0.3)',
            marginBottom: '10px',
            letterSpacing: '4px',
            fontFamily: 'var(--font-heading)'
          }}>
            SIGN UP
          </h1>
          <p style={{ 
            fontSize: '16px',
            fontWeight: '600',
            color: 'white',
            letterSpacing: '1px',
            fontFamily: 'var(--font-body)',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            REGISTER YOUR ACCOUNT
          </p>
        </div>

        {/* White Card */}
        <div style={{
          background: 'white',
          borderRadius: '30px',
          padding: '40px 35px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          {error && (
            <div style={{
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: '#FEE2E2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'var(--font-body)'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: '#D1FAE5',
              border: '1px solid #6EE7B7',
              color: '#065F46',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'var(--font-body)'
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* First Name */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#000',
                fontFamily: 'var(--font-heading)'
              }}>
                First Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your first name"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '15px',
                  border: 'none',
                  borderRadius: '12px',
                  backgroundColor: '#D1D5DB',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'var(--font-body)'
                }}
              />
            </div>

            {/* Last Name */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#000',
                fontFamily: 'var(--font-heading)'
              }}>
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                disabled={loading}
                placeholder="Enter your last name"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '15px',
                  border: 'none',
                  borderRadius: '12px',
                  backgroundColor: '#D1D5DB',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'var(--font-body)'
                }}
              />
            </div>

            {/* Student Number */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#000',
                fontFamily: 'var(--font-heading)'
              }}>
                Student Number
              </label>
              <input
                type="text"
                name="studentNumber"
                disabled={loading}
                placeholder="Enter your student number"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '15px',
                  border: 'none',
                  borderRadius: '12px',
                  backgroundColor: '#D1D5DB',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'var(--font-body)'
                }}
              />
            </div>

            {/* Program */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#000',
                fontFamily: 'var(--font-heading)'
              }}>
                Program
              </label>
              <input
                type="text"
                name="program"
                disabled={loading}
                placeholder="Enter your program"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '15px',
                  border: 'none',
                  borderRadius: '12px',
                  backgroundColor: '#D1D5DB',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'var(--font-body)'
                }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#000',
                fontFamily: 'var(--font-heading)'
              }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '15px',
                  border: 'none',
                  borderRadius: '12px',
                  backgroundColor: '#D1D5DB',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'var(--font-body)'
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#000',
                fontFamily: 'var(--font-heading)'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  disabled={loading}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    paddingRight: '50px',
                    fontSize: '15px',
                    border: 'none',
                    borderRadius: '12px',
                    backgroundColor: '#D1D5DB',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'var(--font-body)'
                  }}
                />
                <img 
                  src="/assets/images/mdi_eye.png" 
                  alt="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '22px',
                    height: '22px',
                    cursor: 'pointer',
                    opacity: showPassword ? '1' : '0.6'
                  }}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#000',
                fontFamily: 'var(--font-heading)'
              }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  disabled={loading}
                  placeholder="Confirm your password"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    paddingRight: '50px',
                    fontSize: '15px',
                    border: 'none',
                    borderRadius: '12px',
                    backgroundColor: '#D1D5DB',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'var(--font-body)'
                  }}
                />
                <img 
                  src="/assets/images/mdi_eye.png" 
                  alt="Toggle password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '22px',
                    height: '22px',
                    cursor: 'pointer',
                    opacity: showConfirmPassword ? '1' : '0.6'
                  }}
                />
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <label style={{ 
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)'
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: '#E64A19',
                border: 'none',
                borderRadius: '25px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.2s',
                marginBottom: '16px',
                fontFamily: 'var(--font-heading)'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.opacity = '0.9')}
              onMouseLeave={(e) => !loading && (e.target.style.opacity = '1')}
            >
              {loading ? "Creating account..." : "SIGN UP"}
            </button>

            {/* Sign In Link */}
            <div style={{ textAlign: 'center', fontSize: '14px', fontFamily: 'var(--font-body)' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate("/login")}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#E64A19',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontFamily: 'var(--font-body)'
                }}
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
