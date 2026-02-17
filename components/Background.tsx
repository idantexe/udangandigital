import React from 'react';

export const BatikKawung: React.FC<{ color?: string; opacity?: number }> = ({ color = "#1E293B", opacity = 0.1 }) => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 pointer-events-none">
    <defs>
      <pattern id="kawungPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M40 40 C 40 20 60 0 80 0 L 80 0 C 60 0 40 20 40 40" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity} />
        <path d="M40 40 C 40 20 20 0 0 0 L 0 0 C 20 0 40 20 40 40" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity} />
        <path d="M40 40 C 40 60 60 80 80 80 L 80 80 C 60 80 40 60 40 40" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity} />
        <path d="M40 40 C 40 60 20 80 0 80 L 0 80 C 20 80 40 60 40 40" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity} />
        <circle cx="40" cy="40" r="2" fill={color} opacity={opacity * 1.5} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#kawungPattern)" />
  </svg>
);

export const BatikParang: React.FC<{ color?: string; opacity?: number }> = ({ color = "#1E293B", opacity = 0.1 }) => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 pointer-events-none">
    <defs>
      <pattern id="parangPattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M0 60 Q 30 0 60 60 T 120 60" fill="none" stroke={color} strokeWidth="1" strokeLinecap="square" opacity={opacity} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#parangPattern)" />
  </svg>
);

export const BatikTruntum: React.FC<{ color?: string; opacity?: number }> = ({ color = "#1E293B", opacity = 0.1 }) => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 pointer-events-none">
    <defs>
      <pattern id="truntumPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M30 10 L 35 25 L 50 30 L 35 35 L 30 50 L 25 35 L 10 30 L 25 25 Z" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#truntumPattern)" />
  </svg>
);

export const EnhancedBackground: React.FC = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#FDFBF7]">
    {/* Subtle animated gradient blobs */}
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-[blob_15s_infinite]"></div>
    <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-amber-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-[blob_15s_infinite_2s]"></div>
    <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-slate-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-[blob_15s_infinite_4s]"></div>

    {/* Noise Texture for Paper feel */}
    <div className="absolute inset-0 opacity-[0.3] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
    
    {/* Batik Overlays */}
    <div className="absolute inset-0 opacity-[0.03]">
       <BatikKawung color="#0F172A" />
    </div>
    
    {/* Vignette */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(253,251,247,0.1)_50%,rgba(226,232,240,0.3)_100%)]"></div>
    
    <style dangerouslySetInnerHTML={{__html: `
      @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
    `}} />
  </div>
);