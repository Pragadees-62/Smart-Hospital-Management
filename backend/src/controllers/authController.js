/**
 * Authentication Controller
 * Handles user registration, login, and auth operations
 */

const { supabaseAdmin } = require('../config/supabase');
const { generateToken, hashPassword, comparePassword } = require('../utils/helpers');
const { sendWelcomeEmail } = require('../utils/emailService');
const { validationResult } = require('express-validator');

/**
 * Register new user (patient or doctor)
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password, full_name, role = 'patient', phone, date_of_birth, gender } = req.body;

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered. Please login.'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user in users table
    const { data: newUser, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        password_hash: hashedPassword,
        full_name,
        role,
        phone,
        is_active: true
      })
      .select()
      .single();

    if (userError) {
      console.error('User creation error:', userError);
      return res.status(500).json({ success: false, message: 'Registration failed.' });
    }

    // Create role-specific profile
    if (role === 'patient') {
      await supabaseAdmin.from('patients').insert({
        user_id: newUser.id,
        date_of_birth,
        gender,
        blood_group: req.body.blood_group || null,
        address: req.body.address || null
      });
    } else if (role === 'doctor') {
      await supabaseAdmin.from('doctors').insert({
        user_id: newUser.id,
        specialization: req.body.specialization || 'General',
        department_id: req.body.department_id || null,
        license_number: req.body.license_number || null,
        experience_years: req.body.experience_years || 0,
        consultation_fee: req.body.consultation_fee || 500
      });
    }

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, full_name).catch(console.error);

    // Generate token
    const token = generateToken(newUser.id, role);

    // Create notification
    await supabaseAdmin.from('notifications').insert({
      user_id: newUser.id,
      title: 'Welcome to Smart Hospital!',
      message: `Welcome ${full_name}! Your account has been created successfully.`,
      type: 'info'
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          role: newUser.role
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Check if account is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account deactivated. Contact administrator.'
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Get role-specific profile
    let profile = null;
    if (user.role === 'patient') {
      const { data } = await supabaseAdmin
        .from('patients')
        .select('*')
        .eq('user_id', user.id)
        .single();
      profile = data;
    } else if (user.role === 'doctor') {
      const { data } = await supabaseAdmin
        .from('doctors')
        .select('*, departments(name)')
        .eq('user_id', user.id)
        .single();
      profile = data;
    }

    // Update last login
    await supabaseAdmin
      .from('users')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', user.id);

    // Generate token
    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          phone: user.phone,
          avatar_url: user.avatar_url,
          profile
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, role, phone, avatar_url, created_at')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Get role-specific profile
    let profile = null;
    if (user.role === 'patient') {
      const { data } = await supabaseAdmin
        .from('patients')
        .select('*')
        .eq('user_id', user.id)
        .single();
      profile = data;
    } else if (user.role === 'doctor') {
      const { data } = await supabaseAdmin
        .from('doctors')
        .select('*, departments(name, description)')
        .eq('user_id', user.id)
        .single();
      profile = data;
    }

    res.json({
      success: true,
      data: { ...user, profile }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
  try {
    const { full_name, phone, avatar_url } = req.body;

    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update({ full_name, phone, avatar_url, updated_at: new Date().toISOString() })
      .eq('id', req.user.id)
      .select('id, email, full_name, role, phone, avatar_url')
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: 'Profile update failed.' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: updatedUser
    });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Change password
 * PUT /api/auth/change-password
 */
const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    // Get current user with password
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('password_hash')
      .eq('id', req.user.id)
      .single();

    // Verify current password
    const isValid = await comparePassword(current_password, user.password_hash);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    // Hash new password
    const hashedPassword = await hashPassword(new_password);

    await supabaseAdmin
      .from('users')
      .update({ password_hash: hashedPassword, updated_at: new Date().toISOString() })
      .eq('id', req.user.id);

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    console.error('ChangePassword error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword };
