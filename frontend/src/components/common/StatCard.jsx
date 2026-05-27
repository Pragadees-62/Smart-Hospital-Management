/** StatCard — Login Lamp Theme */
import { motion } from 'framer-motion';

const colorMap = {
  blue:   { grad:'linear-gradient(135deg,#b8860b,#f5a623)', glow:'rgba(245,166,35,0.25)', light:'rgba(245,166,35,0.08)' },
  green:  { grad:'linear-gradient(135deg,#14532d,#16a34a)', glow:'rgba(22,163,74,0.2)',   light:'rgba(22,163,74,0.08)'  },
  purple: { grad:'linear-gradient(135deg,#b8860b,#ffd700)', glow:'rgba(245,166,35,0.2)',  light:'rgba(245,166,35,0.06)' },
  orange: { grad:'linear-gradient(135deg,#f5a623,#ffd54f)', glow:'rgba(245,166,35,0.25)', light:'rgba(245,166,35,0.08)' },
  red:    { grad:'linear-gradient(135deg,#7f1d1d,#dc2626)', glow:'rgba(220,38,38,0.2)',   light:'rgba(220,38,38,0.08)'  },
  cyan:   { grad:'linear-gradient(135deg,#b8860b,#f5c842)', glow:'rgba(245,166,35,0.2)',  light:'rgba(245,166,35,0.06)' },
  teal:   { grad:'linear-gradient(135deg,#b8860b,#f5a623)', glow:'rgba(245,166,35,0.25)', light:'rgba(245,166,35,0.08)' },
};

const StatCard = ({ title, value, icon:Icon, color='blue', trend, subtitle }) => {
  const c = colorMap[color] || colorMap.blue;
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      whileHover={{ y:-3, boxShadow:`0 12px 40px ${c.glow}` }}
      className="stat-card" style={{ transition:'all 0.25s ease' }}>
      <div style={{ position:'absolute', top:-24, right:-24, width:96, height:96, borderRadius:'50%', background:c.light, pointerEvents:'none' }}/>
      <div style={{ position:'relative', display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:'0.68rem', fontWeight:700, color:'rgba(245,240,232,0.35)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>{title}</p>
          <p style={{ fontSize:'1.75rem', fontWeight:900, color:'#f5f0e8', letterSpacing:'-0.03em' }}>{value}</p>
          {subtitle && <p style={{ fontSize:'0.72rem', color:'rgba(245,240,232,0.35)', marginTop:4, fontWeight:500 }}>{subtitle}</p>}
          {trend !== undefined && (
            <div style={{ display:'inline-flex', alignItems:'center', gap:4, marginTop:8, fontSize:'0.72rem', fontWeight:700, padding:'2px 8px', borderRadius:99, background: trend >= 0 ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.12)', color: trend >= 0 ? '#6ee7b7' : '#fca5a5' }}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
            </div>
          )}
        </div>
        <div style={{ width:48, height:48, borderRadius:14, background:c.grad, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 4px 16px ${c.glow}` }}>
          <Icon size={20} style={{ color:'#0c0a06' }}/>
        </div>
      </div>
    </motion.div>
  );
};
export default StatCard;
