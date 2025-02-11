import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Phone, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import i18n from './i18n';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useEffect } from 'react';

const WellnessLanding = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState(null);
  
    const languages = {
        en: { flag: '/usa.png', label: 'English' },
        ur: { flag: '/pk.png', label: 'اردو' },
    };
  
    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Islamabad&units=metric&appid=d56eaf1086fc151f4be787d9926ed8f8`);
                const data = await response.json();
                setWeather(data.main.temp);
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };
        fetchWeather();
    }, []);
  
    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
        setDropdownOpen(false);
    };

    const isUrdu = i18n.language === 'ur';

    const Card = ({ image, icon, title, desc1, desc2, onClick }) => (
      <div className="bg-[#1E1E1E]/40 border border-white/35 rounded-[20px] p-6 space-y-4 hover:border-primary/35 transition-all duration-300 flex flex-col justify-between">
        <div className="relative w-full h-48 overflow-hidden rounded-[20px]">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className={`absolute bottom-4 ${isUrdu ? 'right-4 flex-row-reverse' : 'left-4'} flex items-center gap-2`}>
            <div className="bg-primary/40 border-primary p-2 rounded-md w-12 h-12 flex items-center justify-center">
              <img src={icon} alt="icon" className="w-6 h-6" />
            </div>
            <h3 className="text-white text-lg font-semibold">{title}</h3>
          </div>
        </div>
        <ul className="space-y-2 mt-2 text-white">
          <li className={`flex items-start gap-2 ${isUrdu ? 'flex-row-reverse' : ''}`}>
            <ChevronRight className="text-primary mt-1 flex-shrink-0" size={16} />
            <span>{desc1}</span>
          </li>
          <li className={`flex items-start gap-2 ${isUrdu ? 'flex-row-reverse' : ''}`}>
            <ChevronRight className="text-primary mt-1 flex-shrink-0" size={16} />
            <span>{desc2}</span>
          </li>
        </ul>
        <button onClick={onClick} className={`flex ${isUrdu ? 'flex-row-reverse' : 'justify-between'} items-center text-primary hover:text-primary/80 hover:bg-primary/30 transition-colors mt-auto border border-primary rounded-[12px] px-4 py-2 w-full`}>
          {t('proceed')}
          <ChevronRight size={16} />
        </button>
      </div>
    );

  return (
    <div className="relative min-h-screen bg-secondary flex flex-col items-center px-6">
        <div 
        className="absolute inset-0 opacity-70 mix-blend-multiply pointer-events-none"
        style={{
            backgroundImage: `url('./public/bgPattern.svg')`,
            backgroundRepeat: 'repeat'
        }}
      />
            <nav className="flex justify-between items-center px-4 py-4 w-full max-w-7xl mx-auto">
                <img src="/logo-nav.svg" alt="Reviva" className="h-8" />
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 text-white text-xl">
                        <img src="/weather.svg" alt="Temperature" className="w-6 h-6" />
                        <span className="text-sm font-bold">{weather !== null ? `${weather}° C` : "--° C"}</span>
                    </div>
                    <div className="h-8 w-px bg-white/20" />
                    <div className="flex flex-col items-center text-white">
                        <span className="text-sm font-bold">{time.toLocaleTimeString()}</span>
                        <span className="text-sm opacity-80">{time.toLocaleDateString()}</span>
                    </div>
                    <div className="h-8 w-px bg-white/20" />
                    <div className="relative">
                        <button 
                            className="flex items-center gap-2 text-white cursor-pointer border border-white/25 px-3 py-1 rounded-md"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <img 
                                src={languages[i18n.language].flag} 
                                alt={`${i18n.language} flag`} 
                                className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm">{languages[i18n.language].label}</span>
                            <ChevronDown size={16} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute top-10 left-0 w-full bg-gray-800 border border-white/25 rounded-md shadow-lg">
                                {Object.entries(languages).map(([lang, { flag, label }]) => (
                                    <div 
                                        key={lang} 
                                        className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-700"
                                        onClick={() => handleLanguageChange(lang)}
                                    >
                                        <img src={flag} alt={label} className="w-5 h-5 rounded-full" />
                                        <span className="text-white text-sm">{label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </nav>
      <main className="px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('welcome')} <span className="text-primary">Reviva</span>
          </h1>
          <p className="text-xl text-gray-300">{t('subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <Card image="/card1.png" icon="/vitals.svg" title={t('card1.title')} desc1={t('card1.desc1')} desc2={t('card1.desc2')} onClick={() => navigate('/1Height')} />
          <Card image="/card2.png" icon="/manual-input.svg" title={t('card2.title')} desc1={t('card2.desc1')} desc2={t('card2.desc2')} />
          <Card image="/card3.png" icon="/history.svg" title={t('card3.title')} desc1={t('card3.desc1')} desc2={t('card3.desc2')} />
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 w-full bg-secondary/80 p-4 px-4 z-20 border-t border-white/10">
        <div className="flex justify-between items-center px-8">
          <div className="flex items-center gap-3">
            <Phone size={20} className="text-primary" />
            <div>
              <p className="text-sm text-white">{t('needHelp')}</p>
              <p className="text-primary text-sm underline">{t('contact')}</p>
            </div>
          </div>
          <p className="text-cta hidden md:block">{t('tagline')}</p>
          <div className="flex items-center gap-3">
            <QrCode size={40} className="text-primary" />
            <div>
              <p className="text-sm text-white">{t('getApp')}</p>
              <p className="text-primary text-sm">{t('download')}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WellnessLanding;