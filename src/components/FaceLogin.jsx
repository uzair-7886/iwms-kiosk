// FaceLogin.js
import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const FaceLogin = ({ onLoginSuccess }) => {
  const webcamRef = useRef(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const captureAndLogin = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setMessage("Unable to capture image. Please try again.");
      return;
    }
    setLoading(true);
    axios.post('http://localhost:8080/api/auth/face/login', { image: imageSrc })
      .then(response => {
        // Assuming the backend returns the JWT token as a string
        const token = response.data;
        onLoginSuccess(token);
      })
      .catch(error => {
        console.error(error);
        setMessage("Face login failed.");
      })
      .finally(() => setLoading(false));
  }, [onLoginSuccess]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Face Login</h2>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{ margin: '20px', width: '320px', height: '240px' }}
      />
      <div>
        <button onClick={captureAndLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Login with Face ID'}
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FaceLogin;
