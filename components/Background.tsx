import React from 'react';

export const BatikKawung: React.FC<{ color?: string; opacity?: number }> = ({ color = "#1E293B", opacity = 0.1 }) => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 pointer-events-none">
    <defs>
      <pattern id="kawungPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M40 40 C 40 20 60 0 80 0 L 80 0 C 60 0 40 20 40 40" fill="none" stroke={color} strokeWidth="1" opacity={opacity} />
        <path d="M40 40 C 40 20 20 0 0 0 L 0 0 C 20 0 40 20 40 40" fill="none" stroke={color} strokeWidth="1" opacity={opacity} />
        <path d="M40 40 C 40 60 60 80 80 80 L 80 80 C 60 80 40 60 40 40" fill="none" stroke={color} strokeWidth="1" opacity={opacity} />
        <path d="M40 40 C 40 60 20 80 0 80 L 0 80 C 20 80 40 60 40 40" fill="none" stroke={color} strokeWidth="1" opacity={opacity} />
        <circle cx="40" cy="40" r="4" fill={color} opacity={opacity * 2} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#kawungPattern)" />
  </svg>
);

export const BatikParang: React.FC<{ color?: string; opacity?: number }> = ({ color = "#1E293B", opacity = 0.1 }) => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 pointer-events-none">
    <defs>
      <pattern id="parangPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M0 50 Q 25 0 50 50 T 100 50" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" opacity={opacity} />
        <path d="M10 60 Q 35 10 60 60 T 110 60" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" opacity={opacity * 0.5} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#parangPattern)" />
  </svg>
);

export const BatikTruntum: React.FC<{ color?: string; opacity?: number }> = ({ color = "#1E293B", opacity = 0.1 }) => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 pointer-events-none">
    <defs>
      <pattern id="truntumPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M30 5 L 35 25 L 55 30 L 35 35 L 30 55 L 25 35 L 5 30 L 25 25 Z" fill="none" stroke={color} strokeWidth="1" opacity={opacity} />
        <circle cx="30" cy="30" r="2.5" fill={color} opacity={opacity * 1.5} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#truntumPattern)" />
  </svg>
);

export const EnhancedBackground: React.FC = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#F8FAFC]">
    <div className="absolute inset-0 bg-gradient-to-br from-[#F1F5F9] via-[#FDFDFD] to-[#E2E8F0]"></div>
    <div className="absolute inset-0 opacity-[0.2] mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
    <div className="absolute inset-0 opacity-[0.05] md:opacity-[0.08]">
       <BatikKawung color="#0F172A" />
    </div>
    <div className="absolute bottom-0 left-0 w-full h-64 opacity-[0.05]">
       <BatikParang color="#1E293B" />
    </div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(30,41,59,0.05)_100%)]"></div>
  </div>
);