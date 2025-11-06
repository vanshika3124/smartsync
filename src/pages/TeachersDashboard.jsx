import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import axios from 'axios';
// import TeachersSidebar from './TeachersSidebar'; // Already commented out, good
import AlertModal from '../components/AlertModal'; // Alert modal (for delete)
// --- CreateClassroomModal IMPORT HATA DIYA ---
import { 
  FiList, 
  FiClock, 
  FiUsers, 
  FiCopy, 
  FiArrowUpRight,
  FiTrash
} from 'react-icons/fi';

// ... (ClassroomCard aur QuizCard components same rahenge) ...
// --- Helper Component 1: Classroom Card ---
const ClassroomCard = ({ classroom, onClick, onDelete }) => (
  <div 
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all relative"
    onClick={() => onClick(classroom._id)} 
  >
    <button
      onClick={(e) => {
        e.stopPropagation(); 
        onDelete(classroom._id);
      }}
      className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
      title="Delete classroom"
    >
      <FiTrash />
    </button>
    <h3 className="font-bold text-xl text-gray-900">{classroom.name}</h3>
    <p className="text-sm text-gray-500 mb-4">Id . {classroom.code}</p>
    <p className="font-medium text-gray-700">{classroom.students?.length || 0} students</p>
  </div>
);
// --- Helper Component 2: Quiz Card ---
const QuizCard = ({ quiz, onDelete }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
    <div className="absolute top-6 right-6 flex items-center gap-2">
      {quiz._id && <span className="text-sm text-gray-400">id.{quiz._id}</span>}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(quiz._id);
        }}
        className="text-gray-400 hover:text-red-500"
        title="Delete quiz"
      >
        <FiTrash className="w-4 h-4" />
      </button>
    </div>
    <div className="mb-4">
      <Link 
        to={`/quiz/${quiz._id}`} 
        className="font-bold text-2xl text-gray-900 pr-20 hover:text-blue-600 hover:underline"
      >
        {quiz.title}
      </Link>
    </div>
    <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-gray-600 text-sm mb-6">
      <span className="flex items-center gap-1.5"><FiList className="w-4 h-4" />{quiz.questions?.length || 0} questions</span>
      <span className="flex items-center gap-1.5"><FiClock className="w-4 h-4" />{quiz.durationMinutes || 0} minutes</span>
      <span className="flex items-center gap-1.5"><FiUsers className="w-4 h-4" />{quiz.participants?.length || 0} participants</span>
    </div>
    <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-sm text-green-800 font-medium">Quiz Code</span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-green-900 text-lg">{quiz.quizCode || 'N/A'}</span>
          <button className="hover:opacity-70" title="Copy code"><FiCopy className="w-5 h-5" /></button>
        </div>
      </div>
      <Link to={`/quiz/${quiz._id}/analysis`} className="flex items-center gap-1.5 text-blue-600 font-medium hover:underline">
        Check analysis <FiArrowUpRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
);


// --- MUKHYA Dashboard Component ---
function TeachersDashboard() {
  const [classrooms, setClassrooms] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // --- isModalOpen STATE HATA DIYA ---
  const [userName, setUserName] = useState('');
  const navigate = useNavigate(); 
  const API_URL = import.meta.env.DEV ? '' : import.meta.env.VITE_BACKEND_URL;

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert',
    status: 'success',
    onConfirm: null,
  });

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.name) {
        setUserName(storedUser.name);
      } else {
        setUserName('Teacher');
      }
    } catch (e) {
      console.error("Failed to parse user details", e);
      setUserName('Teacher');
    }
  }, []);

  // --- Data Fetch Logic (No Change) ---
  const fetchDashboardData = useCallback(async () => {
    const JWT_TOKEN = localStorage.getItem('token'); 
    if (!JWT_TOKEN || JWT_TOKEN === 'undefined' || JWT_TOKEN === 'null') {
      setError("You are not logged in. Please login.");
      setLoading(false);
      navigate('/login'); 
      return; 
    }
    if (!API_URL && !import.meta.env.DEV) {
      setError("Error: Backend URL not found.");
      setLoading(false);
      return;
    }
    const apiConfig = { headers: { Authorization: `Bearer ${JWT_TOKEN}` } };
    setLoading(true);
    
    try {
      const classroomRes = await axios.get(`${API_URL}/api/classroom/my`, apiConfig);
      let fetchedClassrooms = [];
      if (Array.isArray(classroomRes.data)) {
        fetchedClassrooms = classroomRes.data;
      } else if (classroomRes.data && Array.isArray(classroomRes.data.teacher)) {
        fetchedClassrooms = classroomRes.data.teacher; 
      } else {
        setClassrooms([]);
      }
      setClassrooms(fetchedClassrooms);
      setError(null); 
    } catch (err) {
      console.error("Error fetching classrooms:", err);
      setError("Failed to load classroom data.");
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token'); 
        navigate('/login');
      }
      setLoading(false);
      return;
    }

    try {
      const quizRes = await axios.get(`${API_URL}/api/quiz/my-recent`, apiConfig);
      if (quizRes.data && Array.isArray(quizRes.data.quizzes)) {
        setQuizzes(quizRes.data.quizzes);
      } else { 
        setQuizzes([]); 
      }
    } catch (quizErr) {
      console.error("Error fetching recent quizzes:", quizErr);
      setError("Classrooms loaded, but failed to load recent quizzes. (API Error)");
      setQuizzes([]);
    }
    
    setLoading(false);
  }, [navigate, API_URL]); 

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ... (Baaki saare functions same rahenge) ...
  const handleClassroomClick = (classroomId) => {
    navigate(`/classroom/${classroomId}`);
  };

  const handleDeleteClassroom = async (classroomId) => {
    setAlertConfig({
      isOpen: true,
      title: "Delete Classroom?",
      message: "Are you sure? All data (quizzes, notes) for this classroom will be deleted.",
      type: 'confirm',
      status: 'warning',
      onConfirm: () => executeDeleteClassroom(classroomId)
    });
  };

  const executeDeleteClassroom = async (classroomId) => {
    const JWT_TOKEN = localStorage.getItem('token');
    const apiConfig = { headers: { Authorization: `Bearer ${JWT_TOKEN}` } };
    try {
      await axios.delete(`${API_URL}/api/classroom/${classroomId}`, apiConfig);
      setClassrooms(prevClassrooms => prevClassrooms.filter(cls => cls._id !== classroomId));
      setAlertConfig({
        isOpen: true,
        title: "Deleted!",
        message: "Classroom successfully deleted.",
        type: 'alert',
        status: 'success',
      });
    } catch (err) {
      console.error("Error deleting classroom:", err);
      setAlertConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to delete classroom.",
        type: 'alert',
        status: 'warning',
      });
    }
  };

  const handleDeleteQuiz = (quizId) => {
    setAlertConfig({
      isOpen: true,
      title: "Delete Quiz?",
      message: "Are you sure you want to delete this quiz?",
      type: 'confirm',
      status: 'warning',
      onConfirm: () => executeDeleteQuiz(quizId)
    });
  };

  const executeDeleteQuiz = async (quizId) => {
    const JWT_TOKEN = localStorage.getItem('token');
    const apiConfig = { headers: { Authorization: `Bearer ${JWT_TOKEN}` } };
    try {
      await axios.delete(`${API_URL}/api/quiz/${quizId}`, apiConfig);
      setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz._id !== quizId));
      setAlertConfig({
        isOpen: true,
        title: "Deleted!",
        message: "Quiz successfully deleted.",
        type: 'alert',
        status: 'success',
      });
    } catch (err) {
      console.error("Error deleting quiz:", err);
      setAlertConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to delete quiz.",
        type: 'alert',
        status: 'warning',
      });
    }
  };

  const closeAlertModal = () => {
    setAlertConfig({ isOpen: false, title: '', message: '' });
  };
  
  const renderContent = () => {
    if (loading && classrooms.length === 0) {
      return <p className="text-center text-gray-500">Loading your dashboard...</p>;
    }
    if (error && classrooms.length === 0) { 
      return <p className="text-center text-red-500">{error}</p>;
    }
    return (
      <>
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-800">Your classrooms</h2>
            
            {/* --- 🚀🚀 YEH HAI ASLI FIX 🚀🚀 --- */}
            {/* Button ko <Link> mein badal diya */}
            <Link 
              to="/create-classroom"
              className="bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md"
            >
              Create new classroom
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classrooms.length > 0 ? (
              classrooms.map(cls => (
                <ClassroomCard 
                  key={cls._id} 
                  classroom={cls} 
                  onClick={handleClassroomClick}
                  onDelete={handleDeleteClassroom} 
                />
              ))
            ) : (
              !loading && <p>You haven't created any classrooms yet.</p>
            )}
          </div>
        </section>
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-800">Your recent quizzes</h2>
            <Link 
              to="/create-quiz"
              className="bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md"
            >
              Create new quiz
            </Link>
          </div>
          {error && quizzes.length === 0 && <p className="text-center text-red-500 mb-4">{error}</p>}
          <div className="space-y-6">
            {quizzes.length > 0 ? (
                quizzes.map(quiz => (
                  <QuizCard 
                    key={quiz._id} 
                    quiz={quiz} 
                    onDelete={handleDeleteQuiz} 
                  />
                ))
              ) : (
                !loading && !error && <p>You haven't created any quizzes yet.</p>
              )}
          </div>
        </section>
      </>
    );
  };
  
  return (
    <main className="flex-1 p-8 md:p-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Teachers dashboard</h1>
        <p className="text-lg text-gray-600">Welcome back, {userName}</p>
      </div>
      {renderContent()}

      {/* --- CreateClassroomModal HATA DIYA --- */}
      
      <AlertModal 
        isOpen={alertConfig.isOpen}
        onClose={closeAlertModal}
        onConfirm={alertConfig.onConfirm}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        status={alertConfig.status}
      />
    </main>
  );
}

export default TeachersDashboard;