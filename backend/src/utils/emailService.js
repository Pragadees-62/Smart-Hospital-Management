/**
 * Email Service
 * Handles sending emails for notifications, reminders, etc.
 */

const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * Send appointment confirmation email
 */
const sendAppointmentConfirmation = async (to, appointmentData) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Smart Hospital" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Appointment Confirmation - Smart Hospital',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">🏥 Smart Hospital</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1e40af;">Appointment Confirmed!</h2>
            <p>Dear ${appointmentData.patientName},</p>
            <p>Your appointment has been successfully booked.</p>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <p><strong>Doctor:</strong> Dr. ${appointmentData.doctorName}</p>
              <p><strong>Department:</strong> ${appointmentData.department}</p>
              <p><strong>Date:</strong> ${appointmentData.date}</p>
              <p><strong>Time:</strong> ${appointmentData.time}</p>
              <p><strong>Token:</strong> ${appointmentData.token}</p>
            </div>
            <p style="color: #64748b; margin-top: 20px;">Please arrive 15 minutes before your appointment time.</p>
          </div>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error.message);
    return false;
  }
};

/**
 * Send welcome email
 */
const sendWelcomeEmail = async (to, name) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Smart Hospital" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Welcome to Smart Hospital!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">🏥 Smart Hospital</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1e40af;">Welcome, ${name}!</h2>
            <p>Thank you for registering with Smart Hospital. Your health is our priority.</p>
            <p>You can now:</p>
            <ul>
              <li>Book appointments with our specialists</li>
              <li>Track your queue in real-time</li>
              <li>Access your prescriptions online</li>
              <li>View your medical history</li>
            </ul>
          </div>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error.message);
    return false;
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (to, resetToken) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: `"Smart Hospital" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Password Reset - Smart Hospital',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">🏥 Smart Hospital</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1e40af;">Password Reset Request</h2>
            <p>Click the button below to reset your password. This link expires in 1 hour.</p>
            <a href="${resetUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 20px 0;">Reset Password</a>
            <p style="color: #64748b;">If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error.message);
    return false;
  }
};

module.exports = {
  sendAppointmentConfirmation,
  sendWelcomeEmail,
  sendPasswordResetEmail
};
