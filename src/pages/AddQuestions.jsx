import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; 
import { FiPlus, FiUpload, FiCheckCircle } from 'react-icons/fi'; 

// --- (blankQuestion state is unchanged) ---
const blankQuestion = {
  type: 'mcq', 
  questionText: '',
  imageUrl: null, 
  option1: '',
  option2: '',
  option3: '',
  option4: '',
  correctAnswer: '', 
  marks: 10
};

function AddQuestions() {
  const { quizId } = useParams(); 
  const [formData, setFormData] = useState(blankQuestion);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); 
    
    await handleImageUpload(file);
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    setError('');
    
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    
    try {
      const res = await api.post(
        '/api/quiz/upload-image',
        uploadFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      setFormData(prev => ({ ...prev, imageUrl: res.data.url }));
      setMessage('Image uploaded successfully!');
      setImageFile(null); 
      
    } catch (err) {
      console.error("Image upload failed:", err);
      setError("Image upload failed. Please try again.");
      setImageFile(null);
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const { type, questionText, imageUrl, option1, option2, option3, option4, correctAnswer, marks } = formData;

    if (!correctAnswer) {
      setError('Please manually select a correct answer.');
      setLoading(false);
      return;
    }

    if (type === 'image' && !imageUrl) {
      setError('Please upload an image or wait for it to finish.');
      setLoading(false);
      return;
    }

    let finalCorrectAnswer = '';
    if (correctAnswer === 'opt1') finalCorrectAnswer = option1;
    else if (correctAnswer === 'opt2') finalCorrectAnswer = option2;
    else if (correctAnswer === 'opt3') finalCorrectAnswer = option3;
    else if (correctAnswer === 'opt4') finalCorrectAnswer = option4;
    
    const questionData = {
      quizId: quizId,
      type: type,
      questionText: questionText,
      imageUrl: type === 'image' ? imageUrl : null,
      options: [option1, option2, option3, option4],
      correctAnswer: finalCorrectAnswer,
      marks: parseInt(marks, 10)
    };

    try {
      await api.post(`/api/quiz/add-question`, questionData);
      
      setMessage('Question added successfully! Add another.');
      setFormData(blankQuestion); 
      setImageFile(null);
      setImagePreview(null);
      
    } catch (err) {
      console.error("Error adding question:", err);
      setError(err.response?.data?.message || "Error: Failed to add question.");
    } finally {
      setLoading(false);
    }       
  };

  const handleDone = async () => {
    if (formData.questionText.trim() !== '') {
      setLoading(true); 
      setError('');
      setMessage('');

      const { type, questionText, imageUrl, option1, option2, option3, option4, correctAnswer, marks } = formData;

      if (!correctAnswer) {
        setError('Please manually select a correct answer before finishing.');
        setLoading(false);
        return;
      }

      if (type === 'image' && !imageUrl) {
        setError('Please upload an image or wait for it to finish.');
        setLoading(false);
        return;
      }

      let finalCorrectAnswer = '';
      if (correctAnswer === 'opt1') finalCorrectAnswer = option1;
      else if (correctAnswer === 'opt2') finalCorrectAnswer = option2;
      else if (correctAnswer === 'opt3') finalCorrectAnswer = option3;
      else if (correctAnswer === 'opt4') finalCorrectAnswer = option4;
      
      const questionData = {
        quizId: quizId,
        type: type,
        questionText: questionText,
        imageUrl: type === 'image' ? imageUrl : null,
        options: [option1, option2, option3, option4],
        correctAnswer: finalCorrectAnswer,
        marks: parseInt(marks, 10)
      };

      try {
        await api.post('/api/quiz/add-question', questionData);
        navigate('/dashboard'); 

      } catch (err) {
        console.error("Error saving final question:", err);
        setError(err.response?.data?.message || "Error: Failed to save final question.");
        setLoading(false); 
      }
      
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <main className="flex-1 p-8 md:p-12 bg-[#E2F1F9] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add Questions</h1>
          </div>
        </div>
        
        <form onSubmit={handleAddQuestion} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
          
          <div>
            <label htmlFor="type" className="block text-lg font-medium text-gray-700 mb-2">Question Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mcq">MCQ (Text only)</option>
              <option value="image">MCQ with Image</option>
            </select>
          </div>

          <div>
            <label htmlFor="questionText" className="block text-lg font-medium text-gray-700 mb-2">
              Question Text
            </label>
            <input 
              type="text" id="questionText" name="questionText"
              value={formData.questionText}
              onChange={handleChange}
              placeholder="Enter your question"
              className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {formData.type === 'image' && (
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Question Image</label>
              
              {formData.imageUrl && !uploading && (
                <div className="border-2 border-dashed border-green-500 rounded-lg w-full py-6 flex flex-col items-center justify-center bg-green-50">
                   <FiCheckCircle className="w-10 h-10 text-green-600" />
                   <span className="mt-2 font-semibold text-green-700">Image Uploaded!</span>
                   <img src={formData.imageUrl} alt="Uploaded preview" className="max-h-24 w-auto rounded-lg shadow-sm mt-2" />
                   <button type="button" onClick={() => { setFormData(prev => ({...prev, imageUrl: null})); setImagePreview(null); }} className="text-sm text-red-600 hover:underline mt-1">Remove Image</button>
                </div>
              )}

              {!formData.imageUrl && (
                <label className="border-2 border-dashed border-gray-300 rounded-lg w-full py-6 flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer">
                  <div className="bg-blue-100 text-blue-600 rounded-full p-3">
                    <FiUpload className="w-6 h-6" />
                  </div>
                  <span className="mt-4 font-semibold text-gray-700">
                    {uploading ? 'Uploading...' : (imageFile ? imageFile.name : 'Click to Upload Image')}
                  </span>
                  {imagePreview && !uploading && (
                     <img src={imagePreview} alt="Question preview" className="max-h-24 w-auto rounded-lg shadow-sm mt-2" />
                  )}
                  <input 
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/gif"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          )}
          
          {/* --- 🚀 YEH RAHA ALIGNMENT FIX 🚀 --- */}
          {/* Options Grid (Order 1, 2, 3, 4) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="option1" className="block text-md font-medium text-gray-700 mb-2">Option 1</label>
              <input type="text" id="option1" name="option1" value={formData.option1} onChange={handleChange} placeholder="Option 1...." className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg" required />
            </div>
            <div>
              <label htmlFor="option2" className="block text-md font-medium text-gray-700 mb-2">Option 2</label>
              <input type="text" id="option2" name="option2" value={formData.option2} onChange={handleChange} placeholder="Option 2...." className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg" required />
            </div>
            <div>
              <label htmlFor="option3" className="block text-md font-medium text-gray-700 mb-2">Option 3</label>
              <input type="text" id="option3" name="option3" value={formData.option3} onChange={handleChange} placeholder="Option 3...." className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg" required />
            </div>
            <div>
              <label htmlFor="option4" className="block text-md font-medium text-gray-700 mb-2">Option 4</label>
              <input type="text" id="option4" name="option4" value={formData.option4} onChange={handleChange} placeholder="Option 4...." className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg" required />
            </div>
          </div>
          {/* --- End of Fix --- */}

          
          {/* Correct Answer & Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="correctAnswer" className="block text-md font-medium text-gray-700 mb-2">Correct Answer</label>
              <select 
                id="correctAnswer" name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg"
                required
              >
                <option value="" disabled>-- Select correct answer --</option>
                <option value="opt1">{formData.option1 || 'Option 1'}</option>
                <option value="opt2">{formData.option2 || 'Option 2'}</option>
                <option value="opt3">{formData.option3 || 'Option 3'}</option>
                <option value="opt4">{formData.option4 || 'Option 4'}</option>
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
            disabled={loading || uploading}
           className="w-full mt-6 bg-[#1E40AF] text-white py-3 rounded-full ... flex items-center justify-center gap-2"
          >
            <FiPlus />
            {loading ? 'Saving...' : (uploading ? 'Uploading Image...' : 'Add Question')}
          </button>

          {message && <p className="text-center text-sm font-medium text-green-600 mt-4">{message}</p>}
          {error && <p className="text-center text-sm font-medium text-red-600 mt-4">{error}</p>}
        </form>

        <button 
          onClick={handleDone}
          disabled={loading || uploading}
          className="w-1/2 mx-auto mt-8 block bg-[#1E40AF] text-white py-3 rounded-full font-semibold hover:bg-blue-900 transition-colors shadow-md"
        >
          {loading ? 'Saving...' : 'Done'}
        </button>
      </div>
    </main>
  );
}

export default AddQuestions;