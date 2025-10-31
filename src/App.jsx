import React from 'react';
import Navbar from './Navbar';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';
import HomePage from './HomePage';
import TeachersDashboard from './TeachersDashboard'; // 1. Import karein

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="bg-blue-50 min-h-screen flex flex-col">
      <Navbar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        
        {/* 2. Yahan 'div' ko 'TeachersDashboard' se badal dein */}
        <Route path="/dashboard" element={<TeachersDashboard />} /> 
        
        <Route path="/classroom" element={<div>Classroom Page</div>} />
        <Route path="/quiz" element={<div>Quiz Page</div>} />
        <Route path="/faqs" element={<div>FAQs Page</div>} />
      </Routes>
    </div>
  );
}

export default App;