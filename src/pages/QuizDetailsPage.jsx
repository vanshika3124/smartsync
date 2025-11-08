import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api'; 
import { FiList, FiClock, FiCheck, FiX, FiPlus } from 'react-icons/fi';
import AddQuestionModal from '../components/AddQuestionModal';

// --- 1. SKELETON LOADER COMPONENT ---

// Skeleton for a single question card
const QuestionCardSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
      <div className="h-5 bg-gray-200 rounded-md w-1/4"></div>
    </div>
    <div className="h-6 bg-gray-200 rounded-md w-full mb-6"></div>
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 h-12"></div>
      <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 h-12"></div>
      <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 h-12"></div>
    </div>
  </div>
);

// Skeleton for the entire page
const QuizDetailsSkeleton = () => (
  <main className="flex-1 p-8 md:p-12" style={{ backgroundColor: '#F0F7FF' }}>
    {/* Header Skeleton */}
    <div className="mb-8">
      <div className="h-10 bg-gray-200 rounded-md w-3/4 mb-3 animate-pulse"></div>
      <div className="h-6 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
    </div>

    {/* Stats & Add Button Skeleton */}
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8 flex flex-wrap justify-between items-center gap-4 animate-pulse">
      <div className="flex items-center gap-8">
        <div className="h-8 bg-gray-200 rounded-md w-24"></div>
        <div className="h-8 bg-gray-200 rounded-md w-24"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded-lg w-36"></div>
    </div>

    {/* Questions List Skeleton */}
    <section>
      <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-6 animate-pulse"></div>
      <div className="space-y-6">
        <QuestionCardSkeleton />
        <QuestionCardSkeleton />
      </div>
    </section>
  </main>
);
// --- End of Skeleton Components ---


// --- 🚀🚀 YEH HAI FINAL FIXED 'QuestionCard' COMPONENT 🚀🚀 ---
// Yeh component .trim() use karta hai taaki whitespace ki problem na ho
const QuestionCard = ({ question, index }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Question {index + 1}
        </h3>
        <span className="font-medium text-gray-700">{question.marks || 0} Points</span> 
      </div>
      
      <p className="text-xl text-gray-800 mb-6">{question.questionText}</p>
      
      <div className="space-y-3">
        {question.options.map((option, i) => {
          
          // --- 🚀 YEH HAI ASLI FIX 🚀 ---
          // Hum dono strings ko trim kar rahe hain
          const isCorrect = option.trim() === question.correctAnswer.trim();
          
          return (
            <div 
              key={i}
              className={`flex items-center gap-3 p-4 rounded-lg border-2
                ${isCorrect 
                  ? 'bg-green-100 border-green-500' 
                  : 'bg-gray-50 border-gray-200'
                }
              `}
            >
              {isCorrect ? (
                <FiCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <FiX className="w-5 h-5 text-gray-400 flex-shrink-0" /> 
              )}
              <span className={`font-medium ${isCorrect ? 'text-green-800' : 'text-gray-700'}`}>
                {option}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
// --- End of Updated Component ---


// --- Main Page Component ---
function QuizDetailsPage() {
  const [quiz, setQuiz] =  useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { quizId } = useParams();
  const navigate = useNavigate();

  // --- 🚀🚀 YEH HAI FINAL FIXED 'fetchQuizDetails' FUNCTION 🚀🚀 ---
  const fetchQuizDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/quiz/${quizId}`);
      
      // Data 'response.data.quiz' ke andar hai
      setQuiz(response.data.quiz); 

      setError(null);
    } catch (err) {
      console.error("Failed to fetch quiz details:", err);
      setError("Failed to load quiz details. (API Error)");
    } finally {
      setLoading(false);
    }
  }, [quizId]); 
  // --- End of Fix ---

  useEffect(() => {
    fetchQuizDetails();
  }, [fetchQuizDetails]);

  // Loading state
  if (loading) return <QuizDetailsSkeleton />;
  
  // Error/Not found states
  if (error) return <main className="flex-1 p-10 text-center text-red-500"><p>{error}</p></main>;
  if (!quiz) return <main className="flex-1 p-10 text-center text-red-500"><p>Quiz not found.</p></main>;

  // --- Baaki ka JSX poora same hai ---
  return (
    <> 
      <main className="flex-1 p-8 md:p-12" style={{ backgroundColor: '#F0F7FF' }}>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-lg text-gray-600">{quiz.description || 'Quiz details and questions'}</p>
        </div>

        {/* Stats & Add Button */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <FiList className="w-5 h-5 text-blue-600" />
              <span className="font-medium">{quiz.questions?.length || 0} questions</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="w-5 h-5 text-blue-600" />
              <span className="font-medium">{quiz.durationMinutes || 0} minutes</span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            Add Question
          </button>
        </div>


        {/* Questions List */}
        <section>
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Questions & Answers</h2>
          <div className="space-y-6">
            {quiz.questions && quiz.questions.length > 0 ? (
              quiz.questions.map((question, index) => (
                <QuestionCard 
                  key={question._id || index} 
                  question={question} 
                  index={index} 
                />
              ))
            ) : (
              <p>This quiz does not have any questions yet. Click "Add Question" to start.</p>
            )}
          </div>
        </section>
        
      </main>

      {/* Modal Rendered Here */}
      <AddQuestionModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        quizId={quizId}
        onQuestionAdded={fetchQuizDetails} 
      />
    </>
  );
}

export default QuizDetailsPage;