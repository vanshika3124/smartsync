import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api'; 

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
  const location = useLocation();
  const [classIdFromUrl, setClassIdFromUrl] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlClassId = params.get('classId');

    if (urlClassId) {
      setClassroomId(urlClassId); 
      setClassIdFromUrl(urlClassId); 
    } else {
      const fetchClassrooms = async () => {
        try {
          const response = await api.get('/api/classroom/my');
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
    }
  }, [location.search]); 

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classroomId) {
      setError('Please choose a class.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await api.post(
        '/api/quiz/create',
        { title, description, classroomId, durationMinutes }
      );
      
      const responseData = response.data;
      let newQuiz;

      if (responseData && (responseData._id || responseData.quizId || responseData.id)) {
        newQuiz = responseData;
      } else if (responseData && responseData.quiz && responseData.quiz._id) {
        newQuiz = responseData.quiz;
      } else {
        throw new Error("Unknown API response structure");
      }
      setCreatedQuiz(newQuiz);
      
    } catch (err) {
      console.error("Error creating quiz:", err);
      setError(err.response?.data?.message || "Error: Failed to create quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    const newQuizId = createdQuiz?._id || createdQuiz?.quizId || createdQuiz?.id; 

    if (newQuizId) {
      navigate(`/quiz/${newQuizId}/add-questions?classId=${classroomId}`, { replace: true });
    } else {
      setError("Error: Quiz ID not found. Please go back to dashboard.");
      console.error("Could not find ID in createdQuiz object:", createdQuiz);
      setCreatedQuiz(null); 
    }
  };

  // --- 🚀🚀 YEH HAI ASLI FIX 🚀🚀 ---
  // Step 2: Show Success Message
  if (createdQuiz) {
    // const quizIdToShow = createdQuiz._id || createdQuiz.quizId || createdQuiz.id; // Iski zaroorat nahi
    return (
      <main className="flex-1 p-8 md:p-12 bg-blue-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg max-w-lg w-full text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8"> {/* Margin badha diya */}
            Your quiz has been successfully created
          </h2>
          
          {/* --- QUIZ ID WAALA DIV HATA DIYA --- */}
          
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
  // --- End of Fix ---

  // Step 1: Show Create Form
  return (
    <main className="flex-1 p-8 md:p-12 bg-[#E2F1F9] min-h-screen">
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
            
            {!classIdFromUrl && (
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
            )}
            
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
            className="w-1/2 mx-auto block bg-[#1E40AF] text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400"
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