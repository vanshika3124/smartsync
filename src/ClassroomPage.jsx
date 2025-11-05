import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiList, FiClock, FiUsers, FiCopy, FiArrowUpRight, FiPlus, FiUpload, FiFileText } from 'react-icons/fi';
import UploadNotesModal from './UploadNotesModal'; // Hum yeh file banayenge

// --- Helper: Quiz Card (Chhota version) ---
const QuizCardSmall = ({ quiz }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200">
    <h3 className="font-semibold text-gray-800">{quiz.title}</h3>
    <span className="text-sm text-gray-500">{quiz.questions?.length || 0} questions</span>
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
  const [error, setError] = useState(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false); // Modal state
  const { classroomId } = useParams();
  const navigate = useNavigate();

  const API_URL = import.meta.env.DEV ? '' : import.meta.env.VITE_BACKEND_URL;
  const JWT_TOKEN = localStorage.getItem('token');
  const apiConfig = { headers: { Authorization: `Bearer ${JWT_TOKEN}` } };

  // --- Data Fetch Logic ---
  const fetchClassroomData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch classroom details (Using 'my' API to find it)
      const classroomRes = await axios.get(`${API_URL}/api/classroom/my`, apiConfig);
      let foundClass;
      if (Array.isArray(classroomRes.data)) {
        foundClass = classroomRes.data.find(c => c._id === classroomId);
      } else if (classroomRes.data && Array.isArray(classroomRes.data.teacher)) {
        foundClass = classroomRes.data.teacher.find(c => c._id === classroomId);
      }
      if (!foundClass) throw new Error("Classroom not found");
      setClassroom(foundClass);

      // 2. Fetch Quizzes for THIS classroom
      const quizRes = await axios.get(`${API_URL}/api/quiz/classroom/${classroomId}`, apiConfig);
      setQuizzes(quizRes.data || []);

      // 3. Fetch Notes for THIS classroom
      const notesRes = await axios.get(`${API_URL}/api/notes/${classroomId}`, apiConfig);
      setNotes(notesRes.data || []);

      setError(null);
    } catch (err) {
      console.error("Error fetching classroom data:", err);
      setError("Data load nahi hua.");
    } finally {
      setLoading(false);
    }
  }, [classroomId, API_URL, JWT_TOKEN]); // Removed apiConfig

  useEffect(() => {
    fetchClassroomData();
  }, [fetchClassroomData]);

  if (loading) return <p className="p-10 text-center">Loading classroom...</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;
  if (!classroom) return <p className="p-10 text-center text-red-500">Classroom not found.</p>;

  return (
    <>
      <main className="flex-1 p-8 md:p-12" style={{ backgroundColor: '#F0F7FF' }}> {/* Light blue background */}
        
        {/* Header (Welcome Msg) */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Teachers dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back, Mrs. Anjali Singh</p>
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

        {/* Performance Section (Static for now) */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Performance based on recent quiz</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Student Performance */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-semibold mb-4">Student Performance Distribution</h3>
              <p className="text-gray-500">(Chart yahan aayega jab performance API banegi)</p>
              {/*  */}
            </div>
            {/* Chart 2: Topic Strength */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-semibold mb-4">Topic Strength Analysis</h3>
              <p className="text-gray-500">(Pie chart yahan aayega jab performance API banegi)</p>
              {/*  */}
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button className="text-green-600 font-semibold py-3 px-6 rounded-lg hover:bg-green-50">
              See full analysis ↗
            </button>
            <Link 
                to={`/create-quiz?classId=${classroom._id}`}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Create new quiz ↗
              </Link>
          </div>
        </section>

        {/* Share Notes Section */}
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
            
            {/* Notes List */}
            <div className="space-y-4 mt-6">
              {notes.length > 0 ? (
                notes.map(note => <NoteItem key={note._id} note={note} />)
              ) : (
                <p className="text-center text-gray-500">Abhi koi notes upload nahi kiye hain.</p>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* Upload Notes Modal */}
      <UploadNotesModal 
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        classroomId={classroomId}
        onNoteUploaded={fetchClassroomData} // Refresh data on success
      />
    </>
  );
}

export default ClassroomPage;