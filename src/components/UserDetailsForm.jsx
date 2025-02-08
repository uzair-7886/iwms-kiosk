import React, { useState } from "react";

const UserDetailsForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  };

  const validateFullName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
  };

  const validateDob = (dob) => {
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    return age >= 10;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.fullName || !validateFullName(formData.fullName)) {
      newErrors.fullName = "Please enter a valid full name (letters only).";
    }

    if (!formData.dob || !validateDob(formData.dob)) {
      newErrors.dob = "You must be at least 18 years old.";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Handle the successful form submission here
    console.log("Form submitted successfully", formData);
  };

  return (
    <div className="w-full max-w-md p-6 bg-white/10 backdrop-blur-lg border border-white/30 rounded-lg shadow-lg">
      <h2 className="text-white text-2xl font-bold text-center mb-4">Enter Your Details</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-4 rounded-lg bg-secondary text-gray-300 placeholder-gray-400 border-l-4 border-primary"
          />
          {errors.fullName && <p className="text-yellow-500 text-sm">{errors.fullName}</p>}
        </div>

        <div>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full p-4 rounded-lg bg-secondary text-gray-300 placeholder-gray-400 border-l-4 border-primary"
          />
          {errors.dob && <p className="text-yellow-500 text-sm">{errors.dob}</p>}
        </div>

        <div>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-4 rounded-lg bg-secondary text-gray-300 border-l-4 border-primary"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Male" className="text-black">
              Male
            </option>
            <option value="Female" className="text-black">
              Female
            </option>
            <option value="Other" className="text-black">
              Other
            </option>
          </select>
          {errors.gender && <p className="text-yellow-500 text-sm">{errors.gender}</p>}
        </div>

        <button
          type="submit"
          className="w-full p-4 bg-primary text-white rounded-lg hover:bg-secondary-accent transition-colors mt-8"
        >
          Complete Sign Up
        </button>
      </form>
    </div>
  );
};

export default UserDetailsForm;
