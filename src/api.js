import axios from 'axios';

// Get the backend URL from environment variables
const API_URL = import.meta.env.DEV ? '' : import.meta.env.VITE_BACKEND_URL;

// Create a new Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// --- 1. Request Interceptor ---
// This runs BEFORE any request is sent
api.interceptors.request.use(
  (config) => {
    // Get the access token from localStorage
    const token = localStorage.getItem('accessToken');
    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 2. Response Interceptor ---
// This runs AFTER a response is received
api.interceptors.response.use(
  (response) => {
    // If the request was successful, just return the response
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 (Unauthorized) and we haven't already retried
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we have retried
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        // If no refresh token, log out
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login'; // Redirect to login
        return Promise.reject(error);
      }

      try {
        // --- 3. 🚀🚀 YEH HAI ASLI FIX 🚀🚀 ---
        // Call the NEW refresh endpoint
        const rs = await axios.post(`${API_URL}/api/auth/refresh`, {
          refreshToken: refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = rs.data;

        // Store the new tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Update the header of the new Axios instance
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        // Update the header of the original failed request
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (_error) {
        // --- 4. If Refresh Token is also invalid ---
        // Clear all storage and log out
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login'; // Redirect to login
        return Promise.reject(_error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;