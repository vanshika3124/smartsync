import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { FiPlus } from 'react-icons/fi';

const blankQuestion = {
  questionText: '',
  option1: '',
  option2: '',
  option3: '',
  option4: '',
  correctAnswer: 'Option 1',
  marks: 10
};

function AddQuestions() {
  const { quizId } = useParams();
  const [formData, setFormData] = useState(blankQuestion);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

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
    
    const questionData = {
      quizId: quizId,
      questionText: questionText,
      type: 'mcq',
      options: [option1, option2, option3, option4],
      correctAnswer: correctAnswer,
      marks: parseInt(marks, 10)
    };

    try {
      await api.post(`/api/quiz/add-question`, questionData);
      setMessage('Question added successfully! Add another.');
      setFormData(blankQuestion); 
    } catch (err) {
      console.error("Error adding question:", err);
      setError(err.response?.data?.message || "Error: Failed to add question.");
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    const params = new URLSearchParams(location.search);
    const urlClassId = params.get('classId');
    
    if (urlClassId) {
      navigate(`/classroom/${urlClassId}`, { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <main className="flex-1 p-8 md:p-12 bg-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        
        {/* --- 🚀🚀 YEH HAI ASLI FIX 🚀🚀 --- */}
        <div className="flex justify-between items-center mb-8"> {/* Margin badha diya */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add Questions</h1>
            {/* --- QUIZ ID WAALI LINE HATA DI GAYI --- */}
          </div>
          <button 
            onClick={handleAddQuestion}
            disabled={loading}
            className="bg-white text-gray-800 px-5 py-2 rounded-lg font-medium hover:bg-gray-100 shadow-sm border border-gray-200 flex items-center gap-2"
          >
            <FiPlus />
            Add Question
          </button>
        </div>
        {/* --- End of Fix --- */}
        
        {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6">Questions</h2> */}
        
        <form onSubmit={handleAddQuestion} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
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

          {message && <p className="text-center text-sm font-medium text-green-600">{message}</p>}
          {error && <p className="text-center text-sm font-medium text-red-600">{error}</p>}
        </form>

        <button 
          onClick={handleDone}
          className="w-1/2 mx-auto mt-8 block bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
        >
          Done
        </button>
      </div>
    </main>
  );
}

export default AddQuestions;