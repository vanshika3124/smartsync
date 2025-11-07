import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; 
import { FiPlus } from 'react-icons/fi';

// Initial state for a blank question
const blankQuestion = {
  questionText: '',
  option1: '',
  option2: '',
  option3: '',
  option4: '',
  correctAnswer: 'Option 1', // Default
  marks: 10
};

function AddQuestions() {
  const { quizId } = useParams(); // Get quizId from URL
  const [formData, setFormData] = useState(blankQuestion);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const { questionText, option1, option2, option3, option4, correctAnswer, marks } = formData;
    
    // API Body (unchanged)
    const questionData = {
      quizId: quizId,
      questionText: questionText,
      type: 'mcq',
      options: [option1, option2, option3, option4],
      correctAnswer: correctAnswer,
      marks: parseInt(marks, 10)
    };

    try {
      await api.post(
        `/api/quiz/add-question`, 
        questionData
      );
      
      setMessage('Question added successfully! Add another.');
      setFormData(blankQuestion); // Reset the form
      
    } catch (err) {
      console.error("Error adding question:", err);
      setError(err.response?.data?.message || "Error: Failed to add question.");
    } finally {
      setLoading(false);
    }
  };

  // --- 1. "DONE" BUTTON KA LOGIC CHANGE HO GAYA HAI ---
  const handleDone = async () => {
    // Check if there is text in the main question field
    if (formData.questionText.trim() !== '') {
      // Agar form khali nahi hai, toh pehle save karo
      setLoading(true); 
      setError('');
      setMessage('');

      const { questionText, option1, option2, option3, option4, correctAnswer, marks } = formData;
      const questionData = {
        quizId: quizId,
        questionText: questionText,
        type: 'mcq',
        options: [option1, option2, option3, option4],
        correctAnswer: correctAnswer,
        marks: parseInt(marks, 10)
      };

      try {
        // Last question ko save karne ka try
        await api.post('/api/quiz/add-question', questionData);
        
        // Save hone ke baad, navigate karo
        navigate('/dashboard');

      } catch (err) {
        // Agar save nahi hua, toh error dikhao aur ruko
        console.error("Error saving final question:", err);
        setError(err.response?.data?.message || "Error: Failed to save final question before exiting.");
        setLoading(false); // Taaki user error dekh sake
      }
      
    } else {
      // Agar form khali hai, toh seedha navigate karo
      navigate('/dashboard');
    }
  };

  return (
    <main className="flex-1 p-8 md:p-12 bg-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create a Quiz</h1>
            <p className="text-lg text-gray-600">Quiz ID: {quizId}</p>
          </div>
          {/* --- 2. "ADD QUESTION" BUTTON YAHAN SE HATA DIYA GAYA HAI --- */}
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Questions</h2>
        
        <form onSubmit={handleAddQuestion} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
          {/* Question Text */}
          <div>
            <label htmlFor="questionText" className="block text-lg font-medium text-gray-700 mb-2">Question Text</label>
            <input 
              type="text" id="questionText" name="questionText"
              value={formData.questionText}
              onChange={handleChange}
              placeholder="Enter your question"
              className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="option1" className="block text-md font-medium text-gray-700 mb-2">Option 1</label>
              <input type="text" id="option1" name="option1" value={formData.option1} onChange={handleChange} placeholder="Option 1...." className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg" required />
            </div>
            <div>
              <label htmlFor="option3" className="block text-md font-medium text-gray-700 mb-2">Option 3</label>
              <input type="text" id="option3" name="option3" value={formData.option3} onChange={handleChange} placeholder="Option 3...." className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg" required />
            </div>
            <div>
              <label htmlFor="option2" className="block text-md font-medium text-gray-700 mb-2">Option 2</label>
              <input type="text" id="option2" name="option2" value={formData.option2} onChange={handleChange} placeholder="Option 2...." className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg" required />
            </div>
            <div>
              <label htmlFor="option4" className="block text-md font-medium text-gray-700 mb-2">Option 4</label>
              <input type="text" id="option4" name="option4" value={formData.option4} onChange={handleChange} placeholder="Option 4...." className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg" required />
            </div>
          </div>
          
          {/* Correct Answer & Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="correctAnswer" className="block text-md font-medium text-gray-700 mb-2">Correct Answer</label>
              <select 
                id="correctAnswer" name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg"
              >
                <option value={formData.option1}>{formData.option1 || 'Option 1'}</option>
                <option value={formData.option2}>{formData.option2 || 'Option 2'}</option>
                <option value={formData.option3}>{formData.option3 || 'Option 3'}</option>
                <option value={formData.option4}>{formData.option4 || 'Option 4'}</option>
              </select>
            </div>
            <div>
              <label htmlFor="marks" className="block text-md font-medium text-gray-700 mb-2">Score</label>
              <input 
                type="number" id="marks" name="marks"
                value={formData.marks}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg"
                required
              />
            </div>
          </div>

          {/* --- 3. "ADD QUESTION" BUTTON KO NEECHE MOVE KAR DIYA GAYA HAI --- */}
          <button 
            type="submit" // <-- 'onClick' se 'type="submit"' kiya
            disabled={loading}
            className="w-full mt-6 bg-white text-gray-800 px-5 py-3 rounded-lg font-medium hover:bg-gray-100 shadow-sm border border-gray-200 flex items-center justify-center gap-2"
          >
            <FiPlus />
            Add Question
          </button>

          {/* Messages */}
          {message && <p className="text-center text-sm font-medium text-green-600 mt-4">{message}</p>}
          {error && <p className="text-center text-sm font-medium text-red-600 mt-4">{error}</p>}
        </form>

        {/* Done Button (iska 'onClick' change hua hai) */}
        <button 
          onClick={handleDone}
          disabled={loading} // <-- Loading state yahan bhi add kar diya
          className="w-1/2 mx-auto mt-8 block bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
        >
          {loading ? 'Saving...' : 'Done'}
        </button>
      </div>
    </main>
  );
}

export default AddQuestions;