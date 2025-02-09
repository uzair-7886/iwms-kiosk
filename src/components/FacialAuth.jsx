// FacialAuth.js
import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const FacialAuth = () => {
  const webcamRef = useRef(null);
  const [userId, setUserId] = useState('');
  const [mode, setMode] = useState('register'); // 'register' or 'login'
  const [message, setMessage] = useState('');

  const capture = useCallback(() => {
    // Capture the image as a Base64-encoded string.
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setMessage("Unable to capture image. Please try again.");
      return;
    }

    if (mode === 'register') {
      if (!userId) {
        setMessage("Please enter a user ID for registration.");
        return;
      }
      axios.post('http://localhost:5000/register', { userId, image: imageSrc })
        .then(response => {
          setMessage(response.data.message);
        })
        .catch(error => {
          console.error(error);
          setMessage("Registration error.");
        });
    } else {
      axios.post('http://localhost:5000/login', { image: imageSrc })
        .then(response => {
          setMessage(response.data.message);
        })
        .catch(error => {
          console.error(error);
          setMessage("Login failed.");
        });
    }
  }, [mode, userId]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>{mode === 'register' ? 'Facial Registration' : 'Facial Login'}</h2>
      {mode === 'register' && (
        <div>
          <input
            type="text"
            placeholder="Enter user ID"
            value={userId}
            onChange={e => setUserId(e.target.value)}
          />
        </div>
      )}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{ margin: '20px', width: '320px', height: '240px' }}
      />
      <div>
        <button onClick={capture}>
          {mode === 'register' ? 'Register Face' : 'Login'}
        </button>
      </div>
      <div style={{ margin: '10px' }}>
        <button onClick={() => {
          setMode(mode === 'register' ? 'login' : 'register');
          setMessage('');
        }}>
          Switch to {mode === 'register' ? 'Login' : 'Registration'}
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FacialAuth;
