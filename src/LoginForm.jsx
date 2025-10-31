import React, { useState, useEffect, useRef } from 'react';
import { FaRegEye, FaRegEyeSlash, FaRegUser, FaLock } from 'react-icons/fa';
import axios from 'axios';
// 1. 'useNavigate' ko import karein
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const GOOGLE_CLIENT_ID = "768160812865-co6puu6esh3o6731p60mcdifcthd4u8u.apps.googleusercontent.com";

function LoginForm({ showSignUp }) {
  const { login } = useAuth(); // login function nikaalein
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const googleButtonRef = useRef(null);
  
  // 2. 'useNavigate' hook ko initialize karein
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Logging in...');
    try {
      const response = await axios.post('/api/auth/teacher/login', { // Is URL ko check kar lein
        email: formData.email,
        password: formData.password
      });
      setMessage('Success! Logged in.');
      console.log(response.data);
      
      // 3. SUCCESS HONE PAR DASHBOARD BHEJ DO
     login();
     navigate('/dashboard'); 

    } catch (error) {
      console.error('Login failed:', error);
      setMessage(error.response?.data?.message || 'Error: Invalid credentials.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGoogleLogin = async (response) => {
    console.log("Google ID Token mila:");
    const idToken = response.credential;
    console.log(idToken);
    setMessage('Verifying Google Sign-In...');

    try {
      const res = await axios.post('/api/auth/google-login', { // Is URL ko check kar lein
        token: idToken 
      });

      setMessage('Success! Logged in with Google.');
      console.log(res.data);
      
      // 4. GOOGLE SE BHI SUCCESS HONE PAR DASHBOARD BHEJ DO
      login();
      navigate('/dashboard');

    } catch (error) {
      console.error('Google Login failed:', error);
      setMessage(error.response?.data?.message || 'Error: Google Sign-In failed.');
    }
  };

  useEffect(() => {
    if (window.google && googleButtonRef.current) {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin 
      });
      google.accounts.id.renderButton(
        googleButtonRef.current,
        { theme: "outline", size: "large", type: "standard", shape: "pill", width: "300" } 
      );
    }
  }, []); 

  return (
    <div className="flex-grow flex items-center justify-center p-4 md:p-12">
      <div className="flex flex-col md:flex-row w-full max-w-6xl items-center">
        
        <div className="md:w-1/2 p-6 flex justify-center">
          <img src="/photos/illustration.png" alt="Illustration" className="w-full max-w-lg" />
        </div>

        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center md:pl-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sign In</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><FaRegUser size={18} /></span><input type="email" placeholder="Enter your email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 pl-12 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
            <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><FaLock size={18} /></span><input type={showPass ? 'text' : 'password'} placeholder="Password" name="password" value={formData.password} onChange={handleChange} className="w-full p-3 pl-12 bg-white border border-gray-300 rounded-lg shadow-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500" required /><span onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1-2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700">{showPass ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}</span></div>
            <div className="flex items-center"><input type="checkbox" id="remember" className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /><label htmlFor="remember" className="text-sm text-gray-600">remember me</label></div>
            <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-md">Login</button>
            {message && (<p className="text-center text-sm font-medium text-red-600">{message}</p>)}
          </form>

          <div className="my-6 flex items-center"><div className="flex-grow border-t border-gray-300"></div><span className="mx-4 text-sm text-gray-500">Or continue with</span><div className="flex-grow border-t border-gray-300"></div></div>
          
          <div ref={googleButtonRef} className="flex justify-center w-full"></div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Didn't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;