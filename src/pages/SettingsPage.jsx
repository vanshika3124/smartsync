import React, { useState } from 'react';
import { FiBell, FiTrash2 } from 'react-icons/fi';
// No API calls in this file, so 'api.js' is not needed yet.

function SettingsPage() {
  const [quizNotifications, setQuizNotifications] = useState(true);
  const [summaryNotifications, setSummaryNotifications] = useState(false);

  const handleDeleteAccount = () => {
    // --- TODO: This needs an AlertModal and an API call ---
    // (e.g., POST /api/auth/teacher/delete)
    alert("DANGER: Account deletion logic goes here!");
  };

  return (
    <main className="flex-1 p-8 md:p-12 bg-[#E2F1F9]">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
        <p className="text-lg text-gray-600">Manage your account and notification preferences</p>
      </div>

      <div className="max-w-2xl space-y-8">

        {/* Card 1: Notification Settings */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FiBell />
            Notification Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="quizNotifs" className="font-medium text-gray-700">Quiz Submissions</label>
              <input 
                type="checkbox" 
                id="quizNotifs"
                checked={quizNotifications}
                onChange={() => setQuizNotifications(!quizNotifications)}
                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </div>
            <p className="text-sm text-gray-500 -mt-2">Get an email when a student submits a quiz.</p>
            
            <div className="flex items-center justify-between">
              <label htmlFor="summaryNotifs" className="font-medium text-gray-700">Weekly Summary</label>
              <input 
                type="checkbox" 
                id="summaryNotifs"
                checked={summaryNotifications}
                onChange={() => setSummaryNotifications(!summaryNotifications)}
                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </div>
            <p className="text-sm text-gray-500 -mt-2">Receive a weekly performance summary for your classes.</p>
          </div>
        </div>

        {/* Card 2: Danger Zone */}
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
            className="bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md"
          >
            Delete My Account
          </button>
        </div>

      </div>
    </main>
  );
}

export default SettingsPage;