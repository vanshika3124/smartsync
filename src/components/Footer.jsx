import React from 'react';
import { Link } from 'react-router-dom';
// --- 🚀 ICONS IMPORT KIYE HAIN ---
import { FaLinkedin, FaYoutube, FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

function Footer() {
  return (
    // --- 🚀 FIX 1: Background color, text color, aur padding change kiya ---
    <footer className="w-full bg-[#19225B] text-gray-300 p-8 md:p-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* --- 🚀 FIX 2: COLUMN 1 (Contact, Follow, Logo) --- */}
        <div>
          <h4 className="font-semibold text-white mb-4">Contact us</h4>
          <p className="text-sm">Email : smartsync@help.in</p>
          <p className="text-sm mb-6">Call : 703712XXXXX</p>
          
          <h4 className="font-semibold text-white mb-4">Follow us</h4>
          <div className="flex gap-4 items-center">
            <a href="#" aria-label="LinkedIn" className="hover:text-white transition-colors"><FaLinkedin size={20} /></a>
            <a href="#" aria-label="X" className="hover:text-white transition-colors"><FaXTwitter size={20} /></a>
            <a href="#" aria-label="YouTube" className="hover:text-white transition-colors"><FaYoutube size={20} /></a>
            <a href="#" aria-label="Facebook" className="hover:text-white transition-colors"><FaFacebook size={20} /></a>
            <a href="#" aria-label="Instagram" className="hover:text-white transition-colors"><FaInstagram size={20} /></a>
          </div>

          <hr className="border-gray-700 my-8" />
          
          {/* Logo (Assuming white logo path, change '/photos/logo-white.png' if needed) */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/photos/logo.png" alt="SmartSync Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-white">SmartSync</span>
          </Link>
          <p className="text-sm mt-4">@ SmartSync</p>
        </div>

        {/* --- 🚀 FIX 3: COLUMN 2 (Missing links add kiye) --- */}
        <div>
          <h4 className="font-semibold text-white mb-4">Quick links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/dashboard" className="hover:text-white hover:underline">Teachers dashboard</Link></li>
            <li><Link to="/create-classroom" className="hover:text-white hover:underline">Classroom</Link></li>
            <li><Link to="/create-quiz" className="hover:text-white hover:underline">Create a quiz</Link></li>
            <li><Link to="/faqs" className="hover:text-white hover:underline">Faqs</Link></li>
            <li><Link to="/login" className="hover:text-white hover:underline">Login</Link></li>
            <li><Link to="#" className="hover:text-white hover:underline">Terms and Conditions</Link></li>
            <li><Link to="/register" className="hover:text-white hover:underline">Signup</Link></li>
          </ul>
        </div>

        {/* --- 🚀 FIX 4: COLUMN 3 (Address update kiya image ke hisaab se) --- */}
        <div>
          <h4 className="font-semibold text-white mb-4">Address</h4>
          <p className="text-sm leading-relaxed">
            CIN U74999MH2012PTC237035 <br />
            6th Floor, F-Wing, Lotus Corporate Park, 185/A, <br />
            Graham Firth Compound, Goregaon (E), <br />
            Western Express Highway, Mumbai-400063
          </p>
        </div>
      </div>
      
      {/* --- 🚀 FIX 5: Bottom border/copyright section hata diya --- */}
      {/* (Original centered copyright div deleted) */}
      
    </footer>
  );
}

export default Footer;