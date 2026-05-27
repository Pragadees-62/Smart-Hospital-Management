/**
 * Loading Spinner — Premium Redesign v2.0
 */

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-16 w-16' };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizes[size]} animate-spin rounded-full`}
        style={{ border: '3px solid rgba(0,212,184,0.15)', borderTopColor: '#00d4b8' }} />
      {text && <p className="text-sm text-gray-400 font-medium">{text}</p>}
    </div>
  );
};

export const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50"
    style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)' }}>
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full"
          style={{ border: '3px solid rgba(0,212,184,0.15)', borderTopColor: '#00d4b8' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00d4b8, #0ea5e9)' }}>
            <span className="text-white font-black text-sm">H</span>
          </div>
        </div>
      </div>
      <p className="font-black text-gray-900 text-lg tracking-tight">
        Smart<span style={{ color: '#00d4b8' }}>Hospital</span>
      </p>
    </div>
  </div>
);

export const SkeletonCard = () => (
  <div className="rounded-2xl p-6 border border-gray-100 animate-pulse"
    style={{ background: 'linear-gradient(90deg, #f8fafc 25%, #f1f5f9 50%, #f8fafc 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }}>
    <div className="flex items-center gap-4 mb-4">
      <div className="h-12 w-12 rounded-2xl" style={{ background: '#e2e8f0' }} />
      <div className="flex-1">
        <div className="h-4 rounded-xl mb-2" style={{ background: '#e2e8f0', width: '75%' }} />
        <div className="h-3 rounded-xl" style={{ background: '#e2e8f0', width: '50%' }} />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 rounded-xl" style={{ background: '#e2e8f0' }} />
      <div className="h-3 rounded-xl" style={{ background: '#e2e8f0', width: '83%' }} />
    </div>
  </div>
);

export default LoadingSpinner;
