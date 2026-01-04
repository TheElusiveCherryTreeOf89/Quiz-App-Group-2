import { create } from "zustand";
import questionsData from "../data/questions.json";

export const useQuizStore = create((set, get) => ({
  // States
  timeLeft: 300, // 5 minutes = 300 seconds
  violations: 0,
  answers: {},
  isSubmitted: false,
  questions: questionsData.questions,
  showViolationModal: false,

  // Actions
  decreaseTime: () =>
    set((state) => ({
      timeLeft: state.timeLeft > 0 ? state.timeLeft - 1 : 0,
    })),

  addViolation: () =>
    set((state) => {
      const newCount = state.violations + 1;
      return { 
        violations: newCount,
        showViolationModal: true,
      };
    }),

  closeViolationModal: () =>
    set(() => ({
      showViolationModal: false,
    })),

  submitQuiz: (userEmail, userName) =>
    set((state) => {
      try {
        const score = state.questions.reduce((acc, q) => {
          return acc + (state.answers[q.id] === q.correct ? 1 : 0);
        }, 0);

        const result = {
          studentEmail: userEmail,
          studentName: userName,
          score,
          totalQuestions: state.questions.length,
          violations: state.violations,
          timeRemaining: state.timeLeft,
          submittedAt: new Date().toLocaleString(),
          answers: Object.values(state.answers),
          questions: state.questions,
        };

        // Save to localStorage with error handling
        try {
          const existingResults = JSON.parse(localStorage.getItem("quizResults") || "[]");
          
          // Check for duplicate submission
          const alreadySubmitted = existingResults.some(r => r.studentEmail === userEmail);
          if (alreadySubmitted) {
            console.warn("Quiz already submitted by this user");
            return { isSubmitted: true };
          }

          existingResults.push(result);
          localStorage.setItem("quizResults", JSON.stringify(existingResults));

          // Mark quiz as completed for this user
          const completedQuizzes = JSON.parse(localStorage.getItem("completedQuizzes") || "{}");
          completedQuizzes[userEmail] = true;
          localStorage.setItem("completedQuizzes", JSON.stringify(completedQuizzes));

          // Clean up progress
          localStorage.removeItem(`quizProgress_${userEmail}`);
        } catch (storageError) {
          console.error("Failed to save quiz results:", storageError);
          alert("Failed to save your quiz. Please try again.");
          return { isSubmitted: false };
        }

        return { isSubmitted: true };
      } catch (error) {
        console.error("Error submitting quiz:", error);
        alert("An error occurred while submitting your quiz. Please try again.");
        return { isSubmitted: false };
      }
    }),

  saveAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),

  resetQuiz: () =>
    set(() => ({
      timeLeft: 300,
      violations: 0,
      answers: {},
      isSubmitted: false,
      showViolationModal: false,
    })),
}));
