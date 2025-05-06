import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHeight } from './redux/vitalsSlice';
import { useNavigate } from 'react-router-dom';
import { Phone, QrCode, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import { useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';


const steps = [
  { name: 'Height', path: '/1Height' },
  { name: 'Weight', path: '/2Weight' },
  { name: 'Blood Pressure', path: '/3BloodPressure' },
  { name: 'Temperature', path: '/4Temp' },
  { name: 'Glucose', path: '/5Glucose' },
  { name: 'SpO2', path: '/3SpO2' },
  { name: 'Summary', path: '/summary' },
];

const VitalsMeasurement = () => {
  const dispatch = useDispatch();
  const height = useSelector((state) => state.vitals.height);
  const [heightUnit, setHeightUnit] = useState('cm');
  const [faceDetected, setFaceDetected] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state


  const currentStep = steps.findIndex(step => step.path === location.pathname);

  const languages = {
    en: { flag: '/usa.png', label: 'English' },
    ur: { flag: '/pk.png', label: 'اردو' },
  };

  const moveNext = () => {
    navigate(steps[currentStep + 1].path);
  };

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Islamabad&units=metric&appid=d56eaf1086fc151f4be787d9926ed8f8`
        );
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
  const handleUnitSwitch = (unit) => {
    setHeightUnit(unit);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (heightUnit === 'cm') {
      dispatch(setHeight(Number(value)));
    } else if (heightUnit === 'feet') {
      const parts = value.split("'");
      if (parts.length === 2) {
        const feet = parseInt(parts[0], 10);
        const inches = parseInt(parts[1], 10);
        if (!isNaN(feet) && !isNaN(inches)) {
          const cm = (feet * 30.48) + (inches * 2.54);
          dispatch(setHeight(cm));
        }
      }
    }
  };

  const convertHeight = () => {
    if (heightUnit === 'cm') {
      return height ? Math.round(height) : '';
    } else if (heightUnit === 'feet') {
      if (!height) return '';
      const totalInches = height / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return `${feet}'${inches}"`;
    }
    return '';
  };



  return (
    <div className="relative min-h-screen bg-secondary flex flex-col items-center px-6">
      <div
        className="absolute inset-0 opacity-70 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url('./public/bgPattern.svg')`,
          backgroundRepeat: 'repeat',
        }}
      />
      <nav className="flex justify-between items-center px-12 py-12 w-full max-w-7xl mx-auto">
        <img src="/logo-nav.svg" alt="Reviva" className="h-8" />
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-white text-xl">
            <img src="/weather.svg" alt="Temperature" className="w-6 h-6" />
            <span className="text-lg font-bold">
              {weather !== null ? `${weather}° C` : "--° C"}
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
              className="flex items-center gap-2 text-white cursor-pointer border border-white/25 px-3 py-1 rounded-md"
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
              <div className="absolute top-10 left-0 w-full bg-gray-800 border border-white/25 rounded-md shadow-lg">
                {Object.entries(languages).map(([lang, { flag, label }]) => (
                  <div
                    key={lang}
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-700"
                    onClick={() => handleLanguageChange(lang)}
                  >
                    <img src={flag} alt={label} className="w-5 h-5 rounded-full" />
                    <span className="text-white text-lg">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
      {/* Progress Bar */}
      <div className="w-full max-w-4xl flex items-center my-20 relative">
        {steps.map((step, index) => (
          <React.Fragment key={step.path}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-md font-bold mb-2 ${index === currentStep
                  ? 'border-primary text-primary'
                  : 'border-gray-400 text-gray-400'
                  }`}
              >
                {index + 1}
              </div>
              <button
                className={`text-md font-bold ${index === currentStep ? 'text-primary' : 'text-gray-400'
                  }`}
                onClick={() => navigate(step.path)}
              >
                {step.name}
              </button>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 border-dotted border-t-2 border-gray-400 mx-2"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto py-4">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-white mb-4">
            {t('vitals_measurement.title')}
          </h1>
          <p className="text-gray-300 text-xl">
            {t('vitals_measurement.instructions')}
          </p>
        </div>
        <div className="flex flex-col justify-between items-center gap-8 mb-12">
          <div className="flex-1 flex justify-center">
            <img
              src="/camera.gif"
              alt="Face detection in progress"
              className="w-64 h-64 object-contain"
            />
          </div>
          <div className="bg-extrablack text-white py-8 px-16 rounded-lg text-xl max-w-5xl mt-4 text-center">
            <strong className="text-primary">Tip:</strong> Tap on the value below to manually enter your measurement. <br /> Use the slider in the pop-up to adjust, then press <strong className="text-primary">Save</strong> to confirm.
          </div>

          <div className="bg-extrablack rounded-xl p-6 border w-full border-white/35 flex-1">
            <div className="flex justify-between items-center mb-4">
              <span className="text-primary font-bold text-2xl">
                {t('vitals_measurement.height')}
              </span>
              <div className="flex bg-gray-700 rounded-lg p-1 w-24">
                <button
                  className={`flex-1 py-1 rounded-md text-lg font-bold ${heightUnit === 'cm' ? 'bg-primary text-white' : 'text-gray-300'}`}
                  onClick={() => handleUnitSwitch('cm')}
                >
                  cm
                </button>
                <button
                  className={`flex-1 py-1 rounded-md text-lg font-bold ${heightUnit === 'feet' ? 'bg-primary text-white' : 'text-gray-300'}`}
                  onClick={() => handleUnitSwitch('feet')}
                >
                  feet
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              {/* Text field that opens modal */}
              <div
                className="text-5xl text-white cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                {heightUnit === 'cm'
                  ? `${Math.round(height)} cm`
                  : (() => {
                    const totalInches = height / 2.54;
                    const feet = Math.floor(totalInches / 12);
                    const inches = Math.round(totalInches % 12);
                    return `${feet}'${inches}"`;
                  })()}
              </div>
            </div>

            {isModalOpen && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                <div className="bg-extrablack rounded-lg p-8 w-[500px] md:w-[600px]">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-white text-2xl font-bold">Select Height</span>
                    <button
                      className="text-white text-xl"
                      onClick={() => setIsModalOpen(false)}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Unit Switch inside Modal */}
                  <div className="flex bg-gray-700 rounded-lg p-1 w-48 mx-auto mb-8">
                    <button
                      className={`flex-1 py-2 rounded-md text-lg font-bold ${heightUnit === 'cm' ? 'bg-primary text-white' : 'text-gray-300'}`}
                      onClick={() => handleUnitSwitch('cm')}
                    >
                      cm
                    </button>
                    <button
                      className={`flex-1 py-2 rounded-md text-lg font-bold ${heightUnit === 'feet' ? 'bg-primary text-white' : 'text-gray-300'}`}
                      onClick={() => handleUnitSwitch('feet')}
                    >
                      feet
                    </button>
                  </div>

                  {/* Slider */}
                  <div className="my-6">
                    <input
                      type="range"
                      min={heightUnit === 'cm' ? 50 : 3}
                      max={heightUnit === 'cm' ? 250 : 7}
                      step={heightUnit === 'cm' ? 1 : 0.1}
                      value={heightUnit === 'cm' ? Math.round(height) : (height / 30.48).toFixed(1)}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (heightUnit === 'cm') {
                          dispatch(setHeight(value));
                        } else {
                          dispatch(setHeight(value * 30.48));
                        }
                      }}
                      className="w-full h-3 bg-gray-600 rounded-lg appearance-none focus:outline-none
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:cursor-pointer
            transition-all duration-200"
                    />
                    <div className="flex justify-between text-gray-400 text-lg mt-2">
                      <span>{heightUnit === 'cm' ? '50 cm' : "3'0\""}</span>
                      <span>{heightUnit === 'cm' ? '250 cm' : "7'0\""}</span>
                    </div>
                  </div>

                  {/* Current Selected Height */}
                  <div className="text-5xl text-white font-bold text-center my-6">
                    {heightUnit === 'cm'
                      ? `${Math.round(height)} cm`
                      : (() => {
                        const totalInches = height / 2.54;
                        const feet = Math.floor(totalInches / 12);
                        const inches = Math.round(totalInches % 12);
                        return `${feet}'${inches}"`;
                      })()}
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-3 bg-primary text-white text-xl rounded-lg hover:bg-primary/80 transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}


            <span className="text-2xl text-gray-400">
              {heightUnit.toUpperCase()}
            </span>
          </div>

          <div className="bg-extrablack rounded-xl p-6 border h-[600px] w-full border-white/35 flex-1">
            <div className="flex justify-between items-center mb-4">
              <span className="text-primary font-bold">
                {t('vitals_measurement.face_id')}
              </span>
              {faceDetected && (
                <button className="px-3 py-1 rounded bg-gray-700 text-sm">
                  {t('vitals_measurement.login')}
                </button>
              )}
            </div>
            <div className="text-5xl text-white">
              {faceDetected ? 'YES' : 'N/A'}
            </div>
          </div>
        </div>
        <p className="text-center text-gray-300 text-xl mb-12">
          {t('vitals_measurement.camera_instruction')}
        </p>
        <div className="flex flex-col gap-4 max-w-auto mx-auto">
          <button
            onClick={moveNext}
            className="w-full py-6 bg-primary mb-4 rounded-lg text-white font-medium text-lg hover:bg-primary/80 transition-colors"
          >
            {t('vitals_measurement.next')}
          </button>
          <button
            onClick={moveNext}
            className="w-full py-6 border border-primary rounded-lg text-primary font-medium text-lg hover:bg-primary/30 transition-colors"
          >
            {t('vitals_measurement.skip')}
          </button>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 w-full bg-secondary/80 backdrop-blur-md p-4 px-4 z-20 border-t border-white/10">
        <div className="flex justify-between items-center px-8">
          <div className="flex items-center gap-3">
            <Phone size={20} className="text-primary" />
            <div>
              <p className="text-sm text-white">
                {t('vitals_measurement.need_help')}
              </p>
              <p className="text-primary text-sm underline hover:text-secondary-accent cursor-pointer">
                {t('vitals_measurement.contact_us')}
              </p>
            </div>
          </div>
          <p className="text-cta hidden md:block">
            {t('vitals_measurement.footer')}
          </p>
          <div className="flex items-center gap-3">
            <QrCode size={40} className="text-primary" />
            <div>
              <p className="text-sm text-white">
                {t('vitals_measurement.get_app')}
              </p>
              <p className="text-primary text-sm">
                {t('vitals_measurement.download_app')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VitalsMeasurement;
