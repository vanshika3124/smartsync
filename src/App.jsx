import React from 'react';
import Navbar from './Navbar';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';
import CreateClassroom from './CreateClassroomModal'; // Path check kar lena
import HomePage from './HomePage';
import TeachersDashboard from './TeachersDashboard'; 
import FaqPage from './FaqPage'; 

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="bg-blue-50 min-h-screen flex flex-col">
      <Navbar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/faqs" element={<FaqPage />} /> {/* <-- YEH SAHI HAI */}
        
        <Route path="/dashboard" element={<TeachersDashboard />} /> 
        <Route path="/create-classroom" element={<CreateClassroom />} />
        
        {/* Yeh placeholder routes hain, inko baad mein bana lena */}
        <Route path="/classroom" element={<div>Classroom Page</div>} /> 
        <Route path="/quiz" element={<div>Quiz Page</div>} />
        
        {/* <-- DUPlicate /faqs route maine hata diya hai --> */}
      </Routes>
    </div>
  );
}

export default App;