/** Doctor Dashboard — Login Lamp Theme */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar,FiUsers,FiClock,FiCheckCircle,FiArrowRight,FiAlertCircle,FiActivity,FiFileText } from 'react-icons/fi';
import { AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import { SkeletonCard } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatTime, getStatusClass, getGreeting } from '../../utils/helpers';
import toast from 'react-hot-toast';

const G = '#f5a623';
const GOLD = 'linear-gradient(135deg,#b8860b,#f5a623)';
const card = { background:'rgba(20,16,8,0.75)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', border:'1px solid rgba(245,166,35,0.12)', borderRadius:20 };

const GoldTooltip = ({ active, payload, label }) => active && payload?.length ? (
  <div style={{ ...card, padding:'10px 14px', fontSize:'0.8rem' }}>
    <p style={{ fontWeight:700, color:'#f5f0e8', marginBottom:4 }}>{label}</p>
    <p style={{ color:G, fontWeight:600 }}>{payload[0].value} appointments</p>
  </div>
) : null;

const quickLinks = [
  { to:'/doctor/appointments',  icon:FiCalendar, label:'View Appointments', grad:GOLD },
  { to:'/doctor/patients',      icon:FiUsers,    label:'My Patients',       grad:'linear-gradient(135deg,#14532d,#16a34a)' },
  { to:'/doctor/prescriptions', icon:FiFileText, label:'Prescriptions',     grad:'linear-gradient(135deg,#1a0533,#7c3aed)' },
  { to:'/doctor/availability',  icon:FiClock,    label:'Set Availability',  grad:'linear-gradient(135deg,#7f1d1d,#dc2626)' },
];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [todayApts, setTodayApts] = useState([]);
  const [loading, setLoading]     = useState(true);

  const fetchAnalytics = async () => { try { const r = await api.get('/doctors/analytics/stats'); setAnalytics(r.data.data); } catch { toast.error('Failed to load analytics'); } };
  const fetchTodayApts = async () => { try { const r = await api.get('/appointments/today'); setTodayApts(r.data.data || []); } catch {} };

  useEffect(() => { Promise.all([fetchAnalytics(), fetchTodayApts()]).finally(() => setLoading(false)); }, []);

  const handleStatusUpdate = async (id, status) => {
    try { await api.put(`/appointments/${id}/status`, { status }); toast.success(`Appointment ${status}`); fetchTodayApts(); }
    catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
  };

  const chartData = analytics?.appointments_by_date
    ? Object.entries(analytics.appointments_by_date).slice(-7).map(([date, count]) => ({ date: new Date(date).toLocaleDateString('en-US',{ month:'short', day:'numeric' }), appointments: count }))
    : [];

  const stats = analytics ? [
    { title:"Today's Appointments", value:analytics.today_appointments,  icon:FiCalendar,    color:'cyan'   },
    { title:'Total Patients',       value:analytics.total_patients,       icon:FiUsers,       color:'green'  },
    { title:'Pending',              value:analytics.pending_appointments, icon:FiClock,       color:'orange' },
    { title:'Completed',            value:analytics.total_patients,       icon:FiCheckCircle, color:'purple' },
  ] : [];

  return (
    <DashboardLayout title="Doctor Dashboard">
      {/* Greeting banner */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
        style={{ position:'relative', borderRadius:24, padding:'24px 28px', marginBottom:24, overflow:'hidden', background:'linear-gradient(135deg,#1e1a0e,#2a2210)', border:'1px solid rgba(245,166,35,0.2)' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(245,166,35,0.05) 1px,transparent 1px)', backgroundSize:'24px 24px', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:0, right:0, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,166,35,0.15),transparent)', transform:'translate(30%,-30%)', filter:'blur(30px)', pointerEvents:'none' }}/>
        <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <p style={{ color:G, fontSize:'0.8rem', fontWeight:600, marginBottom:4 }}>{getGreeting()} 👨‍⚕️</p>
            <h2 style={{ fontSize:'1.5rem', fontWeight:900, color:'#f5f0e8', letterSpacing:'-0.02em' }}>Dr. {user?.full_name?.split(' ')[0]}</h2>
            <p style={{ color:'rgba(245,240,232,0.4)', fontSize:'0.85rem', marginTop:4 }}>Here's your practice overview for today.</p>
          </div>
          <div className="hidden sm:block">
            <Link to="/doctor/appointments" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:14, background:'rgba(245,166,35,0.12)', border:'1px solid rgba(245,166,35,0.25)', color:G, fontWeight:700, fontSize:'0.875rem', textDecoration:'none', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(245,166,35,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(245,166,35,0.12)'; }}>
              Today's Schedule <FiArrowRight size={14}/>
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

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:20 }} className="dash-grid">
        <style>{`@media(max-width:1024px){.dash-grid{grid-template-columns:1fr!important}}`}</style>

        {/* Today's Appointments */}
        <div style={{ ...card, overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid rgba(245,166,35,0.08)' }}>
            <h3 style={{ fontWeight:800, color:'#f5f0e8', display:'flex', alignItems:'center', gap:8, fontSize:'0.95rem' }}>
              <div style={{ width:26, height:26, borderRadius:8, background:'rgba(245,166,35,0.12)', display:'flex', alignItems:'center', justifyContent:'center' }}><FiCalendar size={13} style={{ color:G }}/></div>
              Today's Appointments
            </h3>
            <Link to="/doctor/appointments" style={{ fontSize:'0.75rem', fontWeight:700, color:G, textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>View All <FiArrowRight size={11}/></Link>
          </div>
          <div>
            {loading ? <div style={{ padding:20 }}><SkeletonCard/></div>
            : todayApts.length > 0 ? todayApts.map(apt => (
              <div key={apt.id} style={{ padding:'14px 20px', borderBottom:'1px solid rgba(245,166,35,0.05)', transition:'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(245,166,35,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:42, height:42, borderRadius:14, background:GOLD, display:'flex', alignItems:'center', justifyContent:'center', color:'#0c0a06', fontWeight:800, fontSize:'0.85rem', flexShrink:0 }}>
                      {apt.patients?.users?.full_name?.[0] || 'P'}
                    </div>
                    <div>
                      <p style={{ fontWeight:700, color:'#f5f0e8', fontSize:'0.875rem' }}>{apt.patients?.users?.full_name}</p>
                      <p style={{ fontSize:'0.72rem', color:'rgba(245,240,232,0.35)', marginTop:2 }}>{formatTime(apt.appointment_time)} · Token: {apt.queue_token}</p>
                      {apt.reason && <p style={{ fontSize:'0.68rem', color:'rgba(245,240,232,0.25)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:180 }}>{apt.reason}</p>}
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span className={`badge ${getStatusClass(apt.status)}`}>{apt.status}</span>
                    {apt.status === 'pending' && (
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={() => handleStatusUpdate(apt.id,'confirmed')} style={{ padding:6, borderRadius:8, background:'rgba(22,163,74,0.12)', border:'none', cursor:'pointer', display:'flex' }} title="Confirm"><FiCheckCircle size={13} style={{ color:'#6ee7b7' }}/></button>
                        <button onClick={() => handleStatusUpdate(apt.id,'cancelled')} style={{ padding:6, borderRadius:8, background:'rgba(220,38,38,0.12)', border:'none', cursor:'pointer', display:'flex' }} title="Cancel"><FiAlertCircle size={13} style={{ color:'#fca5a5' }}/></button>
                      </div>
                    )}
                    {apt.status === 'confirmed' && (
                      <button onClick={() => handleStatusUpdate(apt.id,'in_progress')} style={{ fontSize:'0.72rem', padding:'5px 12px', borderRadius:8, background:GOLD, border:'none', cursor:'pointer', color:'#0c0a06', fontWeight:700, fontFamily:'Inter,sans-serif' }}>Start</button>
                    )}
                    {apt.status === 'in_progress' && (
                      <button onClick={() => handleStatusUpdate(apt.id,'completed')} style={{ fontSize:'0.72rem', padding:'5px 12px', borderRadius:8, background:'linear-gradient(135deg,#14532d,#16a34a)', border:'none', cursor:'pointer', color:'#fff', fontWeight:700, fontFamily:'Inter,sans-serif' }}>Complete</button>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ padding:40, textAlign:'center' }}>
                <div style={{ width:56, height:56, borderRadius:16, background:'rgba(245,166,35,0.08)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}><FiCalendar size={24} style={{ color:G }}/></div>
                <p style={{ color:'rgba(245,240,232,0.5)', fontWeight:600 }}>No appointments today</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Quick Links */}
          <div style={{ ...card, padding:20 }}>
            <h3 style={{ fontWeight:800, color:'#f5f0e8', marginBottom:14, fontSize:'0.95rem' }}>Quick Actions</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {quickLinks.map(({ to, icon:Icon, label, grad }) => (
                <Link key={to} to={to} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:12, textDecoration:'none', transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(245,166,35,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:grad, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 2px 8px rgba(0,0,0,0.3)' }}><Icon size={15} style={{ color:'#f5f0e8' }}/></div>
                  <span style={{ fontSize:'0.85rem', fontWeight:600, color:'rgba(245,240,232,0.7)', flex:1 }}>{label}</span>
                  <FiArrowRight size={12} style={{ color:'rgba(245,240,232,0.25)' }}/>
                </Link>
              ))}
            </div>
          </div>

          {/* Weekly Chart */}
          {chartData.length > 0 && (
            <div style={{ ...card, padding:20 }}>
              <h3 style={{ fontWeight:800, color:'#f5f0e8', marginBottom:14, display:'flex', alignItems:'center', gap:8, fontSize:'0.95rem' }}>
                <div style={{ width:22, height:22, borderRadius:6, background:'rgba(245,166,35,0.12)', display:'flex', alignItems:'center', justifyContent:'center' }}><FiActivity size={12} style={{ color:G }}/></div>
                Weekly Appointments
              </h3>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={chartData} margin={{ top:5, right:5, bottom:0, left:-20 }}>
                  <defs>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#f5a623" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#f5a623" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,166,35,0.06)"/>
                  <XAxis dataKey="date" tick={{ fontSize:9, fill:'rgba(245,240,232,0.3)' }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize:9, fill:'rgba(245,240,232,0.3)' }} axisLine={false} tickLine={false}/>
                  <Tooltip content={<GoldTooltip/>}/>
                  <Area type="monotone" dataKey="appointments" stroke="#f5a623" fill="url(#goldGrad)" strokeWidth={2} dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
