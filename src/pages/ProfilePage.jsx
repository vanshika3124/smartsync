import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiLock, FiSave } from 'react-icons/fi';

function ProfilePage() {
  // User ki details ke liye state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Password change ke liye state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Page load hone par user ki details localStorage se uthao
  // (Maan rahe hain ki login pe 'user' object save kiya tha)
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setName(storedUser.name || '');
        setEmail(storedUser.email || '');
      }
    } catch (e) {
      console.error("User details nahi milin", e);
    }
  }, []);

  // Form Handlers
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');
    // --- TODO: YAHAN PROFILE UPDATE KI API CALL HOGI ---
    // (e.g., PUT /api/auth/teacher/profile)
    console.log("Updating profile:", { name });
    setMessage('Profile updated successfully!');
    // localStorage mein bhi user update karo
    const user = JSON.parse(localStorage.getItem('user'));
    localStorage.setItem('user', JSON.stringify({ ...user, name }));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');
    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords don't match!");
      return;
    }
    // --- TODO: YAHAN PASSWORD CHANGE KI API CALL HOGI ---
    // (e.g., POST /api/auth/teacher/change-password)
    console.log("Changing password...");
    setMessage('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <main className="flex-1 p-8 md:p-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-lg text-gray-600">Manage your personal information and password</p>
      </div>

      {/* Success/Error Messages */}
      {message && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-6">{message}</div>}
      {errorMessage && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">{errorMessage}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card 1: Personal Information */}
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
                  disabled // Email change nahi karne denge
                  className="w-full p-3 pl-12 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <FiSave />
              Save Changes
            </button>
          </form>
        </div>

        {/* Card 2: Change Password */}
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
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors shadow-md"
            >
              Change Password
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}

export default ProfilePage;