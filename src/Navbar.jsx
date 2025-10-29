import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // === YEH LINE BADLI HAI ===
    // Humne 'p-4' (padding) ko 'h-16' (fixed height) se badal diya hai
    <nav className="bg-white shadow-md w-full h-16 md:px-12 px-6 relative">
      
      {/* Humne yahan 'h-full' add kiya hai taaki content bhi poori height le */}
      <div className="flex justify-between items-center max-w-7xl mx-auto h-full">
        
        {/* === LOGO (Image + Text) === */}
        <div className="flex items-center gap-2">
          <img 
            src="/photos/logo.png"
            alt="SmartSync Logo"
            // === AB AAP ISSE BADA KAR SAKTE HAIN ===
            className="h-15" // Ise 'h-12' karke try karein
          />
          <span className="text-2xl font-bold text-blue-800">SmartSync</span>
        </div>

        {/* === DESKTOP NAV LINKS === */}
        <div className="hidden md:flex items-center gap-8">
          {['Dashboard', 'Classroom', 'Quiz', 'FAQs'].map((item) => (
            <a
              href="#"
              key={item}
              className="text-gray-600 font-medium hover:text-blue-600 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* === HAMBURGER ICON === */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-gray-800 text-2xl focus:outline-none"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

      </div>

      {/* === MOBILE MENU (DROPDOWN) === */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} absolute top-full left-0 right-0 bg-white shadow-lg z-20`}>
        <div className="flex flex-col p-4">
          {['Dashboard', 'Classroom', 'Quiz', 'FAQs'].map((item) => (
            <a
              href="#"
              key={item}
              className="text-gray-600 font-medium p-3 hover:bg-gray-100 rounded"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;