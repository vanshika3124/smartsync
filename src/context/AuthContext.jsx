// src/context/AuthContext.jsx

import React, { createContext, useState, useContext } from 'react';

// 1. Context banayein
const AuthContext = createContext();

// 2. Doosre components ko context use karne dein
export function useAuth() {
  return useContext(AuthContext);
}

// 3. Provider component banayein (jo state hold karega)
export function AuthProvider({ children }) {
  // Shuru mein, user logged out hai
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    // Yahan aap future mein token save kar sakte hain
    setIsLoggedIn(true);
  };

  const logout = () => {
    // Yahan aap token clear kar sakte hain
    setIsLoggedIn(false);
  };

  // Yeh value poori app ko milegi
  const value = {
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}