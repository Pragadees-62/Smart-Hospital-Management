/**
 * AI Symptom Checker Component
 * Helps patients identify which department to visit
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiActivity, FiPlus, FiX, FiArrowRight, FiInfo } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const urgencyConfig = {
  critical: { color: 'red', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', badge: 'bg-red-100 text-red-800', label: '🚨 Critical - Seek Emergency Care' },
  high: { color: 'orange', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', badge: 'bg-orange-100 text-orange-800', label: '⚠️ High - See Doctor Soon' },
  medium: { color: 'yellow', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', badge: 'bg-yellow-100 text-yellow-800', label: '📋 Medium - Schedule Appointment' },
  low: { color: 'green', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', badge: 'bg-green-100 text-green-800', label: '✅ Low - Routine Consultation' },
};

const commonSymptoms = [
  'Headache', 'Fever', 'Cough', 'Chest Pain', 'Back Pain',
  'Joint Pain', 'Dizziness', 'Fatigue', 'Shortness of Breath', 'Skin Rash',
];

const SymptomChecker = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState([]);
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const addSymptom = (symptom) => {
    const trimmed = symptom.trim();
    if (!trimmed) return;
    if (symptoms.includes(trimmed)) {
      toast.error('Symptom already added');
      return;
    }
    if (symptoms.length >= 5) {
      toast.error('Maximum 5 symptoms allowed');
      return;
    }
    setSymptoms(prev => [...prev, trimmed]);
    setInput('');
    setResult(null);
  };

  const removeSymptom = (symptom) => {
    setSymptoms(prev => prev.filter(s => s !== symptom));
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (symptoms.length === 0) {
      toast.error('Please add at least one symptom');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/ai/symptoms', { symptoms });
      setResult(res.data.recommendation);
    } catch {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const urgency = result ? urgencyConfig[result.urgency] || urgencyConfig.low : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
          <FiActivity size={18} className="text-purple-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">AI Symptom Checker</h3>
          <p className="text-xs text-gray-500">Get department recommendations</p>
        </div>
      </div>

      {/* Common Symptoms */}
      <div className="mb-3">
        <p className="text-xs font-semibold text-gray-500 mb-2">Common Symptoms (click to add):</p>
        <div className="flex flex-wrap gap-1.5">
          {commonSymptoms.map(s => (
            <button
              key={s}
              onClick={() => addSymptom(s)}
              disabled={symptoms.includes(s)}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                symptoms.includes(s)
                  ? 'bg-blue-600 text-white cursor-default'
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Input */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addSymptom(input)}
          placeholder="Type a symptom..."
          className="input-field py-2 text-sm flex-1"
        />
        <button
          onClick={() => addSymptom(input)}
          className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <FiPlus size={18} />
        </button>
      </div>

      {/* Selected Symptoms */}
      {symptoms.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {symptoms.map(s => (
            <span key={s} className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {s}
              <button onClick={() => removeSymptom(s)} className="hover:text-blue-900">
                <FiX size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading || symptoms.length === 0}
        className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60 mb-3"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <FiActivity size={15} /> Analyze Symptoms
          </>
        )}
      </button>

      {/* Result */}
      <AnimatePresence>
        {result && urgency && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-xl border p-4 ${urgency.bg} ${urgency.border}`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${urgency.badge}`}>
                {urgency.label}
              </span>
            </div>
            <p className={`font-bold text-base mb-1 ${urgency.text}`}>
              Recommended: {result.department}
            </p>
            <p className={`text-sm mb-3 ${urgency.text} opacity-80`}>
              {result.description}
            </p>

            <button
              onClick={() => navigate('/patient/book-appointment')}
              className="w-full flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold text-sm py-2 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200"
            >
              Book Appointment <FiArrowRight size={14} />
            </button>

            <div className="flex items-start gap-1.5 mt-3">
              <FiInfo size={12} className="text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500">{result.disclaimer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SymptomChecker;
