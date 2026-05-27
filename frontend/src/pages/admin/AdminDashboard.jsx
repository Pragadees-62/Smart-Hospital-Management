/** Admin Dashboard — Login Lamp Theme */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers,FiCalendar,FiDollarSign,FiActivity,FiAlertCircle,FiArrowRight } from 'react-icons/fi';
import { AreaChart,Area,BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,PieChart,Pie,Cell } from 'recharts';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import { SkeletonCard } from '../../components/common/LoadingSpinner';
import api from '../../utils/api';
import { formatDate, formatCurrency, getStatusClass, getGreeting } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const G = '#f5a623';
const GOLD = 'linear-gradient(135deg,#b8860b,#f5a623)';
const card = { background:'rgba(20,16,8,0.75)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', border:'1px solid rgba(245,166,35,0.12)', borderRadius:20 };
const PIE_COLORS = ['#f5a623','#dc2626','#f5c842'];

const GoldTooltip = ({ active, payload, label }) => active && payload?.length ? (
  <div style={{ ...card, padding:'10px 14px', fontSize:'0.8rem' }}>
    <p style={{ fontWeight:700, color:'#f5f0e8', marginBottom:4 }}>{label}</p>
    <p style={{ color:G, fontWeight:600 }}>{payload[0].value} appointments</p>
  </div>
) : null;

const quickLinks = [
  { to:'/admin/doctors',   label:'Manage Doctors',    icon:FiActivity,    grad:GOLD },
  { to:'/admin/patients',  label:'Manage Patients',   icon:FiUsers,       grad:'linear-gradient(135deg,#14532d,#16a34a)' },
  { to:'/admin/revenue',   label:'Revenue Analytics', icon:FiDollarSign,  grad:'linear-gradient(135deg,#1a0533,#7c3aed)' },
  { to:'/admin/emergency', label:'Emergency Cases',   icon:FiAlertCircle, grad:'linear-gradient(135deg,#7f1d1d,#dc2626)' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setData(res.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const stats = data ? [
    { title:'Total Patients',       value:data.stats.total_patients,                  icon:FiUsers,       color:'blue'   },
    { title:'Total Doctors',        value:data.stats.total_doctors,                   icon:FiActivity,    color:'green'  },
    { title:"Today's Appointments", value:data.stats.today_appointments,              icon:FiCalendar,    color:'purple' },
    { title:'Monthly Revenue',      value:formatCurrency(data.stats.monthly_revenue), icon:FiDollarSign,  color:'orange' },
    { title:'Pending Appointments', value:data.stats.pending_appointments,            icon:FiCalendar,    color:'cyan'   },
    { title:'Emergency Cases',      value:data.stats.emergency_cases,                 icon:FiAlertCircle, color:'red'    },
  ] : [];

  const dailyChartData = data?.daily_stats ? Object.entries(data.daily_stats).map(([date,count]) => ({ date: new Date(date).toLocaleDateString('en-US',{ weekday:'short' }), appointments:count })) : [];
  const deptChartData  = data?.department_stats ? Object.entries(data.department_stats).map(([name,count]) => ({ name, count })) : [];
  const bedData = data?.bed_stats ? [{ name:'Available', value:data.bed_stats.available },{ name:'Occupied', value:data.bed_stats.occupied },{ name:'Maintenance', value:data.bed_stats.maintenance }] : [];

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* Greeting banner */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
        style={{ position:'relative', borderRadius:24, padding:'24px 28px', marginBottom:24, overflow:'hidden', background:'linear-gradient(135deg,#1e1a0e,#2a2210)', border:'1px solid rgba(245,166,35,0.2)' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(245,166,35,0.05) 1px,transparent 1px)', backgroundSize:'24px 24px', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:0, right:0, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,166,35,0.18),transparent)', transform:'translate(30%,-30%)', filter:'blur(30px)', pointerEvents:'none' }}/>
        <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <p style={{ color:G, fontSize:'0.8rem', fontWeight:600, marginBottom:4 }}>{getGreeting()} 🏥</p>
            <h2 style={{ fontSize:'1.5rem', fontWeight:900, color:'#f5f0e8', letterSpacing:'-0.02em' }}>{user?.full_name?.split(' ')[0]}</h2>
            <p style={{ color:'rgba(245,240,232,0.4)', fontSize:'0.85rem', marginTop:4 }}>Hospital management overview</p>
          </div>
          <div className="hidden sm:block">
            <Link to="/admin/appointments" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:14, background:'rgba(245,166,35,0.12)', border:'1px solid rgba(245,166,35,0.25)', color:G, fontWeight:700, fontSize:'0.875rem', textDecoration:'none', transition:'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(245,166,35,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(245,166,35,0.12)'}>
              View Appointments <FiArrowRight size={14}/>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:24 }}>
          {[1,2,3,4,5,6].map(i => <SkeletonCard key={i}/>)}
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:24 }}>
          {stats.map((s,i) => (
            <motion.div key={s.title} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}>
              <StatCard {...s}/>
            </motion.div>
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:20, marginBottom:20 }} className="chart-grid">
        <style>{`@media(max-width:1024px){.chart-grid,.dept-grid{grid-template-columns:1fr!important}}`}</style>

        <div style={{ ...card, padding:24 }}>
          <h3 style={{ fontWeight:800, color:'#f5f0e8', marginBottom:20, fontSize:'0.95rem' }}>Weekly Appointments</h3>
          {dailyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dailyChartData} margin={{ top:5, right:5, bottom:0, left:-20 }}>
                <defs>
                  <linearGradient id="adminGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f5a623" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f5a623" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,166,35,0.06)"/>
                <XAxis dataKey="date" tick={{ fontSize:10, fill:'rgba(245,240,232,0.3)' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:10, fill:'rgba(245,240,232,0.3)' }} axisLine={false} tickLine={false}/>
                <Tooltip content={<GoldTooltip/>}/>
                <Area type="monotone" dataKey="appointments" stroke="#f5a623" fill="url(#adminGold)" strokeWidth={2.5} dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          ) : <div style={{ height:200, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(245,240,232,0.25)', fontSize:'0.85rem' }}>No data yet</div>}
        </div>

        <div style={{ ...card, padding:24 }}>
          <h3 style={{ fontWeight:800, color:'#f5f0e8', marginBottom:20, fontSize:'0.95rem' }}>Bed Availability</h3>
          {bedData.some(b => b.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={bedData} cx="50%" cy="50%" innerRadius={38} outerRadius={60} paddingAngle={4} dataKey="value" strokeWidth={0}>
                    {bedData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i]}/>)}
                  </Pie>
                  <Tooltip/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:8 }}>
                {bedData.map((b,i) => (
                  <div key={b.name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:'0.8rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:10, height:10, borderRadius:'50%', background:PIE_COLORS[i] }}/>
                      <span style={{ color:'rgba(245,240,232,0.5)', fontWeight:500 }}>{b.name}</span>
                    </div>
                    <span style={{ fontWeight:800, color:'#f5f0e8' }}>{b.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <div style={{ height:140, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(245,240,232,0.25)', fontSize:'0.85rem' }}>No bed data</div>}
        </div>
      </div>

      {/* Dept + Recent */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }} className="dept-grid">
        {deptChartData.length > 0 && (
          <div style={{ ...card, padding:24 }}>
            <h3 style={{ fontWeight:800, color:'#f5f0e8', marginBottom:20, fontSize:'0.95rem' }}>Appointments by Department</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={deptChartData} layout="vertical" margin={{ top:0, right:10, bottom:0, left:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,166,35,0.06)" horizontal={false}/>
                <XAxis type="number" tick={{ fontSize:10, fill:'rgba(245,240,232,0.3)' }} axisLine={false} tickLine={false}/>
                <YAxis dataKey="name" type="category" tick={{ fontSize:10, fill:'rgba(245,240,232,0.4)' }} width={80} axisLine={false} tickLine={false}/>
                <Tooltip/>
                <Bar dataKey="count" radius={[0,8,8,0]}>
                  <defs><linearGradient id="barGold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#b8860b"/><stop offset="100%" stopColor="#f5a623"/></linearGradient></defs>
                  {deptChartData.map((_,i) => <Cell key={i} fill="url(#barGold)"/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div style={{ ...card, overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid rgba(245,166,35,0.08)' }}>
            <h3 style={{ fontWeight:800, color:'#f5f0e8', fontSize:'0.95rem' }}>Recent Appointments</h3>
            <Link to="/admin/appointments" style={{ fontSize:'0.75rem', fontWeight:700, color:G, textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>View All <FiArrowRight size={11}/></Link>
          </div>
          <div style={{ maxHeight:240, overflowY:'auto' }} className="custom-scroll">
            {loading ? <div style={{ padding:16 }}><SkeletonCard/></div>
            : data?.recent_appointments?.slice(0,8).map(apt => (
              <div key={apt.id} style={{ padding:'12px 20px', borderBottom:'1px solid rgba(245,166,35,0.05)', transition:'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(245,166,35,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <p style={{ fontSize:'0.85rem', fontWeight:700, color:'#f5f0e8' }}>{apt.patients?.users?.full_name}</p>
                    <p style={{ fontSize:'0.7rem', color:'rgba(245,240,232,0.35)', marginTop:2 }}>Dr. {apt.doctors?.users?.full_name} · {apt.doctors?.departments?.name}</p>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <p style={{ fontSize:'0.7rem', color:'rgba(245,240,232,0.35)' }}>{formatDate(apt.appointment_date)}</p>
                    <span className={`badge mt-1 ${getStatusClass(apt.status)}`}>{apt.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14 }}>
        {quickLinks.map(({ to, label, icon:Icon, grad }) => (
          <Link key={to} to={to} style={{ ...card, padding:'18px 20px', display:'flex', alignItems:'center', gap:14, textDecoration:'none', transition:'all 0.25s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(245,166,35,0.25)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(245,166,35,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(245,166,35,0.12)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=''; }}>
            <div style={{ width:42, height:42, borderRadius:14, background:grad, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 12px rgba(0,0,0,0.3)' }}><Icon size={18} style={{ color:'#f5f0e8' }}/></div>
            <span style={{ fontSize:'0.875rem', fontWeight:700, color:'rgba(245,240,232,0.7)' }}>{label}</span>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
