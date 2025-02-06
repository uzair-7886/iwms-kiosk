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
        clearInterval(typingInterval);
      }
    }, 100);

    const transitionTimer = setTimeout(() => {
      setShowLanguageSelect(true);
    }, 4000);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(transitionTimer);
    };
  }, []);

  if (showLanguageSelect) {
    return <LanguageSelectScreen />;
  }

  return (
    <div className="relative min-h-screen bg-secondary flex items-center justify-center overflow-hidden">
      {/* SVG Background with Multiply Blend Mode */}
      <div 
        className="absolute inset-0 opacity-70 mix-blend-multiply pointer-events-none"
        style={{
            backgroundImage: `url('./public/bgPattern.svg')`,
            backgroundRepeat: 'repeat'
        }}
      />
      
      <div className="relative z-10 text-center">
        <div className="text-3xl font-bold text-text mb-4 h-10">
          {text}
        </div>
        
        <img 
          src="/reviva-logo-full.svg" 
          alt="Reviva Logo" 
          className="mx-auto mb-8 mt-10 h-max w-max"
        />
        <p className="text-2xl text-text">
          Your partner in tracking and improving your health.
        </p>
      </div>
    </div>
  );
};

export default ReviveWelcomeScreen;