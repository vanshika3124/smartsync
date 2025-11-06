import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FiList, FiClock, FiUsers, FiCopy, FiArrowUpRight, 
  FiUpload, FiFileText, FiTrash, FiAward, FiTrendingUp 
} from 'react-icons/fi';
import UploadNotesModal from '../components/UploadNotesModal'; 
import AlertModal from '../components/AlertModal';

// --- Helper: Quiz Card (Includes alignment and delete fix) ---
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

// --- Helper: Leaderboard Item ---
const LeaderboardItem = ({ student, rank }) => (
  <li className="flex items-center justify-between p-3 border-b">
    <div className="flex items-center gap-3">
      <span className="font-bold text-lg text-gray-700">#{rank + 1}</span>
      <span className="font-medium text-gray-900">{student.name}</span>
    </div>
    <span className="font-semibold text-blue-600">{student.score} pts</span>
  </li>
);


// --- Main Classroom Page Component ---
function ClassroomPage() {
  const [classroom, setClassroom] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [notes, setNotes] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  
  // Loading & Error states
  const [loadingClass, setLoadingClass] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [classError, setClassError] = useState(null);
  const [quizError, setQuizError] = useState(null);
  const [notesError, setNotesError] = useState(null);
  const [leaderboardError, setLeaderboardError] = useState(null);
  
  // Modals & Navigation
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const { classroomId } = useParams();
  const navigate = useNavigate();

  // ML Feature States
  const [predictionStudentId, setPredictionStudentId] = useState('');
  const [predictedScore, setPredictedScore] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState(null);

  const API_URL = import.meta.env.DEV ? '' : import.meta.env.VITE_BACKEND_URL;
  const JWT_TOKEN = localStorage.getItem('token');
  
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert',
    status: 'success',
    onConfirm: null,
  });

  // --- Data Fetching Functions ---

  // 1. Fetch Class Details (runs once)
  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!JWT_TOKEN || JWT_TOKEN === 'undefined' || JWT_TOKEN === 'null') {
        navigate('/login'); 
        return; 
      }
      const apiConfig = { headers: { Authorization: `Bearer ${JWT_TOKEN}` } };
      
      setLoadingClass(true);
      try {
        const classroomRes = await axios.get(`${API_URL}/api/classroom/my`, apiConfig);
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
  }, [classroomId, API_URL, JWT_TOKEN, navigate]);

  // 2. Fetch Quizzes
  const fetchQuizzes = useCallback(async () => {
    if (!JWT_TOKEN) return;
    const apiConfig = { headers: { Authorization: `Bearer ${JWT_TOKEN}` } };
    setLoadingQuizzes(true);
    setQuizError(null);
    try {
      const quizRes = await axios.get(`${API_URL}/api/quiz/classroom/${classroomId}`, apiConfig);
      setQuizzes(quizRes.data || []);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      setQuizError("Failed to load quizzes (API Error)");
    } finally {
      setLoadingQuizzes(false);
    }
  }, [classroomId, API_URL, JWT_TOKEN]);

  // 3. Fetch Notes
  const fetchNotes = useCallback(async () => {
    if (!JWT_TOKEN) return;
    const apiConfig = { headers: { Authorization: `Bearer ${JWT_TOKEN}` } };
    setLoadingNotes(true);
    setNotesError(null);
    try {
      const notesRes = await axios.get(`${API_URL}/api/notes/${classroomId}`, apiConfig);
      setNotes(notesRes.data || []);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setNotesError("Failed to load notes (API Error)");
    } finally {
      setLoadingNotes(false);
    }
  }, [classroomId, API_URL, JWT_TOKEN]);

  // 4. Fetch Smart Leaderboard
  const fetchLeaderboard = useCallback(async () => {
    if (!JWT_TOKEN) return;
    setLoadingLeaderboard(true);
    setLeaderboardError(null);
    try {
      // TODO: Confirm this endpoint and auth method with ML team
      const mlApiUrl = "https://team-task-leaderboard.onrender.com";
      // Assuming it needs a classroomId and token
      const response = await axios.post(`${mlApiUrl}/leaderboard`, 
        { classroomId: classroomId },
        { headers: { Authorization: `Bearer ${JWT_TOKEN}` } } // Or maybe a different auth
      );
      setLeaderboardData(response.data.leaderboard || []);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setLeaderboardError("Failed to load Smart Leaderboard (API Error)");
    } finally {
      setLoadingLeaderboard(false);
    }
  }, [classroomId, JWT_TOKEN]);

  // Load quizzes, notes, and leaderboard once classroom details are fetched
  useEffect(() => {
    if (classroom) {
      fetchQuizzes();
      fetchNotes();
      fetchLeaderboard();
    }
  }, [classroom, fetchQuizzes, fetchNotes, fetchLeaderboard]);

  // --- Action Functions ---

  // Delete Quiz Logic
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
      await axios.delete(`${API_URL}/api/quiz/${quizId}`, apiConfig);
      setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz._id !== quizId));
      setAlertConfig({ isOpen: true, title: "Deleted!", message: "Quiz deleted successfully.", type: 'alert', status: 'success' });
    } catch (err) {
      console.error("Error deleting quiz:", err);
      setAlertConfig({ isOpen: true, title: "Error", message: "Failed to delete quiz.", type: 'alert', status: 'warning' });
    }
  };
  
  // Predict Score Logic
  const handlePredictScore = async (e) => {
    e.preventDefault();
    if (!predictionStudentId) {
      setPredictionError("Please select a student.");
      return;
    }
    setPredictionLoading(true);
    setPredictionError(null);
    setPredictedScore(null);
    
    try {
      // TODO: Confirm this endpoint, body, and auth with ML team
      const mlApiUrl = "https://team-task-future-score.onrender.com";
      // Assuming it's a POST request
      const response = await axios.post(`${mlApiUrl}/predict`, {
        studentId: predictionStudentId,
        classroomId: classroomId 
      });
      
      setPredictedScore(response.data.predictedScore);
    } catch (err) {
      console.error("Error predicting score:", err);
      setPredictionError("Failed to predict score (API Error)");
    } finally {
      setPredictionLoading(false);
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
        
        {/* Classroom Info Card */}
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

        {/* --- ML FEATURE: Future Score Predictor (Interactive) --- */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Future Score Predictor</h2>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FiTrendingUp className="text-blue-500" />
              Predict a Student's Future Score
            </h3>
            
            <form onSubmit={handlePredictScore} className="space-y-4">
              <div>
                <label htmlFor="student-select" className="block text-sm font-medium text-gray-700">Select a student</label>
                <select 
                  id="student-select"
                  value={predictionStudentId}
                  onChange={(e) => setPredictionStudentId(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">-- Select --</option>
                  {/* Assuming classroom.students is an array of objects like { _id, name } */}
                  {classroom.students && classroom.students.map(student => (
                    <option key={student._id} value={student._id}>{student.name}</option>
                  ))}
                </select>
              </div>
              <button 
                type="submit"
                disabled={predictionLoading}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
              >
                {predictionLoading ? "Predicting..." : "Predict Score"}
              </button>
              
              {/* Prediction Result */}
              {predictionLoading && <p className="text-gray-600">Loading prediction...</p>}
              {predictionError && <p className="text-red-500">{predictionError}</p>}
              {predictedScore !== null && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold text-blue-800">Predicted Score: <span className="text-2xl">{predictedScore}%</span></p>
                </div>
              )}
            </form>
          </div>
        </section>

        {/* --- ML FEATURE: Smart Leaderboard (Interactive) --- */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Smart Leaderboard</h2>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
             <div className="flex items-center gap-2 mb-4">
                <FiAward className="text-yellow-500" />
                <h3 className="font-semibold">Classroom Leaderboard</h3>
             </div>
             {loadingLeaderboard && <p>Loading leaderboard...</p>}
             {leaderboardError && <p className="text-red-500">{leaderboardError}</p>}
             {!loadingLeaderboard && !leaderboardError && (
               <ol className="space-y-2">
                 {leaderboardData.length > 0 ? (
                   leaderboardData.map((student, index) => (
                     <LeaderboardItem key={student._id || index} student={student} rank={index} />
                   ))
                 ) : (
                   <p className="text-gray-500">No leaderboard data available yet.</p>
                 )}
               </ol>
             )}
          </div>
        </section>

        {/* Quizzes List */}
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

        {/* Notes List */}
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

      {/* Modals */}
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