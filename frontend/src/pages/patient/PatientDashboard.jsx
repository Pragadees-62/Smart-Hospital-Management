/** Patient Dashboard — Login Lamp Theme */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar,FiFileText,FiDollarSign,FiBell,FiClock,FiCheckCircle,FiAlertCircle,FiArrowRight } from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import { SkeletonCard } from '../../components/common/LoadingSpinner';
import SymptomChecker from '../../components/patient/SymptomChecker';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatDate, formatTime, getStatusClass, getGreeting } from '../../utils/helpers';
import toast from 'react-hot-toast';

const G = '#f5a623';
const GOLD = 'linear-gradient(135deg,#b8860b,#f5a623)';
const card = { background:'rgba(20,16,8,0.75)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', border:'1px solid rgba(245,166,35,0.12)', borderRadius:20 };

const quickActions = [
  { to:'/patient/book-appointment', icon:FiCalendar,   label:'Book Appointment', sub:'Find a doctor',    grad:GOLD },
  { to:'/patient/prescriptions',    icon:FiFileText,   label:'Prescriptions',    sub:'View your meds',  grad:'linear-gradient(135deg,#1a0533,#7c3aed)' },
  { to:'/patient/payments',         icon:FiDollarSign, label:'Pay Bills',        sub:'Pending payments', grad:'linear-gradient(135deg,#14532d,#16a34a)' },
  { to:'/patient/notifications',    icon:FiBell,       label:'Notifications',    sub:'Stay updated',    grad:'linear-gradient(135deg,#7f1d1d,#dc2626)' },
];

export default function PatientDashboard() {
  const { user } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/patients/dashboard')
      .then(res => setData(res.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const stats = data ? [
    { title:'Total Appointments', value:data.total_appointments,              icon:FiCalendar,    color:'blue'   },
    { title:'Completed',          value:data.completed_appointments,          icon:FiCheckCircle, color:'green'  },
    { title:'Prescriptions',      value:data.recent_prescriptions?.length||0, icon:FiFileText,    color:'purple' },
    { title:'Pending Bills',      value:data.pending_bills?.length||0,        icon:FiDollarSign,  color:'orange' },
  ] : [];

  return (
    <DashboardLayout title="Patient Dashboard">
      {/* Greeting banner */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
        style={{ position:'relative', borderRadius:24, padding:'24px 28px', marginBottom:24, overflow:'hidden', background:'linear-gradient(135deg,#1e1a0e,#2a2210)', border:'1px solid rgba(245,166,35,0.2)' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(245,166,35,0.05) 1px,transparent 1px)', backgroundSize:'24px 24px', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:0, right:0, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,166,35,0.12),transparent)', transform:'translate(30%,-30%)', filter:'blur(30px)', pointerEvents:'none' }}/>
        <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <p style={{ color:G, fontSize:'0.8rem', fontWeight:600, marginBottom:4 }}>{getGreeting()} 👋</p>
            <h2 style={{ fontSize:'1.5rem', fontWeight:900, color:'#f5f0e8', letterSpacing:'-0.02em' }}>{user?.full_name?.split(' ')[0]}</h2>
            <p style={{ color:'rgba(245,240,232,0.4)', fontSize:'0.85rem', marginTop:4 }}>Here's your health summary for today.</p>
          </div>
          <div className="hidden sm:block">
            <Link to="/patient/book-appointment" className="btn-teal" style={{ fontSize:'0.875rem', padding:'10px 20px', textDecoration:'none' }}>
              Book Appointment <FiArrowRight size={14}/>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:24 }}>
          {[1,2,3,4].map(i => <SkeletonCard key={i}/>)}
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:24 }}>
          {stats.map((s,i) => (
            <motion.div key={s.title} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}>
              <StatCard {...s}/>
            </motion.div>
          ))}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20 }} className="dash-grid">
        <style>{`@media(max-width:1024px){.dash-grid{grid-template-columns:1fr!important}}`}</style>

        {/* Upcoming Appointments */}
        <div style={{ ...card, overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid rgba(245,166,35,0.08)' }}>
            <h3 style={{ fontWeight:800, color:'#f5f0e8', display:'flex', alignItems:'center', gap:8, fontSize:'0.95rem' }}>
              <div style={{ width:26, height:26, borderRadius:8, background:'rgba(245,166,35,0.12)', display:'flex', alignItems:'center', justifyContent:'center' }}><FiCalendar size={13} style={{ color:G }}/></div>
              Upcoming Appointments
            </h3>
            <Link to="/patient/appointments" style={{ fontSize:'0.75rem', fontWeight:700, color:G, textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>View All <FiArrowRight size={11}/></Link>
          </div>
          <div>
            {loading ? <div style={{ padding:20 }}><SkeletonCard/></div>
            : data?.upcoming_appointments?.length > 0 ? data.upcoming_appointments.map(apt => (
              <div key={apt.id} style={{ padding:'14px 20px', borderBottom:'1px solid rgba(245,166,35,0.05)', transition:'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(245,166,35,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:42, height:42, borderRadius:14, background:GOLD, display:'flex', alignItems:'center', justifyContent:'center', color:'#0c0a06', fontWeight:800, fontSize:'0.85rem', flexShrink:0 }}>
                      {apt.doctors?.users?.full_name?.[0] || 'D'}
                    </div>
                    <div>
                      <p style={{ fontWeight:700, color:'#f5f0e8', fontSize:'0.875rem' }}>Dr. {apt.doctors?.users?.full_name}</p>
                      <p style={{ fontSize:'0.72rem', color:'rgba(245,240,232,0.35)', marginTop:2 }}>{apt.doctors?.departments?.name} · {apt.doctors?.specialization}</p>
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <p style={{ fontSize:'0.8rem', fontWeight:700, color:'#f5f0e8' }}>{formatDate(apt.appointment_date)}</p>
                    <p style={{ fontSize:'0.7rem', color:'rgba(245,240,232,0.35)' }}>{formatTime(apt.appointment_time)}</p>
                    <span className={`badge mt-1 ${getStatusClass(apt.status)}`}>{apt.status}</span>
                  </div>
                </div>
                {apt.queue_token && (
                  <div style={{ marginTop:10, display:'flex', alignItems:'center', gap:8, background:'rgba(245,166,35,0.06)', border:'1px solid rgba(245,166,35,0.12)', borderRadius:10, padding:'7px 12px' }}>
                    <FiClock size={11} style={{ color:G }}/><span style={{ fontSize:'0.72rem', fontWeight:700, color:G }}>Queue Token: {apt.queue_token}</span>
                  </div>
                )}
              </div>
            )) : (
              <div style={{ padding:40, textAlign:'center' }}>
                <div style={{ width:56, height:56, borderRadius:16, background:'rgba(245,166,35,0.08)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}><FiCalendar size={24} style={{ color:G }}/></div>
                <p style={{ color:'rgba(245,240,232,0.5)', fontWeight:600, marginBottom:6 }}>No upcoming appointments</p>
                <p style={{ color:'rgba(245,240,232,0.3)', fontSize:'0.8rem', marginBottom:16 }}>Book your first appointment today</p>
                <Link to="/patient/book-appointment" className="btn-teal" style={{ fontSize:'0.85rem', padding:'9px 20px', textDecoration:'none' }}>Book Now</Link>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Quick Actions */}
          <div style={{ ...card, padding:20 }}>
            <h3 style={{ fontWeight:800, color:'#f5f0e8', marginBottom:16, fontSize:'0.95rem' }}>Quick Actions</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {quickActions.map(({ to, icon:Icon, label, sub, grad }) => (
                <Link key={to} to={to} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'14px 10px', borderRadius:16, border:'1px solid rgba(245,166,35,0.08)', textDecoration:'none', textAlign:'center', transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(245,166,35,0.25)'; e.currentTarget.style.background='rgba(245,166,35,0.04)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(245,166,35,0.08)'; e.currentTarget.style.background='transparent'; e.currentTarget.style.transform='translateY(0)'; }}>
                  <div style={{ width:38, height:38, borderRadius:12, background:grad, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(0,0,0,0.3)' }}><Icon size={16} style={{ color:'#f5f0e8' }}/></div>
                  <div><p style={{ fontSize:'0.72rem', fontWeight:700, color:'#f5f0e8' }}>{label}</p><p style={{ fontSize:'0.65rem', color:'rgba(245,240,232,0.35)' }}>{sub}</p></div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Prescriptions */}
          <div style={{ ...card, padding:20 }}>
            <h3 style={{ fontWeight:800, color:'#f5f0e8', marginBottom:14, display:'flex', alignItems:'center', gap:8, fontSize:'0.95rem' }}>
              <div style={{ width:22, height:22, borderRadius:6, background:'rgba(245,166,35,0.12)', display:'flex', alignItems:'center', justifyContent:'center' }}><FiFileText size={12} style={{ color:G }}/></div>
              Recent Prescriptions
            </h3>
            {loading ? <SkeletonCard/> : data?.recent_prescriptions?.length > 0 ? (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {data.recent_prescriptions.map(p => (
                  <div key={p.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, background:'rgba(245,166,35,0.05)', border:'1px solid rgba(245,166,35,0.08)' }}>
                    <div style={{ width:34, height:34, borderRadius:10, background:'rgba(245,166,35,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><FiFileText size={13} style={{ color:G }}/></div>
                    <div style={{ minWidth:0 }}>
                      <p style={{ fontSize:'0.8rem', fontWeight:700, color:'#f5f0e8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.diagnosis}</p>
                      <p style={{ fontSize:'0.68rem', color:'rgba(245,240,232,0.35)' }}>Dr. {p.doctors?.users?.full_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p style={{ fontSize:'0.8rem', color:'rgba(245,240,232,0.3)', textAlign:'center', padding:'16px 0' }}>No prescriptions yet</p>}
          </div>

          {/* Pending Bills */}
          {data?.pending_bills?.length > 0 && (
            <div style={{ ...card, padding:20, background:'rgba(245,166,35,0.05)', borderColor:'rgba(245,166,35,0.2)' }}>
              <h3 style={{ fontWeight:800, color:G, marginBottom:12, display:'flex', alignItems:'center', gap:8, fontSize:'0.95rem' }}>
                <FiAlertCircle size={15} style={{ color:G }}/> Pending Bills
              </h3>
              {data.pending_bills.map(bill => (
                <div key={bill.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(245,166,35,0.08)' }}>
                  <span style={{ fontSize:'0.8rem', color:'rgba(245,240,232,0.55)', fontWeight:500 }}>Bill #{bill.id?.slice(0,8)}</span>
                  <span style={{ fontWeight:900, color:G }}>₹{bill.amount}</span>
                </div>
              ))}
              <Link to="/patient/payments" style={{ display:'block', marginTop:12, textAlign:'center', fontSize:'0.8rem', fontWeight:700, color:G, textDecoration:'none' }}>Pay Now →</Link>
            </div>
          )}

          <SymptomChecker/>
        </div>
      </div>
    </DashboardLayout>
  );
}
