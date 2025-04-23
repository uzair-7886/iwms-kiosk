// RecommendationsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, QrCode, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import { FaTint, FaWalking, FaAppleAlt, FaBed } from 'react-icons/fa';

const RecommendationsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(null);

  const languages = {
    en: { flag: '/usa.png', label: 'English' },
    ur: { flag: '/pk.png', label: 'اردو' },
  };

  // Clock
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Weather
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

  // Wellness recommendations
  const recommendations = [
    {
      icon: <FaTint size={32} className="text-primary" />,
      title: t('recommendations.hydrate'),
      description: t('recommendations.hydrateDesc'),
    },
    {
      icon: <FaWalking size={32} className="text-primary" />,
      title: t('recommendations.move'),
      description: t('recommendations.moveDesc'),
    },
    {
      icon: <FaAppleAlt size={32} className="text-primary" />,
      title: t('recommendations.eatHealthy'),
      description: t('recommendations.eatHealthyDesc'),
    },
    {
      icon: <FaBed size={32} className="text-primary" />,
      title: t('recommendations.rest'),
      description: t('recommendations.restDesc'),
    },
  ];

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setDropdownOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-secondary flex flex-col items-center px-6">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 opacity-70 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url('./public/bgPattern.svg')`,
          backgroundRepeat: 'repeat',
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
              <ChevronDown size={16} />
            </button>
            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 bg-white rounded-md shadow-lg overflow-hidden">
                {Object.entries(languages).map(([lang, { flag, label }]) => (
                  <li
                    key={lang}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleLanguageChange(lang)}
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
        <h1 className="text-5xl font-bold text-primary">{t('recommendations.title')}</h1>
        <p className="mt-2 text-lg">{t('recommendations.subtitle')}</p>
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
          onClick={() => navigate('/')}
          className="w-full py-6 bg-primary rounded-lg text-white font-medium text-lg hover:bg-primary/80 transition-colors"
        >
          {t('recommendations.done')}
        </button>
      </div>

      {/* Bottom Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-secondary/80 backdrop-blur-md p-4 z-20 border-t border-white/10">
        <div className="flex justify-between items-center px-8">
          <div className="flex items-center gap-3">
            <Phone size={20} className="text-primary" />
            <div>
              <p className="text-sm text-white">{t('vitals_measurement.need_help')}</p>
              <p className="text-primary text-sm underline cursor-pointer">
                {t('vitals_measurement.contact_us')}
              </p>
            </div>
          </div>
          <p className="hidden md:block text-cta">{t('vitals_measurement.footer')}</p>
          <div className="flex items-center gap-3">
            <QrCode size={40} className="text-primary" />
            <div>
              <p className="text-sm text-white">{t('vitals_measurement.get_app')}</p>
              <p className="text-primary text-sm">{t('vitals_measurement.download_app')}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RecommendationsPage;
