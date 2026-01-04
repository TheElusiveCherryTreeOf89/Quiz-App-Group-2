import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const features = [
    {
      icon: "🛡️",
      title: "Academic Integrity",
      description: "Advanced tab detection and violation tracking ensures fair assessment for all students.",
      color: "#FF6B00"
    },
    {
      icon: "🎯",
      title: "One-Take Quiz System",
      description: "Single-attempt quizzes with anti-retake protection to maintain assessment validity.",
      color: "#FFD700"
    },
    {
      icon: "📊",
      title: "Result Release Control",
      description: "Instructors control when results are visible, enabling review before student access.",
      color: "#22C55E"
    },
    {
      icon: "⚠️",
      title: "Violation Logging",
      description: "Automatic tracking and submission after 3 violations to maintain exam integrity.",
      color: "#DC2626"
    },
    {
      icon: "👁️",
      title: "Focus Monitoring",
      description: "Real-time detection of tab switches, window minimization, and focus loss.",
      color: "#3B82F6"
    },
    {
      icon: "💾",
      title: "Progress Persistence",
      description: "Answers auto-save with every selection, preventing data loss from unexpected exits.",
      color: "#8B5CF6"
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      {/* Navigation Header */}
      <header style={{
        backgroundColor: '#FFD700',
        padding: isMobile ? '16px 0' : '20px 0',
        borderBottom: '2px solid #1a1a1a',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: isMobile ? '0 20px' : '0 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* Logo */}
          <div style={{
            backgroundColor: 'white',
            padding: isMobile ? '8px 16px' : '10px 24px',
            borderRadius: '25px',
            border: '3px solid black',
            fontWeight: '900',
            fontSize: isMobile ? '16px' : '22px',
            color: '#1a1a1a',
            cursor: 'pointer'
          }}
          onClick={() => navigate("/")}
          >
            QuizApp
          </div>

          {/* Login Buttons */}
          <div style={{ display: 'flex', gap: isMobile ? '8px' : '12px', alignItems: 'center' }}>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: isMobile ? '10px 20px' : '12px 28px',
                borderRadius: '12px',
                border: '2px solid #1a1a1a',
                backgroundColor: '#1a1a1a',
                color: 'white',
                cursor: 'pointer',
                fontSize: isMobile ? '13px' : '15px',
                fontWeight: '700',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#FF6B00';
                e.target.style.borderColor = '#FF6B00';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#1a1a1a';
                e.target.style.borderColor = '#1a1a1a';
              }}
            >
              Student Login
            </button>
            <button
              onClick={() => navigate("/instructor/login")}
              style={{
                padding: '12px 28px',
                borderRadius: '12px',
                border: '2px solid #6366F1',
                backgroundColor: 'white',
                color: '#6366F1',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '700',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#6366F1';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#6366F1';
              }}
            >
              Instructor Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        backgroundColor: 'white',
        padding: isMobile ? '40px 20px' : '80px 32px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Hero Badge */}
          <div style={{
            display: 'inline-block',
            backgroundColor: '#FFF8F0',
            border: '2px solid #FFD700',
            padding: isMobile ? '6px 16px' : '8px 20px',
            borderRadius: '20px',
            fontSize: isMobile ? '11px' : '13px',
            fontWeight: '700',
            color: '#FF6B00',
            marginBottom: isMobile ? '20px' : '24px',
            letterSpacing: '0.5px'
          }}>
            🎓 BUILT FOR DCIT 26 FINAL PROJECT
          </div>

          <h1 style={{
            fontSize: isMobile ? '36px' : '64px',
            fontWeight: '900',
            color: '#1a1a1a',
            margin: '0 0 24px 0',
            lineHeight: '1.1',
            letterSpacing: '-1px'
          }}>
            Simple Tools For<br />
            <span style={{ color: '#FF6B00' }}>Meaningful Learning</span>
          </h1>

          <p style={{
            fontSize: isMobile ? '18px' : '24px',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: '0 0 16px 0',
            letterSpacing: '1px'
          }}>
            Take. Learn. Improve. Repeat.
          </p>

          <p style={{
            fontSize: isMobile ? '16px' : '18px',
            color: '#666',
            lineHeight: '1.7',
            margin: '0 0 40px 0',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Take control of your academic progress with a platform that makes quizzes simple, 
            organized, and stress-free for both students and instructors.
          </p>

          <button
            onClick={() => navigate("/login")}
            style={{
              padding: '18px 48px',
              borderRadius: '50px',
              border: 'none',
              backgroundColor: '#FF6B00',
              color: 'white',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '700',
              transition: 'all 0.3s',
              boxShadow: '0 4px 20px rgba(255, 107, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 25px rgba(255, 107, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 20px rgba(255, 107, 0, 0.3)';
            }}
          >
            🚀 Get Started Free
          </button>
        </div>
      </section>

      {/* Value Proposition */}
      <section style={{
        backgroundColor: '#1a1a1a',
        padding: '60px 32px',
        color: 'white'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '900',
            margin: '0 0 20px 0'
          }}>
            Designed for Learning, Built for Results
          </h2>
          <p style={{
            fontSize: '18px',
            lineHeight: '1.7',
            color: '#e0e0e0',
            margin: 0
          }}>
            We provide a clean and efficient quiz system that keeps students focused and 
            instructors organized. Everything works together to support learning with less 
            hassle and more results.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        backgroundColor: 'white',
        padding: '60px 32px'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '40px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{
              fontSize: '56px',
              fontWeight: '900',
              color: '#FF6B00',
              marginBottom: '12px'
            }}>100%</div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#666'
            }}>Academic Integrity</div>
          </div>
          <div>
            <div style={{
              fontSize: '56px',
              fontWeight: '900',
              color: '#22C55E',
              marginBottom: '12px'
            }}>0</div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#666'
            }}>Setup Complexity</div>
          </div>
          <div>
            <div style={{
              fontSize: '56px',
              fontWeight: '900',
              color: '#FFD700',
              marginBottom: '12px'
            }}>∞</div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#666'
            }}>Learning Potential</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        backgroundColor: '#f0f0f0',
        padding: '80px 32px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '48px',
              fontWeight: '900',
              color: '#1a1a1a',
              margin: '0 0 16px 0'
            }}>
              Key Features
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#666',
              margin: 0
            }}>
              Everything you need for secure, efficient quiz management
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: isMobile ? '16px' : '24px'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '18px',
                  padding: '32px',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  border: '2px solid transparent',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
                  e.currentTarget.style.borderColor = feature.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  backgroundColor: `${feature.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  margin: '0 auto 20px auto'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  margin: '0 0 12px 0'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        backgroundColor: '#FF6B00',
        padding: '80px 32px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '42px',
            fontWeight: '900',
            color: 'white',
            margin: '0 0 20px 0'
          }}>
            Ready to Transform Your Quizzing Experience?
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'white',
            opacity: 0.95,
            margin: '0 0 32px 0',
            lineHeight: '1.6'
          }}>
            Join students and instructors who are already using QuizApp to make learning more effective.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={() => navigate("/register")}
              style={{
                padding: '16px 40px',
                borderRadius: '12px',
                border: '2px solid white',
                backgroundColor: 'white',
                color: '#FF6B00',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '700',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1a1a1a';
                e.target.style.color = 'white';
                e.target.style.borderColor = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#FF6B00';
                e.target.style.borderColor = 'white';
              }}
            >
              Sign Up Now
            </button>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: '16px 40px',
                borderRadius: '12px',
                border: '2px solid white',
                backgroundColor: 'transparent',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '700',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#FF6B00';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1a1a1a',
        padding: '40px 32px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '8px 20px',
            borderRadius: '20px',
            border: '3px solid #FFD700',
            fontWeight: '900',
            fontSize: '18px',
            color: '#1a1a1a',
            display: 'inline-block',
            marginBottom: '24px'
          }}>
            QuizApp
          </div>
          <p style={{
            fontSize: '14px',
            color: '#999',
            margin: '0 0 8px 0'
          }}>
            DCIT 26 Final Project - Quiz Management System
          </p>
          <p style={{
            fontSize: '13px',
            color: '#666',
            margin: 0
          }}>
            © 2025 QuizApp. Built with ❤️ for meaningful learning.
          </p>
        </div>
      </footer>
    </div>
  );
}
