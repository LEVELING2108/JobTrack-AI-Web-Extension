import React from 'react';

export type JobSourceType =
  | 'LINKEDIN'
  | 'INDEED'
  | 'GLASSDOOR'
  | 'GREENHOUSE'
  | 'LEVER'
  | 'WORKDAY'
  | 'COMPANY_CAREER_PORTAL'
  | 'MANUAL_ENTRY'
  | 'GENERIC_FALLBACK'
  | string;

interface PlatformBadgeProps {
  source?: JobSourceType;
  size?: 'xs' | 'sm' | 'md';
  iconOnly?: boolean;
  className?: string;
}

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({
  source = 'GENERIC_FALLBACK',
  size = 'sm',
  iconOnly = false,
  className = '',
}) => {
  const s = (source || '').toUpperCase();

  let config = {
    label: 'Career Portal',
    bg: 'bg-indigo-50/80',
    text: 'text-indigo-700',
    border: 'border-indigo-200/80',
    iconColor: '#6366f1',
    renderIcon: () => (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
      </svg>
    ),
  };

  if (s.includes('LINKEDIN')) {
    config = {
      label: 'LinkedIn',
      bg: 'bg-[#0A66C2]/10',
      text: 'text-[#0A66C2]',
      border: 'border-[#0A66C2]/30',
      iconColor: '#0A66C2',
      renderIcon: () => (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ),
    };
  } else if (s.includes('INDEED')) {
    config = {
      label: 'Indeed',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      iconColor: '#2164f3',
      renderIcon: () => (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="#2164f3">
          <path d="M12.5 4a3.5 3.5 0 0 0-3.5 3.5v.7A7.5 7.5 0 0 1 12 8c2.8 0 5.2 1.5 6.4 3.7V7.5A3.5 3.5 0 0 0 14.9 4h-2.4zm-3.5 6.2v9.3a1.5 1.5 0 0 0 3 0v-7.2c0-.3.1-.6.3-.8.4-.5 1.1-.7 1.8-.7s1.4.2 1.8.7c.2.2.3.5.3.8v7.2a1.5 1.5 0 0 0 3 0v-7.5c0-1.8-.7-3.4-2-4.5A7.5 7.5 0 0 0 12 9.5a7.5 7.5 0 0 0-3 .7z" />
        </svg>
      ),
    };
  } else if (s.includes('GLASSDOOR')) {
    config = {
      label: 'Glassdoor',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      iconColor: '#0caa41',
      renderIcon: () => (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="#0caa41">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z" />
        </svg>
      ),
    };
  } else if (s.includes('GREENHOUSE')) {
    config = {
      label: 'Greenhouse',
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-200',
      iconColor: '#0f766e',
      renderIcon: () => (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2">
          <path d="M12 22v-9M12 13a5 5 0 0 1 5-5h2a5 5 0 0 1-5 5M12 13a5 5 0 0 0-5-5H5a5 5 0 0 0 5 5" />
        </svg>
      ),
    };
  } else if (s.includes('LEVER')) {
    config = {
      label: 'Lever',
      bg: 'bg-slate-100',
      text: 'text-slate-800',
      border: 'border-slate-300',
      iconColor: '#334155',
      renderIcon: () => (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2.5">
          <path d="M6 3h12l4 18H2L6 3z" />
        </svg>
      ),
    };
  } else if (s.includes('WORKDAY')) {
    config = {
      label: 'Workday',
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-200',
      iconColor: '#ea580c',
      renderIcon: () => (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="#ea580c">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1l2.1-2.1M17 7l2.1-2.1" stroke="#ea580c" strokeWidth="2" />
        </svg>
      ),
    };
  } else if (s.includes('MANUAL')) {
    config = {
      label: 'Manual Entry',
      bg: 'bg-slate-50',
      text: 'text-slate-600',
      border: 'border-slate-200',
      iconColor: '#64748b',
      renderIcon: () => (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
    };
  }

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[9px] gap-1',
    sm: 'px-2 py-0.5 text-[10px] gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  }[size];

  if (iconOnly) {
    return (
      <span
        title={`Sourced from ${config.label}`}
        className={`inline-flex items-center justify-center p-1 rounded-md border ${config.bg} ${config.border} shadow-2xs ${className}`}
      >
        {config.renderIcon()}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-md border ${config.bg} ${config.text} ${config.border} ${sizeClasses} shadow-2xs ${className}`}
    >
      {config.renderIcon()}
      <span>{config.label}</span>
    </span>
  );
};

export default PlatformBadge;
