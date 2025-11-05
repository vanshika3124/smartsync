import React from 'react';
import { FiAlertTriangle, FiCheckCircle, FiX } from 'react-icons/fi';

// Props:
// - isOpen: Modal dikhao ya nahi
// - onClose: Close button (ya 'Cancel') pe kya karna hai
// - onConfirm: 'Yes' button pe kya karna hai (delete ke liye)
// - title: Modal ka title (e.g., "Confirm Deletion")
// - message: Modal ka message
// - type: 'alert' (sirf OK button) ya 'confirm' (Yes/No button)
// - status: 'success' (green icon) ya 'warning' (red icon)

function AlertModal({ isOpen, onClose, onConfirm, title, message, type = 'alert', status = 'success' }) {
  if (!isOpen) {
    return null;
  }

  const Icon = status === 'success' ? FiCheckCircle : FiAlertTriangle;
  const iconColor = status === 'success' ? 'text-green-500' : 'text-red-500';

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      {/* Modal Box */}
      <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full z-50 p-6 relative">
        {/* Close Button 'X' */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
            <FiX size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className={`text-5xl mb-4 ${iconColor}`}>
            <Icon />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          
          {/* Message */}
          <p className="text-gray-600 mb-8">{message}</p>

          {/* Action Buttons */}
          <div className="flex gap-4 w-full">
            {type === 'confirm' && (
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
            <button
              onClick={type === 'confirm' ? onConfirm : onClose}
              className={`flex-1 text-white py-3 rounded-lg font-semibold ${
                status === 'success' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {type === 'confirm' ? 'Yes, Delete' : 'OK'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertModal;