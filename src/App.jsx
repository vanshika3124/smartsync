import React from 'react';
import Navbar from './components/Navbar';
import SignUpForm from './pages/SignUpForm';
import LoginForm from './pages/LoginForm';
import HomePage from './pages/HomePage';
import TeachersDashboard from './pages/TeachersDashboard'; 
import FaqPage from './pages/FaqPage'; 
import CreateQuiz from './pages/CreateQuiz'; 
import AddQuestions from './pages/AddQuestions'; 
import ClassroomPage from './pages/ClassroomPage'; 

// --- 1. NAYE IMPORTS ---
import ProtectedLayout from './components/ProtectedLayout'; // Naya layout
import CreateClassroom from './pages/CreateClassroom'; // Naya page
import ProfilePage from './pages/ProfilePage'; // Naya page
import SettingsPage from './pages/SettingsPage'; // Naya page

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    // bg-blue-50 ko layout mein shift kar diya hai
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/faqs" element={<FaqPage />} /> 
        
        {/* --- 2. PROTECTED ROUTES --- */}
        {/* Yeh routes ab ProtectedLayout ke andar hain (taaki sidebar dikhe) */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<TeachersDashboard />} /> 
          <Route path="/classroom/:classroomId" element={<ClassroomPage />} />
          <Route path="/create-classroom" element={<CreateClassroom />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Quiz routes ko bhi yahan daal sakte ho agar unhe sidebar chahiye */}
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/quiz/:quizId/add-questions" element={<AddQuestions />} />
          <Route path="/quiz/:id/analysis" element={<div>Quiz Analysis Page</div>} />
        </Route>
        
        {/* Baaki routes */}
        {/* ... */}
      </Routes>
    </div>
  );
}

export default App;