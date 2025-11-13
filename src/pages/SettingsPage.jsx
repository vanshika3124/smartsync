import React, { useState } from 'react';
// --- 🚀 FIX: FiLock (Lock icon) hata diya ---
import { FiTrash2 } from 'react-icons/fi';
import api from '../api'; 
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom'; 
import AlertModal from '../components/AlertModal'; 

function SettingsPage() {
  const [loading, setLoading] = useState(false); 
  // --- 🚀 FIX: Password change ki states aur messages hata diye ---
  const { logout } = useAuth(); 
  const navigate = useNavigate();

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert',
    status: 'success',
    onConfirm: null,
  });

  // --- 🚀 FIX: 'handlePasswordChange' function hata diya ---

  // --- (Delete Account logic unchanged) ---
  const handleDeleteAccount = () => {
    setAlertConfig({
      isOpen: true,
      title: "Delete Account?",
      message: "Are you sure? This action is permanent and cannot be undone.",
      type: 'confirm',
      status: 'warning',
      onConfirm: executeDeleteAccount 
    });
  };

  const executeDeleteAccount = async () => {
    setLoading(true);
    try {
      // (API call abhi bhi commented hai)
      // await api.delete('/api/auth/teacher/delete'); 
      
      alert("Account deleted successfully (API call disabled). Redirecting...");
      
      logout();
      navigate('/');

    } catch (err) {
      console.error("Failed to delete account:", err);
      setLoading(false);
      setAlertConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to delete account. Please try again.",
        type: 'alert',
        status: 'warning'
      });
    }
  };

  const closeAlertModal = () => {
    setAlertConfig({ isOpen: false, title: '', message: '' });
  };
  // --- End of Delete Logic ---

  return (
    <>
      <main className="flex-1 p-8 md:p-12 bg-[#E2F1F9]">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
          <p className="text-lg text-gray-600">Manage your account settings</p>
        </div>

        <div className="max-w-2xl space-y-8">

          {/* --- 🚀 FIX: Card 1 (Change Password) HATA DIYA GAYA HAI --- */}
          
          {/* Card 2: Danger Zone (Ab yeh Card 1 hai) */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-red-500">
            <h2 className="text-2xl font-semibold text-red-600 mb-4 flex items-center gap-2">
              <FiTrash2 />
              Danger Zone
            </h2>
            <p className="text-gray-700 mb-6">
              Deleting your account is permanent and cannot be undone. All your classrooms, quizzes, and student data will be lost.
            </p>
            <button 
              onClick={handleDeleteAccount}
              disabled={loading}
              className="bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md disabled:bg-gray-400"
            >
              {loading ? 'Deleting...' : 'Delete My Account'}
            </button>
          </div>

        </div>
      </main>

      {/* --- (Alert Modal render unchanged) --- */}
      <AlertModal 
        isOpen={alertConfig.isOpen}
        onClose={closeAlertModal}
        onConfirm={alertConfig.onConfirm}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        status={alertConfig.status}
      />
    </>
  );
}

export default SettingsPage;