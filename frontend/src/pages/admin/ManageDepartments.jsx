/**
 * Admin — Manage Departments · Login Lamp Dark Theme
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiGrid, FiMapPin, FiHash } from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const G = '#f5a623';
const GOLD = 'linear-gradient(135deg,#b8860b,#f5a623)';
const card = {
  background: 'rgba(20,16,8,0.75)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(245,166,35,0.12)',
  borderRadius: 20,
};

const deptIcons = {
  'Cardiology':'❤️','Neurology':'🧠','Orthopedics':'🦴',
  'Pediatrics':'👶','Oncology':'🔬','Dermatology':'🌿',
  'Ophthalmology':'👁️','Gynecology':'🌸','General Medicine':'🏥',
  'Surgery':'🔪','Emergency':'🚨','Radiology':'📡',
};

/* Dark-themed input */
const DarkInput = ({ label, value, onChange, placeholder, type='text', rows }) => {
  const [focused, setFocused] = useState(false);
  const base = {
    width:'100%', background:'rgba(245,240,232,0.04)',
    border:`1.5px solid ${focused ? 'rgba(245,166,35,0.55)' : 'rgba(245,166,35,0.12)'}`,
    borderRadius:12, color:'#f5f0e8', fontSize:'0.875rem',
    fontFamily:'Inter,sans-serif', outline:'none',
    boxShadow: focused ? '0 0 0 3px rgba(245,166,35,0.1)' : 'none',
    transition:'all 0.2s', padding:'11px 14px',
  };
  return (
    <div>
      <label style={{ display:'block', fontSize:'0.7rem', fontWeight:700, color:'rgba(245,240,232,0.4)', marginBottom:6, letterSpacing:'0.06em', textTransform:'uppercase' }}>
        {label}
      </label>
      {rows ? (
        <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...base, resize:'none' }}/>
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={base}/>
      )}
    </div>
  );
};

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [form, setForm]               = useState({ name:'', description:'', floor:'', room_numbers:'' });
  const [submitting, setSubmitting]   = useState(false);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/admin/departments');
      setDepartments(res.data.data || []);
    } catch { toast.error('Failed to load departments'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const handleCreate = async () => {
    if (!form.name) { toast.error('Department name is required'); return; }
    setSubmitting(true);
    try {
      await api.post('/admin/departments', form);
      toast.success('Department created!');
      setShowModal(false);
      setForm({ name:'', description:'', floor:'', room_numbers:'' });
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create department');
    } finally { setSubmitting(false); }
  };

  return (
    <DashboardLayout title="Manage Departments">
      {/* Header row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <p style={{ color:'rgba(245,240,232,0.4)', fontSize:'0.875rem' }}>
          {departments.length} department{departments.length !== 1 ? 's' : ''}
        </p>
        <button onClick={() => setShowModal(true)} className="btn-teal"
          style={{ fontSize:'0.875rem', padding:'10px 20px', display:'flex', alignItems:'center', gap:8 }}>
          <FiPlus size={16}/> Add Department
        </button>
      </div>

      {/* Grid */}
      {loading ? <LoadingSpinner /> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
          {departments.map((dept, i) => (
            <motion.div key={dept.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:i*0.05 }}
              style={{ ...card, padding:20, transition:'all 0.25s', cursor:'default' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(245,166,35,0.28)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(245,166,35,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(245,166,35,0.12)'; e.currentTarget.style.boxShadow=''; }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:12 }}>
                <div style={{ fontSize:'2.2rem', lineHeight:1 }}>{deptIcons[dept.name] || '🏥'}</div>
                <div>
                  <h3 style={{ fontWeight:800, color:'#f5f0e8', fontSize:'1rem', marginBottom:2 }}>{dept.name}</h3>
                  {dept.floor && (
                    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                      <FiMapPin size={11} style={{ color:G }}/>
                      <span style={{ fontSize:'0.72rem', color:'rgba(245,240,232,0.4)' }}>Floor {dept.floor}</span>
                    </div>
                  )}
                </div>
              </div>
              {dept.description && (
                <p style={{ fontSize:'0.8rem', color:'rgba(245,240,232,0.5)', marginBottom:10, lineHeight:1.55 }}>{dept.description}</p>
              )}
              {dept.room_numbers && (
                <div style={{ background:'rgba(245,166,35,0.07)', border:'1px solid rgba(245,166,35,0.15)', borderRadius:10, padding:'7px 12px', display:'flex', alignItems:'center', gap:6 }}>
                  <FiHash size={11} style={{ color:G }}/>
                  <p style={{ fontSize:'0.75rem', color:G, fontWeight:600 }}>Rooms: {dept.room_numbers}</p>
                </div>
              )}
            </motion.div>
          ))}

          {departments.length === 0 && (
            <div style={{ gridColumn:'1/-1', ...card, padding:64, textAlign:'center' }}>
              <FiGrid size={44} style={{ color:'rgba(245,166,35,0.2)', margin:'0 auto 14px' }}/>
              <p style={{ color:'rgba(245,240,232,0.3)', fontWeight:500 }}>No departments yet</p>
              <p style={{ color:'rgba(245,240,232,0.2)', fontSize:'0.8rem', marginTop:6 }}>Click "Add Department" to create one</p>
            </div>
          )}
        </div>
      )}

      {/* ── Create Modal ── */}
      <AnimatePresence>
        {showModal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:16 }}>
            <motion.div initial={{ opacity:0, scale:0.92, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.92, y:20 }} transition={{ duration:0.25, ease:[0.22,1,0.36,1] }}
              style={{
                width:'100%', maxWidth:460,
                background:'rgba(16,12,6,0.95)',
                backdropFilter:'blur(24px)',
                WebkitBackdropFilter:'blur(24px)',
                border:'1px solid rgba(245,166,35,0.2)',
                borderRadius:24,
                padding:'28px 28px 24px',
                boxShadow:'0 0 0 1px rgba(245,166,35,0.06), 0 24px 80px rgba(0,0,0,0.7)',
              }}>
              {/* Modal header */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:38, height:38, borderRadius:12, background:GOLD, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 14px rgba(245,166,35,0.35)' }}>
                    <FiGrid size={17} style={{ color:'#0c0a06' }}/>
                  </div>
                  <h3 style={{ fontWeight:800, color:'#f5f0e8', fontSize:'1.1rem' }}>Add Department</h3>
                </div>
                <button onClick={() => setShowModal(false)}
                  style={{ background:'rgba(245,240,232,0.06)', border:'1px solid rgba(245,240,232,0.1)', borderRadius:10, padding:8, cursor:'pointer', color:'rgba(245,240,232,0.5)', display:'flex', transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(245,166,35,0.1)'; e.currentTarget.style.color='#f5a623'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(245,240,232,0.06)'; e.currentTarget.style.color='rgba(245,240,232,0.5)'; }}>
                  <FiX size={17}/>
                </button>
              </div>

              {/* Divider */}
              <div style={{ height:1, background:'rgba(245,166,35,0.08)', marginBottom:20 }}/>

              {/* Form */}
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <DarkInput label="Department Name *" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name:e.target.value }))}
                  placeholder="e.g. Cardiology"/>
                <DarkInput label="Description" value={form.description} rows={2}
                  onChange={e => setForm(p => ({ ...p, description:e.target.value }))}
                  placeholder="Brief description..."/>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <DarkInput label="Floor" value={form.floor}
                    onChange={e => setForm(p => ({ ...p, floor:e.target.value }))}
                    placeholder="e.g. 2nd Floor"/>
                  <DarkInput label="Room Numbers" value={form.room_numbers}
                    onChange={e => setForm(p => ({ ...p, room_numbers:e.target.value }))}
                    placeholder="e.g. 201-210"/>
                </div>

                {/* Buttons */}
                <div style={{ display:'flex', gap:12, paddingTop:4 }}>
                  <button onClick={() => setShowModal(false)} className="btn-secondary"
                    style={{ flex:1, padding:'12px', fontSize:'0.9rem' }}>
                    Cancel
                  </button>
                  <button onClick={handleCreate} disabled={submitting}
                    style={{
                      flex:1, padding:'12px', borderRadius:14, border:'none',
                      background: submitting ? 'rgba(245,166,35,0.3)' : GOLD,
                      color:'#0c0a06', fontSize:'0.9rem', fontWeight:800,
                      fontFamily:'Inter,sans-serif', cursor: submitting ? 'not-allowed' : 'pointer',
                      display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                      boxShadow: submitting ? 'none' : '0 4px 16px rgba(245,166,35,0.35)',
                      transition:'all 0.25s',
                    }}>
                    {submitting ? (
                      <><span style={{ width:16, height:16, border:'2px solid rgba(0,0,0,0.2)', borderTopColor:'#0c0a06', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'inline-block' }}/> Creating…</>
                    ) : 'Create Department'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} input::placeholder,textarea::placeholder{color:rgba(245,240,232,0.25)}`}</style>
    </DashboardLayout>
  );
};

export default ManageDepartments;
