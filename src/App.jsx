import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Kiosk from './components/Kiosk';
import store from './redux/store';
import TemperatureDisplay from './components/reading/temp';
import ReviveWelcomeScreen from './welcome';
import LanguageSelectScreen from './language';
import FacialAuth from './components/FacialAuth';
import Homepage from './homepage';
import Height from './1Height';
import Weight from './2weight';
import BP from './3BloodPressure';
import './i18n'; // Import i18n configuration

const PrivateRoute = ({ children }) => {
  const isAuthenticated = store.getState().auth.isAuthenticated;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path='/homepage' element={<Homepage />} />
          <Route path='/1Height' element={<Height />} />
          <Route path='/2Weight' element={<Weight />} />
          <Route path='/3BloodPressure' element={<BP />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/welcome" element={<ReviveWelcomeScreen />} />
          <Route path="/language" element={<LanguageSelectScreen />} />
          <Route path="/facial" element={<FacialAuth />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route path="/temperature" element={<TemperatureDisplay />} />
          <Route path="/" element={<Kiosk/>} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;