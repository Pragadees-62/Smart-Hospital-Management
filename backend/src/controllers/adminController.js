/**
 * Admin Controller
 * Handles admin dashboard, analytics, and management operations
 */

const { supabaseAdmin } = require('../config/supabase');

/**
 * Get admin dashboard stats
 * GET /api/admin/dashboard
 */
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Total counts
    const [
      { count: totalPatients },
      { count: totalDoctors },
      { count: todayAppointments },
      { count: totalAppointments },
      { count: pendingAppointments },
      { count: emergencyCases }
    ] = await Promise.all([
      supabaseAdmin.from('patients').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('doctors').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('appointments').select('*', { count: 'exact', head: true }).eq('appointment_date', today),
      supabaseAdmin.from('appointments').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseAdmin.from('emergency_cases').select('*', { count: 'exact', head: true }).eq('status', 'active')
    ]);

    // Revenue this month
    const { data: billingData } = await supabaseAdmin
      .from('billing')
      .select('amount')
      .eq('payment_status', 'paid')
      .gte('created_at', `${thisMonth}-01`);

    const monthlyRevenue = billingData?.reduce((sum, b) => sum + (b.amount || 0), 0) || 0;

    // Recent appointments
    const { data: recentAppointments } = await supabaseAdmin
      .from('appointments')
      .select(`
        *,
        patients(users(full_name)),
        doctors(users(full_name), departments(name))
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    // Appointments by department
    const { data: deptAppointments } = await supabaseAdmin
      .from('appointments')
      .select('doctors(departments(name))')
      .gte('appointment_date', thirtyDaysAgo);

    const deptStats = {};
    deptAppointments?.forEach(apt => {
      const deptName = apt.doctors?.departments?.name || 'Unknown';
      deptStats[deptName] = (deptStats[deptName] || 0) + 1;
    });

    // Daily appointments for last 7 days
    const { data: weeklyData } = await supabaseAdmin
      .from('appointments')
      .select('appointment_date')
      .gte('appointment_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    const dailyStats = {};
    weeklyData?.forEach(apt => {
      dailyStats[apt.appointment_date] = (dailyStats[apt.appointment_date] || 0) + 1;
    });

    // Bed availability
    const { data: beds } = await supabaseAdmin
      .from('beds')
      .select('status');

    const bedStats = {
      total: beds?.length || 0,
      available: beds?.filter(b => b.status === 'available').length || 0,
      occupied: beds?.filter(b => b.status === 'occupied').length || 0,
      maintenance: beds?.filter(b => b.status === 'maintenance').length || 0
    };

    res.json({
      success: true,
      data: {
        stats: {
          total_patients: totalPatients || 0,
          total_doctors: totalDoctors || 0,
          today_appointments: todayAppointments || 0,
          total_appointments: totalAppointments || 0,
          pending_appointments: pendingAppointments || 0,
          emergency_cases: emergencyCases || 0,
          monthly_revenue: monthlyRevenue
        },
        recent_appointments: recentAppointments || [],
        department_stats: deptStats,
        daily_stats: dailyStats,
        bed_stats: bedStats
      }
    });
  } catch (error) {
    console.error('GetDashboardStats error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get revenue analytics
 * GET /api/admin/revenue
 */
const getRevenueAnalytics = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;

    const { data: billingData } = await supabaseAdmin
      .from('billing')
      .select('amount, payment_status, payment_method, created_at')
      .order('created_at', { ascending: false });

    // Group by month
    const monthlyRevenue = {};
    billingData?.forEach(bill => {
      const month = bill.created_at?.slice(0, 7);
      if (!monthlyRevenue[month]) {
        monthlyRevenue[month] = { total: 0, paid: 0, pending: 0 };
      }
      monthlyRevenue[month].total += bill.amount || 0;
      if (bill.payment_status === 'paid') {
        monthlyRevenue[month].paid += bill.amount || 0;
      } else {
        monthlyRevenue[month].pending += bill.amount || 0;
      }
    });

    // Payment method breakdown
    const paymentMethods = {};
    billingData?.filter(b => b.payment_status === 'paid').forEach(bill => {
      const method = bill.payment_method || 'cash';
      paymentMethods[method] = (paymentMethods[method] || 0) + (bill.amount || 0);
    });

    const totalRevenue = billingData
      ?.filter(b => b.payment_status === 'paid')
      .reduce((sum, b) => sum + (b.amount || 0), 0) || 0;

    const pendingRevenue = billingData
      ?.filter(b => b.payment_status === 'pending')
      .reduce((sum, b) => sum + (b.amount || 0), 0) || 0;

    res.json({
      success: true,
      data: {
        total_revenue: totalRevenue,
        pending_revenue: pendingRevenue,
        monthly_revenue: monthlyRevenue,
        payment_methods: paymentMethods
      }
    });
  } catch (error) {
    console.error('GetRevenueAnalytics error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Manage doctors (admin)
 * GET /api/admin/doctors
 */
const manageDoctors = async (req, res) => {
  try {
    const { data: doctors, error } = await supabaseAdmin
      .from('doctors')
      .select(`
        *,
        users(id, full_name, email, phone, avatar_url, is_active, created_at),
        departments(name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch doctors.' });
    }

    res.json({ success: true, data: doctors });
  } catch (error) {
    console.error('ManageDoctors error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Delete doctor (admin)
 * DELETE /api/admin/doctors/:id
 * Deletes the doctor record AND the linked user account.
 * All related appointments, prescriptions etc. are cascade-deleted by the DB.
 */
const deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;

    // Get doctor + linked user id
    const { data: doctor, error: fetchErr } = await supabaseAdmin
      .from('doctors')
      .select('id, user_id, users(full_name)')
      .eq('id', doctorId)
      .single();

    if (fetchErr || !doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    // Delete doctor row first (FK constraints)
    const { error: docErr } = await supabaseAdmin
      .from('doctors')
      .delete()
      .eq('id', doctorId);

    if (docErr) {
      console.error('Delete doctor error:', docErr);
      return res.status(500).json({ success: false, message: 'Failed to delete doctor record.' });
    }

    // Delete the user account
    const { error: userErr } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', doctor.user_id);

    if (userErr) {
      console.error('Delete user error:', userErr);
      // Doctor row already deleted — still return success
    }

    res.json({
      success: true,
      message: `Dr. ${doctor.users?.full_name || 'Doctor'} has been permanently deleted.`
    });
  } catch (error) {
    console.error('DeleteDoctor error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};


const toggleUserStatus = async (req, res) => {
  try {
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('is_active')
      .eq('id', req.params.id)
      .single();

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { data: updatedUser } = await supabaseAdmin
      .from('users')
      .update({ is_active: !user.is_active, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select('id, full_name, is_active')
      .single();

    res.json({
      success: true,
      message: `User ${updatedUser.is_active ? 'activated' : 'deactivated'} successfully.`,
      data: updatedUser
    });
  } catch (error) {
    console.error('ToggleUserStatus error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Manage departments
 * GET /api/admin/departments
 */
const getDepartments = async (req, res) => {
  try {
    const { data: departments, error } = await supabaseAdmin
      .from('departments')
      .select('*')
      .order('name');

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch departments.' });
    }

    res.json({ success: true, data: departments });
  } catch (error) {
    console.error('GetDepartments error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Create department
 * POST /api/admin/departments
 */
const createDepartment = async (req, res) => {
  try {
    const { name, description, head_doctor_id, floor, room_numbers } = req.body;

    const { data: department, error } = await supabaseAdmin
      .from('departments')
      .insert({ name, description, head_doctor_id, floor, room_numbers })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to create department.' });
    }

    res.status(201).json({ success: true, message: 'Department created.', data: department });
  } catch (error) {
    console.error('CreateDepartment error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Manage beds
 * GET /api/admin/beds
 */
const manageBeds = async (req, res) => {
  try {
    const { data: beds, error } = await supabaseAdmin
      .from('beds')
      .select('*, departments(name), patients(users(full_name))')
      .order('bed_number');

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch beds.' });
    }

    const stats = {
      total: beds.length,
      available: beds.filter(b => b.status === 'available').length,
      occupied: beds.filter(b => b.status === 'occupied').length,
      maintenance: beds.filter(b => b.status === 'maintenance').length
    };

    res.json({ success: true, data: beds, stats });
  } catch (error) {
    console.error('ManageBeds error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Update bed status
 * PUT /api/admin/beds/:id
 */
const updateBedStatus = async (req, res) => {
  try {
    const { status, patient_id } = req.body;

    const { data: bed, error } = await supabaseAdmin
      .from('beds')
      .update({ status, patient_id: status === 'available' ? null : patient_id, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to update bed.' });
    }

    res.json({ success: true, message: 'Bed status updated.', data: bed });
  } catch (error) {
    console.error('UpdateBedStatus error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get emergency cases
 * GET /api/admin/emergency
 */
const getEmergencyCases = async (req, res) => {
  try {
    const { data: cases, error } = await supabaseAdmin
      .from('emergency_cases')
      .select(`
        *,
        patients(users(full_name, phone)),
        doctors(users(full_name))
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch emergency cases.' });
    }

    res.json({ success: true, data: cases });
  } catch (error) {
    console.error('GetEmergencyCases error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Create emergency case
 * POST /api/admin/emergency
 */
const createEmergencyCase = async (req, res) => {
  try {
    const { patient_id, doctor_id, description, severity, location } = req.body;

    const { data: emergencyCase, error } = await supabaseAdmin
      .from('emergency_cases')
      .insert({
        patient_id,
        doctor_id,
        description,
        severity,
        location,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to create emergency case.' });
    }

    // Notify all doctors
    const { data: doctors } = await supabaseAdmin
      .from('doctors')
      .select('user_id');

    if (doctors) {
      const notifications = doctors.map(d => ({
        user_id: d.user_id,
        title: '🚨 Emergency Alert',
        message: `Emergency case reported: ${description}. Severity: ${severity}`,
        type: 'emergency'
      }));
      await supabaseAdmin.from('notifications').insert(notifications);
    }

    res.status(201).json({ success: true, message: 'Emergency case created.', data: emergencyCase });
  } catch (error) {
    console.error('CreateEmergencyCase error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  getDashboardStats,
  getRevenueAnalytics,
  manageDoctors,
  toggleUserStatus,
  deleteDoctor,
  getDepartments,
  createDepartment,
  manageBeds,
  updateBedStatus,
  getEmergencyCases,
  createEmergencyCase
};
