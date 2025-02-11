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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '28px', marginBottom: '20px' }}>Face Login</h2>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ width: '320px', height: '240px', borderRadius: '8px', border: '1px solid white' }}
        />
      </div>
      <button 
        onClick={captureAndLogin} 
        disabled={loading}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'white',
          backgroundColor: '#87C232',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background 0.3s ease'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#618930'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#87C232'}
      >
        {loading ? 'Logging in...' : 'Login with Face ID'}
      </button>
      {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
    </div>
  );
};

export default FaceLogin;
