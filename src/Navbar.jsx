import React, { useState, useEffect } from 'react';
// --- 1. useLocation IMPORT KARO ---
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 
import { FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // --- 2. 'isLoggedIn' ko useAuth se nikaalna BAND KARO ---
  // Sirf 'logout' function nikaalo
  const { logout } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation(); // <-- Active link ke liye

  // --- 3. YEH HAI ASLI FIX ---
  // 'isLoggedIn' ko state se nahi, seedha localStorage se check karo
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // --- 4. YEH CHECK KAREGA KI TOKEN CHANGE HUA YA NAHI ---
  // Jab aap login/logout karte ho, yeh navbar ko update karega
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    
    // Event listener add karo taaki login/logout pe update ho
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    logout(); // Context se state false karega
    localStorage.removeItem('token'); // <-- LocalStorage se token hatana ZAROORI hai
    setIsLoggedIn(false); // State ko manually update karo
    navigate('/'); 
    setIsOpen(false);
  };

  const dashboardLink = isLoggedIn ? "/dashboard" : "/login";
  const classroomLink = isLoggedIn ? "/classroom" : "/login";
  const quizLink = isLoggedIn ? "/quiz" : "/login";
  const faqsLink = "/faqs";

  // --- 5. ACTIVE LINK FIX ---
  // 'useLocation' se check karo
  const isDashboardActive = location.pathname.startsWith('/dashboard');

  return (
    <nav className="w-full bg-white shadow-sm py-4 px-6 md:px-12 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
        
        <Link to="/" className="flex items-center gap-2">
          <img src="/photos/logo.png" alt="SmartSync Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold text-gray-800">SmartSync</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to={dashboardLink} 
            className={`font-medium ${isDashboardActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
          >
            Dashboard
          </Link>
          <Link to={classroomLink} className="text-gray-700 font-medium hover:text-blue-600">Classroom</Link>
          <Link to={quizLink} className="text-gray-700 font-medium hover:text-blue-600">Quiz</Link>
          <Link to={faqsLink} className="text-gray-700 font-medium hover:text-blue-600">FAQs</Link>
          
          {/* Ab yeh 'isLoggedIn' state bilkul sahi kaam karega */}
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
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

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 text-2xl focus:outline-none">
            {isOpen ? 
              <FaTimes className="w-6 h-6" /> : 
              <FaBars className="w-6 h-6" />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden md:hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="pt-4 pb-6 border-t border-gray-100 flex flex-col items-start gap-4">
          <Link to={dashboardLink} className="font-medium text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link to={classroomLink} className="font-medium text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Classroom</Link>
          <Link to={quizLink} className="font-medium text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Quiz</Link>
          <Link to={faqsLink} className="font-medium text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>FAQs</Link>
          
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