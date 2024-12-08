import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserInfo } from '../redux/dashboardSlice';
import { logout } from '../redux/authSlice';
import { FaHeartbeat, FaWeight, FaThermometerHalf, FaGlobe, FaSignOutAlt } from 'react-icons/fa';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-xl">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-xl text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Reviva IWMS Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>

        {/* User Info */}
        {userInfo && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-100 p-6 rounded-lg shadow-sm flex flex-col items-center">
              <FaGlobe className="text-4xl text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">User Details</h2>
              <p><strong>Name:</strong> {userInfo.name}</p>
              <p><strong>Email/Phone:</strong> {userInfo.emailOrPhone}</p>
              <p><strong>Role:</strong> {userInfo.role}</p>
              <p><strong>Gender:</strong> {userInfo.gender}</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg shadow-sm flex flex-col items-center">
              <FaHeartbeat className="text-4xl text-green-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Account Stats</h2>
              <p>Account created on: {new Date(userInfo.createdAt).toLocaleDateString()}</p>
              <p>Date of Birth: {new Date(userInfo.dob).toLocaleDateString()}</p>
            </div>
          </div>
        )}

        {/* Measurements Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Measurements</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm flex flex-col items-center">
              <FaWeight className="text-4xl text-indigo-500 mb-4" />
              <h3 className="text-lg font-bold">Weight</h3>
              <p className="text-sm text-gray-600">Track your weight progress</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm flex flex-col items-center">
              <FaThermometerHalf className="text-4xl text-yellow-500 mb-4" />
              <h3 className="text-lg font-bold">Temperature</h3>
              <p className="text-sm text-gray-600">Monitor your body temperature</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm flex flex-col items-center">
              <FaHeartbeat className="text-4xl text-red-500 mb-4" />
              <h3 className="text-lg font-bold">Blood Pressure</h3>
              <p className="text-sm text-gray-600">Keep track of your BP</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm flex flex-col items-center">
              <FaGlobe className="text-4xl text-purple-500 mb-4" />
              <h3 className="text-lg font-bold">Glucose</h3>
              <p className="text-sm text-gray-600">Manage blood sugar levels</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm flex flex-col items-center">
              <FaHeartbeat className="text-4xl text-teal-500 mb-4" />
              <h3 className="text-lg font-bold">Oxygen Levels</h3>
              <p className="text-sm text-gray-600">Monitor oxygen saturation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
