import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateQuiz() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classroomId, setClassroomId] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdQuiz, setCreatedQuiz] = useState(null); 

  const navigate = useNavigate();
  const API_URL = import.meta.env.DEV ? '' : import.meta.env.VITE_BACKEND_URL;
  const JWT_TOKEN = localStorage.getItem('token');
  const apiConfig = { headers: { Authorization: `Bearer ${JWT_TOKEN}` } };

  // Load classrooms (Same)
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/classroom/my`, apiConfig);
        if (Array.isArray(response.data)) {
          setClassrooms(response.data);
        } else if (response.data && Array.isArray(response.data.teacher)) {
          setClassrooms(response.data.teacher); 
        } else {
          setClassrooms([]);
        }
      } catch (err) {
        console.error("Failed to fetch classrooms", err);
        setError("Could not load your classrooms.");
      }
    };
    fetchClassrooms();
  }, [API_URL, JWT_TOKEN]); // Removed apiConfig

  // --- 🚀🚀 YEH HAI ASLI FIX 🚀🚀 ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classroomId) {
      setError('Please choose a class.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_URL}/api/quiz/create`,
        { title, description, classroomId, durationMinutes },
        apiConfig
      );
      
      console.log("Quiz Create API Response:", response.data); // Check console

      // Ab hum response ko deeply check karenge
      const responseData = response.data;

      if (responseData && (responseData._id || responseData.quizId || responseData.id)) {
        // Case 1: Flat object { _id: ... }
        setCreatedQuiz(responseData);
      } else if (responseData && responseData.quiz && responseData.quiz._id) {
        // Case 2: Nested object { quiz: { _id: ... } }
        setCreatedQuiz(responseData.quiz);
      } else {
        // Case 3: Pata nahi kya aaya
        console.error("Unknown API response structure:", responseData);
        setError("Quiz create ho gaya, par response structure galat tha.");
      }
      
    } catch (err) {
      console.error("Error creating quiz:", err);
      setError(err.response?.data?.message || "Error: Quiz create nahi hua.");
    } finally {
      setLoading(false);
    }
  };

  // handleContinue function ab sahi 'createdQuiz' state use karega
  const handleContinue = () => {
    const newQuizId = createdQuiz?._id || createdQuiz?.quizId || createdQuiz?.id; 

    if (newQuizId) {
      navigate(`/quiz/${newQuizId}/add-questions`);
    } else {
      setError("Error: Quiz ID nahi mila. Dashboard pe waapis jaao.");
      console.error("Could not find ID in createdQuiz object:", createdQuiz);
      setCreatedQuiz(null); 
    }
  };
  // --- End of Fix ---


  // Step 2: Show Success Message
  if (createdQuiz) {
    const quizIdToShow = createdQuiz._id || createdQuiz.quizId || createdQuiz.id;
    return (
      <main className="flex-1 p-8 md:p-12 bg-blue-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg max-w-lg w-full text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Your quiz has been successfully created
          </h2>
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-lg text-gray-600">quiz id .</span>
            <span className="font-bold text-2xl text-gray-900">.{quizIdToShow}</span>
          </div>
          <button 
            onClick={handleContinue}
            className="text-blue-600 font-medium text-lg hover:underline"
          >
            Continue →
          </button>
        </div>
      </main>
    );
  }

  // Step 1: Show Create Form (Same)
  return (
    <main className="flex-1 p-8 md:p-12 bg-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Create a Quiz</h1>
        <p className="text-lg text-gray-600 mb-8">Build your quiz with custom questions and settings</p>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-1">
              <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">Quiz Title</label>
              <input 
                type="text" id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter quiz title....."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="class" className="block text-lg font-medium text-gray-700 mb-2">Class</label>
              <select 
                id="class"
                value={classroomId}
                onChange={(e) => setClassroomId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose class</option>
                {classrooms.map(cls => (
                  <option key={cls._id} value={cls._id}>{cls.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="duration" className="block text-lg font-medium text-gray-700 mb-2">Time limit (in minutes)</label>
              <input 
                type="number" id="duration"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="mb-8">
            <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what the quiz covers"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-1/2 mx-auto block bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create quiz'}
          </button>
          
          {error && <p className="text-center text-sm font-medium text-red-600 mt-4">{error}</p>}
        </form>
      </div>
    </main>
  );
}

export default CreateQuiz;