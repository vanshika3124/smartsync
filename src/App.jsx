import React, { useState } from 'react';
import Navbar from './Navbar';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm'; // 1. LoginForm ko import karein

function App() {
  // 2. Ek state banayein jo batayega kaunsa form dikhana hai
  // 'false' = SignUp form (default), 'true' = Login form
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <Navbar />
      
      {/* 3. Yahan logic lagayein */}
      {showLogin ? (
        // Agar 'showLogin' true hai, toh Login form dikhayein
        <LoginForm showSignUp={setShowLogin} />
      ) : (
        // Agar 'showLogin' false hai, toh Sign Up form dikhayein
        <SignUpForm showLogin={setShowLogin} />
      )}
    </div>
  );
}

export default App;