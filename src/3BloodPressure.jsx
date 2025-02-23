import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, QrCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import { ChevronDown } from 'lucide-react';

const VitalsMeasurementBP = () => {
    const [systolic, setSystolic] = useState('120');
    const [diastolic, setDiastolic] = useState('80');
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState(null);
    const [heartRate, setHeartRate] = useState(null);
    const [showChart, setShowChart] = useState(false);
  
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

      <div className="relative z-10 max-w-4xl mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t('vitals_measurement.title')}
          </h1>
          <p className="text-gray-300">
            {t('vitals_measurement.instructions')}
          </p>
        </div>

        <div className="flex justify-between items-center gap-8 mb-12">
          <div className="bg-extrablack rounded-xl p-6 border h-[200px] border-white/35 flex-1">
            <div className="flex justify-between items-center mb-4">
              <span className="text-primary font-bold">{t('blood_pressure.sys_dia')}</span>
            </div>
            <div className="text-5xl bg-transparent w-full text-white outline-none">
                            
                        </div>
                <input
                    type="text"
                    value={`${systolic}/${diastolic}`}
                    onChange={(e) => {
                        const [sys, dia] = e.target.value.split('/');
                        setSystolic(sys);
                        setDiastolic(dia);
                    }}
                    className="text-5xl bg-transparent w-full text-white outline-none"
                />
            <span className="text-2xl text-gray-400">mmHg</span>
          </div>

          <div className="flex-1 flex justify-center">
            <img 
              src="/blood-pressure.gif"  // Change this to the correct GIF path
              alt="Blood Pressure Measurement in progress"
              className="w-48 h-48 object-contain" // Adjust size if needed
            />
          </div>

          <div className="bg-extrablack rounded-xl p-6 border h-[200px] border-white/35 flex-1">
            <div className="flex justify-between items-center mb-4">
            <span className="text-primary font-bold">{t('blood_pressure.bpm')}</span>
              <button className="px-3 py-1 rounded bg-primary hover:bg-secondary-accent text-sm text-white font-bold" onClick={() => setShowChart(true)}>
                {t('blood_pressure.view_chart')}
              </button>
            </div>
            <div className="text-5xl text-white">{heartRate ? heartRate : 'N/A'}</div>
            <span className="text-2xl text-gray-400">BPM</span>
          </div>
        </div>

        <p className="text-center text-gray-300 mb-8">
          {t('blood_pressure.heart_rate_instruction')}
        </p>

        <div className="flex flex-col gap-4 max-w-md mx-auto">
          <button className="w-full py-4 bg-primary rounded-lg text-white font-medium hover:bg-primary/80 transition-colors">
            {t('vitals_measurement.next')}
          </button>
          <button className="w-full py-4 border border-primary rounded-lg text-primary font-medium hover:bg-primary/30 transition-colors">
            {t('vitals_measurement.skip')}
          </button>
        </div>
      </div>

      {showChart && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg text-center relative">
                        <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowChart(false)}>
                            ✕
                        </button>
                        <img src="/heart-rate.png" alt="Heart Rate Chart" className="h-auto" />
                    </div>
                </div>
            )}

      <footer className="fixed bottom-0 left-0 right-0 w-full bg-secondary/80 backdrop-blur-md p-4 px-4 z-20 border-t border-white/10">
        <div className="flex justify-between items-center px-8">
          <div className="flex items-center gap-3">
            <Phone size={20} className="text-primary" />
            <div>
              <p className="text-sm text-white">{t('vitals_measurement.need_help')}</p>
              <p className="text-primary text-sm underline hover:text-secondary-accent cursor-pointer">
                {t('vitals_measurement.contact_us')}
              </p>
            </div>
          </div>
          <p className="text-cta hidden md:block">{t('vitals_measurement.footer')}</p>
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

export default VitalsMeasurementBP;
