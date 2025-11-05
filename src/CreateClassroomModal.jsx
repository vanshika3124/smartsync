import React, { useState } from 'react';
// useNavigate ab use nahi ho raha, hata sakte hain
import axios from 'axios';
import { FiCopy, FiX } from 'react-icons/fi';

function CreateClassroomModal({ isOpen, onClose, onClassroomCreated }) {
  const [classroomName, setClassroomName] = useState('');
  const [createdClass, setCreatedClass] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- 🚀🚀 YEH FIX HAI 🚀🚀 ---
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const handleOpen = () => {
    setClassroomName('');
    setCreatedClass(null);
    setError('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!classroomName) {
      setError('Please enter a name.');
      return;
    }
    setLoading(true);
    setError('');

    // --- API_URL check ---
    if (!API_URL) {
      setError("Error: Backend URL not found. Deployment config check karo.");
      setLoading(false);
      return;
    }

    const JWT_TOKEN = localStorage.getItem('token');
    const apiConfig = { headers: { Authorization: `Bearer ${JWT_TOKEN}` } };

    try {
      // --- Full URL use kiya ---
      const response = await axios.post(
        `${API_URL}/api/classroom/create`, 
        { name: classroomName }, 
        apiConfig
      );
      
      const responseData = response.data;
      let newClassroom;
      if (responseData.classroom) {
        newClassroom = responseData.classroom;
      } else {
        newClassroom = responseData;
      }
      
      const { code, _id } = newClassroom;
      setCreatedClass({ code: code, id: _id });

    } catch (err) {
      console.error("Error creating classroom:", err);
      setError(err.response?.data?.message || "Error: Classroom create nahi hui.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Code copied to clipboard!');
  };

  const handleContinue = () => {
    onClassroomCreated(); 
    onClose(); 
  }

  const handleClose = () => {
    if (createdClass) {
      onClassroomCreated(); 
    }
    onClose();
  }

  if (!isOpen) {
    return null;
  }

  // ... (Baaki ka return JSX same rahega) ...
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
      onClick={handleClose} 
    >
      <div 
        className="bg-white rounded-2xl shadow-lg max-w-lg w-full z-50 relative"
        onClick={e => e.stopPropagation()} 
        onAnimationEnd={handleOpen} 
      >
        <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-50"
        >
            <FiX size={24} />
        </button>
        
        {createdClass ? (
          <div className="p-8 md:p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Your classroom has been successfully created
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-lg text-gray-600">classroom id:</span>
              <span className="font-bold text-2xl text-gray-900">{createdClass.code}</span>
              <button 
                onClick={() => copyToClipboard(createdClass.code)} 
                className="text-gray-500 hover:text-blue-600"
                title="Copy code"
              >
                <FiCopy />
              </button>
            </div>
            <p className="text-gray-600 mb-8">
              Share this code with students
            </p>
            <button 
              onClick={handleContinue}
              className="text-blue-600 font-medium text-lg hover:underline"
            >
              Continue →
            </button>
          </div>
        ) : (
          <div className="p-8 md:p-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create your classroom</h1>
            <form onSubmit={handleCreate}>
              <div className="mb-6">
                <label htmlFor="classroomName" className="block text-lg font-medium text-gray-700 mb-2">
                  Classroom Name
                </label>
                <input 
                  type="text"
                  id="classroomName"
                  value={classroomName}
                  onChange={(e) => setClassroomName(e.target.value)}
                  placeholder="Enter Classroom name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400"
              >
                {loading ? 'Creating...' : 'Create classroom'}
              </button>
              {error && <p className="text-center text-sm font-medium text-red-600 mt-4">{error}</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateClassroomModal;