import { create } from "zustand";
import questionsData from "../data/questions.json";
import { fetchWithAuth } from "../utils/api";
import { saveSubmission, setMeta, getMeta } from "../utils/db";

export const useQuizStore = create((set, get) => ({
  // States
  timeLeft: 300, // 5 minutes = 300 seconds
  violations: 0,
  answers: {},
  isSubmitted: false,
  questions: questionsData.questions,
  quizId: null,
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

  submitQuiz: (userObj) =>
    set((state) => {
      try {
        const score = state.questions.reduce((acc, q) => {
          const correctAnswer = q.correct || q.correctAnswer;
          return acc + (state.answers[q.id] === correctAnswer ? 1 : 0);
        }, 0);
        const result = {
          student_id: userObj?.id || null,
          studentEmail: userObj?.email || null,
          studentName: userObj?.name || null,
          quiz_id: state.quizId || 'demo-quiz',
          score,
          total_questions: state.questions.length,
          violations: state.violations,
          time_remaining: state.timeLeft,
          submitted_at: new Date().toISOString(),
          answers: state.answers,
          questions: state.questions,
        };
        // Try to submit to backend; on failure queue to IndexedDB
        (async () => {
          try {
            await saveSubmission(result);
            const existing = (await getMeta('completedQuizzes')) || {};
            existing[userObj?.email] = true;
            await setMeta('completedQuizzes', existing);
            await setMeta(`quizProgress_${userObj?.email}`, null);
          } catch (dbErr) {
            console.error('Failed to save submission locally:', dbErr);
            alert('Failed to save your quiz. Please try again.');
            return;
          }

          try {
            const resp = await fetchWithAuth('/api/quiz/submit.php', {
              method: 'POST',
              body: JSON.stringify(result)
            });
            if (!resp.ok) {
              throw new Error('API submission failed');
            }
          } catch (apiErr) {
            console.warn('API submit failed, but local save succeeded', apiErr);
          }
        })();

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

  setQuestions: (questions) =>
    set(() => ({
      questions: Array.isArray(questions) ? questions : [],
    })),
  setQuizId: (id) => set(() => ({ quizId: id })),

  resetQuiz: () =>
    set(() => ({
      timeLeft: 300,
      violations: 0,
      answers: {},
      isSubmitted: false,
      showViolationModal: false,
      questions: questionsData.questions,
    })),
}));
