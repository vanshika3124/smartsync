import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiList, FiClock, FiUsers, FiCopy, FiArrowUpRight, FiUpload, FiPlus, FiFileText, FiTrash, FiAward, FiBarChart2, FiPieChart } from 'react-icons/fi';
import UploadNotesModal from '../components/UploadNotesModal'; 
import AlertModal from '../components/AlertModal';

// ... (QuizCard aur NoteItem helper components same rahenge) ...
// --- Helper: Quiz Card ---
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
      <h3 className="font-bold text-2xl text-gray-900 pr-20">{quiz.title}</h3>
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
// --- Helper: Note List Item ---
const NoteItem = ({ note }) => (
  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
    <div className="flex items-center gap-4">
      <FiFileText className="text-red-500 w-6 h-6" />
      <span className="font-medium text-gray-700">{note.title}</span>
    </div>
    <span className="text-sm text-gray-500">{new Date(note.createdAt).toLocaleDateString()}</span>
  </div>
);


// --- MUKHYA Classroom Page Component ---
function ClassroomPage() {
  const [classroom, setClassroom] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- 🚀🚀 YEH HAI ASLI FIX (Alag Alag Errors) 🚀🚀 ---
  const [classError, setClassError] = useState(null);
  const [quizError, setQuizError] = useState(null);
  const [notesError, setNotesError] = useState(null);

  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const { classroomId } = useParams();
  const navigate = useNavigate();

  const API_URL = import.meta.env.DEV ? '' : import.meta.env.VITE_BACKEND_URL;
  const JWT_TOKEN = localStorage.getItem('token');
  const apiConfig = { headers: { Authorization: `Bearer ${JWT_TOKEN}` } };

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert',
    status: 'success',
    onConfirm: null,
  });

  // --- Data Fetch Logic (UPDATED) ---
  const fetchClassroomData = useCallback(async () => {
    setLoading(true);
    setClassError(null);
    setQuizError(null);
    setNotesError(null);

    // --- 🚀🚀 FIX: API Calls ko alag-alag try...catch mein daala ---
    try {
      // 1. Fetch classroom details
      const classroomRes = await axios.get(`${API_URL}/api/classroom/my`, apiConfig);
      let foundClass;
      if (Array.isArray(classroomRes.data)) {
        foundClass = classroomRes.data.find(c => c._id === classroomId);
      } else if (classroomRes.data && Array.isArray(classroomRes.data.teacher)) {
        foundClass = classroomRes.data.teacher.find(c => c._id === classroomId);
      }
      if (!foundClass) throw new Error("Classroom not found");
      setClassroom(foundClass);
    } catch (err) {
      console.error("Error fetching classroom details:", err);
      setClassError("Classroom details load nahi huin.");
      setLoading(false); // Agar class hi nahi mili toh stop
      return; 
    }

    try {
      // 2. Fetch Quizzes for THIS classroom
      const quizRes = await axios.get(`${API_URL}/api/quiz/classroom/${classroomId}`, apiConfig);
      setQuizzes(quizRes.data || []);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      setQuizError("Quizzes load nahi hue (API Error)");
    }
    
    try {
      // 3. Fetch Notes for THIS classroom
      const notesRes = await axios.get(`${API_URL}/api/notes/${classroomId}`, apiConfig);
      setNotes(notesRes.data || []);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setNotesError("Notes load nahi hue (API Error)");
    }
    // --- End of Fix ---

    setLoading(false); // Sab kuch try ho gaya
  }, [classroomId, API_URL, JWT_TOKEN]); // Removed apiConfig

  useEffect(() => {
    fetchClassroomData();
  }, [fetchClassroomData]);

  // ... (Delete logic same rahegi) ...
  const handleDeleteQuiz = (quizId) => {
    setAlertConfig({
      isOpen: true,
      title: "Delete Quiz?",
      message: "Pakka yeh quiz delete karna hai?",
      type: 'confirm',
      status: 'warning',
      onConfirm: () => executeDeleteQuiz(quizId)
    });
  };
  const executeDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`${API_URL}/api/quiz/${quizId}`, apiConfig);
      setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz._id !== quizId));
      setAlertConfig({
        isOpen: true,
        title: "Deleted!",
        message: "Quiz successfully delete ho gaya.",
        type: 'alert',
        status: 'success',
      });
    } catch (err) {
      console.error("Error deleting quiz:", err);
      setAlertConfig({
        isOpen: true,
        title: "Error",
        message: "Error: Quiz delete nahi hua.",
        type: 'alert',
        status: 'warning',
      });
    }
  };
  const closeAlertModal = () => {
    setAlertConfig({ isOpen: false, title: '', message: '' });
  };


  // --- Render Logic ---
  if (loading && !classroom) return <p className="p-10 text-center">Loading classroom...</p>;
  if (classError) return <p className="p-10 text-center text-red-500">{classError}</p>;
  if (!classroom) return <p className="p-10 text-center text-red-500">Classroom not found.</p>;

  return (
    <>
      <main className="flex-1 p-8 md:p-12" style={{ backgroundColor: '#F0F7FF' }}>
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Teachers dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back, Mrs. Anjali Singh</p>
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
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Performance based on recent quiz</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><FiBarChart2 /> Student Performance Distribution</h3>
              <p className="text-gray-500">(ML Chart yahan aayega)</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><FiPieChart /> Topic Strength Analysis</h3>
              <p className="text-gray-500">(ML Chart yahan aayega)</p>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button className="text-green-600 font-semibold py-3 px-6 rounded-lg hover:bg-green-50">
              See full analysis ↗
            </button>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Smart Leaderboard</h2>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
             <div className="flex items-center gap-2">
                <FiAward className="text-yellow-500" />
                <h3 className="font-semibold">Leaderboard (Coming Soon)</h3>
             </div>
             <p className="text-gray-500 mt-2">Yahan ML-powered leaderboard dikhega...</p>
          </div>
        </section>

        {/* Quizzes List (UPDATED) */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Quizzes</h2>
          
          {/* --- 🚀🚀 FIX: Quiz ka apna error message --- */}
          {quizError && <p className="text-red-500">{quizError}</p>}
          
          <div className="space-y-6">
            {quizzes.length > 0 ? (
              quizzes.map(quiz => 
                <QuizCard 
                  key={quiz._id} 
                  quiz={quiz} 
                  onDelete={handleDeleteQuiz} 
                />)
            ) : (
              !loading && !quizError && <p>Is classroom mein abhi koi quiz nahi hai.</p>
            )}
          </div>
        </section>

        {/* Notes List (UPDATED) */}
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
              <span className="mt-4 font-semibold text-gray-700">Upload pdf file</span>
            </button>
            
            {/* --- 🚀🚀 FIX: Notes ka apna error message --- */}
            {notesError && <p className="text-red-500 mt-4">{notesError}</p>}

            <div className="space-y-4 mt-6">
              {notes.length > 0 ? (
                notes.map(note => <NoteItem key={note._id} note={note} />)
              ) : (
                !loading && !notesError && <p className="text-center text-gray-500">Abhi koi notes upload nahi kiye hain.</p>
              )}
            </div>
          </div>
        </section>

      </main>

      <UploadNotesModal 
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        classroomId={classroomId}
        onNoteUploaded={fetchClassroomData} 
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