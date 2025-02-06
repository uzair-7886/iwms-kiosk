import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router

const StartScreen = () => {
  const navigate = useNavigate(); // Create a history instance

  const options = [
    {
      icon: '/login.svg',
      title: 'Log In',
      description: 'Access your personalized profile and saved health data.',
      onClick: () => navigate('/Login') // Redirect to login page
    },
    {
      icon: '/guest.svg',
      title: 'Use as Guest',
      description: 'Explore the system without an account (data will not be saved).',
      onClick: () => navigate('/homepage') // Redirect to homepage
    },
    {
      icon: '/signup.svg',
      title: 'Create Account',
      description: 'Sign up to save your progress and track your wellness journey.',
      onClick: () => navigate('/Signup') // Redirect to signup page
    }
  ];

  return (
    <div className="relative min-h-screen bg-secondary flex flex-col items-center justify-center px-6">
      <div 
        className="absolute inset-0 opacity-70 mix-blend-multiply pointer-events-none"
        style={{
            backgroundImage: `url('./public/bgPattern.svg')`,
            backgroundRepeat: 'repeat'
        }}
      />
      
      <img 
        src="/reviva-logo-full.svg" 
        alt="Reviva Logo" 
        className="mb-4 h-56 w-56 relative z-10"
      />
      
      <h2 className="text-2xl text-text mb-10 text-center">
        Please choose an option to get started
      </h2>
      
      <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
        {options.map((option) => (
          <div 
            key={option.title} 
            className="bg-white rounded-lg p-6 text-center cursor-pointer group hover:bg-primary transition-transform duration-300 ease-in-out"
            onClick={option.onClick} // Add the click handler here
          >
            <img 
              src={option.icon} 
              alt={option.title} 
              className="mx-auto mb-4 w-12 h-12 group-hover:text-white group-hover:brightness-0 group-hover:invert transition-all duration-300 ease-in-out"
            />
            <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-white transition-all duration-300 ease-in-out">
              {option.title}
            </h3>
            <p className="text-muted-text text-base group-hover:text-white transition-all duration-300 ease-in-out">
              {option.description}
            </p>
          </div>
        ))}
      </div>
      
      <p className="text-cta mt-10">
        Let's take the first step toward a healthier you!
      </p>
    </div>
  );
};

export default StartScreen;
