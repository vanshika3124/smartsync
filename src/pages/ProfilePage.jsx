import React, { useState, useEffect } from 'react';
import api from '../api'; 
// --- 🚀 FIX: Saare icons import kiye ---
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom'; 

function ProfilePage() {
  const { user } = useAuth(); // 'user' context se liya
  const navigate = useNavigate();

  // --- 🚀 FIX: 'name' aur 'email' ki state (display ke liye) ---
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // State for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false); 

  // Load user details from context
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]); 

  // --- 🚀 FIX: 'handleUpdateProfile' function HATA diya ---

  // --- Password change function (functional) ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');
    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords don't match!");
      return;
    }
    
    setLoadingPassword(true); 

    try {
      // ✅ API Call: Change Password
      await api.post('/auth/teacher/change-password', {
        currentPassword: currentPassword,
        newPassword: newPassword,
      });

      setMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (err) {
      console.error("Error changing password:", err);
      setErrorMessage(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoadingPassword(false); 
    }
  };

  return (
    <main className="flex-1 p-8 md:p-12 bg-[#E2F1F9]">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-lg text-gray-600">Manage your personal information and password</p>
      </div>

      {message && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-6 max-w-7xl mx-auto">{message}</div>}
      {errorMessage && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 max-w-7xl mx-auto">{errorMessage}</div>}

      {/* --- 🚀 FIX: Layout ko 2-column grid banaya (jaisa image mein hai) --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8"> 
        
        {/* --- Card 1: Personal Information (SIRF DIKHANE KE LIYE) --- */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personal Information</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" id="name"
                  value={name} // <-- State se value li
                  readOnly // <-- Read only
                  disabled // <-- Disabled
                  className="w-full p-3 pl-12 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" id="email"
                  value={email} // <-- State se value li
                  disabled 
                  readOnly
                  className="w-full p-3 pl-12 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
            {/* --- 'Save Changes' Button Hata Diya --- */}
          </div>
        </div>
        {/* --- End of Card 1 --- */}

        {/* Card 2: Change Password (Yeh functional hai) */}
         

      </div>
    </main>
  );
}

export default ProfilePage;