// LoginScreen.js
import React, { useState } from 'react';
import LoginForm from './Loginform';
import FaceLogin from './FaceLogin';

const LoginScreen = () => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
  const [token, setToken] = useState(null);

  const handleLogout = () => {
    setToken(null);
    // Optionally, remove the token from localStorage if you persist it.
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center p-6">
      <div 
        className="absolute inset-0 opacity-70 mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: `url('./public/bgPattern.svg')`, backgroundRepeat: 'repeat' }}
      />

      {!token ? (
        <div className="w-full max-w-md text-center">
          <img 
            src="/reviva-logo-full.svg" 
            alt="Reviva Logo" 
            className="mx-auto mb-2 h-48 w-48" 
          />
          <h1 className="text-primary text-3xl font-bold mb-8">Log In to IWMS</h1>
          
          <button 
            className="w-full bg-white p-6 rounded-lg hover:bg-white/90 mb-2"
            onClick={() => setIsFaceModalOpen(true)}
          >
            <div className="flex flex-col items-center">
              <img src="/faceid.svg" alt="Face ID" className="w-12 h-12 mb-3" />
              <span className="text-dark-text text-lg font-medium">Sign-in with Face ID</span>
              <span className="text-muted-text text-sm mt-1">
                Look directly at your front camera to use Face ID
              </span>
            </div>
          </button>

          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-text/20 flex-grow" />
            <span className="text-text/50">or log in with</span>
            <div className="h-px bg-text/20 flex-grow" />
          </div>

          <button 
            onClick={() => setIsEmailModalOpen(true)}
            className="w-full p-4 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 mb-8"
          >
            Login with Email/Phone Number
          </button>

          <p className="text-text">
            Don't have an account?{' '}
            <a href="/Signup" className="text-primary hover:underline">Sign Up</a>
          </p>
        </div>
      ) : (
        <div className="w-full max-w-md text-center">
          <h1 className="text-primary text-3xl font-bold mb-8">Welcome to IWMS!</h1>
          <p className="mb-4">You are logged in.</p>
          <button 
            onClick={handleLogout}
            className="w-full p-4 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Logout
          </button>
        </div>
      )}

      {/* Email/Phone Login Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="relative w-full max-w-md p-6 rounded-lg border border-white/30 bg-white/10 backdrop-blur-lg shadow-lg">
            <button 
              onClick={() => setIsEmailModalOpen(false)}
              className="absolute top-4 right-4 text-gray-300 hover:text-white text-xl"
            >
              ✕
            </button>
            <h2 className="text-white text-2xl font-bold text-center mb-4">Sign In</h2>
            <LoginForm 
              onLoginSuccess={(token) => {
                setToken(token);
                setIsEmailModalOpen(false);
              }} 
            />
          </div>
        </div>
      )}

      {/* Face Login Modal */}
      {isFaceModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="relative w-full max-w-md p-6 rounded-lg border border-white/30 bg-white/10 backdrop-blur-lg shadow-lg">
            <button 
              onClick={() => setIsFaceModalOpen(false)}
              className="absolute top-4 right-4 text-gray-300 hover:text-white text-xl"
            >
              ✕
            </button>
            <FaceLogin 
              onLoginSuccess={(token) => {
                setToken(token);
                setIsFaceModalOpen(false);
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
