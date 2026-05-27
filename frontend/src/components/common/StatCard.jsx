/**
 * Stat Card — Premium Redesign v2.0
 */

import { motion } from 'framer-motion';

const colorMap = {
  blue:   { grad: 'linear-gradient(135deg, #0f2040, #1e3a8a)', light: 'rgba(30,58,138,0.08)',  text: '#1e3a8a',  glow: 'rgba(30,58,138,0.2)'  },
  green:  { grad: 'linear-gradient(135deg, #059669, #34d399)', light: 'rgba(5,150,105,0.08)',  text: '#059669',  glow: 'rgba(5,150,105,0.2)'  },
  purple: { grad: 'linear-gradient(135deg, #7c3aed, #a78bfa)', light: 'rgba(124,58,237,0.08)', text: '#7c3aed',  glow: 'rgba(124,58,237,0.2)' },
  orange: { grad: 'linear-gradient(135deg, #d97706, #fbbf24)', light: 'rgba(217,119,6,0.08)',  text: '#d97706',  glow: 'rgba(217,119,6,0.2)'  },
  red:    { grad: 'linear-gradient(135deg, #dc2626, #ff6b6b)', light: 'rgba(220,38,38,0.08)',  text: '#dc2626',  glow: 'rgba(220,38,38,0.2)'  },
  cyan:   { grad: 'linear-gradient(135deg, #00d4b8, #0ea5e9)', light: 'rgba(0,212,184,0.08)',  text: '#0891b2',  glow: 'rgba(0,212,184,0.2)'  },
  teal:   { grad: 'linear-gradient(135deg, #00d4b8, #0ea5e9)', light: 'rgba(0,212,184,0.08)',  text: '#0891b2',  glow: 'rgba(0,212,184,0.2)'  },
};

const StatCard = ({ title, value, icon: Icon, color = 'blue', trend, subtitle }) => {
  const c = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: `0 12px 40px ${c.glow}` }}
      className="stat-card relative overflow-hidden cursor-default"
      style={{ transition: 'all 0.25s ease' }}
    >
      {/* Background orb */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-60"
        style={{ background: c.light }} />

      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{title}</p>
          <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1.5 font-medium">{subtitle}</p>}
          {trend !== undefined && (
            <div className={`inline-flex items-center gap-1 mt-2 text-xs font-bold px-2 py-0.5 rounded-full ${
              trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
            }`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
          style={{ background: c.grad }}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
