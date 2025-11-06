import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-gray-300 p-8 md:p-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="font-semibold mb-4">Contact us</h4>
          <p className="text-sm">Email : smartsync@help.in</p>
          <p className="text-sm">Call : 70372XXXXX</p>
          <div className="flex gap-4 mt-4">
            {/* Social Icons Here */}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Quick links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/dashboard" className="hover:text-white">Teachers dashboard</Link></li>
            <li><Link to="/create-quiz" className="hover:text-white">Create a quiz</Link></li>
            <li><Link to="/faqs" className="hover:text-white">FAQs</Link></li>
            <li><Link to="#" className="hover:text-white">Terms and Conditions</Link></li>
            <li><Link to="/register" className="hover:text-white">Signup</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Address</h4>
          <p className="text-sm">
            C/1, SpringField, Corporate Park, Bandra-Kurla Complex, Bandra (East), Mumbai, 400051
          </p>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
        <p>@ SmartSync</p>
      </div>
    </footer>
  );
}

export default Footer;