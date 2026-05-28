/**
 * Admin — Manage Doctors · Login Lamp Dark Theme
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiToggleLeft, FiToggleRight, FiStar, FiUser, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../utils/api';
import { getInitials, formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const G = '#f5a623';
const GOLD = 'linear-gradient(135deg,#b8860b,#f5a623)';
const card = {
  background:'rgba(20,16,8,0.75)',
  backdropFilter:'blur(16px)',
  WebkitBackdropFilter:'blur(16px)',
  border:'1px solid rgba(245,166,35,0.12)',
  borderRadius:20,
};

/* ── Delete Confirmation Modal ── */
const DeleteConfirmModal = ({ doctor, onConfirm, onCancel, loading }) => (
  <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:16 }}>
    <motion.div initial={{ opacity:0, scale:0.92, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
      exit={{ opacity:0, scale:0.92, y:20 }} transition={{ duration:0.25, ease:[0.22,1,0.36,1] }}
      style={{
        width:'100%', maxWidth:440,
        background:'rgba(16,12,6,0.95)',
        backdropFilter:'blur(24px)',
        WebkitBackdropFilter:'blur(24px)',
        border:'1px solid rgba(220,38,38,0.25)',
        borderRadius:24, padding:'28px',
        boxShadow:'0 24px 80px rgba(0,0,0,0.7)',
      }}>
      {/* Icon */}
      <div style={{ width:60, height:60, borderRadius:18, background:'rgba(220,38,38,0.12)', border:'1px solid rgba(220,38,38,0.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px' }}>
        <FiAlertTriangle size={28} style={{ color:'#f87171' }}/>
      </div>
      <h3 style={{ fontSize:'1.15rem', fontWeight:800, color:'#f5f0e8', textAlign:'center', marginBottom:8 }}>Delete Doctor Account</h3>
      <p style={{ color:'rgba(245,240,232,0.45)', textAlign:'center', fontSize:'0.85rem', lineHeight:1.6, marginBottom:20 }}>
        This will permanently delete{' '}
        <strong style={{ color:'#f5f0e8' }}>Dr. {doctor?.users?.full_name}</strong>
        {' '}and all their data including appointments, prescriptions, and availability.
        <br/><br/>
        <span style={{ color:'#f87171', fontWeight:700 }}>This action cannot be undone.</span>
      </p>

      {/* Doctor info card */}
      <div style={{ background:'rgba(220,38,38,0.08)', border:'1px solid rgba(220,38,38,0.18)', borderRadius:14, padding:'14px 16px', marginBottom:20, display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:40, height:40, borderRadius:12, background:'rgba(220,38,38,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fca5a5', fontWeight:800, fontSize:'0.8rem', flexShrink:0 }}>
          {getInitials(doctor?.users?.full_name)}
        </div>
        <div>
          <p style={{ fontWeight:700, color:'#f5f0e8', fontSize:'0.9rem' }}>Dr. {doctor?.users?.full_name}</p>
          <p style={{ fontSize:'0.72rem', color:'rgba(245,240,232,0.4)' }}>{doctor?.specialization} · {doctor?.users?.email}</p>
        </div>
      </div>

      <div style={{ display:'flex', gap:12 }}>
        <button onClick={onCancel} disabled={loading} className="btn-secondary" style={{ flex:1, padding:'12px', fontSize:'0.9rem' }}>Cancel</button>
        <button onClick={onConfirm} disabled={loading}
          style={{ flex:1, padding:'12px', borderRadius:14, border:'none', background:'linear-gradient(135deg,#7f1d1d,#dc2626)', color:'#fff', fontSize:'0.9rem', fontWeight:800, fontFamily:'Inter,sans-serif', cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity: loading ? 0.7 : 1, boxShadow:'0 4px 16px rgba(220,38,38,0.35)', transition:'all 0.25s' }}>
          {loading ? <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'inline-block' }}/> : <FiTrash2 size={15}/>}
          {loading ? 'Deleting…' : 'Yes, Delete'}
        </button>
      </div>
    </motion.div>
  </div>
);

/* ── Main Component ── */
const ManageDoctors = () => {
  const [doctors, setDoctors]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const fetchDoctors = useCallback(async () => {
    try {
      const res = await api.get('/admin/doctors');
      setDoctors(res.data.data || []);
    } catch { toast.error('Failed to load doctors'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  const toggleStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-status`);
      toast.success(`Doctor ${currentStatus ? 'deactivated' : 'activated'}`);
      fetchDoctors();
    } catch { toast.error('Failed to update status'); }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/admin/doctors/${deleteTarget.id}`);
      toast.success(res.data.message || 'Doctor deleted successfully');
      setDeleteTarget(null);
      setDoctors(prev => prev.filter(d => d.id !== deleteTarget.id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete doctor');
    } finally { setDeleting(false); }
  };

  const filtered = doctors.filter(d =>
    d.users?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
    d.departments?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Manage Doctors">
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} input::placeholder{color:rgba(245,240,232,0.25)}`}</style>

      {/* Search bar */}
      <div style={{ ...card, padding:'14px 16px', marginBottom:20 }}>
        <div style={{ position:'relative' }}>
          <FiSearch size={15} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color: searchFocused ? G : 'rgba(245,240,232,0.3)', transition:'color 0.2s', pointerEvents:'none' }}/>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, specialization or department…"
            onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
            style={{ width:'100%', padding:'11px 14px 11px 38px', background:'rgba(245,240,232,0.04)', border:`1.5px solid ${searchFocused ? 'rgba(245,166,35,0.5)' : 'rgba(245,166,35,0.1)'}`, borderRadius:12, color:'#f5f0e8', fontSize:'0.875rem', fontFamily:'Inter,sans-serif', outline:'none', boxShadow: searchFocused ? '0 0 0 3px rgba(245,166,35,0.1)' : 'none', transition:'all 0.2s' }}/>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
        {[
          { label:'Total Doctors', value:doctors.length,                                  grad:GOLD,                                          glow:'rgba(245,166,35,0.2)'  },
          { label:'Active',        value:doctors.filter(d => d.users?.is_active).length,  grad:'linear-gradient(135deg,#14532d,#16a34a)',      glow:'rgba(22,163,74,0.2)'   },
          { label:'Inactive',      value:doctors.filter(d => !d.users?.is_active).length, grad:'linear-gradient(135deg,#7f1d1d,#dc2626)',      glow:'rgba(220,38,38,0.2)'   },
        ].map(({ label, value, grad, glow }) => (
          <div key={label} style={{ ...card, padding:'18px 20px', textAlign:'center' }}>
            <p style={{ fontSize:'2rem', fontWeight:900, background:grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', letterSpacing:'-0.03em' }}>{value}</p>
            <p style={{ fontSize:'0.78rem', color:'rgba(245,240,232,0.4)', marginTop:4, fontWeight:500 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? <LoadingSpinner /> : (
        <div style={{ ...card, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'rgba(245,166,35,0.06)', borderBottom:'1px solid rgba(245,166,35,0.1)' }}>
                {['Doctor','Specialization','Department','Fee','Rating','Status','Actions'].map(h => (
                  <th key={h} style={{ padding:'13px 18px', textAlign:'left', fontSize:'0.68rem', fontWeight:700, color:'rgba(245,240,232,0.4)', textTransform:'uppercase', letterSpacing:'0.07em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((doctor, i) => (
                <motion.tr key={doctor.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.03 }}
                  style={{ borderBottom:'1px solid rgba(245,166,35,0.06)', transition:'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(245,166,35,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>

                  {/* Doctor info */}
                  <td style={{ padding:'14px 18px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:38, height:38, borderRadius:12, background:GOLD, display:'flex', alignItems:'center', justifyContent:'center', color:'#0c0a06', fontWeight:800, fontSize:'0.78rem', flexShrink:0, boxShadow:'0 0 10px rgba(245,166,35,0.25)' }}>
                        {getInitials(doctor.users?.full_name)}
                      </div>
                      <div>
                        <p style={{ fontWeight:700, color:'#f5f0e8', fontSize:'0.875rem' }}>Dr. {doctor.users?.full_name}</p>
                        <p style={{ fontSize:'0.7rem', color:'rgba(245,240,232,0.35)', marginTop:1 }}>{doctor.users?.email}</p>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding:'14px 18px', fontSize:'0.85rem', color:'rgba(245,240,232,0.65)' }}>{doctor.specialization}</td>
                  <td style={{ padding:'14px 18px', fontSize:'0.85rem', color:'rgba(245,240,232,0.65)' }}>{doctor.departments?.name || 'N/A'}</td>
                  <td style={{ padding:'14px 18px', fontSize:'0.85rem', fontWeight:700, color:G }}>{formatCurrency(doctor.consultation_fee)}</td>

                  {/* Rating */}
                  <td style={{ padding:'14px 18px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                      <FiStar size={12} style={{ color:'#f5c842', fill:'#f5c842' }}/>
                      <span style={{ fontSize:'0.85rem', fontWeight:600, color:'rgba(245,240,232,0.7)' }}>{doctor.rating || '4.8'}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding:'14px 18px' }}>
                    <span style={{
                      display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:99,
                      fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.04em', textTransform:'uppercase',
                      background: doctor.users?.is_active ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.12)',
                      color: doctor.users?.is_active ? '#6ee7b7' : '#fca5a5',
                      border: `1px solid ${doctor.users?.is_active ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)'}`,
                    }}>
                      {doctor.users?.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding:'14px 18px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <button onClick={() => toggleStatus(doctor.users?.id, doctor.users?.is_active)}
                        title={doctor.users?.is_active ? 'Deactivate' : 'Activate'}
                        style={{ padding:7, borderRadius:10, background:'none', border:'none', cursor:'pointer', color: doctor.users?.is_active ? '#6ee7b7' : 'rgba(245,240,232,0.3)', transition:'all 0.2s', display:'flex' }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(245,166,35,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background='none'}>
                        {doctor.users?.is_active ? <FiToggleRight size={22}/> : <FiToggleLeft size={22}/>}
                      </button>
                      <button onClick={() => setDeleteTarget(doctor)} title="Delete permanently"
                        style={{ padding:7, borderRadius:10, background:'none', border:'none', cursor:'pointer', color:'rgba(220,38,38,0.5)', transition:'all 0.2s', display:'flex' }}
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(220,38,38,0.1)'; e.currentTarget.style.color='#f87171'; }}
                        onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='rgba(220,38,38,0.5)'; }}>
                        <FiTrash2 size={16}/>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div style={{ padding:64, textAlign:'center' }}>
              <FiUser size={44} style={{ color:'rgba(245,166,35,0.15)', margin:'0 auto 14px' }}/>
              <p style={{ color:'rgba(245,240,232,0.3)', fontWeight:500 }}>No doctors found</p>
            </div>
          )}
        </div>
      )}

      {/* Delete modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmModal doctor={deleteTarget} onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTarget(null)} loading={deleting}/>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default ManageDoctors;
