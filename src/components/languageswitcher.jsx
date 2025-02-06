import React, { useState } from 'react';

const LanguageSwitch = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  return (
    <div className="w-full rounded-xl overflow-hidden">
      <div 
        className={`
          pt-4 pb-4 pl-8 pr-8 flex items-center
          ${selectedLanguage === 'english' ? 'bg-primary text-text' : 'bg-white text-dark-text'}
        `}
        onClick={() => setSelectedLanguage('english')}
      >
        <img 
          src="/usa.png" 
          alt="USA flag" 
          className="w-8 h-8 mr-4 rounded-full"
        />
        <span className="text-lg flex-grow">English</span>
      </div>
      
      <div 
        className={`
          pt-4 pb-4 pl-8 pr-8 flex items-center
          ${selectedLanguage === 'urdu' ? 'bg-primary text-text' : 'bg-white text-dark-text'}
        `}
        onClick={() => setSelectedLanguage('urdu')}
      >
        <img 
          src="/pk.png" 
          alt="Pakistan flag" 
          className="w-8 h-8 mr-4 rounded-full object-cover"
        />
        <span className="text-lg flex-grow">اردو</span>
      </div>
    </div>
  );
};

export default LanguageSwitch;