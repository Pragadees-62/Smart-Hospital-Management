/** LoadingSpinner — Login Lamp Theme */
const LoadingSpinner = ({ size='md', text='Loading...' }) => {
  const sizes = { sm:'h-6 w-6', md:'h-10 w-10', lg:'h-16 w-16' };
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, padding:'48px 0' }}>
      <div className={sizes[size]} style={{ border:'3px solid rgba(245,166,35,0.15)', borderTopColor:'#f5a623', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      {text && <p style={{ fontSize:'0.8rem', color:'rgba(245,240,232,0.35)', fontWeight:500 }}>{text}</p>}
    </div>
  );
};

export const PageLoader = () => (
  <div style={{ position:'fixed', inset:0, background:'rgba(12,10,6,0.9)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50 }}>
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}>
      <div style={{ position:'relative' }}>
        <div style={{ width:64, height:64, border:'3px solid rgba(245,166,35,0.15)', borderTopColor:'#f5a623', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#b8860b,#f5a623)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:14, color:'#0c0a06' }}>H</div>
        </div>
      </div>
      <p style={{ fontWeight:800, color:'#f5f0e8', fontSize:'1.1rem', letterSpacing:'-0.02em' }}>
        Smart<span style={{ color:'#f5a623' }}>Hospital</span>
      </p>
    </div>
    <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
  </div>
);

export const SkeletonCard = () => (
  <div style={{ borderRadius:16, padding:24, border:'1px solid rgba(245,166,35,0.08)', background:'rgba(245,166,35,0.03)', animation:'shimmer 1.5s infinite', backgroundSize:'200% 100%' }}>
    <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
      <div style={{ width:48, height:48, borderRadius:14, background:'rgba(245,166,35,0.08)' }}/>
      <div style={{ flex:1 }}>
        <div style={{ height:14, borderRadius:8, background:'rgba(245,166,35,0.08)', width:'75%', marginBottom:8 }}/>
        <div style={{ height:10, borderRadius:8, background:'rgba(245,166,35,0.06)', width:'50%' }}/>
      </div>
    </div>
    <div style={{ height:10, borderRadius:8, background:'rgba(245,166,35,0.06)', marginBottom:8 }}/>
    <div style={{ height:10, borderRadius:8, background:'rgba(245,166,35,0.05)', width:'83%' }}/>
  </div>
);

export default LoadingSpinner;
