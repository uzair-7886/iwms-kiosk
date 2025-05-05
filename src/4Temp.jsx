import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTemperature } from './redux/vitalsSlice';
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
  // Read temperature value from Redux store (defaulting to an empty string if not set)
  const temperature = useSelector((state) => state.vitals.temperature) || "";
  const [tempUnit, setTempUnit] = useState('C');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [feverStatus, setFeverStatus] = useState('No Fever');
  const location = useLocation();

  const currentStep = steps.findIndex(step => step.path === location.pathname);

  const moveNext = () => {
    navigate(steps[currentStep + 1].path);
  };

  const languages = {
    en: { flag: '/usa.png', label: 'English' },
    ur: { flag: '/pk.png', label: 'اردو' },
  };

  useEffect(() => {
    // Convert the stored temperature value to a number
    const temp = parseFloat(temperature);
    if (isNaN(temp)) {
      setFeverStatus('No Fever');
      return;
    }

    // Important: temperature is always stored in Celsius in Redux
    let tempForFeverCheck;
    
    // If displaying in Fahrenheit, we need to check the original Celsius value
    // If displaying in Celsius, use the value directly
    tempForFeverCheck = temp;

    // Debug
    console.log(`Current temp: ${temp}, Unit: ${tempUnit}, For fever check: ${tempForFeverCheck}`);

    // Use the Celsius value to determine fever status
    if (tempForFeverCheck < 37) {
      setFeverStatus('No Fever');
    } else if (tempForFeverCheck >= 37 && tempForFeverCheck < 38) {
      setFeverStatus('Low Fever');
    } else {
      setFeverStatus('High Fever');
    }
  }, [temperature, tempUnit]);


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

  const convertTemperature = (value, toUnit = tempUnit) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '--';
    return toUnit === 'F' ? ((num * 9 / 5) + 32).toFixed(1) : num.toFixed(1);
  };
  

  // Function to call the Flask API endpoint to read temperature
  const startRecording = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/temperature', {
        method: 'GET'
      });
      const { temperature } = await response.json();
  
      if (temperature != null) {
        // API returns Celsius directly—store as string in Redux
        dispatch(setTemperature(temperature.toString()));
        // Always display Celsius
        setTempUnit('C');
      } else {
        console.error('Temperature data not available', temperature);
      }
    } catch (error) {
      console.error('Error recording temperature:', error);
    }
  };

  // State and Handlers (no change)
  const [modalOpen, setModalOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(temperature ? parseFloat(temperature) : 36.5);

  const handleTemperatureClick = () => {
    setSliderValue(parseFloat(temperature) || 36.5);
    setModalOpen(true);
  };

  const applyTemperature = () => {
    // Always store the actual temperature value (in Celsius) in Redux
    let valueToStore = sliderValue;
    
    // If user is working in Fahrenheit, convert to Celsius for storage
    if (tempUnit === 'F') {
      // Convert from display value (F) back to storage value (C)
      valueToStore = ((parseFloat(convertTemperature(sliderValue, 'F')) - 32) * 5 / 9);
    }
    
    dispatch(setTemperature(valueToStore.toString()));
    setModalOpen(false);
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
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-md font-bold mb-2 ${index === currentStep ? 'border-primary text-primary' : 'border-gray-400 text-gray-400'
                  }`}
              >
                {index + 1}
              </div>
              <button
                className={`text-md font-bold ${index === currentStep ? 'text-primary' : 'text-gray-400'}`}
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
              src="/temp.gif"
              alt="Temperature Measurement in progress"
              className="w-64 h-64 object-contain"
            />
          </div>
          <div className="bg-extrablack rounded-xl p-6 border w-full border-white/35 flex-1">
            <div className="flex justify-between  mb-4">
              <span className="text-primary font-bold text-2xl">
                {t('temperature.Temp')}
              </span>
              <div className="flex bg-gray-700 rounded-lg p-1 w-24">
                <button
                  className={`flex-1 py-1 rounded-md text-lg font-bold ${tempUnit === 'C' ? 'bg-primary text-white' : 'text-gray-300'}`}
                  onClick={() => setTempUnit('C')}
                >
                  °C
                </button>
                <button
                  className={`flex-1 py-1 rounded-md text-lg font-bold ${tempUnit === 'F' ? 'bg-primary text-white' : 'text-gray-300'}`}
                  onClick={() => setTempUnit('F')}
                >
                  °F
                </button>
              </div>
            </div>

            {/* Temperature display (clickable) */}
            <div
              onClick={handleTemperatureClick}
              className="text-5xl bg-transparent w-full text-white outline-none cursor-pointer "
            >
              {tempUnit === 'F' ? convertTemperature(temperature, 'F') : temperature}°
              <span className="text-2xl text-gray-400 ml-1">{tempUnit}</span>
            </div>
          </div>

          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-extrablack rounded-lg p-8 w-[500px] md:w-[600px]">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white text-2xl font-bold">Adjust Temperature</span>
                  <button
                    className="text-white text-xl"
                    onClick={() => setModalOpen(false)}
                  >
                    ✕
                  </button>
                </div>

                {/* Unit Switch */}
                <div className="flex bg-gray-700 rounded-lg p-1 w-48 mx-auto mb-8">
                  <button
                    className={`flex-1 py-2 rounded-md text-lg font-bold ${tempUnit === 'C' ? 'bg-primary text-white' : 'text-gray-300'}`}
                    onClick={() => setTempUnit('C')}
                  >
                    °C
                  </button>
                  <button
                    className={`flex-1 py-2 rounded-md text-lg font-bold ${tempUnit === 'F' ? 'bg-primary text-white' : 'text-gray-300'}`}
                    onClick={() => setTempUnit('F')}
                  >
                    °F
                  </button>
                </div>

                {/* Slider */}
                <div className="my-6">
                  <input
                    type="range"
                    min={tempUnit === 'C' ? 34 : 93}
                    max={tempUnit === 'C' ? 42 : 108}
                    step="0.1"
                    value={convertTemperature(sliderValue, tempUnit)}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setSliderValue(tempUnit === 'F' ? ((val - 32) * 5 / 9) : val);
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
                    <span>{tempUnit === 'C' ? '34 °C' : '93 °F'}</span>
                    <span>{tempUnit === 'C' ? '42 °C' : '108 °F'}</span>
                  </div>
                </div>

                {/* Current Selected Temperature */}
                <div className="text-5xl text-white font-bold text-center my-6">
                  {convertTemperature(sliderValue, tempUnit)}° {tempUnit}
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="w-full py-3 bg-gray-600 text-white text-xl rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyTemperature}
                    className="w-full py-3 bg-primary text-white text-xl rounded-lg hover:bg-primary/80 transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}



          <div className="bg-extrablack rounded-xl p-6 border w-full border-white/35 flex-1">
            <div className="flex justify-between items-center mb-4">
              <span className="text-primary font-bold text-2xl">{t('temperature.Fever')}</span>
            </div>
            <div className="text-4xl text-white mb-2">{feverStatus}</div>
          </div>
        </div>
        <p className="text-center text-gray-300 mb-10 text-xl">{t('temperature.temp_instruction')}</p>
        {/* "Start Recording" Button */}
        <div className="flex flex-col w-full gap-4 mx-auto mb-4">
          <button
            onClick={startRecording}
            className="w-full py-6 mb-4 bg-primary rounded-lg text-white text-lg font-medium hover:bg-primary/80 transition-colors"
          >
            Start Recording
          </button>
        </div>
        <div className="flex flex-col gap-4 mx-auto">
          <button
            onClick={moveNext}
            className="w-full py-6 mb-4 bg-primary rounded-lg text-white font-medium text-lg hover:bg-primary/80 transition-colors"
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