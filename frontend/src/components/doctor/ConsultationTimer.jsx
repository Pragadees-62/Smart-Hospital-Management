/**
 * ConsultationTimer
 * 30-minute countdown shown when a doctor starts a consultation.
 * Persists across re-renders via localStorage so a page refresh
 * doesn't reset the clock.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX, FiAlertCircle, FiCheckCircle
} from 'react-icons/fi';

const DURATION = 30 * 60; // 30 minutes in seconds
const STORAGE_KEY = 'consultation_timer';

const ConsultationTimer = ({ appointmentId, patientName, onComplete, onClose }) => {
  const storageKey = `${STORAGE_KEY}_${appointmentId}`;

  // Restore from localStorage if timer was already started
  const getSavedSeconds = useCallback(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { startedAt } = JSON.parse(saved);
        const elapsed = Math.floor((Date.now() - startedAt) / 1000);
        const remaining = DURATION - elapsed;
        return remaining > 0 ? remaining : 0;
      }
    } catch { /* ignore */ }
    return DURATION;
  }, [storageKey]);

  const [seconds, setSeconds] = useState(getSavedSeconds);
  const [isExpired, setIsExpired] = useState(seconds === 0);

  // Save start time on first mount
  useEffect(() => {
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify({ startedAt: Date.now() }));
    }
  }, [storageKey]);

  // Countdown tick
  useEffect(() => {
    if (isExpired) return;
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isExpired]);

  const handleClose = () => {
    localStorage.removeItem(storageKey);
    onClose?.();
  };

  const handleComplete = () => {
    localStorage.removeItem(storageKey);
    onComplete?.();
  };

  // Format mm:ss
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  // Progress 0→1
  const progress = seconds / DURATION;
  const circumference = 2 * Math.PI * 54; // r=54
  const strokeDashoffset = circumference * (1 - progress);

  // Colour shifts: green → yellow → red
  const colour =
    seconds > 600 ? '#10b981' :   // > 10 min  green
    seconds > 300 ? '#f59e0b' :   // > 5 min   amber
    '#ef4444';                     // ≤ 5 min   red

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-bold text-gray-900">Consultation in Progress</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            title="Dismiss timer"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Patient name */}
        <p className="px-5 text-xs text-gray-500 mb-3">
          Patient: <span className="font-semibold text-gray-700">{patientName}</span>
        </p>

        {/* Circular timer */}
        <div className="flex flex-col items-center pb-4">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              {/* Track */}
              <circle cx="60" cy="60" r="54" fill="none" stroke="#f3f4f6" strokeWidth="8" />
              {/* Progress */}
              <circle
                cx="60" cy="60" r="54"
                fill="none"
                stroke={colour}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
              />
            </svg>
            {/* Time display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {isExpired ? (
                <FiAlertCircle size={28} className="text-red-500" />
              ) : (
                <>
                  <span className="text-2xl font-bold tabular-nums" style={{ color: colour }}>
                    {mins}:{secs}
                  </span>
                  <span className="text-xs text-gray-400 mt-0.5">remaining</span>
                </>
              )}
            </div>
          </div>

          {/* Expired message */}
          {isExpired && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 px-4 py-2 bg-red-50 rounded-xl text-center"
            >
              <p className="text-sm font-bold text-red-700 flex items-center justify-center gap-1">
                <FiAlertCircle size={14} /> Time's up!
              </p>
              <p className="text-xs text-red-500 mt-0.5">30-minute slot has ended</p>
            </motion.div>
          )}

          {/* Progress bar */}
          {!isExpired && (
            <div className="w-full px-5 mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>0 min</span>
                <span>30 min</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: colour, width: `${(1 - progress) * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 mt-4 px-5 w-full">
            <button
              onClick={handleClose}
              className="flex-1 py-2 text-xs font-semibold bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Minimize
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 py-2 text-xs font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
            >
              <FiCheckCircle size={13} /> Complete
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConsultationTimer;
