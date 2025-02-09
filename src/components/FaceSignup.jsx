// FaceSignup.js
import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const FaceSignup = ({ onComplete }) => {
  const webcamRef = useRef(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const captureAndRegister = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setMessage("Unable to capture image. Please try again.");
      return;
    }
    setLoading(true);
    // Build payload for registration.
    const payload = {
      name: name,         // Optional
      faceImage: imageSrc // Face image for registration
      // emailOrPhone and password can be left empty if not using credentials.
    };
    axios.post('http://localhost:8080/api/auth/register', payload)
      .then(response => {
        setMessage(response.data);
        if (onComplete) onComplete();
      })
      .catch(error => {
        console.error(error);
        setMessage("Registration error.");
      })
      .finally(() => setLoading(false));
  }, [name, onComplete]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Face Registration</h2>
      <div>
        <input
          type="text"
          placeholder="Enter your name (optional)"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{ margin: '20px', width: '320px', height: '240px' }}
      />
      <div>
        <button onClick={captureAndRegister} disabled={loading}>
          {loading ? 'Registering...' : 'Register Face'}
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FaceSignup;
