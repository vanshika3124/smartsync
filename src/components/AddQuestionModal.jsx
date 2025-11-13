import React, { useState } from 'react';
import api from '../api'; // <-- Yahi hai aapka 'axios' instance
import { FiX, FiUpload, FiImage, FiCheckCircle } from 'react-icons/fi'; // <-- Naye icons

// --- 🚀 FIX 1: NAYI STATE FIELDS ADD KI HAIN ---
const blankQuestion = {
  type: 'mcq', // 'mcq' ya 'image'
  questionText: '',
  imageUrl: null, // Image URL ke liye
  option1: '',
  option2: '',
  option3: '',
  option4: '',
  correctAnswer: '', 
  marks: 10
};

function AddQuestionModal({ isOpen, onClose, quizId, onQuestionAdded }) {
  const [formData, setFormData] = useState(blankQuestion);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // --- 🚀 2. IMAGE UPLOAD KE LIYE NAYI STATE ---
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  // ------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- 🚀 3. IMAGE FILE SELECT KARNE PAR AUTO-UPLOAD ---
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // File ka preview dikhane ke liye
    
    // File select hote hi upload shuru
    await handleImageUpload(file);
  };

  // --- 🚀 4. BACKEND KO IMAGE UPLOAD KARNE KA FUNCTION ---
  const handleImageUpload = async (file) => {
    setUploading(true);
    setError('');
    
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    
    try {
      // Naya API route use kiya (spec ke according)
      const res = await api.post(
        '/api/quiz/upload-image',
        uploadFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      // Backend se mila URL state mein save kiya
      setFormData(prev => ({ ...prev, imageUrl: res.data.url }));
      setMessage('Image uploaded successfully!');
      setImageFile(null); // File ko state se hata do
      
    } catch (err) {
      console.error("Image upload failed:", err);
      setError("Image upload failed. Please try again.");
      setImageFile(null);
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };
  // ------------------------------------------

  // --- 🚀 5. SUBMIT FUNCTION KO UPDATE KIYA HAI ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const { type, questionText, imageUrl, option1, option2, option3, option4, correctAnswer, marks } = formData;

    // --- Pehle Correct Answer check karo (pehle jaisa) ---
    if (!correctAnswer) {
      setError('Please manually select a correct answer.');
      setLoading(false);
      return;
    }

    let finalCorrectAnswer = '';
    if (correctAnswer === 'opt1') finalCorrectAnswer = option1;
    else if (correctAnswer === 'opt2') finalCorrectAnswer = option2;
    else if (correctAnswer === 'opt3') finalCorrectAnswer = option3;
    else if (correctAnswer === 'opt4') finalCorrectAnswer = option4;

    
    // --- Agar type 'image' hai, toh check karo ki image upload hui ya nahi ---
    if (type === 'image' && !imageUrl) {
      setError('Please upload an image for this question type.');
      setLoading(false);
      return;
    }
    
    // --- API ko naya data bhejo ---
    const questionData = {
      quizId: quizId,
      type: type, // 'mcq' ya 'image'
      questionText: questionText,
      imageUrl: type === 'image' ? imageUrl : null, // 'image' type ke liye URL
      options: [option1, option2, option3, option4],
      correctAnswer: finalCorrectAnswer,
      marks: parseInt(marks, 10)
    };
    
    try {
      await api.post(`/api/quiz/add-question`, questionData);
      setMessage('Question added successfully!');
      setFormData(blankQuestion); // Reset form
      setImageFile(null); // Image state reset
      setImagePreview(null);
      onQuestionAdded(); // Refresh the list
      
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
    setImageFile(null);
    setImagePreview(null);
    setError('');
    setMessage('');
    onClose();
  };
  // ------------------------------------------

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-[#E2F1F9] bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full z-50 relative p-8">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FiX size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Question</h2>
        
        {/* Form ko scrollable banaya hai */}
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
          
          {/* --- 🚀 6. NAYA "QUESTION TYPE" DROPDOWN --- */}
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
              {/* <option value="truefalse">True/False</option> */}
              {/* <option value="short">Short Answer</option> */}
            </select>
          </div>
          {/* ------------------------------------------ */}

          <div>
            <label htmlFor="questionText" className="block text-lg font-medium text-gray-700 mb-2">
              {formData.type === 'image' ? 'Question Text (e.g., "Identify this logo")' : 'Question Text'}
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

          {/* --- 🚀 7. NAYA "IMAGE UPLOAD" SECTION --- */}
          {formData.type === 'image' && (
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Question Image</label>
              
              {/* Image Upload Ho Jaane Ke Baad */}
              {formData.imageUrl && !uploading && (
                <div className="border-2 border-dashed border-green-500 rounded-lg w-full py-6 flex flex-col items-center justify-center bg-green-50">
                   <FiCheckCircle className="w-10 h-10 text-green-600" />
                   <span className="mt-2 font-semibold text-green-700">Image Uploaded!</span>
                   <img src={formData.imageUrl} alt="Uploaded preview" className="max-h-24 w-auto rounded-lg shadow-sm mt-2" />
                   <button type="button" onClick={() => { setFormData(prev => ({...prev, imageUrl: null})); setImagePreview(null); }} className="text-sm text-red-600 hover:underline mt-1">Remove Image</button>
                </div>
              )}

              {/* Image Upload Se Pehle (Ya Uploading Ke Time) */}
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
          {/* ------------------------------------------ */}
          
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
            disabled={loading || uploading} // Uploading ke time bhi disable
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : (uploading ? 'Uploading Image...' : 'Save Question')}
          </button>

          {message && <p className="text-center text-sm font-medium text-green-600">{message}</p>}
          {error && <p className="text-center text-sm font-medium text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default AddQuestionModal;