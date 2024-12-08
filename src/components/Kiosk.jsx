import React, { useState } from 'react';
import { FaWeight, FaHeartbeat, FaThermometerHalf, FaGlobe, FaLink } from 'react-icons/fa';

const Kiosk = () => {
  const [formData, setFormData] = useState({
    weight: '',
    bloodPressure: '',
    glucose: '',
    temperature: '',
    oxygenLevel: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Health data submitted successfully!');
    console.log('Submitted Data:', formData);
  };

  const connectToSensor = (type) => {
    alert(`Connecting to ${type} sensor...`);
    // Simulate sensor data fetch
    setTimeout(() => {
      const simulatedData = {
        weight: '70kg',
        bloodPressure: '120/80',
        glucose: '100 mg/dL',
        temperature: '36.5°C',
        oxygenLevel: '98%',
      };
      setFormData({ ...formData, [type]: simulatedData[type] || '' });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Health Data Kiosk</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weight Input */}
          <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-sm">
            <FaWeight className="text-3xl text-indigo-500 mb-4" />
            <label className="font-semibold text-gray-600">Weight (kg)</label>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring focus:ring-indigo-300"
              placeholder="Enter weight"
            />
            <button
              type="button"
              onClick={() => connectToSensor('weight')}
              className="mt-2 text-indigo-500 flex items-center"
            >
              <FaLink className="mr-2" /> Connect Sensor
            </button>
          </div>

          {/* Blood Pressure Input */}
          <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-sm">
            <FaHeartbeat className="text-3xl text-red-500 mb-4" />
            <label className="font-semibold text-gray-600">Blood Pressure (mmHg)</label>
            <input
              type="text"
              name="bloodPressure"
              value={formData.bloodPressure}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring focus:ring-red-300"
              placeholder="Enter BP"
            />
            <button
              type="button"
              onClick={() => connectToSensor('bloodPressure')}
              className="mt-2 text-red-500 flex items-center"
            >
              <FaLink className="mr-2" /> Connect Sensor
            </button>
          </div>

          {/* Glucose Input */}
          <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-sm">
            <FaGlobe className="text-3xl text-purple-500 mb-4" />
            <label className="font-semibold text-gray-600">Glucose (mg/dL)</label>
            <input
              type="text"
              name="glucose"
              value={formData.glucose}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring focus:ring-purple-300"
              placeholder="Enter glucose"
            />
            <button
              type="button"
              onClick={() => connectToSensor('glucose')}
              className="mt-2 text-purple-500 flex items-center"
            >
              <FaLink className="mr-2" /> Connect Sensor
            </button>
          </div>

          {/* Temperature Input */}
          <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-sm">
            <FaThermometerHalf className="text-3xl text-yellow-500 mb-4" />
            <label className="font-semibold text-gray-600">Temperature (°C)</label>
            <input
              type="text"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring focus:ring-yellow-300"
              placeholder="Enter temperature"
            />
            <button
              type="button"
              onClick={() => connectToSensor('temperature')}
              className="mt-2 text-yellow-500 flex items-center"
            >
              <FaLink className="mr-2" /> Connect Sensor
            </button>
          </div>

          {/* Oxygen Level Input */}
          <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-sm">
            <FaHeartbeat className="text-3xl text-teal-500 mb-4" />
            <label className="font-semibold text-gray-600">Oxygen Level (%)</label>
            <input
              type="text"
              name="oxygenLevel"
              value={formData.oxygenLevel}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring focus:ring-teal-300"
              placeholder="Enter oxygen level"
            />
            <button
              type="button"
              onClick={() => connectToSensor('oxygenLevel')}
              className="mt-2 text-teal-500 flex items-center"
            >
              <FaLink className="mr-2" /> Connect Sensor
            </button>
          </div>
        </form>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
          >
            Submit Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Kiosk;
