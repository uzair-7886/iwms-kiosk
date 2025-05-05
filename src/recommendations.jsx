import React, { useState, useEffect,useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Phone, QrCode, ChevronDown } from 'lucide-react';
import i18n from './i18n';
import { FaAppleAlt } from 'react-icons/fa';
import { evaluateRecommendations, saveRecommendations } from './services/recommendations';

const RecommendationsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = location.state || {};
  const vitals = navState.vitals || useSelector(state => state.vitals);
  const answers = navState.answers || {};
  const hasSaved=useRef(false)

  // Clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  
      const handleDone = () => {
         if (localStorage.getItem('token')) {
           localStorage.removeItem('token');           
         }
         navigate('/');
       };

  // Weather
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Islamabad&units=metric&appid=d56eaf1086fc151f4be787d9926ed8f8`
        );
        const data = await res.json();
        setWeather(data.main.temp);
      } catch (err) {
        console.error('Weather fetch error:', err);
      }
    };
    fetchWeather();
  }, []);

  // Language dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const languages = {
    en: { flag: '/usa.png', label: 'English' },
    ur: { flag: '/pk.png', label: 'اردو' }
  };

  // Generate recommendations
  const recData = evaluateRecommendations(vitals, answers);
  const recommendations = recData.map((rec, idx) => ({
    icon: <FaAppleAlt size={32} className="text-primary" key={idx} />,   
    title: rec.vital,
    description: rec.message
  }));

  useEffect(() => {
    if (hasSaved.current || !localStorage.getItem('token')) return;
    hasSaved.current = true;
  
    const baseUrl = 'http://localhost:8080';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
  
    const saveRecommendations = async () => {
      console.log(recData);
      await fetch(`${baseUrl}/api/recommendations/add`, {
        method: 'POST',
        headers,
        body: JSON.stringify(recData),
      });
    };
  
    saveRecommendations();
  }, [recData]);
  


  return (
    <div className="relative min-h-screen bg-secondary flex flex-col items-center px-6">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 opacity-70 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url('./public/bgPattern.svg')`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Navigation */}
      <nav className="flex justify-between items-center px-12 py-6 w-full max-w-7xl mx-auto">
        <img src="/logo-nav.svg" alt="Reviva" className="h-8" />
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-white text-xl">
            <img src="/weather.svg" alt="Weather" className="w-6 h-6" />
            <span className="text-lg font-bold">
              {weather !== null ? `${weather}°C` : '--°C'}
            </span>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="flex flex-col items-center text-white">
            <span className="text-lg font-bold">{time.toLocaleTimeString()}</span>
            <span className="text-lg opacity-80">{time.toLocaleDateString()}</span>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="relative">
            <button
              className="flex items-center gap-2 text-white border border-white/25 px-3 py-1 rounded-md"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                src={languages[i18n.language].flag}
                alt={`${i18n.language} flag`}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-lg">{languages[i18n.language].label}</span>
              <ChevronDown size={16} className="text-white" />
            </button>
            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 bg-white rounded-md shadow-lg overflow-hidden">
                {Object.entries(languages).map(([lang, { flag, label }]) => (
                  <li
                    key={lang}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => { i18n.changeLanguage(lang); setDropdownOpen(false); }}
                  >
                    <img src={flag} alt={`${lang} flag`} className="w-5 h-5 rounded-full" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="text-center text-white mb-8">
        <h1 className="text-5xl font-bold text-primary">Your Recommendations</h1>
        <p className="mt-2 text-lg">Based on your vitals and answers, here are your personalized recommendations.</p>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="shadow-lg flex flex-col items-center bg-extrablack rounded-xl p-6 border"
          >
            {rec.icon}
            <h3 className="text-xl font-semibold text-white mt-4">{rec.title}</h3>
            <p className="text-center text-gray-300 mt-2">{rec.description}</p>
          </div>
        ))}
      </div>

      {/* Footer Button */}
      <div className="flex flex-col gap-4 max-w-4xl w-full mx-auto mt-12">
        <button
          onClick={handleDone}
          className="w-full py-6 bg-primary rounded-lg text-white font-medium text-lg hover:bg-primary/80 transition-colors"
        >
          Done
        </button>
      </div>

      {/* Bottom Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-secondary/80 backdrop-blur-md p-4 z-20 border-t border-white/10">
        <div className="flex justify-between items-center px-8">
          <div className="flex items-center gap-3">
            <Phone size={20} className="text-primary" />
            <div>
              <p className="text-sm text-white">Need help?</p>
              <p className="text-primary text-sm underline cursor-pointer">Contact us</p>
            </div>
          </div>
          <p className="hidden md:block text-cta">Powered by Reviva Wellness</p>
          <div className="flex items-center gap-3">
            <QrCode size={40} className="text-primary" />
            <div>
              <p className="text-sm text-white">Get the app</p>
              <p className="text-primary text-sm">Download now</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RecommendationsPage;
