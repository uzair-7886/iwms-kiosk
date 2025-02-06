import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="w-full max-w-md p-6">
      <form className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Email Address or Phone Number"
            className="w-full p-4 rounded-lg bg-secondary text-gray-300 placeholder-gray-400 border-l-4 border-primary"
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
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
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="hidden"
              />
              <div className={`w-6 h-6 rounded bg-primary flex items-center justify-center ${rememberMe ? 'bg-primary' : 'bg-secondary'}`}>
                {rememberMe && (
                  <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-white">Remember Me</span>
          </label>
          <a href="#" className="text-white hover:text-primary">
            Forgot Password?
          </a>
        </div>

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