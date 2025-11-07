import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import api from '../api'; // <-- 1. IMPORT 'api' INSTEAD OF 'axios'
import { 
  FiHome, 
  FiChevronDown, 
  FiPlusCircle, 
  FiFileText, 
  FiUser, 
  FiSettings 
} from 'react-icons/fi';
import { HiOutlineBookOpen } from 'react-icons/hi'; 

function TeachersSidebar() {
  const [isClassroomOpen, setIsClassroomOpen] = useState(true);
  const [isQuizzesOpen, setIsQuizzesOpen] = useState(true);
  
  const [classrooms, setClassrooms] = useState([]);
  
  // --- 2. REMOVED API_URL, JWT_TOKEN, and apiConfig ---

  useEffect(() => {
    const fetchClassrooms = async () => {
      // --- 3. Check for 'accessToken' ---
      const token = localStorage.getItem('accessToken');
      if (!token) return; // Don't fetch if not logged in
      
      try {
        // --- 4. Use 'api.get' and remove config ---
        const response = await api.get('/api/classroom/my');
        let fetchedClassrooms = [];
        if (Array.isArray(response.data)) {
          fetchedClassrooms = response.data;
        } else if (response.data && Array.isArray(response.data.teacher)) {
          fetchedClassrooms = response.data.teacher; 
        }
        setClassrooms(fetchedClassrooms);
      } catch (err) {
        console.error("Sidebar classroom fetch error:", err);
      }
    };
    fetchClassrooms();
  }, []); // <-- 5. Dependency array is now empty

  // Helper 'NavLink'
  const getLinkClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium ${
      isActive ? 'bg-blue-50 text-blue-600' : ''
    }`;
    
  // NavLink (submenu) ke liye helper
  const getSubLinkClass = ({ isActive }) => 
    `block px-4 py-2 text-gray-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-sm ml-4 ${
      isActive ? 'bg-blue-50 text-blue-600' : ''
    }`;

  return (
    <aside className="w-64 bg-white min-h-screen p-6 shadow-md hidden md:block border-r border-gray-100">
      <nav className="space-y-4">
        
        {/* Home */}
        <NavLink to="/dashboard" className={getLinkClass}>
          <FiHome className="w-5 h-5" />
          <span>Home</span>
        </NavLink>
        
        {/* Classroom Section */}
        <div>
          <button 
            onClick={() => setIsClassroomOpen(!isClassroomOpen)}
            className="flex items-center justify-between w-full gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium"
          >
            <div className="flex items-center gap-3">
              <HiOutlineBookOpen className="w-5 h-5" />
              <span>Classroom</span>
            </div>
            <FiChevronDown className={`w-4 h-4 transition-transform ${isClassroomOpen ? 'rotate-180' : ''}`} />
          </button>
          {isClassroomOpen && (
            <div className="pl-8 pt-2 space-y-2">
              <Link to="/create-classroom" className="flex items-center gap-3 px-4 py-2 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-sm">
                <FiPlusCircle className="w-5 h-5" />
                <span>Create a classroom</span>
              </Link>
              
              {/* DYNAMIC CLASSROOM LIST */}
              {classrooms.map(cls => (
                <NavLink 
                  key={cls._id} 
                  to={`/classroom/${cls._id}`} 
                  className={getSubLinkClass}
                >
                  {cls.name}
                </NavLink>
              ))}
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
              <FiFileText className="w-5 h-5" />
              <span>Quizzes</span>
            </div>
            <FiChevronDown className={`w-4 h-4 transition-transform ${isQuizzesOpen ? 'rotate-180' : ''}`} />
          </button>
          {isQuizzesOpen && (
            <div className="pl-8 pt-2 space-y-2">
              <Link to="/create-quiz" className="flex items-center gap-3 px-4 py-2 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-sm">
                <FiPlusCircle className="w-5 h-5" />
                <span>Create a quiz</span>
              </Link>
            </div>
          )}
        </div>
        
        {/* Profile */}
        <NavLink to="/profile" className={getLinkClass}>
          <FiUser className="w-5 h-5" />
          <span>Profile</span>
        </NavLink>
        
        {/* Settings */}
        <NavLink to="/settings" className={getLinkClass}>
          <FiSettings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default TeachersSidebar;