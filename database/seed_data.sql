-- ============================================================
-- Smart Hospital - Sample/Demo Data
-- Run AFTER schema.sql
-- All passwords are: demo123
-- Bcrypt hash for "demo123" with salt 12
-- ============================================================
-- Demo Patient User
INSERT INTO users (email, password_hash, full_name, role, phone, is_active) VALUES
  ('patient@demo.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Rahul Sharma', 'patient', '+91 98765 43210', true),
  ('patient2@demo.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Priya Patel', 'patient', '+91 98765 43211', true),
  ('patient3@demo.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Amit Kumar', 'patient', '+91 98765 43212', true)
ON CONFLICT (email) DO NOTHING;

-- Demo Doctor Users
INSERT INTO users (email, password_hash, full_name, role, phone, is_active) VALUES
  ('doctor@demo.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Anita Patel', 'doctor', '+91 98765 43220', true),
  ('doctor2@demo.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Rajesh Mehta', 'doctor', '+91 98765 43221', true),
  ('doctor3@demo.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sunita Verma', 'doctor', '+91 98765 43222', true),
  ('doctor4@demo.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Vikram Singh', 'doctor', '+91 98765 43223', true)
ON CONFLICT (email) DO NOTHING;

-- Demo Admin
INSERT INTO users (email, password_hash, full_name, role, phone, is_active) VALUES
  ('admin@demo.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin', '+91 98765 43200', true)
ON CONFLICT (email) DO NOTHING;

-- Patient Profiles
INSERT INTO patients (user_id, date_of_birth, gender, blood_group, address, emergency_contact)
SELECT id, '1990-05-15', 'male', 'B+', 'Mumbai, Maharashtra', '+91 98765 43299'
FROM users WHERE email = 'patient@demo.com'
ON CONFLICT DO NOTHING;

INSERT INTO patients (user_id, date_of_birth, gender, blood_group, address)
SELECT id, '1995-08-22', 'female', 'A+', 'Delhi, India'
FROM users WHERE email = 'patient2@demo.com'
ON CONFLICT DO NOTHING;

INSERT INTO patients (user_id, date_of_birth, gender, blood_group, address)
SELECT id, '1985-12-10', 'male', 'O+', 'Bangalore, Karnataka'
FROM users WHERE email = 'patient3@demo.com'
ON CONFLICT DO NOTHING;

-- Doctor Profiles
INSERT INTO doctors (user_id, department_id, specialization, experience_years, consultation_fee, rating, bio, education)
SELECT u.id, d.id, 'Cardiology', 12, 800.00, 4.9,
  'Experienced cardiologist with expertise in interventional cardiology and heart failure management.',
  'MBBS - AIIMS Delhi, MD Cardiology - PGI Chandigarh, DM Cardiology'
FROM users u, departments d
WHERE u.email = 'doctor@demo.com' AND d.name = 'Cardiology'
ON CONFLICT DO NOTHING;

INSERT INTO doctors (user_id, department_id, specialization, experience_years, consultation_fee, rating, bio, education)
SELECT u.id, d.id, 'Neurology', 8, 700.00, 4.7,
  'Specialist in neurological disorders including epilepsy, stroke, and movement disorders.',
  'MBBS - KEM Mumbai, MD Neurology - NIMHANS Bangalore'
FROM users u, departments d
WHERE u.email = 'doctor2@demo.com' AND d.name = 'Neurology'
ON CONFLICT DO NOTHING;

INSERT INTO doctors (user_id, department_id, specialization, experience_years, consultation_fee, rating, bio, education)
SELECT u.id, d.id, 'Pediatrics', 10, 600.00, 4.8,
  'Dedicated pediatrician providing comprehensive care for children from newborns to adolescents.',
  'MBBS - Grant Medical College, MD Pediatrics - AIIMS'
FROM users u, departments d
WHERE u.email = 'doctor3@demo.com' AND d.name = 'Pediatrics'
ON CONFLICT DO NOTHING;

INSERT INTO doctors (user_id, department_id, specialization, experience_years, consultation_fee, rating, bio, education)
SELECT u.id, d.id, 'Orthopedics', 15, 900.00, 4.6,
  'Expert orthopedic surgeon specializing in joint replacement and sports injuries.',
  'MBBS - Maulana Azad Medical College, MS Orthopedics - AIIMS'
FROM users u, departments d
WHERE u.email = 'doctor4@demo.com' AND d.name = 'Orthopedics'
ON CONFLICT DO NOTHING;

-- Doctor Availability (Mon-Sat, 9AM-5PM, 30 min slots)
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time, slot_duration, is_available)
SELECT d.id, day, '09:00', '17:00', 30, (day != 'sunday')
FROM doctors d,
  unnest(ARRAY['monday','tuesday','wednesday','thursday','friday','saturday','sunday']) AS day
WHERE d.user_id IN (SELECT id FROM users WHERE role = 'doctor')
ON CONFLICT (doctor_id, day_of_week) DO NOTHING;
