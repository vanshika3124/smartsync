import React, { useState } from 'react';
import axios from 'axios';
import { FiX, FiUploadCloud } from 'react-icons/fi';

function UploadNotesModal({ isOpen, onClose, classroomId, onNoteUploaded }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const API_URL = import.meta.env.DEV ? '' : import.meta.env.VITE_BACKEND_URL;
  const JWT_TOKEN = localStorage.getItem('token');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      setError('Please provide both a title and a file.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');

    // FormData use karna padega file upload ke liye
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('classroomId', classroomId);

    try {
      await axios.post(
        `${API_URL}/api/notes/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${JWT_TOKEN}`
          }
        }
      );
      
      setMessage('Note uploaded successfully!');
      onNoteUploaded(); // Classroom page ko refresh karo
      setTimeout(() => { // Thodi der baad modal band karo
        onClose();
        setMessage('');
        setTitle('');
        setFile(null);
      }, 1500);

    } catch (err) {
      console.error("Error uploading note:", err);
      setError(err.response?.data?.message || "Error uploading file.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
     setTitle('');
     setFile(null);
     setError('');
     setMessage('');
     onClose();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full z-50 relative p-8">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FiX size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload New Note</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="noteTitle" className="block text-lg font-medium text-gray-700 mb-2">Note Title</label>
            <input 
              type="text"
              id="noteTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Unit 3 Handwritten Notes"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* File Upload */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">PDF File</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                {file ? (
                  <p className="text-sm text-green-600">{file.name}</p>
                ) : (
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                )}
              </div>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400"
          >
            {loading ? 'Uploading...' : 'Upload Note'}
          </button>
          
          {error && <p className="text-center text-sm font-medium text-red-600">{error}</p>}
          {message && <p className="text-center text-sm font-medium text-green-600">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default UploadNotesModal;