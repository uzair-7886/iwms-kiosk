import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  height: null,           // in cm
  weight: null,           // in kg
  bloodPressure: {        // systolic and diastolic
    systolic: null,
    diastolic: null,
  },
  temperature: null,      // in Centigrade (°C)
  glucose: null,          // glucose level
  spo2: null,             // oxygen level (%)
};

const vitalsSlice = createSlice({
  name: 'vitals',
  initialState,
  reducers: {
    setHeight(state, action) {
      state.height = action.payload;
    },
    setWeight(state, action) {
      state.weight = action.payload;
    },
    setBloodPressure(state, action) {
      // Expects an object with properties: { systolic, diastolic }
      state.bloodPressure = action.payload;
    },
    setTemperature(state, action) {
      state.temperature = action.payload;
    },
    setGlucose(state, action) {
      state.glucose = action.payload;
    },
    setSpo2(state, action) {
      state.spo2 = action.payload;
    },
    resetVitals(state) {
      state.height = null;
      state.weight = null;
      state.bloodPressure = { systolic: null, diastolic: null };
      state.temperature = null;
      state.glucose = null;
      state.spo2 = null;
    },
  },
});

export const {
  setHeight,
  setWeight,
  setBloodPressure,
  setTemperature,
  setGlucose,
  setSpo2,
  resetVitals,
} = vitalsSlice.actions;

export default vitalsSlice.reducer;
