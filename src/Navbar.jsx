import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // 1. Auth context
import { FaBars, FaTimes } from 'react-icons/fa'; // <-- YAHAN ICONS IMPORT KIYE

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth(); // 2. State nikaalein
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Auth state ko false karega
    navigate('/'); // Homepage par bhej dega
    setIsOpen(false); // Mobile menu band kar dega
  };

  // Agar user logged in hai, toh '/login' ki jagah '/dashboard' par jao
  const dashboardLink = isLoggedIn ? "/dashboard" : "/login";
  const classroomLink = isLoggedIn ? "/classroom" : "/login"; // Inhe bhi update kar sakte ho
  const quizLink = isLoggedIn ? "/quiz" : "/login";
  const faqsLink = "/faqs";

  // Active link style (Dashboard ke liye)
  // Yeh check karega ki hum dashboard par hain ya nahi
  const isDashboardActive = window.location.pathname.includes('/dashboard');

  return (
    <nav className="w-full bg-white shadow-sm py-4 px-6 md:px-12 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
        
        <Link to="/" className="flex items-center gap-2">
          {/* Logo image hai, isse nahi badla */}
          <img src="/photos/logo.png" alt="SmartSync Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold text-gray-800">SmartSync</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to={dashboardLink} 
            // Dashboard active hai toh blue underline dikhayega
            className={`font-medium ${isDashboardActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
          >
            Dashboard
          </Link>
          <Link to={classroomLink} className="text-gray-700 font-medium hover:text-blue-600">Classroom</Link>
          <Link to={quizLink} className="text-gray-700 font-medium hover:text-blue-600">Quiz</Link>
          <Link to={faqsLink} className="text-gray-700 font-medium hover:text-blue-600">FAQs</Link>
          
          {/* 3. Login/Logout Button Logic (STYLED) */}
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              // Logout ka style bhi TEAL rakha hai (screenshot ke hisaab se)
              className="bg-teal-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-teal-600 transition-colors shadow-md text-sm"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              className="bg-teal-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-teal-600 transition-colors shadow-md text-sm"
            >
              Login
            </Link>
          )}
        </div>

        {/* Hamburger Icon (UPDATED) */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 text-2xl focus:outline-none">
            {/* --- YAHAN ICONS USE KIYE --- */}
            {isOpen ? 
              <FaTimes className="w-6 h-6" /> : 
              <FaBars className="w-6 h-6" />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) (UPDATED & COMPLETED) */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden md:hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="pt-4 pb-6 border-t border-gray-100 flex flex-col items-start gap-4">
          <Link to={dashboardLink} className="font-medium text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link to={classroomLink} className="font-medium text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Classroom</Link>
          <Link to={quizLink} className="font-medium text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Quiz</Link>
          <Link to={faqsLink} className="font-medium text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>FAQs</Link>
          
          {/* Mobile Login/Logout Logic */}
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="w-full bg-teal-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-teal-600 transition-colors shadow-md text-sm"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setIsOpen(false)}
              className="w-full text-center bg-teal-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-teal-600 transition-colors shadow-md text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
