import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  
  // --- 🚀 FIX 1: 'user' ko bhi localStorage se load karo ---
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      return null;
    }
  });
  
  // --- 'isLoggedIn' state (yeh pehle se sahi tha) ---
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));

  // --- 🚀 FIX 2: 'login' function ko update kiya taaki woh user data receive kare ---
  // (Yeh 'LoginForm' se call hoga)
  const login = (userData) => {
    setIsLoggedIn(true);
    // Agar login form se naya data milta hai, toh state update karo
    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData)); // LocalStorage bhi update karo
    }
  };

  // --- 🚀 FIX 3: 'logout' function 'user' ko bhi clear karega ---
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    // (Token clear karne ka logic 'Navbar.jsx' mein hai, woh sahi hai)
  };

  return (
    // --- 🚀 FIX 4: 'user' object ko context mein provide kiya ---
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};