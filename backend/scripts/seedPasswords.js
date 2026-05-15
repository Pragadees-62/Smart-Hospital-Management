require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const sb = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  console.log('Hashing passwords...');
  const demo123 = await bcrypt.hash('demo123', 10);
  const admin123 = await bcrypt.hash('admin123', 10);
  console.log('Hashes ready, updating DB...');

  const rows = [
    { email: 'patient@demo.com',         hash: demo123 },
    { email: 'patient2@demo.com',        hash: demo123 },
    { email: 'patient3@demo.com',        hash: demo123 },
    { email: 'doctor@demo.com',          hash: demo123 },
    { email: 'doctor2@demo.com',         hash: demo123 },
    { email: 'doctor3@demo.com',         hash: demo123 },
    { email: 'doctor4@demo.com',         hash: demo123 },
    { email: 'admin@demo.com',           hash: demo123 },
    { email: 'admin@smarthospital.com',  hash: admin123 },
    { email: 'test_check@demo.com',      hash: demo123 },
  ];

  for (const r of rows) {
    const { error } = await sb
      .from('users')
      .update({ password_hash: r.hash })
      .eq('email', r.email);
    if (error) console.log('FAIL', r.email, error.message);
    else console.log('OK  ', r.email);
  }

  // Ensure doctor profiles exist
  console.log('\nChecking doctor profiles...');
  const { data: doctors } = await sb
    .from('users')
    .select('id, email')
    .eq('role', 'doctor');

  const { data: dept } = await sb
    .from('departments')
    .select('id, name')
    .limit(4);

  const deptMap = {
    'doctor@demo.com':  dept?.[0]?.id,
    'doctor2@demo.com': dept?.[1]?.id,
    'doctor3@demo.com': dept?.[2]?.id,
    'doctor4@demo.com': dept?.[3]?.id,
  };

  const specs = {
    'doctor@demo.com':  'Cardiology',
    'doctor2@demo.com': 'Neurology',
    'doctor3@demo.com': 'Pediatrics',
    'doctor4@demo.com': 'Orthopedics',
  };

  for (const d of doctors || []) {
    const { data: existing } = await sb
      .from('doctors')
      .select('id')
      .eq('user_id', d.id)
      .single();

    if (!existing) {
      const { error } = await sb.from('doctors').insert({
        user_id: d.id,
        specialization: specs[d.email] || 'General Medicine',
        department_id: deptMap[d.email] || null,
        experience_years: 8,
        consultation_fee: 600,
        is_available: true,
      });
      if (error) console.log('Doctor profile FAIL', d.email, error.message);
      else console.log('Doctor profile created:', d.email);
    } else {
      console.log('Doctor profile OK:', d.email);
    }
  }

  // Ensure patient profiles exist
  console.log('\nChecking patient profiles...');
  const { data: patients } = await sb
    .from('users')
    .select('id, email')
    .eq('role', 'patient');

  for (const p of patients || []) {
    const { data: existing } = await sb
      .from('patients')
      .select('id')
      .eq('user_id', p.id)
      .single();

    if (!existing) {
      await sb.from('patients').insert({ user_id: p.id });
      console.log('Patient profile created:', p.email);
    } else {
      console.log('Patient profile OK:', p.email);
    }
  }

  // Ensure admin profiles exist
  console.log('\nChecking admin profiles...');
  const { data: admins } = await sb
    .from('users')
    .select('id, email')
    .eq('role', 'admin');

  for (const a of admins || []) {
    const { data: existing } = await sb
      .from('admins')
      .select('id')
      .eq('user_id', a.id)
      .single();

    if (!existing) {
      await sb.from('admins').insert({ user_id: a.id, permissions: { all: true } });
      console.log('Admin profile created:', a.email);
    } else {
      console.log('Admin profile OK:', a.email);
    }
  }

  console.log('\n=== DONE ===');
  console.log('Demo credentials:');
  console.log('  patient@demo.com  / demo123');
  console.log('  doctor@demo.com   / demo123');
  console.log('  admin@demo.com    / demo123');
}

run().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
