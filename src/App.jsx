import React from 'react';
import Navbar from './Navbar';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';
import HomePage from './HomePage';
import TeachersDashboard from './TeachersDashboard'; 
import FaqPage from './FaqPage'; 
import CreateQuiz from './CreateQuiz'; 
import AddQuestions from './AddQuestions'; 

// --- 1. NAYA PAGE IMPORT KARO ---
import ClassroomPage from './ClassroomPage'; 

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="bg-blue-50 min-h-screen flex flex-col">
      <Navbar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/faqs" element={<FaqPage />} /> 
        
        <Route path="/dashboard" element={<TeachersDashboard />} /> 
        
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/quiz/:quizId/add-questions" element={<AddQuestions />} />
        
        {/* --- 2. YEH NAYI LINE ADD KARO --- */}
        <Route path="/classroom/:classroomId" element={<ClassroomPage />} />
        
        <Route path="/quiz/:id/analysis" element={<div>Quiz Analysis Page</div>} />
        <Route path="/classroom/:id/upload-notes" element={<div>Upload Notes Page</div>} />

      </Routes>
    </div>
  );
}

export default App;