// SignupScreen.js
import React, { useState } from 'react';
import SignupForm from './Signupform';
import UserDetailsForm from './UserDetailsForm';
import FaceSignup from './FaceSignup';

const SignupScreen = () => {
  const [step, setStep] = useState(1); // Step 1: Signup, Step 2: User Details
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center p-6">
      <div
        className="absolute inset-0 opacity-70 mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: `url('./public/bgPattern.svg')`, backgroundRepeat: 'repeat' }}
      />
      
      <div className="w-full max-w-md text-center">
        <img src="/reviva-logo-full.svg" alt="Reviva Logo" className="mx-auto mb-2 h-48 w-48" />
        
        <h1 className="text-primary text-3xl font-bold mb-8">Sign Up for IWMS</h1>
        
        {step === 1 ? (
          <>
            <button 
              className="w-full bg-white p-6 rounded-lg hover:bg-white/90 mb-2"
              onClick={() => setIsFaceModalOpen(true)}
            >
              <div className="flex flex-col items-center">
                <img src="/faceid.svg" alt="Face ID" className="w-12 h-12 mb-3" />
                <span className="text-dark-text text-lg font-medium">Sign-up with Face ID</span>
                <span className="text-muted-text text-sm mt-1">
                  Look directly at your front camera to use Face ID
                </span>
              </div>
            </button>

            <div className="flex items-center gap-4 my-8">
              <div className="h-px bg-text/20 flex-grow" />
              <span className="text-text/50">or sign up with</span>
              <div className="h-px bg-text/20 flex-grow" />
            </div>

            <button 
              onClick={() => setIsEmailModalOpen(true)}
              className="w-full p-4 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 mb-8"
            >
              Sign Up with Email/Phone Number
            </button>
          </>
        ) : (
          <UserDetailsForm />
        )}

        <p className="text-text">
          Already have an account?{' '}
          <a href="#" className="text-primary hover:underline">Log In</a>
        </p>
      </div>

      {/* Email/Phone Signup Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="relative w-full max-w-md p-6 rounded-lg border border-white/30 bg-white/10 backdrop-blur-lg shadow-lg">
            <button 
              onClick={() => setIsEmailModalOpen(false)}
              className="absolute top-4 right-4 text-gray-300 hover:text-white text-xl"
            >
              ✕
            </button>
            <h2 className="text-white text-2xl font-bold text-center mb-4">Sign Up</h2>
            <SignupForm onComplete={() => { 
              setIsEmailModalOpen(false); 
              setStep(2); 
            }} />
          </div>
        </div>
      )}

      {/* Face Signup Modal */}
      {isFaceModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="relative w-full max-w-md p-6 rounded-lg border border-white/30 bg-white/10 backdrop-blur-lg shadow-lg">
            <button 
              onClick={() => setIsFaceModalOpen(false)}
              className="absolute top-4 right-4 text-gray-300 hover:text-white text-xl"
            >
              ✕
            </button>
            <FaceSignup onComplete={() => setIsFaceModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupScreen;
