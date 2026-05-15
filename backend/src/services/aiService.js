/**
 * AI Symptom Checker Service
 * Provides basic symptom analysis using rule-based logic.
 * In production, integrate with a medical AI API (e.g., OpenAI, Infermedica).
 */

/**
 * Symptom-to-department mapping
 * Maps common symptoms to recommended departments
 */
const symptomDepartmentMap = {
  // Cardiology
  'chest pain': { department: 'Cardiology', urgency: 'high', description: 'Chest pain can indicate cardiac issues. Seek immediate medical attention.' },
  'heart palpitations': { department: 'Cardiology', urgency: 'medium', description: 'Irregular heartbeat may require cardiac evaluation.' },
  'shortness of breath': { department: 'Cardiology', urgency: 'high', description: 'Difficulty breathing can be cardiac or pulmonary in origin.' },
  'high blood pressure': { department: 'Cardiology', urgency: 'medium', description: 'Hypertension requires regular monitoring and management.' },

  // Neurology
  'headache': { department: 'Neurology', urgency: 'low', description: 'Persistent or severe headaches should be evaluated by a neurologist.' },
  'migraine': { department: 'Neurology', urgency: 'medium', description: 'Migraines can be managed with proper neurological care.' },
  'dizziness': { department: 'Neurology', urgency: 'medium', description: 'Dizziness may indicate neurological or inner ear issues.' },
  'seizure': { department: 'Neurology', urgency: 'critical', description: 'Seizures require immediate neurological evaluation.' },
  'memory loss': { department: 'Neurology', urgency: 'medium', description: 'Memory issues should be evaluated by a neurologist.' },
  'numbness': { department: 'Neurology', urgency: 'medium', description: 'Numbness or tingling may indicate nerve issues.' },

  // Orthopedics
  'joint pain': { department: 'Orthopedics', urgency: 'low', description: 'Joint pain can be managed with orthopedic care.' },
  'back pain': { department: 'Orthopedics', urgency: 'low', description: 'Back pain is common and often treatable with orthopedic care.' },
  'fracture': { department: 'Orthopedics', urgency: 'high', description: 'Suspected fractures require immediate orthopedic evaluation.' },
  'knee pain': { department: 'Orthopedics', urgency: 'low', description: 'Knee pain may require orthopedic assessment.' },
  'sports injury': { department: 'Orthopedics', urgency: 'medium', description: 'Sports injuries benefit from specialized orthopedic care.' },

  // Pediatrics
  'fever in child': { department: 'Pediatrics', urgency: 'medium', description: 'Fever in children should be evaluated by a pediatrician.' },
  'child cough': { department: 'Pediatrics', urgency: 'low', description: 'Persistent cough in children needs pediatric evaluation.' },
  'child rash': { department: 'Pediatrics', urgency: 'medium', description: 'Skin rashes in children should be assessed by a pediatrician.' },

  // Dermatology
  'skin rash': { department: 'Dermatology', urgency: 'low', description: 'Skin conditions are best evaluated by a dermatologist.' },
  'acne': { department: 'Dermatology', urgency: 'low', description: 'Acne treatment is available through dermatology.' },
  'eczema': { department: 'Dermatology', urgency: 'low', description: 'Eczema management requires dermatological care.' },
  'psoriasis': { department: 'Dermatology', urgency: 'low', description: 'Psoriasis is a chronic condition managed by dermatologists.' },

  // Ophthalmology
  'eye pain': { department: 'Ophthalmology', urgency: 'medium', description: 'Eye pain requires prompt ophthalmological evaluation.' },
  'blurred vision': { department: 'Ophthalmology', urgency: 'medium', description: 'Vision changes should be assessed by an eye specialist.' },
  'eye infection': { department: 'Ophthalmology', urgency: 'medium', description: 'Eye infections need prompt treatment.' },

  // Gynecology
  'menstrual pain': { department: 'Gynecology', urgency: 'low', description: 'Menstrual issues are best managed by a gynecologist.' },
  'pregnancy': { department: 'Gynecology', urgency: 'medium', description: 'Prenatal care is essential for a healthy pregnancy.' },

  // General Medicine
  'fever': { department: 'General Medicine', urgency: 'medium', description: 'Fever can indicate infection. A general physician can evaluate.' },
  'cold': { department: 'General Medicine', urgency: 'low', description: 'Common cold is usually managed with general care.' },
  'cough': { department: 'General Medicine', urgency: 'low', description: 'Persistent cough should be evaluated by a physician.' },
  'fatigue': { department: 'General Medicine', urgency: 'low', description: 'Chronic fatigue may have various causes requiring evaluation.' },
  'diabetes': { department: 'General Medicine', urgency: 'medium', description: 'Diabetes management requires regular medical supervision.' },
  'thyroid': { department: 'General Medicine', urgency: 'medium', description: 'Thyroid disorders require medical management.' },

  // Emergency
  'severe bleeding': { department: 'Emergency', urgency: 'critical', description: 'Severe bleeding requires immediate emergency care.' },
  'unconscious': { department: 'Emergency', urgency: 'critical', description: 'Loss of consciousness is a medical emergency.' },
  'stroke': { department: 'Emergency', urgency: 'critical', description: 'Stroke symptoms require immediate emergency treatment.' },
  'accident': { department: 'Emergency', urgency: 'critical', description: 'Trauma from accidents requires emergency evaluation.' },
};

/**
 * Analyze symptoms and suggest department
 * @param {string[]} symptoms - Array of symptom strings
 * @returns {Object} Analysis result with department recommendation
 */
const analyzeSymptoms = (symptoms) => {
  if (!symptoms || symptoms.length === 0) {
    return {
      success: false,
      message: 'Please provide at least one symptom'
    };
  }

  const results = [];
  const symptomsLower = symptoms.map(s => s.toLowerCase().trim());

  // Check each symptom against the map
  for (const symptom of symptomsLower) {
    for (const [key, value] of Object.entries(symptomDepartmentMap)) {
      if (symptom.includes(key) || key.includes(symptom)) {
        results.push({ symptom, ...value });
        break;
      }
    }
  }

  if (results.length === 0) {
    return {
      success: true,
      recommendation: {
        department: 'General Medicine',
        urgency: 'low',
        description: 'Your symptoms could not be specifically matched. A general physician can evaluate and refer you to the appropriate specialist.',
        symptoms_analyzed: symptoms,
        disclaimer: 'This is an AI-assisted suggestion only. Please consult a qualified medical professional for proper diagnosis.'
      }
    };
  }

  // Find highest urgency
  const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
  const highestUrgency = results.reduce((max, r) =>
    urgencyOrder[r.urgency] > urgencyOrder[max.urgency] ? r : max
  );

  return {
    success: true,
    recommendation: {
      department: highestUrgency.department,
      urgency: highestUrgency.urgency,
      description: highestUrgency.description,
      all_matches: results,
      symptoms_analyzed: symptoms,
      disclaimer: 'This is an AI-assisted suggestion only. Please consult a qualified medical professional for proper diagnosis and treatment.'
    }
  };
};

/**
 * Get urgency color for UI
 */
const getUrgencyColor = (urgency) => {
  const colors = {
    critical: 'red',
    high: 'orange',
    medium: 'yellow',
    low: 'green'
  };
  return colors[urgency] || 'gray';
};

module.exports = { analyzeSymptoms, getUrgencyColor };
