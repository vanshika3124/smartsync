import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  
  // --- 🚀🚀 YEH HAI ASLI FIX 🚀🚀 ---
  // State ko seedha localStorage se initialize karo
  // !! (do exclamation) string/null ko true/false mein badal dete hain
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // Jab LoginForm.jsx 'login()' call karega, hum state ko true set kar denge
  const login = () => {
    setIsLoggedIn(true);
  };

  // Jab Navbar.jsx 'logout()' call karega, hum state ko false set kar denge
  const logout = () => {
    setIsLoggedIn(false);
    // localStorage se remove karne ka kaam Navbar/LoginForm mein ho raha hai
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};