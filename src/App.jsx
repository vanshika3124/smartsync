import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // <-- 1. IMPORT FOOTER
import SignUpForm from './pages/SignUpForm';
import LoginForm from './pages/LoginForm';
import HomePage from './pages/HomePage';
import TeachersDashboard from './pages/TeachersDashboard'; 
import FaqPage from './pages/FaqPage'; 
import CreateQuiz from './pages/CreateQuiz'; 
import AddQuestions from './pages/AddQuestions'; 
import ClassroomPage from './pages/ClassroomPage'; 
import ProtectedLayout from './components/ProtectedLayout';
import CreateClassroom from './pages/CreateClassroom';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import QuizAnalysisPage from './pages/QuizAnalysisPage'; 

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* 2. Add flex-1 to the main content area */}
      {/* This makes the content area fill the space, pushing the footer down */}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/faqs" element={<FaqPage />} /> 
          
          {/* Protected Routes (with Sidebar) */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<TeachersDashboard />} /> 
            <Route path="/classroom/:classroomId" element={<ClassroomPage />} />
            <Route path="/create-classroom" element={<CreateClassroom />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            
            <Route path="/create-quiz" element={<CreateQuiz />} />
            <Route path="/quiz/:quizId/add-questions" element={<AddQuestions />} />
            <Route path="/quiz/:quizId/analysis" element={<QuizAnalysisPage />} />
          </Route>
          
        </Routes>
      </main>
      
      <Footer /> {/* <-- 3. ADD FOOTER HERE, outside the main content */}
    </div>
  );
}

export default App;