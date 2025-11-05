import React from 'react';
import { Outlet } from 'react-router-dom';
import TeachersSidebar from './TeachersSidebar'; // Aapka sidebar

function ProtectedLayout() {
  return (
    // Yeh layout sidebar aur content ko flex karega
    <div className="w-full min-h-screen bg-gray-50 flex">
      {/* 1. Sidebar (hamesha dikhega) */}
      <TeachersSidebar />
      
      {/* 2. Main Content Area */}
      {/* Outlet yahan aapka child page (Dashboard, Profile, etc.) render karega */}
      <Outlet /> 
    </div>
  );
}
export default ProtectedLayout;