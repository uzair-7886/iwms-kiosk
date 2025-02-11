import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ language, setLanguage, translations }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [temperature, setTemperature] = useState(null);
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Islamabad&units=metric&appid=d56eaf1086fc151f4be787d9926ed8f8');
        const data = await response.json();
        setTemperature(`${Math.round(data.main.temp)}° C`);
      } catch (error) {
        console.error('Error fetching temperature:', error);
      }
    };
    fetchTemperature();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const languages = {
    english: { flag: '/usa.png', label: 'English' },
    urdu: { flag: '/pk.png', label: 'اردو' }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="flex justify-between items-center px-4 py-4">
      <img src="/logo-nav.svg" alt="Reviva" className="h-8 cursor-pointer" onClick={() => navigate('/')} />
      <div className="flex items-center gap-8">
        {/* Temperature */}
        <div className="flex items-center gap-2 text-white text-xl">
          <img src="/weather.svg" alt="Temperature" className="w-6 h-6" />
          <span className="text-sm font-bold">{temperature || 'Loading...'}</span>
        </div>
        {/* Divider */}
        <div className="h-8 w-px bg-white/20" />
        {/* Time and Date */}
        <div className="flex flex-col items-center text-white">
          <span className="text-sm font-bold">{time.toLocaleTimeString()}</span>
          <span className="text-sm opacity-80">{time.toLocaleDateString()}</span>
        </div>
        {/* Divider */}
        <div className="h-8 w-px bg-white/20" />
        {/* Language Selector with Dropdown */}
        <div className="relative">
          <div 
            className="flex items-center gap-2 text-white cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img 
              src={languages[language].flag} 
              alt={`${language} flag`} 
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm">{languages[language].label}</span>
            <ChevronRight 
              size={20} 
              className={`transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-[270deg]' : 'rotate-90'}`}
            />
          </div>
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 bg-secondary border border-white/20 rounded-lg overflow-hidden">
              {Object.entries(languages).map(([key, value]) => (
                <div
                  key={key}
                  className={`flex items-center gap-2 px-4 py-2 hover:bg-white/10 cursor-pointer ${language === key ? 'bg-white/5' : ''}`}
                  onClick={() => handleLanguageChange(key)}
                >
                  <img src={value.flag} alt={`${key} flag`} className="w-6 h-6 rounded-full" />
                  <span className="text-white text-lg whitespace-nowrap">{value.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
