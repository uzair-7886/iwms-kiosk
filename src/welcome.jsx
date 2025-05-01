import React, { useState, useEffect } from 'react';
import LanguageSelectScreen from './language';

const ReviveWelcomeScreen = () => {
  const [text, setText] = useState('');
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const welcomeText = "Welcome to...";

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i <= welcomeText.length) {
        setText(welcomeText.slice(0, i));
        i++;
      } else {
        // After completing the text, reset i after a small delay
        setTimeout(() => {
          i = 0;
          setText('');
        }, 1000); // 1 second pause before restarting
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  const handleClick = () => {
    setShowLanguageSelect(true);
  };

  if (showLanguageSelect) {
    return <LanguageSelectScreen />;
  }

  return (
    <div
      className="relative min-h-screen bg-secondary flex items-center justify-center overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      {/* SVG Background with Multiply Blend Mode */}
      <div 
        className="absolute inset-0 opacity-70 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url('./public/bgPattern.svg')`,
          backgroundRepeat: 'repeat'
        }}
      />
      
      <div className="relative z-10 text-center">
        <div className="text-4xl font-bold text-text mb-4 h-10">
          {text}
        </div>
        
        <img 
          src="/reviva-logo-full.svg" 
          alt="Reviva Logo" 
          className="mx-auto mt-24 mb-24 h-96 w-auto"
        />
        
        <p className="text-3xl text-white">
          Your partner in tracking and improving your health.
        </p>

        {/* Click to Get Started */}
        <p className="mt-20 text-4xl text-primary animate-pulse">
          Click anywhere to get started
        </p>
      </div>
    </div>
  );
};

export default ReviveWelcomeScreen;
