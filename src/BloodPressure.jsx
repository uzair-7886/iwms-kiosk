import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBloodPressure as setReduxBloodPressure, setHeartRate } from './redux/vitalsSlice'; // Adjust the path as needed
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, QrCode, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';

const steps = [
  { name: 'Height', path: '/1Height' },
  { name: 'Weight', path: '/2Weight' },
  { name: 'Blood Pressure', path: '/3BloodPressure' },
  { name: 'Temperature', path: '/4Temp' },
  { name: 'Glucose', path: '/5Glucose' },
  { name: 'SpO2', path: '/3SpO2' },
  { name: 'Summary', path: '/summary' },
];

const VitalsMeasurementBP = () => {
  const dispatch = useDispatch();
  // Get blood pressure from Redux state if needed
  // const reduxBloodPressure = useSelector((state) => state.vitals.bloodPressure);
  const heartRate = useSelector((state) => state.vitals.heartRate);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const location = useLocation();

  const [bloodPressure, setLocalBloodPressure] = useState({
    systolic: 120,
    diastolic: 80,
  });
  const [showBPModal, setShowBPModal] = useState(false);
  const [activeBPType, setActiveBPType] = useState('systolic');

  const currentStep = steps.findIndex((step) => step.path === location.pathname);

  const moveNext = () => {
    // Save bloodPressure to Redux before moving to next step
    dispatch(setReduxBloodPressure(bloodPressure));
    navigate(steps[currentStep + 1].path);
  };

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
        const response = await fetch(
          'https://api.openweathermap.org/data/2.5/weather?q=Islamabad&units=metric&appid=d56eaf1086fc151f4be787d9926ed8f8'
        );
        const data = await response.json();
        setWeather(data.main.temp);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    fetchWeather();
  }, []);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setDropdownOpen(false);
  };

  // Handle blood pressure changes
  const handleBloodPressureChange = (value) => {
    const newBP = {
      ...bloodPressure,
      [activeBPType]: parseInt(value)
    };
    setLocalBloodPressure(newBP);
  };

  return (
    <div className="relative min-h-screen bg-secondary flex flex-col items-center px-6">
      <div
        className="absolute inset-0 opacity-70 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: "url('./public/bgPattern.svg')",
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
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            {t('vitals_measurement.title')}
          </h1>
          <p className="text-gray-300 text-xl">{t('vitals_measurement.instructions')}</p>
        </div>

        <div className="flex flex-col justify-between items-center gap-8 mb-12">
          <div className="flex-1 flex justify-center">
            <img
              src="/blood-pressure.gif"  // Change this to the correct GIF path
              alt="Blood Pressure Measurement in progress"
              className="w-64 h-64 object-contain"
            />
          </div>
          {/* Blood Pressure Panel */}
          <div className="bg-extrablack rounded-xl p-6 border w-full border-white/35 flex-1">
            <div className="flex justify-between items-center mb-4 w-full">
              <span className="text-primary font-bold text-2xl">{t('blood_pressure.sys_dia')}</span>
            </div>
            <div className="flex items-center space-x-2">
              {/* Systolic Clickable Display */}
              <div
                onClick={() => {
                  setActiveBPType('systolic');
                  setShowBPModal(true);
                }}
                className="text-5xl bg-transparent m-8 text-white outline-none w-full cursor-pointer text-center"
              >
                {bloodPressure.systolic || '--'}
              </div>

              <span className="text-2xl text-white">/</span>

              {/* Diastolic Clickable Display */}
              <div
                onClick={() => {
                  setActiveBPType('diastolic');
                  setShowBPModal(true);
                }}
                className="text-5xl bg-transparent m-8 text-white outline-none w-full cursor-pointer text-center"
              >
                {bloodPressure.diastolic || '--'}
              </div>
            </div>
            <span className="text-2xl text-gray-400">mmHg</span>
          </div>

          {showBPModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-extrablack rounded-lg p-8 w-[500px] md:w-[600px]">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white text-2xl font-bold">
                    {activeBPType === 'systolic' ? 'Adjust Systolic (SYS)' : 'Adjust Diastolic (DIA)'}
                  </span>
                  <button
                    className="text-white text-xl"
                    onClick={() => setShowBPModal(false)}
                  >
                    ✕
                  </button>
                </div>

                {/* Unit Switch inside Modal */}
                <div className="flex bg-gray-700 rounded-lg p-1 w-48 mx-auto mb-8">
                  <button
                    className={`flex-1 py-2 rounded-md text-lg font-bold ${activeBPType === 'systolic' ? 'bg-primary text-white' : 'text-gray-300'}`}
                    onClick={() => setActiveBPType('systolic')}
                  >
                    SYS
                  </button>
                  <button
                    className={`flex-1 py-2 rounded-md text-lg font-bold ${activeBPType === 'diastolic' ? 'bg-primary text-white' : 'text-gray-300'}`}
                    onClick={() => setActiveBPType('diastolic')}
                  >
                    DIA
                  </button>
                </div>

                {/* Slider */}
                <div className="my-6">
                  <input
                    type="range"
                    min={activeBPType === 'systolic' ? 90 : 60}
                    max={activeBPType === 'systolic' ? 200 : 120}
                    value={activeBPType === 'systolic' ? bloodPressure.systolic || 120 : bloodPressure.diastolic || 80}
                    onChange={(e) => handleBloodPressureChange(e.target.value)}
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
                    <span>{activeBPType === 'systolic' ? '90 mmHg' : '60 mmHg'}</span>
                    <span>{activeBPType === 'systolic' ? '200 mmHg' : '120 mmHg'}</span>
                  </div>
                </div>

                {/* Current Selected BP */}
                <div className="text-5xl text-white font-bold text-center my-6">
                  {activeBPType === 'systolic' ? bloodPressure.systolic || 120 : bloodPressure.diastolic || 80} mmHg
                </div>

                {/* Confirm Button */}
                <button
                  onClick={() => setShowBPModal(false)}
                  className="w-full py-3 bg-primary text-white text-xl rounded-lg hover:bg-primary/80 transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}



          {/* Heart Rate Panel as input */}
          <div className="bg-extrablack rounded-xl p-6 border w-full border-white/35 flex-1">
            <div className="flex justify-between items-center mb-4">
              <span className="text-primary font-bold text-2xl">{t('blood_pressure.bpm')}</span>
              <button
                className="px-3 py-1 rounded bg-primary hover:bg-secondary-accent text-lg text-white font-bold"
                onClick={() => setShowChart(true)}
              >
                {t('blood_pressure.view_chart')}
              </button>
            </div>
            <input
              type="text"
              value={heartRate !== null ? heartRate : ''}
              onChange={(e) => dispatch(setHeartRate(e.target.value))}
              className="text-5xl bg-transparent text-white outline-none w-full"
            />
            <span className="text-2xl text-gray-400">BPM</span>
          </div>
        </div>

        <p className="text-center text-gray-300 mb-8 text-xl">
          {t('blood_pressure.heart_rate_instruction')}
        </p>

        <div className="flex flex-col gap-4 mx-auto">
          <button
            onClick={moveNext}
            className="w-full mb-4 py-6 bg-primary rounded-lg text-white font-medium text-lg hover:bg-primary/80 transition-colors"
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

      {showChart && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setShowChart(false)}
            >
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