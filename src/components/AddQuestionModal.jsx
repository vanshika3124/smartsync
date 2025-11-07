import React, { useState } from 'react';
import api from '../api';
import { FiX } from 'react-icons/fi';

// Initial state for a blank question
const blankQuestion = {
  questionText: '',
  option1: '',
  option2: '',
  option3: '',
  option4: '',
  correctAnswer: 'Option 1',
  marks: 10
};

function AddQuestionModal({ isOpen, onClose, quizId, onQuestionAdded }) {
  const [formData, setFormData] = useState(blankQuestion);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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
      setMessage('Question added successfully!');
      setFormData(blankQuestion); // Reset form
      onQuestionAdded(); // Refresh the list on the details page
      
      // Close modal after a short delay
      setTimeout(() => {
        handleClose();
      }, 1500);

    } catch (err) {
      console.error("Error adding question:", err);
      setError(err.response?.data?.message || "Error: Failed to add question.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(blankQuestion);
    setError('');
    setMessage('');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full z-50 relative p-8">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FiX size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Question</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Save Question'}
          </button>

          {message && <p className="text-center text-sm font-medium text-green-600">{message}</p>}
          {error && <p className="text-center text-sm font-medium text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default AddQuestionModal;