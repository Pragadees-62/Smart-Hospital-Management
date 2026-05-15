-- ============================================================
-- Feedback / Rating Table
-- Run this in Supabase SQL Editor AFTER schema.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id    UUID NOT NULL REFERENCES patients(id)     ON DELETE CASCADE,
  doctor_id     UUID NOT NULL REFERENCES doctors(id)      ON DELETE CASCADE,
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  -- one feedback per appointment
  UNIQUE(appointment_id)
);

CREATE INDEX idx_feedback_doctor_id     ON feedback(doctor_id);
CREATE INDEX idx_feedback_patient_id    ON feedback(patient_id);
CREATE INDEX idx_feedback_appointment_id ON feedback(appointment_id);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on feedback" ON feedback FOR ALL USING (true);

-- Auto-recalculate doctor rating after each new feedback row
CREATE OR REPLACE FUNCTION recalculate_doctor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE doctors
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 2)
    FROM feedback
    WHERE doctor_id = NEW.doctor_id
  )
  WHERE id = NEW.doctor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS after_feedback_insert ON feedback;
CREATE TRIGGER after_feedback_insert
  AFTER INSERT OR UPDATE ON feedback
  FOR EACH ROW EXECUTE FUNCTION recalculate_doctor_rating();
