import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronDown, Phone, QrCode, ArrowRight, Heart, Activity, Thermometer, Droplet, Clipboard, BarChart2 } from 'lucide-react';
import i18n from './i18n';
import { evaluateRecommendations } from './services/recommendations';
import { resetVitals } from './redux/vitalsSlice';

// Mapping of vital types to specific icons - updated to match code 2's style
const VITAL_ICONS = {
  'BMI': <BarChart2 size={28} className="text-blue-400" />,
  'Blood Pressure': <Activity size={28} className="text-red-500" />,
  'Heart Rate': <Heart size={28} className="text-pink-500" />,
  'Temperature': <Thermometer size={28} className="text-orange-400" />,
  'Oxygen Saturation': <Droplet size={28} className="text-sky-400" />,
  'Blood Sugar': <Clipboard size={28} className="text-emerald-400" />,
  'Metabolic Health': <Activity size={28} className="text-yellow-500" />,
  'Cardiorespiratory': <Activity size={28} className="text-rose-500" />,
  'Diet': <Clipboard size={28} className="text-green-400" />,
  'Diet & Genetics': <Clipboard size={28} className="text-indigo-400" />,
  'BMI & Blood Pressure': <Activity size={28} className="text-purple-400" />,
  'Infection Concern': <Thermometer size={28} className="text-amber-500" />
};

// Get icon based on vital name with fallback
const getVitalIcon = (vitalName) => {
  const exactMatch = VITAL_ICONS[vitalName];
  if (exactMatch) return exactMatch;

  // Try to match partial vital names
  for (const [key, icon] of Object.entries(VITAL_ICONS)) {
    if (vitalName.includes(key)) return icon;
  }

  // Default icon if no match
  return <Clipboard size={28} className="text-primary" />;
};

// Action steps mapping for different vital types
const getActionSteps = (vitalType) => {
  // Base action steps that apply to all recommendations
  const commonSteps = [
    {
      icon: <Activity size={20} className="text-rose-500" />,
      title: "Schedule Follow-up",
      description: "Revisit your wellness center in 30 days to track your progress"
    }
  ];

  // Specific action steps based on vital type
  const specificSteps = {
    'BMI': [
      {
        icon: <BarChart2 size={20} className="text-blue-400" />,
        title: "Exercise Regularly",
        description: "Aim for 150 minutes of moderate activity per week"
      },
      {
        icon: <Clipboard size={20} className="text-green-400" />,
        title: "Balanced Diet",
        description: "Focus on whole foods with appropriate portion sizes"
      }
    ],
    'Blood Pressure': [
      {
        icon: <Activity size={20} className="text-red-500" />,
        title: "Monitor Your Blood Pressure",
        description: "Track your readings at the same time each day"
      },
      {
        icon: <Clipboard size={20} className="text-green-400" />,
        title: "Reduce Sodium Intake",
        description: "Limit processed foods and added salt in your diet"
      }
    ],
    'Heart Rate': [
      {
        icon: <Heart size={20} className="text-pink-500" />,
        title: "Track Heart Rate Patterns",
        description: "Monitor your heart rate at rest and during activity"
      },
      {
        icon: <Activity size={20} className="text-blue-400" />,
        title: "Practice Deep Breathing",
        description: "Try 5 minutes of slow breathing exercises daily"
      }
    ],
    'Temperature': [
      {
        icon: <Thermometer size={20} className="text-orange-400" />,
        title: "Monitor Temperature",
        description: "Check your temperature twice daily if elevated"
      },
      {
        icon: <Droplet size={20} className="text-sky-400" />,
        title: "Stay Hydrated",
        description: "Drink at least 8-10 glasses of water daily"
      }
    ],
    'Oxygen Saturation': [
      {
        icon: <Droplet size={20} className="text-sky-400" />,
        title: "Deep Breathing Exercises",
        description: "Practice diaphragmatic breathing for 5 minutes, 3 times daily"
      },
      {
        icon: <Activity size={20} className="text-pink-500" />,
        title: "Maintain Good Posture",
        description: "Sit and stand with proper alignment to optimize breathing"
      }
    ],
    'Blood Sugar': [
      {
        icon: <Clipboard size={20} className="text-emerald-400" />,
        title: "Maintain Balanced Diet",
        description: "Focus on low-glycemic foods and regular meal timing"
      },
      {
        icon: <BarChart2 size={20} className="text-blue-400" />,
        title: "Monitor Blood Sugar",
        description: "Track levels before meals and 2 hours after eating"
      }
    ],
    'Metabolic Health': [
      {
        icon: <BarChart2 size={20} className="text-yellow-500" />,
        title: "Balanced Macronutrients",
        description: "Balance protein, healthy fats, and complex carbs at each meal"
      },
      {
        icon: <Activity size={20} className="text-blue-400" />,
        title: "Regular Physical Activity",
        description: "Include both cardio and strength training in your routine"
      }
    ],
    'Cardiorespiratory': [
      {
        icon: <Heart size={20} className="text-rose-500" />,
        title: "Cardio Exercise",
        description: "Start with low-impact activities like walking or swimming"
      },
      {
        icon: <Droplet size={20} className="text-sky-400" />,
        title: "Breathing Techniques",
        description: "Practice pursed-lip breathing when experiencing shortness of breath"
      }
    ],
    'Diet': [
      {
        icon: <Clipboard size={20} className="text-green-400" />,
        title: "Food Journal",
        description: "Track your meals and snacks for one week to identify patterns"
      },
      {
        icon: <Droplet size={20} className="text-blue-400" />,
        title: "Hydration Goals",
        description: "Drink water before meals to support digestion and portion control"
      }
    ],
    'Diet & Genetics': [
      {
        icon: <Clipboard size={20} className="text-indigo-400" />,
        title: "Personalized Nutrition",
        description: "Consider genetic factors when planning your diet"
      },
      {
        icon: <BarChart2 size={20} className="text-purple-400" />,
        title: "Regular Testing",
        description: "Monitor key health markers every 3-6 months"
      }
    ],
    'BMI & Blood Pressure': [
      {
        icon: <Activity size={20} className="text-purple-400" />,
        title: "Combined Approach",
        description: "Follow DASH diet principles to address both weight and blood pressure"
      },
      {
        icon: <BarChart2 size={20} className="text-blue-400" />,
        title: "Track Multiple Metrics",
        description: "Monitor both weight and blood pressure weekly"
      }
    ],
    'Infection Concern': [
      {
        icon: <Thermometer size={20} className="text-amber-500" />,
        title: "Regular Temperature Checks",
        description: "Monitor temperature every 4-6 hours when elevated"
      },
      {
        icon: <Droplet size={20} className="text-sky-400" />,
        title: "Increase Fluid Intake",
        description: "Drink clear fluids regularly to prevent dehydration"
      }
    ]
  };

  // Try to match exact vital type first
  if (specificSteps[vitalType]) {
    return [...specificSteps[vitalType], ...commonSteps];
  }

  // Try to match partial vital names
  for (const [key, steps] of Object.entries(specificSteps)) {
    if (vitalType.includes(key)) {
      return [...steps, ...commonSteps];
    }
  }

  // Default steps if no match
  return [
    {
      icon: <Clipboard size={20} className="text-primary" />,
      title: "Track Your Progress",
      description: "Keep a daily log of your symptoms and improvements"
    },
    {
      icon: <Activity size={20} className="text-blue-400" />,
      title: "Healthy Lifestyle",
      description: "Focus on balanced nutrition, exercise, and adequate rest"
    },
    ...commonSteps
  ];
};

const RecommendationsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = location.state || {};
  const vitals = navState.vitals || useSelector(state => state.vitals);
  const answers = navState.answers || {};
  const hasSaved = useRef(false);
  const dispatch = useDispatch();

  // Clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);


  
      const handleDone = () => {
        dispatch(resetVitals());
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

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setDropdownOpen(false);
  };

  // Generate recommendations
  const recData = evaluateRecommendations(vitals, answers);

  // Selected recommendation state for detailed view
  const [selectedRec, setSelectedRec] = useState(null);

  // Save recommendations to backend
  useEffect(() => {
    if (hasSaved.current || !localStorage.getItem('token')) return;
    hasSaved.current = true;

    const baseUrl = 'http://localhost:8080';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    const saveRecs = async () => {
      try {
        console.log("Saving recommendations:", recData);
        await fetch(`${baseUrl}/api/recommendations/add`, {
          method: 'POST',
          headers,
          body: JSON.stringify(recData),
        });
      } catch (error) {
        console.error("Failed to save recommendations:", error);
      }
    };

    saveRecs();
  }, [recData]);


  // Group recommendations by category for better organization
  const groupedRecs = {};
  recData.forEach(rec => {
    const category = rec.vital.includes('&') ? 'Combined Health Factors' :
      (rec.vital === 'BMI' ? 'Body Composition' :
        (rec.vital.includes('Blood') ? 'Blood Metrics' :
          (rec.vital.includes('Heart') || rec.vital.includes('Oxygen') ? 'Cardiorespiratory' : 'Other Health Factors')));

    if (!groupedRecs[category]) {
      groupedRecs[category] = [];
    }
    groupedRecs[category].push(rec);
  });

  return (
    <div className="relative min-h-screen bg-secondary flex flex-col items-center">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 opacity-70 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url('./public/bgPattern.svg')`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Navigation */}
      <nav className="flex justify-between items-center px-12 py-12 w-full max-w-7xl mx-auto">
        <img src="/logo-nav.svg" alt="Reviva" className="h-8" />
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-white text-xl">
            <img src="/weather.svg" alt="Temperature" className="w-6 h-6" />
            <span className="text-lg font-bold">{weather !== null ? `${weather}° C` : "--° C"}</span>
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

      {/* Content Container */}
      <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col px-6 py-8 z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-primary">Your Wellness Recommendations</h1>
          <p className="mt-4 mb-4 text-xl text-white/80">Based on your health assessment, we've personalized these recommendations for your optimal wellness journey.</p>
        </div>

        {/* Main Content */}
        <div className="flex-grow">
          {selectedRec ? (
            // Detailed view of selected recommendation with dynamic action steps
            <div className="animate-fadeIn bg-extrablack border border-white/10 rounded-xl p-8 shadow-xl">
              <button
                onClick={() => setSelectedRec(null)}
                className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-colors"
              >
                <ArrowRight size={24} className="transform rotate-180" />
                <span className='text-xl'>Back to all recommendations</span>
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-extrablack/50 rounded-full border border-white/10">
                  {getVitalIcon(selectedRec.vital)}
                </div>
                <h2 className="text-3xl font-bold text-white">{selectedRec.vital}</h2>
              </div>

              <div className="bg-extrablack/30 p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-medium text-primary mb-4">Your Recommendation</h3>
                <p className="text-lg text-white leading-relaxed whitespace-pre-line">{selectedRec.message}</p>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-medium text-primary mb-4">Action Steps</h3>
                <div className="space-y-4">
                  {getActionSteps(selectedRec.vital).map((step, index) => (
                    <div key={index} className="flex gap-3 items-center bg-extrablack/30 p-4 rounded-lg border border-white/10">
                      <div className="mt-1">{step.icon}</div>
                      <div>
                        <h4 className="font-medium text-lg text-white">{step.title}</h4>
                        <p className="text-white/70 text-lg">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // List view of all recommendations grouped by category
            <div className="space-y-8 max-h-[65vh] overflow-y-auto pr-2 scrollbar-hide">
              {Object.entries(groupedRecs).map(([category, recs]) => (
                <div key={category} className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-primary">{category}</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {recs.map((rec, idx) => (
                      <div
                        key={idx}
                        className="p-6 bg-extrablack border border-white/10 hover:border-primary/50 transition-colors cursor-pointer shadow-lg rounded-xl flex items-center group"
                        onClick={() => setSelectedRec(rec)}
                      >
                        <div className="p-3 bg-extrablack rounded-full border border-white/10 mr-4">
                          {getVitalIcon(rec.vital)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-2">{rec.vital}</h3>
                          <p className="text-white/70 text-lg">{rec.message}</p>
                        </div>
                        <div className="text-primary">
                          <ArrowRight size={24} className="ml-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-8 w-full mb-16">
          <button
            onClick={handleDone}
            className="w-full py-5 bg-primary rounded-lg text-white font-medium text-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <span>Complete Your Wellness Session</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-extrablack/90 backdrop-blur-md py-4 z-20 border-t border-white/10">
        <div className="flex justify-between items-center px-8 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Phone size={24} className="text-primary" />
            <div>
              <p className="text-sm text-white">Need help?</p>
              <p className="text-primary text-sm font-medium cursor-pointer">Contact support</p>
            </div>
          </div>
          <p className="hidden md:block text-white/70">Powered by Reviva Wellness</p>
          <div className="flex items-center gap-3">
            <QrCode size={42} className="text-primary" />
            <div>
              <p className="text-sm text-white">Get the app</p>
              <p className="text-primary text-sm font-medium">Download now</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RecommendationsPage;