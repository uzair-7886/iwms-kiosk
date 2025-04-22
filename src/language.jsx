// import React, { useState } from 'react';
import LanguageSwitch from './components/languageswitcher';

// const LanguageSelectScreen = () => {
//   const [selectedLanguage, setSelectedLanguage] = useState('english');

//   const languages = [
//     { code: 'english', name: 'English', flag: '🇺🇸' },
//     { code: 'urdu', name: 'اردو', flag: '🇵🇰' }
//   ];

//   return (
//     <div className="relative min-h-screen bg-secondary flex items-center justify-center overflow-hidden py-12"> {/* Add padding */}
//       <div 
//         className="absolute inset-0 opacity-70 mix-blend-multiply pointer-events-none"
//         style={{
//             backgroundImage: `url('./public/bgPattern.svg')`,
//             backgroundRepeat: 'repeat'
//         }}
//       />
      
//       <div className="relative z-10 text-center w-full max-w-md px-6 flex flex-col space-y-6"> {/* Use flex-col and space-y-6 */}
//         <div className="flex flex-col items-center space-y-8">
//             <img 
//                 src="/reviva-logo-full.svg" 
//                 alt="Reviva Logo" 
//                 className="h-auto w-52"
//             />
//             <h2 className="text-2xl text-text">
//                 Please select your preferred language
//             </h2>
//         </div>

//         {/* <div>
//           {languages.map((lang) => (
//             <div 
//               key={lang.code}
//               onClick={() => setSelectedLanguage(lang.code)}
//               className={`
//                 flex items-center justify-between p-4 mb-4 rounded-lg cursor-pointer
//                 ${selectedLanguage === lang.code 
//                   ? 'bg-primary text-text' 
//                   : 'bg-white/10 text-text/70'}
//               `}
//             >
//               <span className="text-2xl mr-4">{lang.flag}</span>
//               <span className="flex-grow text-left">{lang.name}</span>
//               <div 
//                 className={`
//                   w-6 h-6 rounded-full border-2
//                   ${selectedLanguage === lang.code 
//                     ? 'bg-text border-text' 
//                     : 'border-text/30'}
//                 `}
//               />
//             </div>
//           ))}
//         </div> */}

//         <div className="flex justify-center items-center">
//             <LanguageSwitch />
//         </div>
        
//         <button 
//           className="w-full py-4 bg-primary text-secondary rounded-lg text-lg font-bold hover:bg-secondary-accent"
//         >
//           Confirm
//         </button>
        
//         <div><p className="text-cta mt-10">
//           Let's take the first step toward a healthier you!
//         </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LanguageSelectScreen;

import React, { useState } from 'react';
import StartScreen from './startScreen';

const LanguageSelectScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [proceed, setProceed] = useState(false);

  const languages = [
    { code: 'english', name: 'English', flag: '/usa.png' },
    { code: 'urdu', name: 'اردو', flag: '/pk.png' }
  ];

  if (proceed) {
    return <StartScreen />;
  }

  return (
    <div className="relative min-h-screen bg-secondary flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 opacity-70 mix-blend-multiply pointer-events-none"
        style={{
            backgroundImage: `url('./public/bgPattern.svg')`,
            backgroundRepeat: 'repeat'
        }}
      />
      <div className="relative z-10 text-center w-full max-w-2xl px-6 space-y-6">
        <div className="flex flex-col items-center space-y-8">
              <img 
                  src="/reviva-logo-full.svg" 
                  alt="Reviva Logo" 
                  className="h-auto w-auto"
              />
              <h2 className="text-3xl text-text pt-20 pb-20">
                  Please select your preferred language
              </h2>
        </div>
        
        {/* <div className="w-full rounded-lg overflow-hidden mb-6">
          {languages.map((lang) => (
            <div 
              key={lang.code}
              className={`
                p-4 flex items-center
                ${selectedLanguage === lang.code ? 'bg-primary text-text' : 'bg-white text-dark-text'}
              `}
              onClick={() => setSelectedLanguage(lang.code)}
            >
              <img 
                src={lang.flag} 
                alt={`${lang.name} flag`} 
                className="w-8 h-8 mr-4 rounded-full"
              />
              <span className="text-lg flex-grow">{lang.name}</span>
            </div>
          ))}
        </div> */}
        <div className="flex justify-center items-center pb-20">
            <LanguageSwitch />
        </div>
        
        <button 
          onClick={() => setProceed(true)}
          className="w-full py-4 bg-primary/20 text-white border border-primary rounded-lg text-lg font-bold hover:bg-secondary-accent"
        >
          Confirm
        </button>
        
        <p className="text-cta mt-10 text-2xl pt-20">
          Let's take the first step toward a healthier you!
        </p>
      </div>
    </div>
  );
};

export default LanguageSelectScreen;