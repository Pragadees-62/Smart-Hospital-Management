/**
 * Fix Demo User Passwords
 * Run once: node scripts/fixDemoPasswords.js
 * Updates all demo users to use password: demo123
 * Admin user uses: admin123
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const demoUsers = [
  // patients
  { email: 'patient@demo.com',  password: 'demo123', full_name: 'Rahul Sharma',  role: 'patient', phone: '+91 98765 43210' },
  { email: 'patient2@demo.com', password: 'demo123', full_name: 'Priya Patel',   role: 'patient', phone: '+91 98765 43211' },
  { email: 'patient3@demo.com', password: 'demo123', full_name: 'Amit Kumar',    role: 'patient', phone: '+91 98765 43212' },
  // doctors
  { email: 'doctor@demo.com',   password: 'demo123', full_name: 'Anita Patel',   role: 'doctor',  phone: '+91 98765 43220' },
  { email: 'doctor2@demo.com',  password: 'demo123', full_name: 'Rajesh Mehta',  role: 'doctor',  phone: '+91 98765 43221' },
  { email: 'doctor3@demo.com',  password: 'demo123', full_name: 'Sunita Verma',  role: 'doctor',  phone: '+91 98765 43222' },
  { email: 'doctor4@demo.com',  password: 'demo123', full_name: 'Vikram Singh',  role: 'doctor',  phone: '+91 98765 43223' },
  // admins
  { email: 'admin@demo.com',           password: 'demo123',  full_name: 'Admin User',         role: 'admin', phone: '+91 98765 43200' },
  { email: 'admin@smarthospital.com',  password: 'admin123', full_name: 'System Administrator', role: 'admin', phone: '+91 98765 00001' },
];

async function fixPasswords() {
  console.log('🔧 Fixing demo user passwords...\n');

  for (const u of demoUsers) {
    const hash = await bcrypt.hash(u.password, 12);

    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('email', u.email)
      .single();

    if (existing) {
      // Update password
      const { error } = await supabase
        .from('users')
        .update({ password_hash: hash, is_active: true })
        .eq('email', u.email);

      if (error) {
        console.log(`❌ Failed to update ${u.email}: ${error.message}`);
      } else {
        console.log(`✅ Updated password: ${u.email} (${existing.role}) → "${u.password}"`);
      }
    } else {
      // Create user
      const { data: newUser, error: createErr } = await supabase
        .from('users')
        .insert({
          email: u.email,
          password_hash: hash,
          full_name: u.full_name,
          role: u.role,
          phone: u.phone,
          is_active: true,
        })
        .select()
        .single();

      if (createErr) {
        console.log(`❌ Failed to create ${u.email}: ${createErr.message}`);
        continue;
      }

      console.log(`🆕 Created user: ${u.email} (${u.role}) → "${u.password}"`);

      // Create role profile
      if (u.role === 'patient') {
        await supabase.from('patients').insert({ user_id: newUser.id }).select();
      } else if (u.role === 'doctor') {
        // Find a department
        const { data: dept } = await supabase
          .from('departments')
          .select('id')
          .limit(1)
          .single();

        await supabase.from('doctors').insert({
          user_id: newUser.id,
          specialization: 'General Medicine',
          department_id: dept?.id || null,
          experience_years: 5,
          consultation_fee: 500,
          is_available: true,
        });
      } else if (u.role === 'admin') {
        await supabase.from('admins').insert({
          user_id: newUser.id,
          permissions: { all: true },
        });
      }
    }
  }

  // Also ensure patient/doctor profiles exist for existing users
  console.log('\n🔧 Ensuring role profiles exist...');

  const { data: allUsers } = await supabase
    .from('users')
    .select('id, email, role')
    .in('email', demoUsers.map(u => u.email));

  for (const user of allUsers || []) {
    if (user.role === 'patient') {
      const { data: p } = await supabase.from('patients').select('id').eq('user_id', user.id).single();
      if (!p) {
        await supabase.from('patients').insert({ user_id: user.id });
        console.log(`  ➕ Created patient profile for ${user.email}`);
      }
    } else if (user.role === 'doctor') {
      const { data: d } = await supabase.from('doctors').select('id').eq('user_id', user.id).single();
      if (!d) {
        const { data: dept } = await supabase.from('departments').select('id').limit(1).single();
        await supabase.from('doctors').insert({
          user_id: user.id,
          specialization: 'General Medicine',
          department_id: dept?.id || null,
          experience_years: 5,
          consultation_fee: 500,
          is_available: true,
        });
        console.log(`  ➕ Created doctor profile for ${user.email}`);
      }
    }
  }

  console.log('\n✅ Done! Demo credentials:');
  console.log('  patient@demo.com  / demo123');
  console.log('  doctor@demo.com   / demo123');
  console.log('  admin@demo.com    / demo123');
  process.exit(0);
}

fixPasswords().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
