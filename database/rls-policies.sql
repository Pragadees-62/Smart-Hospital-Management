-- ============================================================
-- Smart Hospital Management System - Row Level Security Policies
-- Run this AFTER schema.sql
-- These policies are for direct Supabase client access.
-- The backend uses the service role key which bypasses RLS.
-- ============================================================

-- ============================================================
-- USERS TABLE POLICIES
-- ============================================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- ============================================================
-- PATIENTS TABLE POLICIES
-- ============================================================

-- Patients can view their own record
CREATE POLICY "Patients can view own record" ON patients
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE id::text = auth.uid()::text)
  );

-- Patients can update their own record
CREATE POLICY "Patients can update own record" ON patients
  FOR UPDATE USING (
    user_id IN (SELECT id FROM users WHERE id::text = auth.uid()::text)
  );

-- ============================================================
-- APPOINTMENTS TABLE POLICIES
-- ============================================================

-- Patients can view their own appointments
CREATE POLICY "Patients can view own appointments" ON appointments
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM patients WHERE user_id::text = auth.uid()::text
    )
  );

-- Doctors can view their appointments
CREATE POLICY "Doctors can view own appointments" ON appointments
  FOR SELECT USING (
    doctor_id IN (
      SELECT id FROM doctors WHERE user_id::text = auth.uid()::text
    )
  );

-- ============================================================
-- NOTIFICATIONS TABLE POLICIES
-- ============================================================

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id::text = auth.uid()::text);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id::text = auth.uid()::text);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications" ON notifications
  FOR DELETE USING (user_id::text = auth.uid()::text);

-- ============================================================
-- PRESCRIPTIONS TABLE POLICIES
-- ============================================================

-- Patients can view their own prescriptions
CREATE POLICY "Patients can view own prescriptions" ON prescriptions
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM patients WHERE user_id::text = auth.uid()::text
    )
  );

-- Doctors can view prescriptions they created
CREATE POLICY "Doctors can view own prescriptions" ON prescriptions
  FOR SELECT USING (
    doctor_id IN (
      SELECT id FROM doctors WHERE user_id::text = auth.uid()::text
    )
  );

-- ============================================================
-- BILLING TABLE POLICIES
-- ============================================================

-- Patients can view their own bills
CREATE POLICY "Patients can view own bills" ON billing
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM patients WHERE user_id::text = auth.uid()::text
    )
  );

-- ============================================================
-- NOTE: Backend service role bypasses all RLS policies
-- The above policies are for direct Supabase client access only
-- ============================================================
