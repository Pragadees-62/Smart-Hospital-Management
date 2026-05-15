-- ============================================================
-- Smart Hospital Management System - Performance Indexes
-- Run this AFTER schema.sql
-- ============================================================

-- ============================================================
-- USERS TABLE INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- ============================================================
-- PATIENTS TABLE INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_blood_group ON patients(blood_group);
CREATE INDEX IF NOT EXISTS idx_patients_gender ON patients(gender);

-- ============================================================
-- DOCTORS TABLE INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_department_id ON doctors(department_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);
CREATE INDEX IF NOT EXISTS idx_doctors_is_available ON doctors(is_available);
CREATE INDEX IF NOT EXISTS idx_doctors_rating ON doctors(rating DESC);

-- ============================================================
-- APPOINTMENTS TABLE INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at DESC);
-- Composite index for common query: doctor + date + status
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date_status
  ON appointments(doctor_id, appointment_date, status);
-- Composite index for patient appointments
CREATE INDEX IF NOT EXISTS idx_appointments_patient_date
  ON appointments(patient_id, appointment_date DESC);

-- ============================================================
-- QUEUE TOKENS TABLE INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_queue_doctor_date ON queue_tokens(doctor_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_queue_appointment_id ON queue_tokens(appointment_id);
CREATE INDEX IF NOT EXISTS idx_queue_status ON queue_tokens(status);
CREATE INDEX IF NOT EXISTS idx_queue_token_number ON queue_tokens(token_number);

-- ============================================================
-- PRESCRIPTIONS TABLE INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_appointment_id ON prescriptions(appointment_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_created_at ON prescriptions(created_at DESC);

-- ============================================================
-- BILLING TABLE INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_billing_patient_id ON billing(patient_id);
CREATE INDEX IF NOT EXISTS idx_billing_payment_status ON billing(payment_status);
CREATE INDEX IF NOT EXISTS idx_billing_appointment_id ON billing(appointment_id);
CREATE INDEX IF NOT EXISTS idx_billing_created_at ON billing(created_at DESC);
-- Composite for revenue queries
CREATE INDEX IF NOT EXISTS idx_billing_status_date
  ON billing(payment_status, created_at DESC);

-- ============================================================
-- NOTIFICATIONS TABLE INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
-- Composite for unread notifications query
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON notifications(user_id, is_read) WHERE is_read = false;

-- ============================================================
-- REPORTS TABLE INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_reports_patient_id ON reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_reports_appointment_id ON reports(appointment_id);
CREATE INDEX IF NOT EXISTS idx_reports_report_type ON reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- ============================================================
-- EMERGENCY CASES TABLE INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_emergency_status ON emergency_cases(status);
CREATE INDEX IF NOT EXISTS idx_emergency_severity ON emergency_cases(severity);
CREATE INDEX IF NOT EXISTS idx_emergency_created_at ON emergency_cases(created_at DESC);

-- ============================================================
-- BEDS TABLE INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_beds_status ON beds(status);
CREATE INDEX IF NOT EXISTS idx_beds_department_id ON beds(department_id);
CREATE INDEX IF NOT EXISTS idx_beds_bed_type ON beds(bed_type);

-- ============================================================
-- DOCTOR AVAILABILITY TABLE INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_availability_doctor_id ON doctor_availability(doctor_id);
CREATE INDEX IF NOT EXISTS idx_availability_day ON doctor_availability(day_of_week);
CREATE INDEX IF NOT EXISTS idx_availability_doctor_day
  ON doctor_availability(doctor_id, day_of_week);

-- ============================================================
-- DEPARTMENTS TABLE INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_departments_name ON departments(name);
