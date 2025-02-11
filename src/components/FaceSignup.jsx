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
    const payload = {
      name: name,
      faceImage: imageSrc
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '28px', marginBottom: '20px' }}>Face Registration</h2>
      <input
        type="text"
        placeholder="Enter your name (optional)"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{
          padding: '10px',
          fontSize: '16px',
          borderRadius: '5px',
          border: '1px solid white',
          backgroundColor: 'transparent',
          color: 'white',
          outline: 'none',
          textAlign: 'center',
          marginBottom: '20px',
          width:'80%'
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ width: '320px', height: '240px', borderRadius: '8px', border: '1px solid white' }}
        />
      </div>
      <button 
        onClick={captureAndRegister} 
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
        {loading ? 'Registering...' : 'Register Face'}
      </button>
      {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
    </div>
  );
};

export default FaceSignup;