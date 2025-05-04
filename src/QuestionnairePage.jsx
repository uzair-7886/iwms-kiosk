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
  const questions = generateFollowUpQuestions(abnormalities);

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

  const handleChange = (vital, key) => e => {
    const val = e.target.value;
    setAnswers(prev => ({
      ...prev,
      [vital]: { ...(prev[vital] || {}), [key]: val }
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
    return answers[q.vital]?.[q.key] && answers[q.vital][q.key].trim() !== '';
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
              <ul className="absolute right-0 mt-2 bg-white rounded-md shadow-lg overflow-hidden z-50">
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

      {/* Main Content */}
      <div className="w-full max-w-5xl mx-auto px-6 pb-32 flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center text-white mb-8 mt-6">
          <h1 className="text-5xl font-bold text-primary mb-4">Wellness Assessment</h1>
          <p className="text-xl opacity-90">Help us understand your health better with a few questions</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-8">
          <div className="flex justify-between text-white mb-2">
            <span className="text-lg">{questions.length > 0 ? `Question ${currentQuestion + 1} of ${questions.length}` : 'Assessment'}</span>
            <span className="text-lg">{Math.round(questionProgress)}% Complete</span>
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
                        <p className="text-white/70 text-lg">{question.description || "Your answer helps us provide better recommendations for your wellness journey."}</p>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <label className="block text-white/80 text-xl mb-3">Your answer:</label>
                      <textarea
                        placeholder="Type your answer here..."
                        value={answers[question.vital]?.[question.key] || ''}
                        onChange={handleChange(question.vital, question.key)}
                        className="w-full p-6 rounded-lg text-black text-xl min-h-32 focus:ring-2 focus:ring-primary"
                        required
                      />
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

export default QuestionnairePage;