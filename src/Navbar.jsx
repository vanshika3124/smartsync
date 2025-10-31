import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // 1. Auth context import karein

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth(); // 2. State nikaalein
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Auth state ko false karega
    navigate('/'); // Homepage par bhej dega
  };

  // Agar user logged in hai, toh '/login' ki jagah '/dashboard' par jao
  const dashboardLink = isLoggedIn ? "/dashboard" : "/login";
  const classroomLink = isLoggedIn ? "/classroom" : "/login";
  const quizLink = isLoggedIn ? "/quiz" : "/login";
  const faqsLink = isLoggedIn ? "/faqs" : "/login";

  return (
    <nav className="bg-white shadow-md w-full h-16 md:px-12 px-6 relative z-10">
      <div className="flex justify-between items-center max-w-7xl mx-auto h-full">
        
        <Link to="/" className="flex items-center gap-2">
          <img src="/photos/logo.png" alt="SmartSync Logo" className="h-10" />
          <span className="text-2xl font-bold text-gray-800">SmartSync</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to={dashboardLink} className="text-gray-600 font-medium hover:text-blue-600">Dashboard</Link>
          <Link to={classroomLink} className="text-gray-600 font-medium hover:text-blue-600">Classroom</Link>
          <Link to={quizLink} className="text-gray-600 font-medium hover:text-blue-600">Quiz</Link>
          <Link to={faqsLink} className="text-gray-600 font-medium hover:text-blue-600">FAQs</Link>
          
          {/* 3. Login/Logout Button Logic */}
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              className="bg-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 text-2xl focus:outline-none">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} absolute top-full left-0 right-0 bg-white shadow-lg`}>
        {/* (Aap yahan bhi 'isLoggedIn' logic daal sakte hain) */}
      </div>
    </nav>
  );
}

export default Navbar;