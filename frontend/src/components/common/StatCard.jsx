/**
 * Stat Card Component for dashboards
 */

import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color = 'blue', trend, subtitle }) => {
  const colorMap = {
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-600', text: 'text-blue-600' },
    green: { bg: 'bg-emerald-50', icon: 'bg-emerald-600', text: 'text-emerald-600' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-600', text: 'text-purple-600' },
    orange: { bg: 'bg-orange-50', icon: 'bg-orange-500', text: 'text-orange-500' },
    red: { bg: 'bg-red-50', icon: 'bg-red-500', text: 'text-red-500' },
    cyan: { bg: 'bg-cyan-50', icon: 'bg-cyan-600', text: 'text-cyan-600' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="stat-card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <p className={`text-xs font-medium mt-2 ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`${c.bg} p-3 rounded-xl`}>
          <Icon size={22} className={c.text} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
