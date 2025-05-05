// services/recommendationEngine.js

// Define normal ranges/thresholds for each vital for an average adult&#8203;:contentReference[oaicite:1]{index=1}.
// These thresholds can be adjusted as needed or even loaded from a config/database in future.
const NORMAL_RANGES = {
  BMI: { min: 18.5, max: 24.9 },                          // BMI 18.5–24.9 considered normal
  bloodPressure: { systolic: { min: 90, max: 120 }, diastolic: { min: 60, max: 80 } },  // Normal BP: 90/60 to 120/80
  temperature: { min: 36.0, max: 37.2 },                  // Normal body temp ~36.5\u201337.2°C
  heartRate: { min: 60, max: 100 },                        // Normal resting HR 60\u2013100 bpm
  spO2: { min: 95, max: 100 },                             // Normal oxygen saturation 95\u2013100%
  glucose: { min: 70, max: 140 }                       // Normal blood sugar ~70\u2013140 mg/dL (depending on fasting/meal)
};

// Utility: calculate BMI from height (cm) and weight (kg)
export function computeBMI(height, weight) {
  if (!height || !weight) return null;
  const heightM = height / 100;
  // Round to one decimal for easier interpretation
  return +(weight / (heightM * heightM)).toFixed(1);
}

// Step 1: Identify abnormal vitals based on normal ranges
export function getAbnormalVitals(vitals) {
  const abnormalities = {};
  // Compute BMI as an additional vital to evaluate
  const bmi = computeBMI(vitals.height, vitals.weight);
  if (bmi !== null) {
    // Check if BMI is out of normal range
    if (bmi < NORMAL_RANGES.BMI.min || bmi > NORMAL_RANGES.BMI.max) {
      abnormalities.BMI = bmi < NORMAL_RANGES.BMI.min ? 'low' : 'high';
    }
  }

  // Check blood pressure
  const { systolic, diastolic } = vitals.bloodPressure || {};
  if (systolic && diastolic) {
    if (systolic > NORMAL_RANGES.bloodPressure.systolic.max || diastolic > NORMAL_RANGES.bloodPressure.diastolic.max) {
      abnormalities.bloodPressure = 'high';  // high blood pressure (hypertension)
    } else if (systolic < NORMAL_RANGES.bloodPressure.systolic.min || diastolic < NORMAL_RANGES.bloodPressure.diastolic.min) {
      abnormalities.bloodPressure = 'low';   // low blood pressure (hypotension)
    }
  }

  // Check heart rate
  if (vitals.heartRate) {
    if (vitals.heartRate > NORMAL_RANGES.heartRate.max) {
      abnormalities.heartRate = 'high';
    } else if (vitals.heartRate < NORMAL_RANGES.heartRate.min) {
      abnormalities.heartRate = 'low';
    }
  }

  // Check temperature
  if (vitals.temperature) {
    if (vitals.temperature > NORMAL_RANGES.temperature.max) {
      abnormalities.temperature = 'high';   // fever
    } else if (vitals.temperature < NORMAL_RANGES.temperature.min) {
      abnormalities.temperature = 'low';    // below normal temperature
    }
  }

  // Check SpO2
  if (vitals.spO2) {
    if (vitals.spO2 < NORMAL_RANGES.spO2.min) {
      abnormalities.spO2 = 'low';            // low oxygen level
    }
  }

  // Check glucose
  if (vitals.glucose) {
    if (vitals.glucose > NORMAL_RANGES.glucose.max) {
      abnormalities.glucose = 'high';    // high blood sugar
    } else if (vitals.glucose < NORMAL_RANGES.glucose.min) {
      abnormalities.glucose = 'low';     // low blood sugar
    }
  }

  return abnormalities;
}

// Step 2: Generate follow-up questions for each abnormal vital.
// We prepare a bank of possible questions targeting family history, lifestyle, or symptoms.
const QUESTION_BANK = {
  BMI: {
    high: [
      { key: 'familyHistoryObesity', text: 'Do you have a family history of obesity or related conditions?' },
      { key: 'exerciseHabits', text: 'How often do you exercise in a typical week?' }
    ],
    low: [
      { key: 'unintendedWeightLoss', text: 'Have you experienced any unintended weight loss recently?' },
      { key: 'dietaryIntake', text: 'Are you getting sufficient daily calorie intake?' }
    ]
  },
  bloodPressure: {
    high: [
      { key: 'familyHistoryBP', text: 'Do you have a family history of high blood pressure?' },
      { key: 'highSaltDiet', text: 'Would you consider your diet high in salt?' },
      { key: 'bpMeds', text: 'Are you currently on any blood pressure medication?' }
    ],
    low: [
      { key: 'dizziness', text: 'Have you felt dizzy or lightheaded recently?' },
      { key: 'hydration', text: 'Are you well hydrated today?' }
    ]
  },
  heartRate: {
    high: [
      { key: 'recentExercise', text: 'Were you engaged in physical activity in the past hour?' },
      { key: 'anxiety', text: 'Are you feeling stressed or anxious right now?' }
    ],
    low: [
      { key: 'fatigue', text: 'Do you feel unusually tired or fatigued?' },
      { key: 'athlete', text: 'Are you an athlete or someone who exercises a lot?' }
    ]
  },
  temperature: {
    high: [
      { key: 'infectionSymptoms', text: 'Are you experiencing any symptoms of infection (e.g., cough, sore throat)?' },
      { key: 'medicationFever', text: 'Have you taken any fever-reducing medication?' }
    ],
    low: [
      { key: 'feelingCold', text: 'Do you feel cold or have you been in a cold environment recently?' },
      { key: 'thyroid', text: 'Do you have any known thyroid issues affecting body temperature?' }
    ]
  },
  spO2: {
    low: [
      { key: 'breathingIssues', text: 'Are you experiencing any shortness of breath?' },
      { key: 'knownLungIssues', text: 'Do you have any known lung or respiratory conditions?' }
    ]
  },
  glucose: {
    high: [
      { key: 'recentMeal', text: 'Have you eaten in the last 2 hours?' },
      { key: 'frequentUrination', text: 'Have you noticed frequent urination or thirst lately?' }
    ],
    low: [
      { key: 'diabetesMedication', text: 'If you are diabetic, did you take insulin or medication recently?' },
      { key: 'symptomsLowSugar', text: 'Are you feeling shaky, sweaty, or have other low sugar symptoms?' }
    ]
  }
};

export function generateFollowUpQuestions(abnormalVitals) {
  const questions = [];
  for (const [vital, status] of Object.entries(abnormalVitals)) {
    const qBank = QUESTION_BANK[vital];
    if (!qBank) continue;
    // If the question bank has subcategories for 'high'/'low', use accordingly; otherwise use generic list
    if (typeof status === 'string' && qBank[status]) {
      qBank[status].forEach(q => {
        questions.push({ vital, key: q.key, text: q.text });
      });
    } else if (Array.isArray(qBank)) {
      // If qBank is directly an array (no high/low distinction)
      qBank.forEach(q => {
        questions.push({ vital, key: q.key, text: q.text });
      });
    }
  }
  return questions;
}

// Step 3: Evaluate wellness recommendations based on vitals and answers.
// This function applies individual rules for each vital and also cross-parameter rules.
// It returns an array of recommendation objects or strings.
// export function evaluateRecommendations(vitals, answers) {
//   const recommendations = [];
//   const abnormalities = getAbnormalVitals(vitals);
//   const bmi = computeBMI(vitals.height, vitals.weight);

//   // Individual vital-based rules:
//   if (abnormalities.BMI) {
//     if (abnormalities.BMI === 'high') {
//       // High BMI (overweight/obese)
//       const hasExercise = answers.BMI?.exerciseHabits;
//       recommendations.push({
//         vital: 'BMI',
//         message: `Your BMI is ${bmi}, which is above the normal range. ` +
//                  `Consider a healthier diet and regular exercise to lose weight.` + 
//                  (hasExercise ? '' : ' Start with a manageable exercise routine and gradually increase activity.')
//       });
//     } else if (abnormalities.BMI === 'low') {
//       // Low BMI (underweight)
//       recommendations.push({
//         vital: 'BMI',
//         message: `Your BMI is ${bmi}, which is below the normal range. ` +
//                  `You might need to increase calorie intake or check for underlying issues. ` +
//                  `Consider consulting a nutritionist for a diet plan.`
//       });
//     }
//   }

//   if (abnormalities.bloodPressure) {
//     if (abnormalities.bloodPressure === 'high') {
//       const familyHist = answers.bloodPressure?.familyHistoryBP;
//       recommendations.push({
//         vital: 'Blood Pressure',
//         message: `Your blood pressure is high. ` +
//                  `We recommend reducing salt intake, regular exercise, and stress management. ` +
//                  `Consider consulting a doctor for guidance.` +
//                  (familyHist ? ` Since you have a family history of hypertension, be especially vigilant.` : '')
//       });
//     } else if (abnormalities.bloodPressure === 'low') {
//       recommendations.push({
//         vital: 'Blood Pressure',
//         message: `Your blood pressure is lower than normal. ` +
//                  `Make sure you're staying hydrated and not skipping meals. ` +
//                  `If you experience dizziness or fainting, consult a healthcare provider.`
//       });
//     }
//   }

//   if (abnormalities.heartRate) {
//     if (abnormalities.heartRate === 'high') {
//       const recentExercise = answers.heartRate?.recentExercise;
//       recommendations.push({
//         vital: 'Heart Rate',
//         message: `Your heart rate is above normal. ` +
//                  (recentExercise ? `It might be elevated due to recent activity; try rechecking after resting.` 
//                                   : `This could be due to stress, caffeine, or other factors; consider relaxing and monitoring it.`)
//       });
//     } else if (abnormalities.heartRate === 'low') {
//       recommendations.push({
//         vital: 'Heart Rate',
//         message: `Your heart rate is below normal. ` +
//                  `If you feel fine and are athletic, a low resting heart rate can be normal. ` +
//                  `Otherwise, if you experience fatigue or dizziness, consult a doctor.`
//       });
//     }
//   }

//   if (abnormalities.temperature) {
//     if (abnormalities.temperature === 'high') {
//       recommendations.push({
//         vital: 'Temperature',
//         message: `You have a fever (elevated body temperature). ` +
//                  `Stay hydrated, rest, and consider taking fever-reducing medication. ` +
//                  `If the fever persists or is very high, seek medical advice.`
//       });
//     } else if (abnormalities.temperature === 'low') {
//       recommendations.push({
//         vital: 'Temperature',
//         message: `Your body temperature is below normal. ` +
//                  `Ensure you're warm and consider checking your thyroid function if this persists.`
//       });
//     }
//   }

//   if (abnormalities.spO2) {
//     if (abnormalities.spO2 === 'low') {
//       recommendations.push({
//         vital: 'Oxygen Saturation',
//         message: `Your oxygen saturation is below the normal range. ` +
//                  `Take deep breaths and relax. If it stays low or you have trouble breathing, seek medical attention.`
//       });
//     }
//     // (No 'high' scenario for SpO2 beyond normal physiological range)
//   }

//   if (abnormalities.glucose) {
//     if (abnormalities.glucose === 'high') {
//       const recentMeal = answers.glucose?.recentMeal;
//       recommendations.push({
//         vital: 'Blood Sugar',
//         message: `Your blood sugar reading is high. ` +
//                  (recentMeal 
//                    ? `Since you recently ate, it may be a normal post-meal spike. Try measuring again when fasting.` 
//                    : `This could indicate a risk of diabetes. Consider a proper fasting glucose test or consult a doctor.`)
//       });
//     } else if (abnormalities.glucose === 'low') {
//       recommendations.push({
//         vital: 'Blood Sugar',
//         message: `Your blood sugar is low. ` +
//                  `Please eat or drink something with sugar. If you have diabetes, follow your hypoglycemia protocol. ` +
//                  `If symptoms persist, seek medical help.`
//       });
//     }
//   }

//   // Cross-parameter rules (consider combinations of vitals):
//   // Example: If both blood pressure and BMI are high, a combined lifestyle recommendation.
//   if (abnormalities.bloodPressure === 'high' && abnormalities.BMI === 'high') {
//     recommendations.push({
//       vital: 'BMI & Blood Pressure',
//       message: `Because both your BMI and blood pressure are high, losing weight will likely help reduce your blood pressure. ` +
//                `Focus on diet and exercise as a combined approach for improvement in both areas.`
//     });
//   }
//   // Another example cross-rule: high blood pressure and high stress (from questionnaire)
//   if (abnormalities.bloodPressure === 'high' && answers.bloodPressure?.highSaltDiet === 'yes') {
//     recommendations.push({
//       vital: 'Diet',
//       message: `You indicated a high-salt diet, which can elevate blood pressure. Consider reducing your salt intake as a priority.`
//     });
//   }
//   // (Additional cross rules can be added easily here)

//   return recommendations;
// }

// Update the evaluateRecommendations function to better interpret structured answers

export function evaluateRecommendations(vitals, answers) {
  const recommendations = [];
  const abnormalities = getAbnormalVitals(vitals);
  const bmi = computeBMI(vitals.height, vitals.weight);

  // Individual vital-based rules with enhanced answer interpretation:
  if (abnormalities.BMI) {
    if (abnormalities.BMI === 'high') {
      // High BMI (overweight/obese)
      const exerciseLevel = answers.BMI?.exerciseHabits;
      const exerciseRec = getExerciseRecommendation(exerciseLevel);

      recommendations.push({
        vital: 'BMI',
        message: `Your BMI is ${bmi}, which is above the normal range. ` +
          `Consider a healthier diet and regular exercise to lose weight. ${exerciseRec}`
      });
    } else if (abnormalities.BMI === 'low') {
      // Low BMI (underweight)
      const weightLoss = answers.BMI?.unintendedWeightLoss;
      const dietaryIntake = answers.BMI?.dietaryIntake;

      let nutritionRec = "";
      if (dietaryIntake === 'insufficient') {
        nutritionRec = "Focus on increasing your calorie intake with nutrient-dense foods.";
      } else if (weightLoss === 'moderate' || weightLoss === 'significant') {
        nutritionRec = "Unexplained weight loss should be discussed with a healthcare provider.";
      }

      recommendations.push({
        vital: 'BMI',
        message: `Your BMI is ${bmi}, which is below the normal range. ${nutritionRec} ` +
          `Consider consulting a nutritionist for a personalized diet plan.`
      });
    }
  }

  if (abnormalities.bloodPressure) {
    if (abnormalities.bloodPressure === 'high') {
      const familyHist = answers.bloodPressure?.familyHistoryBP === 'yes';
      const highSalt = answers.bloodPressure?.highSaltDiet;
      const onMeds = answers.bloodPressure?.bpMeds;

      let dietRec = "";
      if (highSalt === 'yes') {
        dietRec = "Reducing salt intake should be a priority for you. ";
      }

      let medicationNote = "";
      if (onMeds === 'yes') {
        medicationNote = "Continue taking your prescribed medication and consult your doctor about these readings. ";
      } else if (onMeds === 'previous') {
        medicationNote = "Consider discussing with your doctor about potentially resuming medication. ";
      }

      recommendations.push({
        vital: 'Blood Pressure',
        message: `Your blood pressure is high. ${dietRec}We recommend regular exercise and stress management. ` +
          `${medicationNote}` +
          (familyHist ? `Since you have a family history of hypertension, be especially vigilant.` : '')
      });
    } else if (abnormalities.bloodPressure === 'low') {
      const dizziness = answers.bloodPressure?.dizziness;
      const hydration = answers.bloodPressure?.hydration;

      let dizzyRec = "";
      if (dizziness === 'frequent' || dizziness === 'occasional') {
        dizzyRec = "Your reported dizziness might be related to your low blood pressure. ";
      }

      let hydrationRec = "";
      if (hydration === 'dehydrated') {
        hydrationRec = "Increasing your fluid intake should be your first step. ";
      }

      recommendations.push({
        vital: 'Blood Pressure',
        message: `Your blood pressure is lower than normal. ${dizzyRec}${hydrationRec}` +
          `Make sure you're staying hydrated and not skipping meals. ` +
          `If you experience recurring dizziness or fainting, consult a healthcare provider.`
      });
    }
  }

  if (abnormalities.heartRate) {
    if (abnormalities.heartRate === 'high') {
      const recentExercise = answers.heartRate?.recentExercise === 'yes' || answers.heartRate?.recentExercise === 'light';
      const anxietyLevel = answers.heartRate?.anxiety;

      let anxietyRec = "";
      if (anxietyLevel === 'high' || anxietyLevel === 'moderate') {
        anxietyRec = "Your reported anxiety may be contributing to your elevated heart rate. Consider stress reduction techniques. ";
      }

      recommendations.push({
        vital: 'Heart Rate',
        message: `Your heart rate is above normal. ${anxietyRec}` +
          (recentExercise ? `It might be elevated due to recent activity; try rechecking after resting for at least 30 minutes.`
            : `This could be due to stress, caffeine, or other factors; consider relaxing and monitoring it.`)
      });
    } else if (abnormalities.heartRate === 'low') {
      const athleteStatus = answers.heartRate?.athlete;
      const fatigue = answers.heartRate?.fatigue;

      let athleteNote = "";
      if (athleteStatus === 'professional' || athleteStatus === 'serious') {
        athleteNote = "As someone who trains regularly, a lower resting heart rate can be normal and even beneficial. ";
      }

      let fatigueRec = "";
      if (fatigue === 'severe' || fatigue === 'moderate') {
        fatigueRec = "Your reported fatigue combined with low heart rate should be monitored. ";
      }

      recommendations.push({
        vital: 'Heart Rate',
        message: `Your heart rate is below normal. ${athleteNote}${fatigueRec}` +
          `If you experience persistent fatigue or dizziness, consult a doctor.`
      });
    }
  }

  if (abnormalities.temperature) {
    if (abnormalities.temperature === 'high') {
      const infectionSigns = answers.temperature?.infectionSymptoms;
      const medication = answers.temperature?.medicationFever;

      let infectionRec = "";
      if (infectionSigns === 'multiple') {
        infectionRec = "Your reported symptoms suggest you may have an infection. ";
      }

      let medicationRec = "";
      if (medication === 'recent') {
        medicationRec = "Note that your fever may be partially masked by recent medication. ";
      }

      recommendations.push({
        vital: 'Temperature',
        message: `You have a fever (elevated body temperature). ${infectionRec}${medicationRec}` +
          `Stay hydrated, rest, and consider appropriate medication if advised. ` +
          `If the fever persists beyond 3 days or exceeds 39°C (102°F), seek medical advice.`
      });
    } else if (abnormalities.temperature === 'low') {
      const feelingCold = answers.temperature?.feelingCold;
      const thyroidIssues = answers.temperature?.thyroid === 'yes' || answers.temperature?.thyroid === 'suspected';

      let thyroidRec = "";
      if (thyroidIssues) {
        thyroidRec = "Your thyroid condition may contribute to your low body temperature. Follow your doctor's advice for managing it. ";
      }

      recommendations.push({
        vital: 'Temperature',
        message: `Your body temperature is below normal. ${thyroidRec}` +
          (feelingCold === 'very' ? `Ensure you warm up gradually and monitor your temperature. ` : ``) +
          `If this persists, consider consulting a healthcare provider about potential causes.`
      });
    }
  }

  if (abnormalities.spO2) {
    if (abnormalities.spO2 === 'low') {
      const breathingIssues = answers.spO2?.breathingIssues;
      const lungCondition = answers.spO2?.knownLungIssues;

      let urgencyRec = "";
      if (breathingIssues === 'severe' || breathingIssues === 'moderate') {
        urgencyRec = "Your difficulty breathing with low oxygen levels is concerning and requires prompt attention. ";
      }

      let conditionNote = "";
      if (lungCondition === 'yes') {
        conditionNote = "With your existing respiratory condition, monitoring oxygen levels is particularly important. ";
      }

      recommendations.push({
        vital: 'Oxygen Saturation',
        message: `Your oxygen saturation is below the normal range. ${urgencyRec}${conditionNote}` +
          `Take deep breaths and rest in a well-ventilated area. ` +
          (breathingIssues === 'severe' ? `Seek immediate medical attention.` :
            `If it stays low or your breathing difficulty increases, seek medical attention.`)
      });
    }
  }

  if (abnormalities.glucose) {
    if (abnormalities.glucose === 'high') {
      const recentMeal = answers.glucose?.recentMeal === 'lastHour' || answers.glucose?.recentMeal === '1-2hours';
      const frequentUrination = answers.glucose?.frequentUrination;
      const diabetesMeds = answers.glucose?.diabetesMedication;

      let diabetesNote = "";
      if (diabetesMeds === 'insulin' || diabetesMeds === 'oral' || diabetesMeds === 'both') {
        diabetesNote = "Discuss these readings with your healthcare provider to evaluate your medication effectiveness. ";
      } else if (diabetesMeds === 'notDiabetic' && (frequentUrination === 'very' || frequentUrination === 'somewhat')) {
        diabetesNote = "Your symptoms of frequent urination with high blood sugar warrant medical evaluation. ";
      }

      recommendations.push({
        vital: 'Blood Sugar',
        message: `Your blood sugar reading is high. ${diabetesNote}` +
          (recentMeal
            ? `Since you recently ate, this could be a normal post-meal spike. Try measuring again before eating.`
            : `This could indicate a risk of diabetes or inadequate blood sugar control. Consider proper testing and medical advice.`)
      });
    } else if (abnormalities.glucose === 'low') {
      const symptoms = answers.glucose?.symptomsLowSugar;
      const diabetesMeds = answers.glucose?.diabetesMedication;

      let urgencyRec = "";
      if (symptoms === 'severe') {
        urgencyRec = "Your symptoms indicate a potentially serious low blood sugar episode. ";
      }

      let medicationNote = "";
      if (diabetesMeds === 'insulin' || diabetesMeds === 'both') {
        medicationNote = "This may be related to your insulin dose. ";
      }

      recommendations.push({
        vital: 'Blood Sugar',
        message: `Your blood sugar is low. ${urgencyRec}${medicationNote}` +
          `Please eat or drink something with sugar immediately. ` +
          `If you have diabetes, follow your hypoglycemia protocol. ` +
          (symptoms === 'severe' ? `If symptoms don't improve quickly, seek immediate medical help.` :
            `Monitor your levels after eating and seek help if they don't normalize.`)
      });
    }
  }

  // Add cross-parameter rules
  addCrossParameterRecommendations(recommendations, abnormalities, answers);

  return recommendations;
}

// Helper function for exercise recommendations based on activity level
function getExerciseRecommendation(exerciseLevel) {
  switch (exerciseLevel) {
    case 'none':
      return "Start with gentle walking for 10-15 minutes daily and gradually increase duration and intensity.";
    case 'light':
      return "Try to increase your exercise frequency to at least 3-4 days per week with moderate intensity.";
    case 'moderate':
      return "Your current exercise routine is good; consider adding strength training if you haven't already.";
    case 'active':
      return "Your activity level is excellent; maintain this routine and ensure proper nutrition to support it.";
    default:
      return "Start with a manageable exercise routine that you enjoy and gradually increase activity.";
  }
}

// Function to add cross-parameter recommendations
function addCrossParameterRecommendations(recommendations, abnormalities, answers) {
  // BMI + Blood Pressure
  if (abnormalities.bloodPressure === 'high' && abnormalities.BMI === 'high') {
    recommendations.push({
      vital: 'BMI & Blood Pressure',
      message: `Both your BMI and blood pressure are elevated. Weight loss of even 5-10% can significantly reduce your blood pressure. ` +
        `Focus on a heart-healthy diet low in sodium and regular exercise to address both issues.`
    });
  }

  // High BP + High Salt + Family History
  if (abnormalities.bloodPressure === 'high' &&
    answers.bloodPressure?.highSaltDiet === 'yes' &&
    answers.bloodPressure?.familyHistoryBP === 'yes') {
    recommendations.push({
      vital: 'Diet & Genetics',
      message: `Your high-salt diet combined with family history of hypertension significantly increases your risk. ` +
        `Reducing sodium intake should be your top dietary priority.`
    });
  }

  // High glucose + High BMI
  if (abnormalities.glucose === 'high' && abnormalities.BMI === 'high') {
    recommendations.push({
      vital: 'Metabolic Health',
      message: `The combination of elevated blood sugar and BMI increases your risk for metabolic syndrome and type 2 diabetes. ` +
        `Focus on both weight management and carbohydrate control in your diet.`
    });
  }

  // Low SpO2 + High Heart Rate
  if (abnormalities.spO2 === 'low' && abnormalities.heartRate === 'high') {
    recommendations.push({
      vital: 'Cardiorespiratory',
      message: `Your low oxygen levels and elevated heart rate together could indicate respiratory distress. ` +
        `This combination warrants careful monitoring and medical evaluation if it persists.`
    });
  }

  // Fever + Low BP
  if (abnormalities.temperature === 'high' && abnormalities.bloodPressure === 'low') {
    recommendations.push({
      vital: 'Infection Concern',
      message: `The combination of fever and low blood pressure could indicate an infection affecting your circulation. ` +
        `Stay well-hydrated and consider seeking prompt medical attention if other symptoms develop.`
    });
  }
}


export async function saveRecommendations(recommendations) {
  console.log('🛠️ saveRecommendations called with:', recommendations);

  // Hard-coded token for debugging; replace/remove once verified
  const token = localStorage.getItem('token') ||
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmaW5hbEBleGFtcGxlLmNvbSIsImlhdCI6MTc0NTg1OTMxMSwiZXhwIjoxNzQ1ODk1MzExfQ.L4SetmLEU7vnvRpQIxrKg0veXWW4Gij3GMoHYHeEGC5wrV6Kbh2U9LpyWXBj6eZVeY8GyXRIi4pZzvTXJx2_aw';
  console.log('🛠️ Using token:', token);

  const baseUrl = 'http://localhost:8080';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  for (const rec of recommendations) {
    const url = `${baseUrl}/api/recommendations/add?recommendationText=${encodeURIComponent(rec.message)}`;
    console.log(`🛠️ POST -> ${url}`);
    try {
      const response = await fetch(url, { method: 'POST', headers });
      console.log(`🛠️ Response for "${rec.message}":`, response.status, await response.text());
    } catch (err) {
      console.error('🛠️ Error posting recommendation:', err);
    }
  }
}
