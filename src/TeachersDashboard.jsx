import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import axios from 'axios';
import TeachersSidebar from './TeachersSidebar'; 
import CreateClassroomModal from './CreateClassroomModal'; 
import { 
  FiList, 
  FiClock, 
  FiUsers, 
  FiCopy, 
  FiArrowUpRight,
  FiTrash // <-- DELETE ICON IMPORT
} from 'react-icons/fi';

// --- Helper Component 1: Classroom Card (Updated) ---
const ClassroomCard = ({ classroom, onClick, onDelete }) => (
  <div 
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all relative" // <-- 'relative' add kiya
    onClick={() => onClick(classroom._id)} 
  >
    {/* --- DELETE BUTTON ADDED --- */}
    <button
      onClick={(e) => {
        e.stopPropagation(); // Card pe click hone se roko
        onDelete(classroom._id); // Delete function call karo
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

// --- Helper Component 2: Quiz Card (No Change) ---
const QuizCard = ({ quiz }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-start mb-4">
      <h3 className="font-bold text-2xl text-gray-900">{quiz.title}</h3>
      {quiz.id && <span className="text-sm text-gray-400">id.{quiz.id}</span>}
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); 

  // --- Data Fetch Logic (No Change) ---
  const fetchDashboardData = useCallback(async () => {
    const JWT_TOKEN = localStorage.getItem('token'); 
    if (!JWT_TOKEN || JWT_TOKEN === 'undefined' || JWT_TOKEN === 'null') {
      setError("Aap logged in nahi hain. Please login.");
      setLoading(false);
      navigate('/login'); 
      return; 
    }
    const apiConfig = { headers: { Authorization: `Bearer ${JWT_TOKEN}` } };
    setLoading(true);
    try {
      const classroomRes = await axios.get('/api/classroom/my', apiConfig);
      let fetchedClassrooms = [];
      if (Array.isArray(classroomRes.data)) {
        fetchedClassrooms = classroomRes.data;
      } else if (classroomRes.data && Array.isArray(classroomRes.data.teacher)) {
        fetchedClassrooms = classroomRes.data.teacher; 
      } else {
        console.error("Unexpected API response for classrooms:", classroomRes.data);
        setError("API se classroom data format galat mila.");
        setClassrooms([]);
      }
      setClassrooms(fetchedClassrooms);
      if (fetchedClassrooms.length > 0) {
        const firstClassroomId = fetchedClassrooms[0]._id;
        const quizRes = await axios.get(`/api/quiz/classroom/${firstClassroomId}`, apiConfig);
        if (Array.isArray(quizRes.data)) {
          setQuizzes(quizRes.data); 
        } else { setQuizzes([]); }
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Dashboard data load nahi hua. Token invalid ho sakta hai.");
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token'); 
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]); 

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // --- Classroom Click (No Change) ---
  const handleClassroomClick = (classroomId) => {
    navigate(`/classroom/${classroomId}`);
  };

  // --- 🚀🚀 DELETE CLASSROOM FUNCTION ADDED 🚀🚀 ---
  const handleDeleteClassroom = async (classroomId) => {
    // Pehle confirm karo
    if (!window.confirm("Pakka delete karna hai? Is classroom ka saara data (quiz, notes) delete ho jaayega.")) {
      return;
    }

    const JWT_TOKEN = localStorage.getItem('token');
    const apiConfig = { headers: { Authorization: `Bearer ${JWT_TOKEN}` } };

    try {
      // YEH API BACKEND MEIN HONI CHAHIYE
      await axios.delete(`/api/classroom/${classroomId}`, apiConfig);
      
      // List se refresh karo (bina page reload kiye)
      setClassrooms(prevClassrooms => prevClassrooms.filter(cls => cls._id !== classroomId));
      alert("Classroom successfully delete ho gayi.");

    } catch (err) {
      console.error("Error deleting classroom:", err);
      alert("Error: Classroom delete nahi hui. Backend API check karo.");
    }
  };

  // --- Render Content Logic ---
  const renderContent = () => {
    if (loading && classrooms.length === 0) {
      return <p className="text-center text-gray-500">Aapka dashboard load ho raha hai...</p>;
    }
    if (error) {
      return <p className="text-center text-red-500">{error}</p>;
    }
    return (
      <>
        {/* Your Classrooms Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-800">Your classrooms</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md"
            >
              Create new classroom
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classrooms.length > 0 ? (
              classrooms.map(cls => (
                <ClassroomCard 
                  key={cls._id} 
                  classroom={cls} 
                  onClick={handleClassroomClick}
                  onDelete={handleDeleteClassroom} // <-- Prop pass kiya
                />
              ))
            ) : (
              !loading && <p>Aapne koi classroom nahi banayi hai.</p>
            )}
          </div>
        </section>

        {/* Your Recent Quizzes Section (No Change) */}
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
          <div className="space-y-6">
            {quizzes.length > 0 ? (
                quizzes.map(quiz => (
                  <QuizCard key={quiz._id} quiz={quiz} />
                ))
              ) : (
                !loading && <p>Aapne abhi koi quiz nahi banaya hai.</p>
              )}
          </div>
        </section>
      </>
    );
  };

  // --- Main Return (No Change) ---
  return (
    <div className="w-full min-h-screen bg-gray-50 flex">
      <TeachersSidebar />
      <main className="flex-1 p-8 md:p-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Teachers dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back, Mrs. Anjali Singh</p>
        </div>
        {renderContent()}
      </main>
      <CreateClassroomModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClassroomCreated={fetchDashboardData} 
      />
    </div>
  );
}

export default TeachersDashboard;