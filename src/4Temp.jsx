import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, QrCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import { ChevronDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const steps = [
    { name: 'Height', path: '/1Height' },
    { name: 'Weight', path: '/2Weight' },
    { name: 'Blood Pressure', path: '/3BloodPressure' },
    { name: 'Temperature', path: '/4Temp' }
];


const VitalsMeasurementBP = () => {
    const [tempUnit, setTempUnit] = useState('C');
    const [temperature, setTemperature] = useState('37');
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState(null);
    const [feverStatus, setFeverStatus] = useState('No Fever');
    const location = useLocation();

    const currentStep = steps.findIndex(step => step.path === location.pathname);

    const languages = {
        en: { flag: '/usa.png', label: 'English' },
        ur: { flag: '/pk.png', label: 'اردو' },
    };
    useEffect(() => {
        const tempInCelsius = tempUnit === 'F'
            ? (parseFloat(temperature) - 32) * 5 / 9
            : parseFloat(temperature);

        if (tempInCelsius < 37) {
            setFeverStatus('No Fever');
        } else if (tempInCelsius >= 37 && tempInCelsius < 38) {
            setFeverStatus('Low Fever');
        } else {
            setFeverStatus('High Fever');
        }
    }, [temperature, tempUnit]);

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
    const convertTemperature = (value) => {
        return tempUnit === 'F' ? ((value * 9 / 5) + 32).toFixed(1) : value;
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
            <nav className="flex justify-between items-center px-12 py-4 w-full max-w-8xl mx-auto">
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
                  {/* Progress Bar */}
                  <div className="w-full max-w-2xl flex items-center my-6 relative">
                    {steps.map((step, index) => (
                      <React.Fragment key={step.path}>
                        <div className="flex flex-col items-center">
                          <div 
                            className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm font-bold mb-2 ${index === currentStep ? 'border-primary text-primary' : 'border-gray-400 text-gray-400'}`}
                          >
                            {index + 1}
                          </div>
                          <button
                            className={`text-sm font-bold ${index === currentStep ? 'text-primary' : 'text-gray-400'}`}
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
                            <span className="text-primary font-bold">{t('temperature.Temp')}</span>
                            <div className="flex bg-gray-700 rounded-lg p-1 w-24">
                                <button
                                    className={`flex-1 py-1 rounded-md text-sm font-bold ${tempUnit === 'C' ? 'bg-primary text-white' : 'text-gray-300'}`}
                                    onClick={() => setTempUnit('C')}
                                >
                                    °C
                                </button>
                                <button
                                    className={`flex-1 py-1 rounded-md text-sm font-bold ${tempUnit === 'F' ? 'bg-primary text-white' : 'text-gray-300'}`}
                                    onClick={() => setTempUnit('F')}
                                >
                                    °F
                                </button>
                            </div>
                        </div>
                        <input
                            type="text"
                            value={convertTemperature(temperature)}
                            onChange={(e) => setTemperature(e.target.value)}
                            className="text-5xl bg-transparent w-full text-white outline-none"
                        />
                        <span className="text-2xl text-gray-400">{tempUnit}</span>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <img
                            src="/temp.gif"  // Change this to the correct GIF path
                            alt="Temperature Measurement in progress"
                            className="w-48 h-48 object-contain" // Adjust size if needed
                        />
                    </div>

                    <div className="bg-extrablack rounded-xl p-6 border h-[200px] border-white/35 flex-1">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-primary font-bold">{t('temperature.Fever')}</span>
                        </div>
                        <div className="text-5xl text-white">{feverStatus}</div>
                    </div>
                </div>

                <p className="text-center text-gray-300 mb-8">
                    {t('temperature.temp_instruction')}
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
