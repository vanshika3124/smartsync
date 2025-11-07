import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { 
  FiList, FiClock, FiUsers, FiCopy, FiArrowUpRight, 
  FiUpload, FiFileText, FiTrash, FiAward, FiBarChart2, FiPieChart, 
  FiTrendingUp // <-- 1. ICON YAHAN ADD KAR DIYA
} from 'react-icons/fi';
import UploadNotesModal from '../components/UploadNotesModal'; 
import AlertModal from '../components/AlertModal';

// --- (QuizCard and NoteItem helper components are unchanged) ---
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
const NoteItem = ({ note }) => (
  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
    <div className="flex items-center gap-4">
      <FiFileText className="text-red-500 w-6 h-6" />
      <span className="font-medium text-gray-700">{note.title}</span>
    </div>
    <span className="text-sm text-gray-500">{new Date(note.createdAt).toLocaleDateString()}</span>
  </div>
);


// --- Main Classroom Page Component ---
function ClassroomPage() {
  const [classroom, setClassroom] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loadingClass, setLoadingClass] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [classError, setClassError] = useState(null);
  const [quizError, setQuizError] = useState(null);
  const [notesError, setNotesError] = useState(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const { classroomId } = useParams();
  const navigate = useNavigate();

  const API_URL = import.meta.env.DEV ? '' : import.meta.env.VITE_BACKEND_URL;
  const JWT_TOKEN = localStorage.getItem('accessToken'); // <-- 2. 'accessToken' use kiya
  
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert',
    status: 'success',
    onConfirm: null,
  });

  // 1. Fetch Class Details
  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!JWT_TOKEN) { // Check for token
        navigate('/login'); 
        return; 
      }
      const apiConfig = { headers: { Authorization: `Bearer ${JWT_TOKEN}` } };
      
      setLoadingClass(true);
      try {
        const classroomRes = await api.get('/api/classroom/my'); // Use api
        let foundClass;
        if (Array.isArray(classroomRes.data)) {
          foundClass = classroomRes.data.find(c => c._id === classroomId);
        } else if (classroomRes.data && Array.isArray(classroomRes.data.teacher)) {
          foundClass = classroomRes.data.teacher.find(c => c._id === classroomId);
        }
        if (!foundClass) throw new Error("Classroom not found");
        setClassroom(foundClass);
        setClassError(null);
      } catch (err) {
        console.error("Error fetching classroom details:", err);
        setClassError("Failed to load classroom details.");
      } finally {
        setLoadingClass(false);
      }
    };
    fetchClassDetails();
  }, [classroomId, navigate]); // Removed unstable dependencies

  // 2. Fetch Quizzes (refreshable)
  const fetchQuizzes = useCallback(async () => {
    if (!JWT_TOKEN) return;
    const apiConfig = { headers: { Authorization: `Bearer ${JWT_TOKEN}` } };
    
    setLoadingQuizzes(true);
    setQuizError(null);
    try {
      const quizRes = await api.get(`/api/quiz/classroom/${classroomId}`); // Use api
      if (quizRes.data && Array.isArray(quizRes.data.quizzes)) {
          setQuizzes(quizRes.data.quizzes);
      } else {
          setQuizzes([]);
      }
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      setQuizError("Failed to load quizzes (API Error)");
    } finally {
      setLoadingQuizzes(false);
    }
  }, [classroomId, JWT_TOKEN]); // Added JWT_TOKEN

  // 3. Fetch Notes (refreshable)
  const fetchNotes = useCallback(async () => {
    if (!JWT_TOKEN) return;
    const apiConfig = { headers: { Authorization: `Bearer ${JWT_TOKEN}` } };
    
    setLoadingNotes(true);
    setNotesError(null);
    try {
      const notesRes = await api.get(`/api/notes/${classroomId}`); // Use api
      if (notesRes.data && Array.isArray(notesRes.data.notes)) {
        setNotes(notesRes.data.notes);
      } else {
        setNotes([]);
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
      setNotesError("Failed to load notes (API Error)");
    } finally {
      setLoadingNotes(false);
    }
  }, [classroomId, JWT_TOKEN]); // Added JWT_TOKEN

  // Page load hook
  useEffect(() => {
    if (classroom) {
      fetchQuizzes();
      fetchNotes();
    }
  }, [classroom, fetchQuizzes, fetchNotes]);

  // --- Delete Quiz Logic ---
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
    const apiConfig = { headers: { Authorization: `Bearer ${JWT_TOKEN}` } };
    try {
      await api.delete(`/api/quiz/${quizId}`); // Use api
      setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz._id !== quizId));
      setAlertConfig({ isOpen: true, title: "Deleted!", message: "Quiz deleted successfully.", type: 'alert', status: 'success' });
    } catch (err) {
      console.error("Error deleting quiz:", err);
      setAlertConfig({ isOpen: true, title: "Error", message: "Failed to delete quiz.", type: 'alert', status: 'warning' });
    }
  };
  
  const closeAlertModal = () => {
    setAlertConfig({ isOpen: false, title: '', message: '' });
  };

  // --- Render Logic ---
  if (loadingClass) return <p className="p-10 text-center">Loading classroom...</p>;
  if (classError) return <p className="p-10 text-center text-red-500">{classError}</p>;
  if (!classroom) return <p className="p-10 text-center text-red-500">Classroom not found.</p>;

  return (
    <>
      <main className="flex-1 p-8 md:p-12" style={{ backgroundColor: '#F0F7FF' }}>
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Teachers dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back, {JSON.parse(localStorage.getItem('user'))?.name || 'Teacher'}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{classroom.name}</h2>
              <p className="text-gray-500">Id. {classroom.code}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="font-medium text-gray-700">{classroom.students?.length || 0} students</span>
                <span className="font-medium text-gray-700">{quizzes.length} quizzes</span>
              </div>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <button 
                onClick={() => setIsNotesModalOpen(true)}
                className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
              >
                + Share notes
              </button>
              <Link 
                to={`/create-quiz?classId=${classroom._id}`}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600"
              >
                Create a quiz
              </Link>
            </div>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Future Score Predictor</h2>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FiTrendingUp className="text-blue-500" /> {/* <-- 3. ICON YAHAN USE HO RAHA HAI */}
              Predict a Student's Future Score
            </h3>
            <p className="text-gray-500 mb-4">(This feature is in progress. API integration needed.)</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Smart Leaderboard</h2>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
             <div className="flex items-center gap-2">
                <FiAward className="text-yellow-500" />
                <h3 className="font-semibold">Leaderboard (Coming Soon)</h3>
             </div>
             <p className="text-gray-500 mt-2">This will show an ML-powered leaderboard...</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Quizzes</h2>
          {loadingQuizzes && <p className="text-gray-500">Loading quizzes...</p>}
          {quizError && <p className="text-red-500">{quizError}</p>}
          <div className="space-y-6">
            {!loadingQuizzes && !quizError && quizzes.length > 0 && (
              quizzes.map(quiz => 
                <QuizCard 
                  key={quiz._id} 
                  quiz={quiz} 
                  onDelete={handleDeleteQuiz} 
                />)
            )}
            {!loadingQuizzes && !quizError && quizzes.length === 0 && (
              <p>No quizzes created for this class yet.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Share notes with {classroom.name}</h2>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <button 
              onClick={() => setIsNotesModalOpen(true)}
              className="border-2 border-dashed border-gray-300 rounded-lg w-full py-10 flex flex-col items-center justify-center hover:bg-gray-50"
            >
              <div className="bg-blue-100 text-blue-600 rounded-full p-3">
                <FiUpload className="w-6 h-6" />
              </div>
              <span className="mt-4 font-semibold text-gray-700">Upload PDF file</span>
            </button>
            {loadingNotes && <p className="text-gray-500 mt-4">Loading notes...</p>}
            {notesError && <p className="text-red-500 mt-4">{notesError}</p>}
            <div className="space-y-4 mt-6">
              {!loadingNotes && !notesError && notes.length > 0 && (
                notes.map(note => <NoteItem key={note._id} note={note} />)
              )}
              {!loadingNotes && !notesError && notes.length === 0 && (
                <p className="text-center text-gray-500">No notes uploaded for this class yet.</p>
              )}
            </div>
          </div>
        </section>
      </main>

      <UploadNotesModal 
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        classroomId={classroomId}
        onNoteUploaded={fetchNotes} 
      />
      <AlertModal 
        isOpen={alertConfig.isOpen}
        onClose={closeAlertModal}
        onConfirm={alertConfig.onConfirm}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        status={alertConfig.status}
      />
    </>
  );
}

export default ClassroomPage;