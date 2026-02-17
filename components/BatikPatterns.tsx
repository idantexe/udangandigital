import React from 'react';

export const BatikKawung: React.FC<{ className?: string, color?: string, opacity?: number }> = ({ className, color = "#64748B", opacity = 0.1 }) => (
  <svg className={className} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="kawungRoyal" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M40 40 C 40 20 60 0 80 0 L 80 0 C 60 0 40 20 40 40" fill="none" stroke={color} strokeWidth="1.5" opacity={opacity} />
        <path d="M40 40 C 40 20 20 0 0 0 L 0 0 C 20 0 40 20 40 40" fill="none" stroke={color} strokeWidth="1.5" opacity={opacity} />
        <path d="M40 40 C 40 60 60 80 80 80 L 80 80 C 60 80 40 60 40 40" fill="none" stroke={color} strokeWidth="1.5" opacity={opacity} />
        <path d="M40 40 C 40 60 20 80 0 80 L 0 80 C 20 80 40 60 40 40" fill="none" stroke={color} strokeWidth="1.5" opacity={opacity} />
        <circle cx="40" cy="40" r="6" fill="none" stroke={color} strokeWidth="1" opacity={opacity * 1.5} />
        <circle cx="40" cy="40" r="3" fill={color} opacity={opacity * 2} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#kawungRoyal)" />
  </svg>
);

export const BatikTruntum: React.FC<{ className?: string, color?: string, opacity?: number }> = ({ className, color = "#475569", opacity = 0.08 }) => (
  <svg className={className} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="truntumStar" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M25 5 L 30 20 L 45 25 L 30 30 L 25 45 L 20 30 L 5 25 L 20 20 Z" fill="none" stroke={color} strokeWidth="1.2" opacity={opacity} />
        <circle cx="25" cy="25" r="3" fill={color} opacity={opacity * 0.8} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#truntumStar)" />
  </svg>
);