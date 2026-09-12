import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 28 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="extLogoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="extLogoBrand" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="40%" stopColor="#6366f1" />
          <stop offset="70%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="extLogoSpark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      <rect width="128" height="128" rx="28" fill="url(#extLogoBg)" />
      <rect width="126" height="126" x="1" y="1" rx="27" fill="none" stroke="#4f46e5" strokeWidth="2" strokeOpacity="0.5" />

      {/* J Trajectory & Ascending Arrow */}
      <path
        d="M 50 38 L 72 38 L 72 50 L 62 60 L 62 74 C 62 84 54 92 44 92 C 34 92 26 84 26 74 L 36 74 C 36 78 39 82 44 82 C 48 82 52 78 52 74 L 52 58 L 78 32"
        fill="none"
        stroke="url(#extLogoBrand)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 66 32 L 82 30 L 80 46"
        fill="none"
        stroke="url(#extLogoBrand)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* AI Star Spark */}
      <g transform="translate(94, 24)">
        <path d="M 0 -11 Q 0 0 11 0 Q 0 0 0 11 Q 0 0 -11 0 Q 0 0 0 -11 Z" fill="url(#extLogoSpark)" />
        <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
      </g>
    </svg>
  );
};

export default BrandLogo;
