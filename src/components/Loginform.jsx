// LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', formData);
      // Assuming the response data is the JWT token as a string.
      onLoginSuccess(response.data);
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="w-full max-w-md p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            name="username"
            placeholder="Email Address or Phone Number"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full p-4 rounded-lg bg-secondary text-gray-300 placeholder-gray-400 border-l-4 border-primary"
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-4 rounded-lg bg-secondary text-gray-300 placeholder-gray-400 border-l-4 border-primary"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-4 text-gray-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                // You can add onChange logic for rememberMe if needed.
                className="hidden"
              />
              <div className={`w-6 h-6 rounded bg-primary flex items-center justify-center`}>
                {/* Optionally, show a checkmark if needed */}
              </div>
            </div>
            <span className="text-white">Remember Me</span>
          </label>
          <a href="#" className="text-white hover:text-primary">
            Forgot Password?
          </a>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full p-4 bg-primary text-white rounded-lg hover:bg-secondary-accent transition-colors mt-8"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
