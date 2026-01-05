import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../App";
import logo from "../assets/1.svg";

export default function CreateQuizPage() {
  const navigate = useNavigate();
  const showToast = useToastContext();
  const [activeMenu, setActiveMenu] = useState("quizzes");
  const [darkMode, setDarkMode] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Load dark mode and trigger animation
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    setTimeout(() => setPageLoaded(true), 50);
  }, []);

  // Quiz Details State
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [passingScore, setPassingScore] = useState(70);
  const [maxViolations, setMaxViolations] = useState(3);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);

  // Questions State
  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: "multiple-choice",
      question: "",
      description: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      correctAnswers: [], // for multiple correct
      answer: "", // for short/long answer
      required: true,
      points: 1,
      imageUrl: ""
    }
  ]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    showToast(`Dark mode ${newMode ? 'enabled' : 'disabled'}`, "info");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      type: "multiple-choice",
      question: "",
      description: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      correctAnswers: [],
      answer: "",
      required: true,
      points: 1,
      imageUrl: ""
    };
    setQuestions([...questions, newQuestion]);
  };

  const duplicateQuestion = (id) => {
    const questionToDuplicate = questions.find(q => q.id === id);
    const newQuestion = {
      ...questionToDuplicate,
      id: Date.now(),
      question: questionToDuplicate.question + " (Copy)"
    };
    const index = questions.findIndex(q => q.id === id);
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, newQuestion);
    setQuestions(newQuestions);
  };

  const removeQuestion = (id) => {
    if (questions.length === 1) {
      showToast("Quiz must have at least one question!", "warning");
      return;
    }
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const addOption = (questionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, options: [...q.options, ""] };
      }
      return q;
    }));
  };

  const removeOption = (questionId, optionIndex) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options.length > 2) {
        const newOptions = q.options.filter((_, idx) => idx !== optionIndex);
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const toggleCorrectAnswer = (questionId, optionIndex) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.type === "multiple-correct") {
        const newCorrectAnswers = [...(q.correctAnswers || [])];
        const index = newCorrectAnswers.indexOf(optionIndex);
        if (index > -1) {
          newCorrectAnswers.splice(index, 1);
        } else {
          newCorrectAnswers.push(optionIndex);
        }
        return { ...q, correctAnswers: newCorrectAnswers };
      }
      return q;
    }));
  };

  const handleSaveQuiz = () => {
    // Validation
    if (!quizTitle || !quizTitle.trim()) {
      showToast("Please enter a quiz title!", "warning");
      return;
    }

    if (quizTitle.trim().length < 3) {
      showToast("Quiz title must be at least 3 characters!", "warning");
      return;
    }

    if (questions.length === 0) {
      showToast("Please add at least one question!", "warning");
      return;
    }

    const emptyQuestions = questions.filter(q => !q.question || !q.question.trim());
    if (emptyQuestions.length > 0) {
      showToast("All questions must have text!", "warning");
      return;
    }

    // Validate based on question type
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const questionPreview = q.question.substring(0, 30);
      
      if (q.type === "multiple-choice" || q.type === "dropdown") {
        if (!q.options || q.options.length < 2) {
          showToast(`Question "${questionPreview}..." needs at least 2 options!`, "warning");
          return;
        }
        if (q.options.some(opt => !opt || !opt.trim())) {
          showToast(`Question "${questionPreview}..." has empty options!`, "warning");
          return;
        }
        if (q.correctAnswer === null || q.correctAnswer === undefined) {
          showToast(`Question "${questionPreview}..." needs a correct answer selected!`, "warning");
          return;
        }
      } else if (q.type === "multiple-correct") {
        if (!q.options || q.options.length < 2) {
          showToast(`Question "${questionPreview}..." needs at least 2 options!`, "warning");
          return;
        }
        if (q.options.some(opt => !opt || !opt.trim())) {
          showToast(`Question "${questionPreview}..." has empty options!`, "warning");
          return;
        }
        if (!q.correctAnswers || q.correctAnswers.length === 0) {
          showToast(`Question "${questionPreview}..." needs at least one correct answer!`, "warning");
          return;
        }
      } else if (q.type === "true-false") {
        if (q.correctAnswer === null || q.correctAnswer === undefined) {
          showToast(`Question "${questionPreview}..." needs a correct answer selected!`, "warning");
          return;
        }
      } else if (q.type === "short-answer" || q.type === "long-answer") {
        if (!q.answer || !q.answer.trim()) {
          showToast(`Question "${questionPreview}..." needs a sample answer!`, "warning");
          return;
        }
      }

      if (q.points <= 0) {
        showToast(`Question "${questionPreview}..." must have points greater than 0!`, "warning");
        return;
      }
    }

    if (timeLimit <= 0) {
      showToast("Time limit must be greater than 0!", "warning");
      return;
    }

    if (passingScore < 0 || passingScore > 100) {
      showToast("Passing score must be between 0 and 100!", "warning");
      return;
    }

    if (maxViolations < 0) {
      showToast("Max violations cannot be negative!", "warning");
      return;
    }

    try {
      // Save to localStorage
      const quiz = {
        id: Date.now(),
        title: quizTitle.trim(),
        description: quizDescription.trim(),
        timeLimit,
        passingScore,
        maxViolations,
        shuffleQuestions,
        shuffleOptions,
        questions: questions.map(q => ({
          type: q.type,
          question: q.question.trim(),
          description: q.description ? q.description.trim() : "",
          options: q.options,
          correctAnswer: q.correctAnswer,
          correctAnswers: q.correctAnswers,
          answer: q.answer,
          required: q.required,
          points: q.points,
          imageUrl: q.imageUrl ? q.imageUrl.trim() : ""
        })),
        createdAt: new Date().toISOString(),
        published: false
      };

      const existingQuizzes = JSON.parse(localStorage.getItem("instructorQuizzes") || "[]");
      existingQuizzes.push(quiz);
      localStorage.setItem("instructorQuizzes", JSON.stringify(existingQuizzes));

      showToast("Quiz saved successfully!", "success");
      navigate("/instructor/quizzes");
    } catch (error) {
      console.error("Error saving quiz:", error);
      showToast("Failed to save quiz. Please try again.", "error");
    }
  };

  // Theme object
  const theme = darkMode ? {
    background: '#1a1a1a',
    card: '#2d2d2d',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    border: '#404040',
    sidebarBg: '#2d2d2d'
  } : {
    background: '#f0f0f0',
    card: 'white',
    text: '#1a1a1a',
    textSecondary: '#666',
    border: '#eee',
    sidebarBg: 'white'
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      backgroundColor: theme.background,
      opacity: pageLoaded ? 1 : 0,
      transform: pageLoaded ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.5s ease-out, transform 0.5s ease-out, background-color 0.3s ease'
    }}>
      {/* Left Sidebar */}
      <aside style={{
        width: '200px',
        backgroundColor: theme.sidebarBg,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: darkMode ? '2px 0 10px rgba(0,0,0,0.5)' : '2px 0 10px rgba(0,0,0,0.08)',
        flexShrink: 0,
        transition: 'background-color 0.3s ease'
      }}>
        <div style={{ padding: '20px', borderBottom: `1px solid ${theme.border}`, transition: 'border-color 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '20px', fontWeight: '900', color: theme.text, transition: 'color 0.3s ease' }}>Menu</span>
            <span style={{ fontSize: '18px', cursor: 'pointer', color: theme.text, transition: 'color 0.3s ease' }}>≡</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '15px 12px' }}>
          <button
            onClick={() => navigate("/instructor/dashboard")}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '6px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMenu === "results" ? '#6366F1' : 'transparent',
              color: activeMenu === "results" ? 'white' : theme.text,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '16px' }}>📊</span>
            <span>Results</span>
          </button>

          <button
            onClick={() => {}}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '6px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMenu === "quizzes" ? '#6366F1' : 'transparent',
              color: activeMenu === "quizzes" ? 'white' : theme.text,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '16px' }}>📝</span>
            <span>Quizzes</span>
          </button>

          <button
            onClick={() => setActiveMenu("students")}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '6px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMenu === "students" ? '#6366F1' : 'transparent',
              color: activeMenu === "students" ? 'white' : theme.text,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '16px' }}>👥</span>
            <span>Students</span>
          </button>

          <button
            onClick={() => setActiveMenu("analytics")}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '6px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMenu === "analytics" ? '#6366F1' : 'transparent',
              color: activeMenu === "analytics" ? 'white' : theme.text,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '16px' }}>📈</span>
            <span>Analytics</span>
          </button>
        </nav>

        <div style={{ padding: '15px 12px', borderTop: `1px solid ${theme.border}`, transition: 'border-color 0.3s ease' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#DC2626',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '16px' }}>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <header style={{
          backgroundColor: '#6366F1',
          padding: '16px 32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '8px 20px',
            borderRadius: '20px',
            border: '3px solid black',
            fontWeight: '700',
            fontSize: '16px'
          }}>
            QuizApp - Instructor
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span 
              onClick={toggleDarkMode}
              style={{ fontSize: '20px', cursor: 'pointer', filter: 'brightness(0) invert(1)' }}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? '☀️' : '🌙'}
            </span>
            <span style={{ fontSize: '20px', cursor: 'pointer', filter: 'brightness(0) invert(1)' }}>🔔</span>
            <span style={{ fontSize: '20px', cursor: 'pointer', filter: 'brightness(0) invert(1)' }}>👤</span>
          </div>
        </header>

        {/* Content Area */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Page Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px'
            }}>
              <div>
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: '900',
                  color: theme.text,
                  margin: 0,
                  transition: 'color 0.3s ease'
                }}>
                  Create New Quiz
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: theme.textSecondary,
                  marginTop: '8px',
                  transition: 'color 0.3s ease'
                }}>
                  Build your quiz with questions, options, and settings
                </p>
              </div>
              <button
                onClick={() => navigate("/instructor/dashboard")}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: '2px solid #666',
                  backgroundColor: 'white',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                }}
              >
                ← Back to Dashboard
              </button>
            </div>

            {/* Quiz Details Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '18px',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '24px' }}>📋</span>
                Quiz Details
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Quiz Title */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Quiz Title *
                  </label>
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="e.g., DCIT 26 Final Exam"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      fontSize: '15px',
                      fontWeight: '500',
                      outline: 'none',
                      transition: 'border 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>

                {/* Description */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Description
                  </label>
                  <textarea
                    value={quizDescription}
                    onChange={(e) => setQuizDescription(e.target.value)}
                    placeholder="Brief description of the quiz..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      fontSize: '15px',
                      fontWeight: '500',
                      outline: 'none',
                      transition: 'border 0.2s',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>

                {/* Time Limit */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
                    min="1"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      fontSize: '15px',
                      fontWeight: '500',
                      outline: 'none',
                      transition: 'border 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>

                {/* Passing Score */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    value={passingScore}
                    onChange={(e) => setPassingScore(parseInt(e.target.value) || 0)}
                    min="0"
                    max="100"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      fontSize: '15px',
                      fontWeight: '500',
                      outline: 'none',
                      transition: 'border 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>

                {/* Max Violations */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Max Violations
                  </label>
                  <input
                    type="number"
                    value={maxViolations}
                    onChange={(e) => setMaxViolations(parseInt(e.target.value) || 0)}
                    min="1"
                    max="10"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      fontSize: '15px',
                      fontWeight: '500',
                      outline: 'none',
                      transition: 'border 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>

                {/* Shuffle Options */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    id="shuffleQuestions"
                    checked={shuffleQuestions}
                    onChange={(e) => setShuffleQuestions(e.target.checked)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      accentColor: '#6366F1'
                    }}
                  />
                  <label htmlFor="shuffleQuestions" style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    cursor: 'pointer'
                  }}>
                    Shuffle Questions
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    id="shuffleOptions"
                    checked={shuffleOptions}
                    onChange={(e) => setShuffleOptions(e.target.checked)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      accentColor: '#6366F1'
                    }}
                  />
                  <label htmlFor="shuffleOptions" style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    cursor: 'pointer'
                  }}>
                    Shuffle Options
                  </label>
                </div>
              </div>
            </div>

            {/* Questions Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '18px',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '24px' }}>❓</span>
                  Questions ({questions.length})
                </h2>
                <button
                  onClick={addQuestion}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#6366F1',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#5558dd';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#6366F1';
                  }}
                >
                  ➕ Add Question
                </button>
              </div>

              {/* Questions List */}
              {questions.map((q, qIndex) => (
                <div
                  key={q.id}
                  style={{
                    backgroundColor: '#f9f9f9',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '20px',
                    border: '2px solid #e0e0e0'
                  }}
                >
                  {/* Question Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      display: 'inline-block',
                      backgroundColor: '#6366F1',
                      color: 'white',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '700'
                    }}>
                      Question {qIndex + 1}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => duplicateQuestion(q.id)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: '2px solid #6366F1',
                          backgroundColor: 'white',
                          color: '#6366F1',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600',
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
                        📋 Duplicate
                      </button>
                      <button
                        onClick={() => removeQuestion(q.id)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: '2px solid #DC2626',
                          backgroundColor: 'white',
                          color: '#DC2626',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#DC2626';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.color = '#DC2626';
                        }}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>

                  {/* Question Type Selector */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#666',
                      marginBottom: '8px'
                    }}>
                      Question Type
                    </label>
                    <select
                      value={q.type}
                      onChange={(e) => updateQuestion(q.id, 'type', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '2px solid #e0e0e0',
                        fontSize: '14px',
                        fontWeight: '500',
                        outline: 'none',
                        transition: 'border 0.2s',
                        backgroundColor: 'white',
                        cursor: 'pointer'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                      onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                    >
                      <option value="multiple-choice">Multiple Choice (Single Answer)</option>
                      <option value="multiple-correct">Multiple Correct (Checkboxes)</option>
                      <option value="true-false">True/False</option>
                      <option value="short-answer">Short Answer</option>
                      <option value="long-answer">Long Answer (Paragraph)</option>
                      <option value="dropdown">Dropdown</option>
                    </select>
                  </div>

                  {/* Question Text */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#666',
                      marginBottom: '8px'
                    }}>
                      Question Text *
                    </label>
                    <textarea
                      value={q.question}
                      onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                      placeholder="Enter your question here..."
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: '2px solid #e0e0e0',
                        fontSize: '15px',
                        fontWeight: '500',
                        outline: 'none',
                        transition: 'border 0.2s',
                        fontFamily: 'inherit',
                        backgroundColor: 'white',
                        resize: 'vertical'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                      onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                    />
                  </div>

                  {/* Description/Help Text */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#666',
                      marginBottom: '8px'
                    }}>
                      Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={q.description}
                      onChange={(e) => updateQuestion(q.id, 'description', e.target.value)}
                      placeholder="Add helpful context or instructions..."
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0',
                        fontSize: '13px',
                        fontWeight: '500',
                        outline: 'none',
                        transition: 'border 0.2s',
                        backgroundColor: 'white',
                        fontStyle: 'italic',
                        color: '#666'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                      onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                    />
                  </div>

                  {/* Image URL (Optional) */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#666',
                      marginBottom: '8px'
                    }}>
                      Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={q.imageUrl}
                      onChange={(e) => updateQuestion(q.id, 'imageUrl', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0',
                        fontSize: '13px',
                        fontWeight: '500',
                        outline: 'none',
                        transition: 'border 0.2s',
                        backgroundColor: 'white'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                      onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                    />
                    {q.imageUrl && (
                      <img 
                        src={q.imageUrl} 
                        alt="Question" 
                        style={{ 
                          marginTop: '12px', 
                          maxWidth: '100%', 
                          maxHeight: '200px', 
                          borderRadius: '8px',
                          border: '2px solid #e0e0e0'
                        }} 
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                  </div>

                  {/* Conditional Rendering Based on Question Type */}
                  {(q.type === "multiple-choice" || q.type === "dropdown") && (
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#666',
                        marginBottom: '8px'
                      }}>
                        Options *
                      </label>
                      {q.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '10px'
                          }}
                        >
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={q.correctAnswer === optIndex}
                            onChange={() => updateQuestion(q.id, 'correctAnswer', optIndex)}
                            style={{
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer',
                              accentColor: '#22C55E',
                              flexShrink: 0
                            }}
                          />
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: '#6366F1',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '14px',
                            flexShrink: 0
                          }}>
                            {String.fromCharCode(65 + optIndex)}
                          </div>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(q.id, optIndex, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                            style={{
                              flex: 1,
                              padding: '10px 14px',
                              borderRadius: '8px',
                              border: '2px solid #e0e0e0',
                              fontSize: '14px',
                              fontWeight: '500',
                              outline: 'none',
                              transition: 'border 0.2s',
                              backgroundColor: 'white'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                          />
                          {q.options.length > 2 && (
                            <button
                              onClick={() => removeOption(q.id, optIndex)}
                              style={{
                                padding: '8px',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: '#fee',
                                color: '#DC2626',
                                cursor: 'pointer',
                                fontSize: '16px',
                                flexShrink: 0
                              }}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addOption(q.id)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: '2px solid #6366F1',
                          backgroundColor: 'white',
                          color: '#6366F1',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600',
                          marginTop: '8px'
                        }}
                      >
                        + Add Option
                      </button>
                      <p style={{
                        fontSize: '12px',
                        color: '#22C55E',
                        marginTop: '12px',
                        fontWeight: '600'
                      }}>
                        ✓ Select the radio button to mark the correct answer
                      </p>
                    </div>
                  )}

                  {q.type === "multiple-correct" && (
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#666',
                        marginBottom: '8px'
                      }}>
                        Options * (Multiple correct answers)
                      </label>
                      {q.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '10px'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={(q.correctAnswers || []).includes(optIndex)}
                            onChange={() => toggleCorrectAnswer(q.id, optIndex)}
                            style={{
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer',
                              accentColor: '#22C55E',
                              flexShrink: 0
                            }}
                          />
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: '#6366F1',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '14px',
                            flexShrink: 0
                          }}>
                            {String.fromCharCode(65 + optIndex)}
                          </div>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(q.id, optIndex, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                            style={{
                              flex: 1,
                              padding: '10px 14px',
                              borderRadius: '8px',
                              border: '2px solid #e0e0e0',
                              fontSize: '14px',
                              fontWeight: '500',
                              outline: 'none',
                              transition: 'border 0.2s',
                              backgroundColor: 'white'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                          />
                          {q.options.length > 2 && (
                            <button
                              onClick={() => removeOption(q.id, optIndex)}
                              style={{
                                padding: '8px',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: '#fee',
                                color: '#DC2626',
                                cursor: 'pointer',
                                fontSize: '16px',
                                flexShrink: 0
                              }}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addOption(q.id)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: '2px solid #6366F1',
                          backgroundColor: 'white',
                          color: '#6366F1',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600',
                          marginTop: '8px'
                        }}
                      >
                        + Add Option
                      </button>
                      <p style={{
                        fontSize: '12px',
                        color: '#22C55E',
                        marginTop: '12px',
                        fontWeight: '600'
                      }}>
                        ✓ Check all correct answers
                      </p>
                    </div>
                  )}

                  {q.type === "true-false" && (
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#666',
                        marginBottom: '8px'
                      }}>
                        Correct Answer *
                      </label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => updateQuestion(q.id, 'correctAnswer', 0)}
                          style={{
                            flex: 1,
                            padding: '14px',
                            borderRadius: '10px',
                            border: `3px solid ${q.correctAnswer === 0 ? '#22C55E' : '#e0e0e0'}`,
                            backgroundColor: q.correctAnswer === 0 ? '#f0fdf4' : 'white',
                            color: q.correctAnswer === 0 ? '#22C55E' : '#666',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '700',
                            transition: 'all 0.2s'
                          }}
                        >
                          ✓ True
                        </button>
                        <button
                          onClick={() => updateQuestion(q.id, 'correctAnswer', 1)}
                          style={{
                            flex: 1,
                            padding: '14px',
                            borderRadius: '10px',
                            border: `3px solid ${q.correctAnswer === 1 ? '#DC2626' : '#e0e0e0'}`,
                            backgroundColor: q.correctAnswer === 1 ? '#fef2f2' : 'white',
                            color: q.correctAnswer === 1 ? '#DC2626' : '#666',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '700',
                            transition: 'all 0.2s'
                          }}
                        >
                          × False
                        </button>
                      </div>
                    </div>
                  )}

                  {(q.type === "short-answer" || q.type === "long-answer") && (
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#666',
                        marginBottom: '8px'
                      }}>
                        Sample/Expected Answer *
                      </label>
                      <textarea
                        value={q.answer}
                        onChange={(e) => updateQuestion(q.id, 'answer', e.target.value)}
                        placeholder="Enter the expected answer for grading reference..."
                        rows={q.type === "long-answer" ? 4 : 2}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          border: '2px solid #e0e0e0',
                          fontSize: '14px',
                          fontWeight: '500',
                          outline: 'none',
                          transition: 'border 0.2s',
                          fontFamily: 'inherit',
                          backgroundColor: 'white',
                          resize: 'vertical'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                      />
                      <p style={{
                        fontSize: '11px',
                        color: '#999',
                        marginTop: '6px',
                        fontStyle: 'italic'
                      }}>
                        This answer will be used for manual grading reference
                      </p>
                    </div>
                  )}

                  {/* Bottom Row: Points and Required */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '2px solid #e0e0e0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="checkbox"
                        id={`required-${q.id}`}
                        checked={q.required}
                        onChange={(e) => updateQuestion(q.id, 'required', e.target.checked)}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer',
                          accentColor: '#6366F1'
                        }}
                      />
                      <label htmlFor={`required-${q.id}`} style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        cursor: 'pointer'
                      }}>
                        Required Question
                      </label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#666'
                      }}>
                        Points:
                      </label>
                      <input
                        type="number"
                        value={q.points}
                        onChange={(e) => updateQuestion(q.id, 'points', parseInt(e.target.value) || 1)}
                        min="1"
                        style={{
                          width: '80px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '2px solid #e0e0e0',
                          fontSize: '14px',
                          fontWeight: '600',
                          outline: 'none',
                          transition: 'border 0.2s',
                          backgroundColor: 'white',
                          textAlign: 'center'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => navigate("/instructor/dashboard")}
                style={{
                  padding: '14px 32px',
                  borderRadius: '12px',
                  border: '2px solid #e0e0e0',
                  backgroundColor: 'white',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuiz}
                style={{
                  padding: '14px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#6366F1',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#5558dd';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#6366F1';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                }}
              >
                💾 Save Quiz
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
