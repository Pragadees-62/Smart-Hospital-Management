/**
 * Supabase Client for Frontend
 * Used for real-time subscriptions and direct queries
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables not set. Real-time features will be disabled.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

/**
 * Subscribe to real-time queue updates for a doctor
 * @param {string} doctorId - Doctor's UUID
 * @param {Function} callback - Called with updated queue data
 * @returns {Function} Unsubscribe function
 */
export const subscribeToQueue = (doctorId, callback) => {
  const channel = supabase
    .channel(`queue:${doctorId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'queue_tokens',
        filter: `doctor_id=eq.${doctorId}`
      },
      (payload) => callback(payload)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
};

/**
 * Subscribe to real-time notifications for a user
 * @param {string} userId - User's UUID
 * @param {Function} callback - Called with new notification
 * @returns {Function} Unsubscribe function
 */
export const subscribeToNotifications = (userId, callback) => {
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => callback(payload.new)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
};

/**
 * Subscribe to appointment status changes
 * @param {string} patientId - Patient's UUID
 * @param {Function} callback - Called with updated appointment
 * @returns {Function} Unsubscribe function
 */
export const subscribeToAppointments = (patientId, callback) => {
  const channel = supabase
    .channel(`appointments:${patientId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'appointments',
        filter: `patient_id=eq.${patientId}`
      },
      (payload) => callback(payload.new)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
};

/**
 * Subscribe to emergency cases (admin)
 * @param {Function} callback - Called with new emergency case
 * @returns {Function} Unsubscribe function
 */
export const subscribeToEmergencies = (callback) => {
  const channel = supabase
    .channel('emergency_cases')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'emergency_cases'
      },
      (payload) => callback(payload.new)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
};

export default supabase;
