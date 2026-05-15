/**
 * Billing Controller
 * Handles payment and billing operations
 */

const { supabaseAdmin } = require('../config/supabase');

/**
 * Create bill
 * POST /api/payments
 */
const createBill = async (req, res) => {
  try {
    const { appointment_id, patient_id, items, discount = 0, notes } = req.body;

    // Calculate total
    const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const total = subtotal - discount;

    const { data: bill, error } = await supabaseAdmin
      .from('billing')
      .insert({
        appointment_id,
        patient_id,
        items: JSON.stringify(items),
        subtotal,
        discount,
        amount: total,
        payment_status: 'pending',
        notes
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to create bill.' });
    }

    // Notify patient
    const { data: patient } = await supabaseAdmin
      .from('patients')
      .select('user_id')
      .eq('id', patient_id)
      .single();

    if (patient) {
      await supabaseAdmin.from('notifications').insert({
        user_id: patient.user_id,
        title: 'New Bill Generated',
        message: `A bill of ₹${total} has been generated for your appointment.`,
        type: 'billing'
      });
    }

    res.status(201).json({ success: true, message: 'Bill created.', data: bill });
  } catch (error) {
    console.error('CreateBill error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get bills
 * GET /api/payments
 */
const getBills = async (req, res) => {
  try {
    let query = supabaseAdmin
      .from('billing')
      .select(`
        *,
        patients(users(full_name, email)),
        appointments(appointment_date, doctors(users(full_name)))
      `);

    if (req.user.role === 'patient') {
      const { data: patient } = await supabaseAdmin
        .from('patients').select('id').eq('user_id', req.user.id).single();
      if (patient) query = query.eq('patient_id', patient.id);
    }

    const { data: bills, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch bills.' });
    }

    const parsedBills = bills.map(b => ({
      ...b,
      items: typeof b.items === 'string' ? JSON.parse(b.items) : b.items
    }));

    res.json({ success: true, data: parsedBills });
  } catch (error) {
    console.error('GetBills error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Process payment
 * PUT /api/payments/:id/pay
 */
const processPayment = async (req, res) => {
  try {
    const { payment_method, transaction_id } = req.body;

    const { data: bill, error } = await supabaseAdmin
      .from('billing')
      .update({
        payment_status: 'paid',
        payment_method,
        transaction_id,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: 'Payment processing failed.' });
    }

    res.json({ success: true, message: 'Payment processed successfully.', data: bill });
  } catch (error) {
    console.error('ProcessPayment error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get single bill
 * GET /api/payments/:id
 */
const getBill = async (req, res) => {
  try {
    const { data: bill, error } = await supabaseAdmin
      .from('billing')
      .select(`
        *,
        patients(*, users(full_name, email, phone)),
        appointments(*, doctors(users(full_name), departments(name)))
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !bill) {
      return res.status(404).json({ success: false, message: 'Bill not found.' });
    }

    const parsedBill = {
      ...bill,
      items: typeof bill.items === 'string' ? JSON.parse(bill.items) : bill.items
    };

    res.json({ success: true, data: parsedBill });
  } catch (error) {
    console.error('GetBill error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { createBill, getBills, processPayment, getBill };
