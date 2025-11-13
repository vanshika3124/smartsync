import React, { useState, useEffect } from 'react';
import api from '../api'; 
import { FiUser, FiMail, FiLock, FiSave } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom'; 

function ProfilePage() {
  const { user, login } = useAuth(); 
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false); 
  const [loadingPassword, setLoadingPassword] = useState(false); 

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]); 

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');
    setLoadingProfile(true); 
    
    try {
      // --- 🚀 FIX: Extra '/api' prefix hata diya ---
      const response = await api.put('/auth/teacher/profile', {
        name: name,
      });

      const updatedUser = response.data.user; 
      localStorage.setItem('user', JSON.stringify(updatedUser)); 
      
      if (typeof login === 'function') {
        login(updatedUser); 
      }
      
      setMessage('Profile updated successfully!');

    } catch (err) {
      console.error("Error updating profile:", err);
      setErrorMessage(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoadingProfile(false); 
    }
  };

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
      // --- 🚀 FIX: Extra '/api' prefix hata diya ---
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

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8"> 
        
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personal Information</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" id="email"
                  value={email}
                  disabled 
                  readOnly
                  className="w-full p-3 pl-12 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={loadingProfile}
              className="w-full bg-[#1E40AF] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              <FiSave />
              {loadingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Confirm New Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={loadingPassword}
              className="w-full bg-[#1E40AF] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400"
            >
              {loadingPassword ? 'Saving...' : 'Change Password'}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}

export default ProfilePage;