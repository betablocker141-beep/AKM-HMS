-- ═══════════════════════════════════════════════════════════════════════════
-- AKM HMS — SEED DATA
-- Run this in Supabase Dashboard → SQL Editor → New Query
-- Run AFTER schema.sql
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── STEP 1: Confirm admin email (skip if already confirmed)
UPDATE auth.users
SET email_confirmed_at  = NOW(),
    confirmation_token  = '',
    confirmation_sent_at = NOW()
WHERE email = 'akmmedicare.admin@gmail.com'
  AND email_confirmed_at IS NULL;

-- ─── STEP 2: Insert admin user profile
INSERT INTO users (id, email, role, doctor_id)
VALUES (
  'e3a16fc7-a41e-4c3c-bfe1-ed64a9deaa3a',
  'akmmedicare.admin@gmail.com',
  'admin',
  NULL
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- ─── STEP 3: Seed doctors (skip if already inserted)
INSERT INTO doctors (name, specialty, phone, whatsapp_number, share_percent, is_active)
SELECT name, specialty, phone, whatsapp_number, share_percent, is_active
FROM (VALUES
  ('Dr. Amjad Ali',     'General Medicine', '03001234567', '923001234567', 40, TRUE),
  ('Dr. Fatima Malik',  'Gynecology & OB',  '03009876543', '923009876543', 45, TRUE),
  ('Dr. Tariq Hussain', 'Pediatrics',       '03335551234', '923335551234', 40, TRUE),
  ('Dr. Sana Baig',     'Radiology / US',   '03456789012', '923456789012', 50, TRUE),
  ('Dr. Imran Sheikh',  'Surgery',          '03211112222', '923211112222', 40, TRUE)
) AS v(name, specialty, phone, whatsapp_number, share_percent, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM doctors WHERE doctors.name = v.name
);

-- ─── STEP 4: Create receptionist auth account (safe — wraps in exception block)
DO $$
DECLARE
  rec_id uuid;
BEGIN
  -- Only insert if email doesn't already exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'receptionist@akmmedicare.gmail.com') THEN
    rec_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, email, encrypted_password, email_confirmed_at,
      role, aud, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data
    ) VALUES (
      rec_id,
      'receptionist@akmmedicare.gmail.com',
      crypt('AKMReception2026!', gen_salt('bf')),
      NOW(),
      'authenticated', 'authenticated', NOW(), NOW(),
      '{"provider":"email","providers":["email"]}',
      '{}'
    );

    INSERT INTO users (id, email, role, doctor_id)
    VALUES (rec_id, 'receptionist@akmmedicare.gmail.com', 'receptionist', NULL);
  END IF;
END $$;

-- ─── STEP 5: Verify everything
SELECT 'auth.users' AS table_name, COUNT(*) AS rows FROM auth.users WHERE email LIKE '%akmmedicare%'
UNION ALL
SELECT 'users',    COUNT(*) FROM users
UNION ALL
SELECT 'doctors',  COUNT(*) FROM doctors;
