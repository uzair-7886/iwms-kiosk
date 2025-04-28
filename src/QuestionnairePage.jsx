import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Phone, QrCode, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import { getAbnormalVitals,generateFollowUpQuestions } from './services/recommendations';

const QuestionnairePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const vitals = useSelector(state => state.vitals);

  // Clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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

  // Determine abnormal vitals and questions
  const abnormalities = getAbnormalVitals(vitals);
  const questions = generateFollowUpQuestions(abnormalities);

  // Collect user answers
  const [answers, setAnswers] = useState({});
  const handleChange = (vital, key) => e => {
    const val = e.target.value;
    setAnswers(prev => ({
      ...prev,
      [vital]: { ...(prev[vital] || {}), [key]: val }
    }));
  };

  // Submit questionnaire and navigate
  const handleSubmit = e => {
    e.preventDefault();
    navigate('/recommendations', { state: { vitals, answers } });
  };

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
        <h1 className="text-5xl font-bold text-primary">Wellness Questionnaire</h1>
        <p className="mt-2 text-lg">Please answer a few questions based on your vital readings.</p>
      </div>

      {/* Questionnaire Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-6 mb-12">
        {questions.length > 0 ? (
          questions.map((q, idx) => (
            <div key={idx} className="bg-extrablack rounded-xl border shadow-lg p-6">
              <label className="block text-white font-semibold mb-2">{q.text}</label>
              <input
                type="text"
                placeholder="Your answer"
                value={answers[q.vital]?.[q.key] || ''}
                onChange={handleChange(q.vital, q.key)}
                className="w-full p-3 rounded-md text-black"
                required
              />
            </div>
          ))
        ) : (
          <p className="text-white text-center">
            All your vital measurements are within normal ranges. No additional questions.
          </p>
        )}
        <button
          type="submit"
          className="w-full py-6 bg-primary rounded-lg text-white font-medium text-lg hover:bg-primary/80 transition-colors"
        >
          Continue
        </button>
      </form>

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

export default QuestionnairePage;