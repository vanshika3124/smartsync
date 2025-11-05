import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiCopy } from 'react-icons/fi';

function CreateClassroom() {
  const [classroomName, setClassroomName] = useState('');
  const [createdClass, setCreatedClass] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.DEV ? '' : import.meta.env.VITE_BACKEND_URL;
  const JWT_TOKEN = localStorage.getItem('token');
  const apiConfig = { headers: { Authorization: `Bearer ${JWT_TOKEN}` } };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!classroomName) {
      setError('Please enter a name.');
      return;
    }
    setLoading(true);
    setError('');

    try {
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
      setCreatedClass({ code: newClassroom.code, id: newClassroom._id });

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

  if (createdClass) {
    return (
      <main className="flex-1 p-8 md:p-12 bg-blue-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg max-w-lg w-full text-center">
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
            onClick={() => navigate(`/classroom/${createdClass.id}`)}
            className="text-blue-600 font-medium text-lg hover:underline"
          >
            Continue →
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8 md:p-12" style={{ backgroundColor: '#F0F7FF' }}>
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create your classroom</h1>
        <form onSubmit={handleCreate} className="bg-white p-8 rounded-2xl shadow-lg">
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
    </main>
  );
}

export default CreateClassroom;