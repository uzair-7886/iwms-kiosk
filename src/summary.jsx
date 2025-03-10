import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, QrCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import { FaWeight, FaThermometerHalf, FaHeartbeat, FaTint, FaLungs } from "react-icons/fa";
import { IoMdPulse } from "react-icons/io";
import { ChevronDown } from 'lucide-react';



const VitalsMeasurementBP = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState(null);

    const languages = {
        en: { flag: '/usa.png', label: 'English' },
        ur: { flag: '/pk.png', label: 'اردو' },
    };
    const vitals = [
        { icon: <img src="/weight-scale.svg" alt="Weight" /> , label: t('summary.weight'), value: "70 kg", normal: "65-75 kg", color: "text-[#15B7A8]", border:"border-[#15B7A8]/40" },
        { icon: <img src="/temp.svg" alt="Weight" />, label: t('summary.temperature'), value: "36.7°C", normal: "36.1-37.2°C", color: "text-[#FF3F41]", border:"border-[#FF3F41]/40" },
        { icon: <img src="/blood-pressure.svg" alt="Blood Pressure" />, label: t('summary.blood_pressure'), value: "120/80 mmHg", normal: "90-140/60-90 mmHg", color: "text-[#BC4F66]", border:"border-[#BC4F66]/40" },
        { icon: <img src="/heart-rate.svg" alt="Heart Rate" />, label: t('summary.heart_rate'), value: "72 bpm", normal: "60-100 bpm", color: "text-[#F39E0F]", border:"border-[#F39E0F]/40" },
        { icon: <img src="/glucose.svg" alt="Glucose" />, label: t('summary.glucose'), value: "90 mg/dl", normal: "70-100 mg/dL (Before Meals)", color: "text-[#80649F]", border:"border-[#80649F]/40" },
        { icon: <img src="/spo2.svg" alt="SpO2" />, label: t('summary.oxygen'), value: "98%", normal: "95-100%", color: "text-[#4A82DF]", border:"border-[#4A82DF]/40" },
      ];
      
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

            <div className=" text-white p-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-2 text-primary"> {t('summary.title')}</h1>
                    <p className="text-white text-lg mb-6">{t('summary.desc')}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {vitals.map((vital, index) => (
                        <div
                            key={index}
                            className={`shadow-lg flex flex-col items-center bg-extrablack rounded-xl p-6 border  ${vital.border}`}
                        >
                            <div className={vital.color}>{vital.icon}</div>
                            <h3 className="text-lg font-semibold mt-2">{vital.label}</h3>
                            <p className={`text-2xl font-bold mt-1 ${vital.color}`}>{vital.value}</p>
                            {vital.normal && (
                                <div className="w-full mt-2"><p className={`shadow-lg text-center p-2 text-sm text-gray-400 mt-2 bg-[#292E32] rounded-[6px] border ${vital.border}`}>Normal: {vital.normal}</p></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-4 w-2/6 mx-auto">
                    <button className="w-full py-4 bg-primary rounded-lg text-white font-medium hover:bg-primary/80 transition-colors">
                        {t('summary.next')}
                    </button>
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
