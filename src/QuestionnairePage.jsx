import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Phone, QrCode, ChevronDown, AlertCircle, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import { getAbnormalVitals, generateFollowUpQuestions } from './services/recommendations';

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
  const rawQuestions = generateFollowUpQuestions(abnormalities);
  
  // Enhance questions with predefined answer options
  const questions = rawQuestions.map(question => {
    // Add predefined options based on the question key
    const options = getQuestionOptions(question.vital, question.key);
    return { ...question, options };
  });

  // Collect user answers
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionProgress, setQuestionProgress] = useState(0);
  
  // Track completion status
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    // Calculate progress percentage
    if (questions.length > 0) {
      setQuestionProgress((completed.length / questions.length) * 100);
    }
  }, [completed, questions.length]);

  const handleOptionSelect = (vital, key, value) => {
    setAnswers(prev => ({
      ...prev,
      [vital]: { ...(prev[vital] || {}), [key]: value }
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      const questionId = questions[currentQuestion].vital + '_' + questions[currentQuestion].key;
      if (!completed.includes(questionId)) {
        setCompleted([...completed, questionId]);
      }
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // On last question
      const questionId = questions[currentQuestion].vital + '_' + questions[currentQuestion].key;
      if (!completed.includes(questionId)) {
        setCompleted([...completed, questionId]);
      }
      
      // Submit the form
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Check if current question has an answer
  const isCurrentQuestionAnswered = () => {
    if (questions.length === 0) return true;
    
    const q = questions[currentQuestion];
    return answers[q.vital]?.[q.key] !== undefined;
  };

  // Submit questionnaire and navigate
  const handleSubmit = () => {
    navigate('/recommendations', { state: { vitals, answers } });
  };

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

      {/* Main Content */}
      <div className="w-full max-w-5xl mx-auto px-6 pb-32 flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center text-white mb-8 mt-6">
          <h1 className="text-5xl font-bold text-primary mb-4">Wellness Assessment</h1>
          <p className="text-xl opacity-90 mb-4">Help us understand your health better with a few questions</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-16">
          <div className="flex justify-between text-white mb-2">
            <span className="text-xl">{questions.length > 0 ? `Question ${currentQuestion + 1} of ${questions.length}` : 'Assessment'}</span>
            <span className="text-xl">{Math.round(questionProgress)}% Complete</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${questionProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Cards */}
        <div className="flex-1 w-full">
          {questions.length > 0 ? (
            <div className="relative h-full">
              {questions.map((question, idx) => (
                <div 
                  key={idx}
                  className={`absolute w-full transition-all duration-500 ease-in-out ${
                    idx === currentQuestion ? 'opacity-100 translate-x-0' : 
                    idx < currentQuestion ? 'opacity-0 -translate-x-full' : 
                    'opacity-0 translate-x-full'
                  }`}
                  style={{ display: idx === currentQuestion ? 'block' : 'none' }}
                >
                  <div className="bg-extrablack rounded-xl border border-white/10 shadow-lg p-8">
                    <div className="flex items-start mb-6">
                      {question.critical ? (
                        <AlertCircle size={36} className="text-red-400 mr-4 flex-shrink-0 mt-1" />
                      ) : (
                        <HelpCircle size={36} className="text-primary mr-4 flex-shrink-0 mt-1" />
                      )}
                      <div>
                        <h3 className="text-2xl text-white font-medium mb-2">{question.text}</h3>
                        <p className="text-white/70 text-xl">{question.description || "Your answer helps us provide better recommendations for your wellness journey."}</p>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <label className="block text-white/80 text-xl mb-3">Select your answer:</label>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {question.options && question.options.map((option, optionIdx) => (
                          <div 
                            key={optionIdx}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              answers[question.vital]?.[question.key] === option.value
                                ? 'bg-primary/20 border-primary'
                                : 'bg-white/5 border-white/20 hover:bg-white/10'
                            }`}
                            onClick={() => handleOptionSelect(question.vital, question.key, option.value)}
                          >
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                                answers[question.vital]?.[question.key] === option.value
                                  ? 'bg-primary'
                                  : 'border border-white/50'
                              }`}>
                                {answers[question.vital]?.[question.key] === option.value && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                              <span className="text-xl text-white">{option.label}</span>
                            </div>
                            {option.description && (
                              <p className="text-white/70 text-lg mt-2 pl-8">{option.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Option for "Other" with text input if needed */}
                      {question.allowCustom && (
                        <div className="mt-4">
                          <div 
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              answers[question.vital]?.[question.key] === 'other'
                                ? 'bg-primary/20 border-primary'
                                : 'bg-white/5 border-white/20 hover:bg-white/10'
                            }`}
                            onClick={() => handleOptionSelect(question.vital, question.key, 'other')}
                          >
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                                answers[question.vital]?.[question.key] === 'other'
                                  ? 'bg-primary'
                                  : 'border border-white/50'
                              }`}>
                                {answers[question.vital]?.[question.key] === 'other' && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                              <span className="text-lg text-white">Other (please specify)</span>
                            </div>
                          </div>
                          
                          {answers[question.vital]?.[question.key] === 'other' && (
                            <textarea
                              placeholder="Please specify your answer..."
                              value={answers[question.vital]?.otherText || ''}
                              onChange={(e) => setAnswers(prev => ({
                                ...prev,
                                [question.vital]: { ...(prev[question.vital] || {}), otherText: e.target.value }
                              }))}
                              className="w-full p-3 rounded-lg text-black text-lg mt-2 focus:ring-2 focus:ring-primary"
                            />
                          )}
                        </div>
                      )}
                    </div>
                    
                    {question.hint && (
                      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mt-4">
                        <p className="text-white/90 flex items-start">
                          <span className="text-primary mr-2">💡</span>
                          {question.hint}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-extrablack rounded-xl border border-white/10 shadow-lg p-8 text-center">
              <div className="flex flex-col items-center justify-center py-12">
                <CheckCircle size={80} className="text-green-400 mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">Great News!</h2>
                <p className="text-xl text-white/80 max-w-xl mx-auto mb-8">
                  All your vital measurements are within normal ranges. No additional questions are needed at this time.
                </p>
                <button
                  onClick={handleSubmit}
                  className="py-6 px-12 bg-primary rounded-lg text-white font-semibold text-xl hover:bg-primary/90 transition-colors flex items-center"
                >
                  Continue to Recommendations
                  <ArrowRight size={24} className="ml-2" />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation Buttons */}
        {questions.length > 0 && (
          <div className="flex justify-between gap-6 mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`py-6 px-8 rounded-lg text-white font-medium text-xl border border-white/20 transition-colors ${
                currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'
              }`}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!isCurrentQuestionAnswered()}
              className={`flex-1 py-6 rounded-lg text-white font-medium text-xl transition-colors flex items-center justify-center ${
                isCurrentQuestionAnswered() 
                  ? 'bg-primary hover:bg-primary/90' 
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Assessment'}
              <ArrowRight size={24} className="ml-2" />
            </button>
          </div>
        )}
      </div>

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

// Helper function to get predefined options for each question
function getQuestionOptions(vital, key) {
  const optionsMap = {
    // BMI Questions
    familyHistoryObesity: [
      { value: 'yes', label: 'Yes', description: 'Close family members have obesity issues' },
      { value: 'no', label: 'No', description: 'No known family history of obesity' },
      { value: 'unsure', label: 'Not sure', description: 'I dont have enough information' }
    ],
    exerciseHabits: [
      { value: 'none', label: 'None', description: 'I rarely or never exercise' },
      { value: 'light', label: '1-2 days/week', description: 'Light exercise once or twice a week' },
      { value: 'moderate', label: '3-4 days/week', description: 'Regular moderate exercise' },
      { value: 'active', label: '5+ days/week', description: 'Active lifestyle with frequent exercise' }
    ],
    unintendedWeightLoss: [
      { value: 'none', label: 'No weight loss', description: 'My weight has been stable' },
      { value: 'slight', label: 'Slight (1-5 lbs)', description: 'Lost a small amount unintentionally' },
      { value: 'moderate', label: 'Moderate (5-10 lbs)', description: 'Notable weight loss without trying' },
      { value: 'significant', label: 'Significant (10+ lbs)', description: 'Substantial unintended weight loss' }
    ],
    dietaryIntake: [
      { value: 'insufficient', label: 'Insufficient', description: 'I often skip meals or eat very little' },
      { value: 'adequate', label: 'Adequate', description: 'I eat regular meals with sufficient calories' },
      { value: 'excessive', label: 'More than needed', description: 'I eat more than my body requires' }
    ],
    
    // Blood Pressure Questions
    familyHistoryBP: [
      { value: 'yes', label: 'Yes', description: 'Family history of high blood pressure' },
      { value: 'no', label: 'No', description: 'No known family history of high blood pressure' },
      { value: 'unsure', label: 'Not sure', description: 'I dont have enough information' }
    ],
    highSaltDiet: [
      { value: 'yes', label: 'Yes', description: 'I consume many salty foods or add salt regularly' },
      { value: 'moderate', label: 'Moderate', description: 'Im somewhat careful about salt intake' },
      { value: 'no', label: 'No', description: 'I follow a low-sodium diet' }
    ],
    bpMeds: [
      { value: 'yes', label: 'Yes', description: 'Currently taking BP medication' },
      { value: 'no', label: 'No', description: 'Not on any BP medication' },
      { value: 'previous', label: 'Previously', description: 'Have taken BP medication in the past' }
    ],
    dizziness: [
      { value: 'frequent', label: 'Frequently', description: 'I often feel dizzy or lightheaded' },
      { value: 'occasional', label: 'Occasionally', description: 'I sometimes experience dizziness' },
      { value: 'rare', label: 'Rarely', description: 'I rarely experience dizziness' },
      { value: 'never', label: 'Never', description: 'I never feel dizzy or lightheaded' }
    ],
    hydration: [
      { value: 'dehydrated', label: 'Dehydrated', description: 'Ive had very little to drink today' },
      { value: 'adequate', label: 'Adequately hydrated', description: 'Ive had a normal amount of fluids' },
      { value: 'wellHydrated', label: 'Well hydrated', description: 'Ive been drinking plenty of fluids' }
    ],
    
    // Heart Rate Questions
    recentExercise: [
      { value: 'yes', label: 'Yes', description: 'Exercised within the last hour' },
      { value: 'light', label: 'Light activity', description: 'Light activity in the past hour' },
      { value: 'no', label: 'No', description: 'Have been resting for at least an hour' }
    ],
    anxiety: [
      { value: 'high', label: 'Very anxious', description: 'Feeling very stressed or anxious' },
      { value: 'moderate', label: 'Moderately anxious', description: 'Feeling somewhat stressed' },
      { value: 'slight', label: 'Slightly anxious', description: 'Feeling a little on edge' },
      { value: 'none', label: 'Not anxious', description: 'Feeling calm and relaxed' }
    ],
    fatigue: [
      { value: 'severe', label: 'Severely fatigued', description: 'Extremely tired, struggling to function' },
      { value: 'moderate', label: 'Moderately fatigued', description: 'Definitely tired but managing' },
      { value: 'mild', label: 'Mildly fatigued', description: 'A bit tired but not significantly' },
      { value: 'none', label: 'Not fatigued', description: 'Feeling well-rested and energetic' }
    ],
    athlete: [
      { value: 'professional', label: 'Professional athlete', description: 'Compete or train at a high level' },
      { value: 'serious', label: 'Serious fitness enthusiast', description: 'Train intensively and regularly' },
      { value: 'recreational', label: 'Recreational athlete', description: 'Exercise regularly for fitness' },
      { value: 'no', label: 'Not athletic', description: 'Dont engage in regular intense exercise' }
    ],
    
    // Temperature Questions
    infectionSymptoms: [
      { value: 'multiple', label: 'Multiple symptoms', description: 'Several signs of infection (cough, pain, etc.)' },
      { value: 'mild', label: 'Mild symptoms', description: 'One or two mild symptoms' },
      { value: 'none', label: 'No symptoms', description: 'No signs of infection' }
    ],
    medicationFever: [
      { value: 'recent', label: 'Yes, recently', description: 'Took medication in the last 4-6 hours' },
      { value: 'earlier', label: 'Yes, earlier today', description: 'Took medication more than 6 hours ago' },
      { value: 'no', label: 'No', description: 'Havent taken any fever-reducing medication' }
    ],
    feelingCold: [
      { value: 'very', label: 'Very cold', description: 'Feeling extremely cold, shivering' },
      { value: 'somewhat', label: 'Somewhat cold', description: 'Feeling chilly but not severely' },
      { value: 'no', label: 'Not cold', description: 'Temperature feels comfortable' }
    ],
    thyroid: [
      { value: 'yes', label: 'Yes', description: 'Diagnosed with thyroid condition' },
      { value: 'suspected', label: 'Suspected but not diagnosed', description: 'Symptoms suggest thyroid issues' },
      { value: 'no', label: 'No', description: 'No known thyroid issues' },
      { value: 'unsure', label: 'Not sure', description: 'Dont have enough information' }
    ],
    
    // SpO2 Questions
    breathingIssues: [
      { value: 'severe', label: 'Severe', description: 'Significant difficulty breathing' },
      { value: 'moderate', label: 'Moderate', description: 'Noticeable shortness of breath' },
      { value: 'mild', label: 'Mild', description: 'Slight breathing difficulty' },
      { value: 'none', label: 'None', description: 'Breathing normally' }
    ],
    knownLungIssues: [
      { value: 'yes', label: 'Yes', description: 'Diagnosed with respiratory condition' },
      { value: 'suspected', label: 'Suspected', description: 'Not diagnosed but suspect issues' },
      { value: 'previous', label: 'Previous issues', description: 'Had respiratory issues in the past' },
      { value: 'no', label: 'No', description: 'No known respiratory conditions' }
    ],
    
    // Glucose Questions
    recentMeal: [
      { value: 'lastHour', label: 'Within the last hour', description: 'Recently consumed food' },
      { value: '1-2hours', label: '1-2 hours ago', description: 'Ate a while ago' },
      { value: '2-4hours', label: '2-4 hours ago', description: 'Several hours since eating' },
      { value: '4plus', label: '4+ hours ago', description: 'Long time since last meal' }
    ],
    frequentUrination: [
      { value: 'very', label: 'Very frequent', description: 'Urinating much more than usual' },
      { value: 'somewhat', label: 'Somewhat frequent', description: 'Urinating more than usual' },
      { value: 'no', label: 'No change', description: 'Normal urination pattern' }
    ],
    diabetesMedication: [
      { value: 'insulin', label: 'Insulin', description: 'Took insulin recently' },
      { value: 'oral', label: 'Oral medication', description: 'Taking diabetes pills' },
      { value: 'both', label: 'Both insulin and oral meds', description: 'Taking multiple diabetes medications' },
      { value: 'none', label: 'None', description: 'Not on diabetes medication' },
      { value: 'notDiabetic', label: 'Not diabetic', description: 'Dont have diabetes' }
    ],
    symptomsLowSugar: [
      { value: 'severe', label: 'Severe symptoms', description: 'Shaking, sweating, confusion, etc.' },
      { value: 'mild', label: 'Mild symptoms', description: 'Slight symptoms of low blood sugar' },
      { value: 'none', label: 'No symptoms', description: 'Feeling normal' }
    ]
  };
  
  // Return predefined options or a default set
  return optionsMap[key] || [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
    { value: 'unsure', label: 'Not sure' }
  ];
}

export default QuestionnairePage;