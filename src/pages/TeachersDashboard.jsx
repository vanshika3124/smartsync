import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import api from '../api'; 
import AlertModal from '../components/AlertModal';
import { 
  FiArrowUpRight,
  FiTrash,
  FiBook, // Classroom icon
  FiEdit  // Edit icon
} from 'react-icons/fi';

// --- (ClassroomCard is unchanged) ---
const ClassroomCard = ({ classroom, onClick, onDelete }) => (
  <div 
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-300 cursor-pointer hover:shadow-md transition-all relative"
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

// --- 🚀🚀 YEH HAI AAPKA NAYA QUIZCARD (Design v3) 🚀🚀 ---
const QuizCard = ({ quiz, onDelete }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-200 relative">
    
    {/* Delete Button (same) */}
    <div className="absolute top-6 right-6 flex items-center gap-2">
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
    
    {/* Title */}
    <h3 className="font-bold text-2xl text-gray-900 pr-10">
      {quiz.title}
    </h3>
    
    {/* Classroom Name (small, under title) */}
    <span className="flex items-center gap-1.5 font-medium text-gray-500 text-sm mt-2 mb-6">
      <FiBook className="w-4 h-4" />
      {quiz.classroom?.name || 'No Classroom'} 
    </span>

    {/* Footer Bar with Links */}
    <div className="bg-emerald-50 p-4 rounded-lg flex items-center justify-between mt-4">
      
      {/* "VIEW / EDIT" LINK */}
      <Link 
        to={`/quiz/${quiz._id}`} 
        className="flex items-center gap-1.5 text-gray-700 font-semibold hover:text-blue-600"
      >
        <FiEdit className="w-4 h-4" /> 
        View / Edit
      </Link>
      
      {/* "CHECK ANALYSIS" LINK */}
      <Link 
        to={`/quiz/${quiz._id}/analysis`} 
        className="flex items-center gap-1.5 text-blue-600 font-semibold hover:underline"
      >
        Check analysis 
        <FiArrowUpRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
);
// --- End of Fix ---


// --- 🚀 NAYA SKELETON CARD (Design v3) 🚀 ---
const SkeletonClassroomCard = () => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
  </div>
);
const SkeletonQuizCard = () => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>
    <div className="h-5 bg-gray-200 rounded w-1/3 mb-6"></div>
    <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between h-14">
        <div className="h-5 bg-gray-200 rounded-lg w-28"></div>
        <div className="h-5 bg-gray-200 rounded-lg w-32"></div>
    </div>
  </div>
);
// --- End of Skeletons ---


// --- MUKHYA Dashboard Component ---
function TeachersDashboard() {
  const [classrooms, setClassrooms] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate(); 
  
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

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const classroomRes = await api.get('/api/classroom/my');
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
      setLoading(false);
      return;
    }

    try {
      const quizRes = await api.get('/api/quiz/my-recent');
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
  }, [navigate]); 

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleClassroomClick = (classroomId) => {
    navigate(`/classroom/${classroomId}`);
  };

  // --- (Baaki ka code delete logic etc. same hai) ---
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
    try {
      await api.delete(`/api/classroom/${classroomId}`);
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
    try {
      await api.delete(`/api/quiz/${quizId}`);
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
    if (loading) {
      return (
        <>
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-gray-800">Your classrooms</h2>
              <div className="bg-gray-200 h-12 w-48 rounded-lg animate-pulse"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonClassroomCard />
              <SkeletonClassroomCard />
              <SkeletonClassroomCard />
            </div>
          </section>
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-gray-800">Your recent quizzes</h2>
              <div className="bg-gray-200 h-12 w-44 rounded-lg animate-pulse"></div>
            </div>
            <div className="space-y-6">
              <SkeletonQuizCard />
              <SkeletonQuizCard />
            </div>
          </section>
        </>
      );
    }
    
    if (error && classrooms.length === 0) { 
      return <p className="text-center text-red-500">{error}</p>;
    }

    return (
      <>
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-800">Your classrooms</h2>
            <Link 
              to="/create-classroom"
              className="bg-[#1E40AF] text-white px-5 py-3 rounded-full font-medium hover:bg-blue-800 shadow-md"
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
                className="bg-[#1E40AF] text-white px-5 py-3 rounded-full font-medium hover:bg-blue-800 shadow-md"
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
    <main className="flex-1 p-8 md:p-12 bg-[#E2F1F9]">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Teachers dashboard</h1>
        <p className="text-lg text-gray-600">Welcome back, {userName}</p>
      </div>
      {renderContent()}
      
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