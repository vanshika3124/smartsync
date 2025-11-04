import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// --- Helper Components (Sidebar aur Cards) ---

// 1. Dashboard ka Sidebar
const DashboardSidebar = () => {
  const [isClassroomOpen, setIsClassroomOpen] = useState(true);
  const [isQuizzesOpen, setIsQuizzesOpen] = useState(true);

  return (
    <aside className="w-64 bg-white min-h-screen p-6 shadow-md hidden md:block">
      <nav className="space-y-4">
        {/* Home */}
        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium bg-blue-50 text-blue-600">
          <img src="/icons/home.png" alt="" className="w-5 h-5" />
          <span>Home</span>
        </Link>
        
        {/* Classroom Section */}
        <div>
          <button 
            onClick={() => setIsClassroomOpen(!isClassroomOpen)}
            className="flex items-center justify-between w-full gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium"
          >
            <div className="flex items-center gap-3">
              <img src="/icons/classroom.png" alt="" className="w-5 h-5" />
              <span>Classroom</span>
            </div>
            <img src="/icons/chevron-down.png" alt="" className={`w-4 h-4 transition-transform ${isClassroomOpen ? 'rotate-180' : ''}`} />
          </button>
          {isClassroomOpen && (
            <div className="pl-8 pt-2 space-y-2">
              <Link to="#" className="flex items-center gap-3 px-4 py-2 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-sm">
                <img src="/icons/plus-circle-dashed.png" alt="" className="w-5 h-5" />
                <span>Create a classroom</span>
              </Link>
            </div>
          )}
        </div>

        {/* Quizzes Section */}
        <div>
          <button 
            onClick={() => setIsQuizzesOpen(!isQuizzesOpen)}
            className="flex items-center justify-between w-full gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium"
          >
            <div className="flex items-center gap-3">
              <img src="/icons/quiz.png" alt="" className="w-5 h-5" />
              <span>Quizzes</span>
            </div>
            <img src="/icons/chevron-down.png" alt="" className={`w-4 h-4 transition-transform ${isQuizzesOpen ? 'rotate-180' : ''}`} />
          </button>
          {isQuizzesOpen && (
            <div className="pl-8 pt-2 space-y-2">
              <Link to="#" className="flex items-center gap-3 px-4 py-2 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-sm">
                <img src="/icons/plus-circle-dashed.png" alt="" className="w-5 h-5" />
                <span>Create a quiz</span>
              </Link>
              <Link to="#" className="block px-4 py-2 text-gray-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-sm ml-4">Class 1</Link>
              <Link to="#" className="block px-4 py-2 text-gray-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-sm ml-4">Class 2</Link>
              <Link to="#" className="block px-4 py-2 text-gray-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-sm ml-4">Class 3</Link>
            </div>
          )}
        </div>
        
        {/* Profile */}
        <Link to="#" className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium">
          <img src="/icons/profile.png" alt="" className="w-5 h-5" />
          <span>Profile</span>
        </Link>
        
        {/* Settings */}
        <Link to="#" className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium">
          <img src="/icons/settings.png" alt="" className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </nav>
    </aside>
  );
};

// 2. Classroom Card
const ClassroomCard = ({ title, id, students }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
    <h3 className="font-bold text-xl text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500 mb-4">Id . {id}</p>
    <p className="font-medium text-gray-700">{students} students</p>
  </div>
);

// 3. Quiz Card
const QuizCard = ({ title, id, questions, minutes, participants, code }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
    <div className="flex justify-between items-start mb-4">
      <h3 className="font-bold text-2xl text-gray-900">{title}</h3>
      {id && <span className="text-sm text-gray-400">id.{id}</span>}
    </div>
    <div className="flex items-center gap-6 text-gray-600 text-sm mb-6">
      <span className="flex items-center gap-1.5">
        <img src="/icons/quiz-questions.png" alt="" className="w-4 h-4" />
        {questions} questions
      </span>
      <span className="flex items-center gap-1.5">
        <img src="/icons/quiz-time.png" alt="" className="w-4 h-4" />
        {minutes} minutes
      </span>
      <span className="flex items-center gap-1.5">
        <img src="/icons/quiz-participants.png" alt="" className="w-4 h-4" />
        {participants} participants
      </span>
    </div>
    <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-sm text-green-800 font-medium">Quiz Code</span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-green-900 text-lg">{code}</span>
          <button className="hover:opacity-70">
            <img src="/icons/copy.png" alt="Copy code" className="w-5 h-5" />
          </button>
        </div>
      </div>
      <Link to="#" className="flex items-center gap-1.5 text-blue-600 font-medium hover:underline">
        Check analysis
        <img src="/icons/arrow-up-right.png" alt="" className="w-4 h-4" />
      </Link>
    </div>
  </div>
);


// --- MUKHYA Dashboard Component ---
function Dashboard() {
  return (
    // Note: Navbar component yahan se hata diya hai
    <div className="w-full min-h-screen bg-gray-50 flex">
      
      {/* 1. Left Sidebar */}
      <DashboardSidebar />
      
      {/* 2. Main Content Area */}
      <main className="flex-1 p-8 md:p-12">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Teachers dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back, Mrs. Anjali Singh</p>
        </div>

        {/* Your Classrooms Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-800">Your classrooms</h2>
            <button className="bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-lg">
              Create new classroom
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <ClassroomCard title="Class 1" id="234265" students={24} />
            <ClassroomCard title="Class 2" id="234265" students={33} />
            <ClassroomCard title="Class 3" id="234265" students={28} />
          </div>
        </section>

        {/* Your Recent Quizzes Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-800">Your recent quizzes</h2>
            <button className="bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-lg">
              Create new quiz
            </button>
          </div>
          <div className="space-y-6">
            <QuizCard 
              title="Unit 1 Quiz - Class 1"
              questions={10}
              minutes={3}
              participants={30}
              code="DLB3112"
            />
            <QuizCard 
              title="Unit 3 Quiz - Class 2"
              id="608785"
              questions={10}
              minutes={15}
              participants={30}
              code="DOJ7037"
            />
          </div>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;