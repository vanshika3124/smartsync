import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';

function SignUpForm() {
  const { login } = useAuth(); 
  const navigate = useNavigate(); 
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');

  // --- 1. ADDED API_URL ---
  const API_URL = import.meta.env.DEV ? '' : import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (formData.password !== formData.confirmPassword) {
      setMessage('Error: Passwords do not match!');
      return;
    }
    if (!API_URL && !import.meta.env.DEV) {
        setMessage("Error: Backend URL not found.");
        return;
    }

    setMessage('Creating account...');
    try {
      // --- 2. Use API_URL ---
      const response = await axios.post(`${API_URL}/api/auth/teacher/register`, {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: "teacher" 
      });

      setMessage('Success! Account created successfully.');
      console.log(response.data); 
      
      // --- 3. SAVE NEW TOKENS ON SIGNUP ---
      if (response.data && response.data.accessToken && response.data.user) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Log in and navigate to dashboard
        if (typeof login === 'function') {
          login();
        }
        navigate('/dashboard');
      } else {
        // Fallback if tokens aren't returned
        setMessage("Account created, but failed to log in. Please go to login page.");
      }

    } catch (error) {
      console.error('Registration failed:', error);
      setMessage(error.response?.data?.message || 'Error: Could not create account.');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 md:p-12">
      <div className="flex flex-col md:flex-row w-full max-w-6xl items-center">
        
        <div className="md:w-1/2 p-6 flex justify-center">
          <img src="/photos/illustration.png" alt="Illustration" className="w-full max-w-lg" />
        </div>

        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center md:pl-16">
            
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Create an account</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div><input type="text" placeholder="Enter your full name" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
            <div><input type="email" placeholder="Enter your email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
            <div className="relative"><input type={showPass ? 'text' : 'password'} placeholder="Password" name="password" value={formData.password} onChange={handleChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500" required /><span onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700">{showPass ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}</span></div>
            <div className="relative"><input type={showConfirmPass ? 'text' : 'password'} placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500" required /><span onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700">{showConfirmPass ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}</span></div>
            <div className="flex items-center"><input type="checkbox" id="remember" className="mr-2" /><label htmlFor="remember" className="text-sm text-gray-600">remember me</label></div>
            <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-md">Create Account</button>
            {message && (<p className="text-center text-sm font-medium text-red-600">{message}</p>)}

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login"
                className="font-medium text-blue-600 hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;