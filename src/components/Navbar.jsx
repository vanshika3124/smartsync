import React, { useState, useEffect } from 'react'; // <-- useEffect add kiya
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import api from '../api'; // <-- 🚀 API IMPORT KIYA
import { FaBars, FaTimes } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi'; // <-- Dropdown icon

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation(); 

  // --- 🚀 NAYI STATE DROPDOWNS KE LIYE ---
  const [classrooms, setClassrooms] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showQuizDropdown, setShowQuizDropdown] = useState(false);
  // --- End of New State ---

  // --- 🚀 NAYA DATA FETCHING LOGIC ---
  useEffect(() => {
    // Sirf tab fetch karo jab user logged in ho
    if (isLoggedIn) {
      const fetchData = async () => {
        // 1. Classrooms fetch karo
        try {
          const classRes = await api.get('/api/classroom/my');
          if (classRes.data && Array.isArray(classRes.data.teacher)) {
            setClassrooms(classRes.data.teacher);
          } else if (Array.isArray(classRes.data)) {
            setClassrooms(classRes.data);
          }
        } catch (err) {
          console.error("Failed to fetch classrooms for navbar", err);
        }
        
        // 2. Quizzes fetch karo
        try {
          const quizRes = await api.get('/api/quiz/my-recent'); // Aapne bataya tha yeh route hai
          if (quizRes.data && Array.isArray(quizRes.data.quizzes)) {
            setQuizzes(quizRes.data.quizzes);
          }
        } catch (err) {
          console.error("Failed to fetch quizzes for navbar", err);
        }
      };
      fetchData();
    }
  }, [isLoggedIn]); // Jab bhi isLoggedIn state change ho, yeh dobara run hoga
  // --- End of Data Fetching ---

  const handleLogout = () => {
    if (typeof logout === 'function') {
      logout(); 
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user'); 
    navigate('/'); 
    setIsOpen(false);
  };

  const dashboardLink = isLoggedIn ? "/dashboard" : "/login";
  const faqsLink = "/faqs";
  const isDashboardActive = location.pathname.startsWith('/dashboard');
  

  return (
    <nav className="w-full bg-white shadow-sm py-4 px-6 md:px-12 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
        <Link to="/" className="flex items-center gap-2">
          <img src="/photos/logo.png" alt="SmartSync Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold text-[#1E40AF]">SmartSync</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to={dashboardLink} 
            className={`font-medium ${isDashboardActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
          >
            Dashboard
          </Link>
          
          {/* --- 🚀 "CLASSROOM" LINK KO DROPDOWN BANA DIYA --- */}
          {isLoggedIn ? (
            <div className="relative" onMouseLeave={() => setShowClassDropdown(false)}>
              <button 
                onMouseEnter={() => setShowClassDropdown(true)}
                className="font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1"
              >
                Classroom <FiChevronDown size={16} />
              </button>
              {showClassDropdown && (
                <div 
                  onMouseLeave={() => setShowClassDropdown(false)}
                  className="absolute top-full left-0 mt-2 w-60 bg-white rounded-lg shadow-xl border z-50 py-2"
                >
                  {classrooms.length > 0 ? (
                    classrooms.map(cls => (
                      <Link 
                        key={cls._id}
                        to={`/classroom/${cls._id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowClassDropdown(false)}
                      >
                        {cls.name}
                      </Link>
                    ))
                  ) : (
                    <span className="block px-4 py-2 text-sm text-gray-400">No classrooms found</span>
                  )}
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link 
                    to="/create-classroom"
                    className="block px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-100"
                    onClick={() => setShowClassDropdown(false)}
                  >
                    + Create new classroom
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-gray-700 font-medium hover:text-blue-600">Classroom</Link>
          )}
          {/* --- End of Classroom Dropdown --- */}
          

          {/* --- 🚀 "QUIZ" LINK KO DROPDOWN BANA DIYA --- */}
          {isLoggedIn ? (
            <div className="relative" onMouseLeave={() => setShowQuizDropdown(false)}>
              <button 
                onMouseEnter={() => setShowQuizDropdown(true)}
                className="font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1"
              >
                Quiz <FiChevronDown size={16} />
              </button>
              {showQuizDropdown && (
                <div 
                  onMouseLeave={() => setShowQuizDropdown(false)}
                  className="absolute top-full left-0 mt-2 w-60 bg-white rounded-lg shadow-xl border z-50 py-2"
                >
                  {quizzes.length > 0 ? (
                    quizzes.map(quiz => (
                      <Link 
                        key={quiz._id}
                        to={`/quiz/${quiz._id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 truncate"
                        onClick={() => setShowQuizDropdown(false)}
                      >
                        {quiz.title}
                      </Link>
                    ))
                  ) : (
                    <span className="block px-4 py-2 text-sm text-gray-400">No recent quizzes</span>
                  )}
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link 
                    to="/create-quiz"
                    className="block px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-100"
                    onClick={() => setShowQuizDropdown(false)}
                  >
                    + Create new quiz
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-gray-700 font-medium hover:text-blue-600">Quiz</Link>
          )}
          {/* --- End of Quiz Dropdown --- */}

          <Link to={faqsLink} className="text-gray-700 font-medium hover:text-blue-600">FAQs</Link>
          
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="bg-emerald-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-teal-600 transition-colors shadow-md text-sm"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              className="bg-emerald-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-teal-600 transition-colors shadow-md text-sm"
            >
              Login
            </Link>
          )}
        </div>
        
        {/* Mobile Menu Button (waisa hi hai) */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 text-2xl focus:outline-none">
            {isOpen ? 
              <FaTimes className="w-6 h-6" /> : 
              <FaBars className="w-6 h-6" />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu (waisa hi hai, dropdowns yahan nahi daale) */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden md:hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="pt-4 pb-6 border-t border-gray-100 flex flex-col items-start gap-4">
          <Link to={dashboardLink} className="font-medium text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link to="/create-classroom" className="font-medium text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Classroom</Link>
          <Link to="/create-quiz" className="font-medium text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Quiz</Link>
          <Link to={faqsLink} className="font-medium text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>FAQs</Link>
          
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="w-full bg-emerald-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-teal-600 transition-colors shadow-md text-sm"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setIsOpen(false)}
              className="w-full text-center bg-emerald-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-teal-600 transition-colors shadow-md text-sm"
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