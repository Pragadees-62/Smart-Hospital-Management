/** Dashboard Layout — Login Lamp Theme */
import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';

const DashboardLayout = ({ children, title = 'Dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#0c0a06' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main style={{ flex:1, overflowY:'auto', padding:'20px 24px' }} className="custom-scroll animate-fadeInUp">
          {children}
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
