-- ============================================================
-- Smart Hospital Management System - Database Triggers
-- Run this AFTER schema.sql
-- ============================================================

-- ============================================================
-- AUTO-UPDATE updated_at TIMESTAMP
-- ============================================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'users', 'doctors', 'patients', 'appointments', 'prescriptions',
    'billing', 'notifications', 'beds', 'emergency_cases',
    'doctor_availability', 'queue_tokens', 'departments'
  ]
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%s_updated_at ON %s;
      CREATE TRIGGER update_%s_updated_at
        BEFORE UPDATE ON %s
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    ', t, t, t, t);
  END LOOP;
END;
$$;

-- ============================================================
-- AUTO-CREATE PATIENT PROFILE ON USER REGISTRATION
-- ============================================================

CREATE OR REPLACE FUNCTION create_patient_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'patient' THEN
    INSERT INTO patients (user_id)
    VALUES (NEW.id)
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_patient_user_created ON users;
CREATE TRIGGER on_patient_user_created
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_patient_profile();

-- ============================================================
-- AUTO-CREATE ADMIN PROFILE ON ADMIN USER CREATION
-- ============================================================

CREATE OR REPLACE FUNCTION create_admin_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'admin' THEN
    INSERT INTO admins (user_id, permissions)
    VALUES (NEW.id, '{"all": true}')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_admin_user_created ON users;
CREATE TRIGGER on_admin_user_created
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_admin_profile();

-- ============================================================
-- AUTO-GENERATE QUEUE TOKEN ON APPOINTMENT CREATION
-- ============================================================

CREATE OR REPLACE FUNCTION generate_queue_token_on_appointment()
RETURNS TRIGGER AS $$
DECLARE
  token_count INTEGER;
  token_code VARCHAR(10);
BEGIN
  -- Count existing appointments for this doctor on this date
  SELECT COUNT(*) INTO token_count
  FROM appointments
  WHERE doctor_id = NEW.doctor_id
    AND appointment_date = NEW.appointment_date
    AND status != 'cancelled'
    AND id != NEW.id;

  -- Generate token code
  token_code := 'T' || LPAD((token_count + 1)::TEXT, 3, '0');

  -- Update the appointment with token info
  NEW.queue_token := token_code;
  NEW.token_number := token_count + 1;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: This trigger is optional since the backend handles token generation
-- Uncomment if you want database-level token generation
-- DROP TRIGGER IF EXISTS on_appointment_created ON appointments;
-- CREATE TRIGGER on_appointment_created
--   BEFORE INSERT ON appointments
--   FOR EACH ROW
--   EXECUTE FUNCTION generate_queue_token_on_appointment();

-- ============================================================
-- AUTO-NOTIFY ON APPOINTMENT STATUS CHANGE
-- ============================================================

CREATE OR REPLACE FUNCTION notify_appointment_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger on status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Insert notification for patient
    INSERT INTO notifications (user_id, title, message, type)
    SELECT
      p.user_id,
      'Appointment Status Updated',
      'Your appointment status has been updated to: ' || NEW.status,
      'appointment'
    FROM patients p
    WHERE p.id = NEW.patient_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_appointment_status_change ON appointments;
CREATE TRIGGER on_appointment_status_change
  AFTER UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION notify_appointment_status_change();

-- ============================================================
-- AUTO-UPDATE BED STATUS WHEN PATIENT ASSIGNED
-- ============================================================

CREATE OR REPLACE FUNCTION update_bed_status_on_patient_assignment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.patient_id IS NOT NULL AND OLD.patient_id IS NULL THEN
    NEW.status := 'occupied';
  ELSIF NEW.patient_id IS NULL AND OLD.patient_id IS NOT NULL THEN
    NEW.status := 'available';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_bed_patient_assignment ON beds;
CREATE TRIGGER on_bed_patient_assignment
  BEFORE UPDATE ON beds
  FOR EACH ROW
  EXECUTE FUNCTION update_bed_status_on_patient_assignment();
