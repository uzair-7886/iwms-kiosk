// SignupForm.js
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from 'axios';

const SignupForm = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmailOrPhone = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  const validatePassword = (password) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!validateEmailOrPhone(formData.emailOrPhone)) {
      newErrors.emailOrPhone = "Enter a valid email or phone number.";
    }
    if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters, contain one uppercase letter, and one number.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare payload. (For normal registration, faceImage is left empty.)
    const payload = {
      emailOrPhone: formData.emailOrPhone,
      password: formData.password,
      // You can also include other fields like name, dob, etc. if desired.
      faceImage: "", // Not used in normal registration.
    };

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", payload);
      // Assuming response.data contains a success message.
      setApiMessage(response.data);
      onComplete();
    } catch (err) {
      console.error(err);
      setApiMessage("Registration error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <input
          type="text"
          name="emailOrPhone"
          placeholder="Email Address or Phone Number"
          value={formData.emailOrPhone}
          onChange={handleInputChange}
          className="w-full p-4 rounded-lg bg-secondary text-gray-300 placeholder-gray-400 border-l-4 border-primary"
        />
        {errors.emailOrPhone && (
          <p className="text-yellow-500 text-sm">{errors.emailOrPhone}</p>
        )}
      </div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full p-4 rounded-lg bg-secondary text-gray-300 placeholder-gray-400 border-l-4 border-primary"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-4 text-gray-400"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {errors.password && (
          <p className="text-yellow-500 text-sm">{errors.password}</p>
        )}
      </div>
      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="w-full p-4 rounded-lg bg-secondary text-gray-300 placeholder-gray-400 border-l-4 border-primary"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword((prev) => !prev)}
          className="absolute right-4 top-4 text-gray-400"
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full p-4 bg-primary text-white rounded-lg hover:bg-secondary-accent transition-colors mt-8"
      >
        {loading ? "Registering..." : "Continue"}
      </button>
      {apiMessage && (
        <p className="mt-4 text-green-500 text-center">{apiMessage}</p>
      )}
    </form>
  );
};

export default SignupForm;
