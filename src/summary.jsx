
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, QrCode, Activity, TrendingUp, AlertCircle, ThumbsUp, BarChart2, ChevronDown } from 'lucide-react';
import { FaWeight, FaThermometerHalf, FaHeartbeat, FaTint, FaLungs } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { useRef } from 'react';

// Mock translation function since we don't have the actual i18n implementation
const useTranslation = () => {
  return {
    t: (key) => {
      const translations = {
        'summary.title': 'Health Summary',
        'summary.weight': 'Weight',
        'summary.temperature': 'Temperature',
        'summary.blood_pressure': 'Blood Pressure',
        'summary.glucose': 'Glucose',
        'summary.oxygen': 'Oxygen',
        'summary.heart_rate': 'Heart Rate',
        'summary.next': 'Continue to Recommendations',
        'vitals_measurement.need_help': 'Need assistance?',
        'vitals_measurement.contact_us': 'Contact support',
        'vitals_measurement.footer': 'Powered by Reviva Health',
        'vitals_measurement.get_app': 'Take it with you',
        'vitals_measurement.download_app': 'Scan to download'
      };
      return translations[key] || key;
    }
  };
};

// Mock for displaying the component without Redux
const mockVitals = {
  weight: '78',
  bloodPressure: { systolic: '135', diastolic: '85' },
  temperature: '37.1',
  glucose: '105',
  spo2: '97',
  heartRate: '72'
};

const SummaryPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(27.5); // Mock weather data
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVital, setSelectedVital] = useState(null);

  const hasSaved = useRef(false);

  // Get vitals from Redux store (or use mock data for demonstration)
  const { weight, bloodPressure, temperature, glucose, spo2, heartRate } = useSelector((state) => state.vitals) || mockVitals;

  // Define language options
  const languages = {
    en: { flag: '/usa.png', label: 'English' },
    ur: { flag: '/pk.png', label: 'اردو' }
  };

  // Current language (mock)
  const i18n = { language: 'en' };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (hasSaved.current) return;
    if (!token) return; // not logged in, skip

    const baseUrl = 'http://localhost:8080';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const saveMeasurements = async () => {
      try {
        if (weight) {
          await fetch(
            `${baseUrl}/api/measurements/add/weight?weight=${weight}`,
            { method: 'POST', headers }
          );
        }
        if (temperature) {
          await fetch(
            `${baseUrl}/api/measurements/add/temperature?temperature=${temperature}`,
            { method: 'POST', headers }
          );
        }
        if (bloodPressure?.systolic && bloodPressure?.diastolic) {
          await fetch(
            `${baseUrl}/api/measurements/add/blood-pressure?systolic=${bloodPressure.systolic}&diastolic=${bloodPressure.diastolic}`,
            { method: 'POST', headers }
          );
        }
        if (glucose) {
          await fetch(
            `${baseUrl}/api/measurements/add/glucose?glucoseLevel=${glucose}`,
            { method: 'POST', headers }
          );
        }
        if (spo2) {
          await fetch(
            `${baseUrl}/api/measurements/add/blood-oxygen?bloodOxygen=${spo2}`,
            { method: 'POST', headers }
          );
        }
        if (heartRate) {
          await fetch(
            `${baseUrl}/api/measurements/add/heart-rate?heartRate=${heartRate}`,
            { method: 'POST', headers }
          );
        }
      } catch (error) {
        console.error('Error saving measurements:', error);
      }
    };
    hasSaved.current=true
    saveMeasurements();
  }, [weight, temperature, bloodPressure, glucose, spo2, heartRate]);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Define expected normal ranges
  const normalRanges = {
    weight: { min: 65, max: 75 }, // kg
    temperature: { min: 36.1, max: 37.2 }, // °C
    bloodPressure: {
      systolic: { min: 90, max: 140 },
      diastolic: { min: 60, max: 90 },
    },
    glucose: { min: 70, max: 100 }, // mg/dL before meals
    spo2: { min: 95, max: 100 }, // %
    heartRate: { min: 60, max: 100 }, // bpm
  };

  // Build vitals array using Redux store values
  const vitals = [
    {
      id: 'weight',
      icon: <img src="/weight-scale.svg" alt="Weight" className='w-8 h-8' />, // Placeholder icon
      label: t('summary.weight'),
      value: weight ? `${weight} kg` : "NA",
      normal: "65-75 kg",
      abnormal:
        weight &&
        (parseFloat(weight) < normalRanges.weight.min ||
          parseFloat(weight) > normalRanges.weight.max),
      description: "Weight is a key indicator of overall health and nutrition status.",
      tips: weight && parseFloat(weight) < normalRanges.weight.min ?
        "Consider a balanced diet with adequate calories to reach a healthy weight." :
        weight && parseFloat(weight) > normalRanges.weight.max ?
          "Focus on balanced nutrition and regular physical activity." :
          "Your weight is within the healthy range. Maintain your healthy lifestyle!",
      color: function () {
        if (this.value === "NA") return "text-gray-400";
        if (this.abnormal) return "text-red-400";
        return "text-green-400";
      }
    },
    {
      id: 'temperature',
      icon: <img src="/temp.svg" className="w-8 h-8"  alt="Temperature" />, // Placeholder icon
      label: t('summary.temperature'),
      value: temperature ? `${temperature}°C` : "NA",
      normal: "36.1-37.2°C",
      abnormal:
        temperature &&
        (parseFloat(temperature) < normalRanges.temperature.min ||
          parseFloat(temperature) > normalRanges.temperature.max),
      description: "Body temperature is a vital sign that indicates your body's ability to generate and dissipate heat.",
      tips: temperature && parseFloat(temperature) > normalRanges.temperature.max ?
        "Elevated temperature may indicate infection or illness. Rest and stay hydrated." :
        temperature && parseFloat(temperature) < normalRanges.temperature.min ?
          "Low body temperature may need medical attention if persistent." :
          "Your temperature is normal, indicating good health.",
      color: function () {
        if (this.value === "NA") return "text-gray-400";
        if (this.abnormal) return "text-red-400";
        return "text-green-400";
      }
    },
    {
      id: 'bloodPressure',
      icon: <img src="/blood-pressure.svg" alt="Blood Pressure" className="w-8 h-8" />, // Placeholder icon
      label: t('summary.blood_pressure'),
      value:
        bloodPressure && bloodPressure.systolic && bloodPressure.diastolic
          ? `${bloodPressure.systolic}/${bloodPressure.diastolic} mmHg`
          : "NA",
      normal: "90-140/60-90 mmHg",
      abnormal:
        bloodPressure &&
        ((bloodPressure.systolic &&
          (parseFloat(bloodPressure.systolic) < normalRanges.bloodPressure.systolic.min ||
            parseFloat(bloodPressure.systolic) > normalRanges.bloodPressure.systolic.max)) ||
          (bloodPressure.diastolic &&
            (parseFloat(bloodPressure.diastolic) < normalRanges.bloodPressure.diastolic.min ||
              parseFloat(bloodPressure.diastolic) > normalRanges.bloodPressure.diastolic.max))),
      description: "Blood pressure measures the force of blood against your artery walls and is important for heart health.",
      tips: bloodPressure && ((bloodPressure.systolic && parseFloat(bloodPressure.systolic) > normalRanges.bloodPressure.systolic.max) ||
        (bloodPressure.diastolic && parseFloat(bloodPressure.diastolic) > normalRanges.bloodPressure.diastolic.max)) ?
        "Consider reducing sodium intake, regular exercise, and stress management techniques." :
        bloodPressure && ((bloodPressure.systolic && parseFloat(bloodPressure.systolic) < normalRanges.bloodPressure.systolic.min) ||
          (bloodPressure.diastolic && parseFloat(bloodPressure.diastolic) < normalRanges.bloodPressure.diastolic.min)) ?
          "Low blood pressure may cause dizziness. Stay hydrated and consult with a healthcare provider." :
          "Your blood pressure is within normal range, reflecting good cardiovascular health.",
      color: function () {
        if (this.value === "NA") return "text-gray-400";
        if (this.abnormal) return "text-red-400";
        return "text-green-400";
      }
    },
    {
      id: 'glucose',
      icon: <img src="/glucose.svg" alt="Glucose" className="w-8 h-8" />, // Placeholder icon
      label: t('summary.glucose'),
      value: glucose ? `${glucose} mg/dL` : "NA",
      normal: "70-100 mg/dL (Before Meals)",
      abnormal:
        glucose &&
        (parseFloat(glucose) < normalRanges.glucose.min ||
          parseFloat(glucose) > normalRanges.glucose.max),
      description: "Blood glucose levels indicate how well your body processes sugar and are critical for metabolic health.",
      tips: glucose && parseFloat(glucose) > normalRanges.glucose.max ?
        "Consider reducing simple carbohydrates and sugar intake. Regular exercise can help lower blood glucose." :
        glucose && parseFloat(glucose) < normalRanges.glucose.min ?
          "Low blood sugar may cause weakness. Consider having a small, balanced snack." :
          "Your glucose levels are healthy, indicating good metabolic function.",
      color: function () {
        if (this.value === "NA") return "text-gray-400";
        if (this.abnormal) return "text-red-400";
        return "text-green-400";
      }
    },
    {
      id: 'spo2',
      icon: <img src="/spo2.svg" alt="SpO2" className="w-8 h-8" />, // Placeholder icon
      label: t('summary.oxygen'),
      value: spo2 ? `${spo2}%` : "NA",
      normal: "95-100%",
      abnormal:
        spo2 && parseFloat(spo2) < normalRanges.spo2.min,
      description: "Blood oxygen saturation (SpO2) measures how well your lungs are delivering oxygen to your blood.",
      tips: spo2 && parseFloat(spo2) < normalRanges.spo2.min ?
        "Low oxygen levels require medical attention. Practice deep breathing and avoid high altitudes." :
        "Your oxygen levels are excellent, indicating good respiratory function.",
      color: function () {
        if (this.value === "NA") return "text-gray-400";
        if (this.abnormal) return "text-red-400";
        return "text-green-400";
      }
    },
    {
      id: 'heartRate',
      icon: <img src="/heart-rate.svg" alt="Heart Rate" className="w-8 h-8" />, // Placeholder icon
      label: t('summary.heart_rate'),
      value: heartRate ? `${heartRate} bpm` : "NA",
      normal: "60-100 bpm",
      abnormal: heartRate && (parseFloat(heartRate) < normalRanges.heartRate.min || parseFloat(heartRate) > normalRanges.heartRate.max),
      description: "Heart rate measures how many times your heart beats per minute and is an indicator of cardiovascular fitness.",
      tips: heartRate && parseFloat(heartRate) > normalRanges.heartRate.max ?
        "Elevated heart rate may indicate stress or anxiety. Practice relaxation techniques and moderate exercise." :
        heartRate && parseFloat(heartRate) < normalRanges.heartRate.min ?
          "Low resting heart rate may indicate good fitness, but if accompanied by symptoms, consult a doctor." :
          "Your heart rate is within normal range, indicating good cardiovascular health.",
      color: function () {
        if (this.value === "NA") return "text-gray-400";
        if (this.abnormal) return "text-red-400";
        return "text-green-400";
      }
    },
  ];

  // Calculate wellness score
  const calculateWellnessScore = () => {
    const availableVitals = vitals.filter(v => v.value !== "NA");
    if (availableVitals.length === 0) return 0;

    const abnormalCount = availableVitals.filter(v => v.abnormal).length;
    return Math.round(((availableVitals.length - abnormalCount) / availableVitals.length) * 100);
  };

  const wellnessScore = calculateWellnessScore();

  // Get wellness status based on score
  const getWellnessStatus = (score) => {
    if (score >= 90) return { text: "Excellent", color: "text-green-400" };
    if (score >= 75) return { text: "Good", color: "text-blue-400" };
    if (score >= 60) return { text: "Fair", color: "text-yellow-400" };
    return { text: "Needs Attention", color: "text-red-400" };
  };

  const wellnessStatus = getWellnessStatus(wellnessScore);

  // Count abnormal vitals
  const abnormalCount = vitals.filter(v => v.abnormal).length;

  // Determine navigation links
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart2 size={24} /> },
    { id: 'details', label: 'Details', icon: <Activity size={24} /> },
    { id: 'insights', label: 'Insights', icon: <TrendingUp size={24} /> }
  ];

  // Handle vital card click
  const handleVitalClick = (vital) => {
    setSelectedVital(selectedVital === vital.id ? null : vital.id);
  };

  return (
    <div className="relative min-h-screen bg-secondary flex flex-col items-center px-4 pb-24">
      <div
        className="absolute inset-0 opacity-70 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url('./public/bgPattern.svg')`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Header - Optimized for portrait kiosk */}
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

      <div className="w-full px-4 mx-auto text-white overflow-y-auto" style={{ maxHeight: "calc(100vh - 13rem)" }}>
        {/* Page Title - Larger for kiosk */}
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-6xl font-bold text-primary mb-3">{t('summary.title')}</h1>
          <p className="text-2xl text-white/80">Your personal health dashboard</p>
        </div>

        {/* Tab Navigation - Larger buttons for touch */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-extrablack p-2 rounded-lg border border-white/10 shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 rounded-md transition-all text-xl ${activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-white/70 hover:text-white'
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Wellness Score Card */}
            <div className="bg-extrablack rounded-xl p-8 shadow-lg border border-white/10">
              <div className="flex flex-col items-center">
                <div className="flex flex-col items-center mb-6">
                  <h2 className="text-3xl font-semibold mb-3">Wellness Score</h2>
                  <div className="flex items-baseline">
                    <span className={`text-7xl font-bold ${wellnessStatus.color}`}>{wellnessScore}</span>
                    <span className="text-3xl text-white/60 ml-2">/100</span>
                  </div>
                  <p className={`mt-2 text-2xl font-medium ${wellnessStatus.color}`}>{wellnessStatus.text}</p>
                </div>

                <div className="w-full flex flex-col">
                  <div className="flex justify-between mb-3">
                    <span className="text-xl text-white/70">Status</span>
                    <span className="font-medium text-xl">
                      {abnormalCount > 0 ? (
                        <span className="flex items-center text-yellow-400">
                          <AlertCircle size={24} className="mr-2" />
                          {abnormalCount} {abnormalCount === 1 ? 'vital' : 'vitals'} need attention
                        </span>
                      ) : (
                        <span className="flex items-center text-green-400">
                          <ThumbsUp size={24} className="mr-2" />
                          All vitals normal
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${wellnessScore >= 90 ? 'bg-green-400' :
                          wellnessScore >= 75 ? 'bg-blue-400' :
                            wellnessScore >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                      style={{ width: `${wellnessScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vitals Summary Cards - Single column for portrait */}
            <div className="grid grid-cols-1 gap-6">
              {vitals.map((vital) => (
                <div
                  key={vital.id}
                  onClick={() => handleVitalClick(vital)}
                  className={`bg-extrablack rounded-xl p-6 cursor-pointer transition-all shadow-lg border ${vital.abnormal ? 'border-red-500/40' : 'border-white/10'
                    } ${selectedVital === vital.id ? 'ring-2 ring-primary' : 'hover:bg-extrablack/80'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${vital.value !== "NA" ? vital.abnormal ? 'bg-red-500/20' : 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                        {vital.icon}
                      </div>
                      <h3 className="ml-4 font-medium text-2xl">{vital.label}</h3>
                    </div>
                    <div className={`text-lg px-3 py-2 rounded-md ${vital.value === "NA"
                        ? 'bg-gray-600/30 text-gray-400'
                        : vital.abnormal
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                      {vital.value === "NA"
                        ? "No Data"
                        : vital.abnormal
                          ? "Abnormal"
                          : "Normal"}
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className={`text-3xl font-bold ${vital.color()}`}>
                      {vital.value}
                    </span>
                    <span className="text-lg text-white/60">Normal: {vital.normal}</span>
                  </div>

                  {/* Expanded section */}
                  {selectedVital === vital.id && (
                    <div className="mt-5 pt-5 border-t border-white/10">
                      <p className="text-lg text-white/80 mb-4">{vital.description}</p>
                      <div className="bg-white/5 p-4 rounded-lg">
                        <div className="flex items-start">
                          <div className="mt-1 mr-3">
                            {vital.abnormal ?
                              <AlertCircle size={24} className="text-yellow-400" /> :
                              <ThumbsUp size={24} className="text-green-400" />
                            }
                          </div>
                          <p className="text-lg">{vital.tips}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="bg-extrablack rounded-xl p-6 shadow-lg border border-white/10">
            <h2 className="text-3xl font-semibold mb-6">Detailed Measurements</h2>

            <div className="space-y-8">
              {vitals.map((vital) => (
                <div key={vital.id} className="border-b border-white/10 pb-6 last:border-0">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className={`p-3 mr-4 rounded-full ${vital.value !== "NA"
                          ? vital.abnormal
                            ? 'bg-red-500/20'
                            : 'bg-green-500/20'
                          : 'bg-gray-500/20'
                        }`}>
                        {vital.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-2xl">{vital.label}</h3>
                        <p className="text-lg text-white/60">Normal range: {vital.normal}</p>
                      </div>
                    </div>
                    <div>
                      <span className={`text-3xl font-bold ${vital.color()}`}>
                        {vital.value}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="w-full bg-white/10 rounded-full h-3">
                      {vital.value !== "NA" && (
                        <div
                          className={`h-3 rounded-full ${vital.abnormal ? 'bg-red-400' : 'bg-green-400'}`}
                          style={{ width: '70%' }} // Simplified for example
                        ></div>
                      )}
                    </div>

                    {vital.value !== "NA" && (
                      <div className="flex justify-between text-lg mt-2 text-white/60">
                        <span>Min</span>
                        <span>Max</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-8">
            <div className="bg-extrablack rounded-xl p-8 shadow-lg border border-white/10">
              <h2 className="text-3xl font-semibold mb-6">Wellness Insights</h2>

              {abnormalCount > 0 ? (
                <div className="space-y-6">
                  <p className="text-xl text-white/80">Based on your measurements, here are some key insights:</p>

                  {vitals.filter(v => v.abnormal).map((vital) => (
                    <div key={vital.id} className="bg-white/5 p-6 rounded-lg border-l-4 border-yellow-500">
                      <h3 className="font-medium mb-3 text-2xl flex items-center">
                        {vital.icon}
                        <span className="ml-3">{vital.label} Attention</span>
                      </h3>
                      <p className="text-lg">{vital.tips}</p>
                    </div>
                  ))}

                  <div className="mt-8 p-6 bg-primary/10 rounded-lg">
                    <h3 className="font-medium mb-4 text-2xl flex items-center">
                      <Activity size={28} className="mr-3" />
                      <span>Recommendations</span>
                    </h3>
                    <ul className="space-y-4 text-lg">
                      <li className="flex items-start">
                        <div className="mt-1 mr-3 flex-shrink-0 text-xl">•</div>
                        <span>Schedule a follow-up with your healthcare provider to discuss your abnormal measurements.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-1 mr-3 flex-shrink-0 text-xl">•</div>
                        <span>Continue monitoring your vitals daily to track improvements.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-1 mr-3 flex-shrink-0 text-xl">•</div>
                        <span>Consider lifestyle adjustments based on the specific measurements that need attention.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-center mb-8">
                    <div className="bg-green-500/20 p-6 rounded-full border border-green-500/40">
                      <ThumbsUp size={48} className="text-green-500" />
                    </div>
                  </div>

                  <p className="text-center text-xl text-white/80">Great job! All your vital measurements are within normal ranges.</p>

                  <div className="mt-8 p-6 bg-green-500/10 rounded-lg border border-green-500/40">
                    <h3 className="font-medium mb-4 text-2xl flex items-center">
                      <Activity size={28} className="mr-3" />
                      <span>Maintain Your Wellness</span>
                    </h3>
                    <ul className="space-y-4 text-lg">
                      <li className="flex items-start">
                        <div className="mt-1 mr-3 flex-shrink-0 text-xl">•</div>
                        <span>Continue your healthy habits and lifestyle choices.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-1 mr-3 flex-shrink-0 text-xl">•</div>
                        <span>Regular monitoring helps catch any changes early.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-1 mr-3 flex-shrink-0 text-xl">•</div>
                        <span>Consider scheduling your next wellness check-up in 3-6 months.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Trends (Mockup) */}
            <div className="bg-extrablack rounded-xl p-6 shadow-lg border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Recent Trends</h2>
                <span className="text-lg text-white/60">Last 7 days</span>
              </div>

              <div className="h-64 flex items-center justify-center border border-dashed border-white/20 rounded-lg">
                <p className="text-xl text-white/60">Your measurement history will appear here as you continue to track your vitals</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons - Larger for kiosk touch */}
        <div className="flex flex-col gap-5 w-full mx-auto mt-12 mb-24">
          <button
            onClick={() => navigate('/questionnaire')}
            className="w-full py-8 bg-primary rounded-lg text-white font-medium text-2xl hover:bg-primary/80 transition-colors flex items-center justify-center"
          >
            <span>{t('summary.next')}</span>
            <TrendingUp size={24} className="ml-3" />
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button className="py-5 rounded-lg text-white font-medium text-xl border border-white/20 hover:bg-white/5 transition-colors">
              Download Report
            </button>
            <button className="py-5 rounded-lg text-white font-medium text-xl border border-white/20 hover:bg-white/5 transition-colors">
              Share Results
            </button>
          </div>
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

export default SummaryPage;