/**
 * FeedbackModal
 * Patient rates the doctor (1-5 stars) and leaves an optional comment
 * after a completed appointment.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiX, FiSend } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

const FeedbackModal = ({ appointment, existingFeedback, onClose, onSubmitted }) => {
  const [rating, setRating]   = useState(existingFeedback?.rating  || 0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState(existingFeedback?.comment || '');
  const [loading, setLoading] = useState(false);

  const doctorName = appointment?.doctors?.users?.full_name;
  const alreadySubmitted = !!existingFeedback;

  const handleSubmit = async () => {
    if (!rating) { toast.error('Please select a star rating'); return; }
    setLoading(true);
    try {
      await api.post('/feedback', {
        appointment_id: appointment.id,
        rating,
        comment: comment.trim() || undefined
      });
      toast.success('Feedback submitted! Thank you.');
      onSubmitted?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const displayRating = hovered || rating;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900 text-lg">
            {alreadySubmitted ? 'Your Feedback' : 'Rate Your Consultation'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
            <FiX size={18} />
          </button>
        </div>

        {/* Doctor info */}
        <div className="flex items-center gap-3 mb-6 p-3 bg-blue-50 rounded-2xl">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {doctorName?.[0] || 'D'}
          </div>
          <div>
            <p className="font-bold text-gray-900">Dr. {doctorName}</p>
            <p className="text-xs text-gray-500">{appointment?.doctors?.specialization}</p>
            <p className="text-xs text-gray-400">{appointment?.appointment_date}</p>
          </div>
        </div>

        {/* Stars */}
        <div className="text-center mb-4">
          <p className="text-sm font-semibold text-gray-600 mb-3">
            {displayRating ? LABELS[displayRating] : 'Tap a star to rate'}
          </p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                disabled={alreadySubmitted}
                onMouseEnter={() => !alreadySubmitted && setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => !alreadySubmitted && setRating(star)}
                className="transition-transform hover:scale-110 disabled:cursor-default"
              >
                <FiStar
                  size={36}
                  className={`transition-colors ${
                    star <= displayRating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {displayRating > 0 && (
            <motion.p
              key={displayRating}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-bold text-yellow-600 mt-2"
            >
              {'⭐'.repeat(displayRating)} {LABELS[displayRating]}
            </motion.p>
          )}
        </div>

        {/* Comment */}
        <div className="mb-5">
          <label className="input-label">
            {alreadySubmitted ? 'Your comment' : 'Comment (optional)'}
          </label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            disabled={alreadySubmitted}
            placeholder="Share your experience with this doctor..."
            className="input-field resize-none disabled:bg-gray-50 disabled:text-gray-500"
            rows={3}
            maxLength={500}
          />
          {!alreadySubmitted && (
            <p className="text-xs text-gray-400 text-right mt-1">{comment.length}/500</p>
          )}
        </div>

        {/* Actions */}
        {alreadySubmitted ? (
          <div className="bg-green-50 rounded-2xl p-3 text-center">
            <p className="text-sm font-semibold text-green-700">✅ Feedback already submitted</p>
            <p className="text-xs text-green-600 mt-0.5">Thank you for your review!</p>
          </div>
        ) : (
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !rating}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><FiSend size={14} /> Submit</>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FeedbackModal;
