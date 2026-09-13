import React from 'react';
import { ApplicationStatus } from '../types';

export interface StageMeta {
  status: ApplicationStatus;
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
  solidBg: string;
  colorHex: string;
  renderIcon: (className?: string) => React.ReactNode;
}

export const STAGE_CONFIG: Record<ApplicationStatus, StageMeta> = {
  SAVED: {
    status: 'SAVED',
    label: 'Saved',
    bg: 'bg-indigo-50/90',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    dot: 'bg-indigo-500',
    solidBg: 'bg-indigo-600 text-white border-indigo-600 shadow-xs',
    colorHex: '#6366f1',
    renderIcon: (className = 'w-3 h-3') => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        <path d="M12 7v4" />
        <path d="M10 9h4" />
      </svg>
    ),
  },
  APPLIED: {
    status: 'APPLIED',
    label: 'Applied',
    bg: 'bg-blue-50/90',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    solidBg: 'bg-blue-600 text-white border-blue-600 shadow-xs',
    colorHex: '#2563eb',
    renderIcon: (className = 'w-3 h-3') => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </svg>
    ),
  },
  SCREENING: {
    status: 'SCREENING',
    label: 'Screening',
    bg: 'bg-amber-50/90',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    solidBg: 'bg-amber-600 text-white border-amber-600 shadow-xs',
    colorHex: '#d97706',
    renderIcon: (className = 'w-3 h-3') => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 0 1 10 10" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 8a4 4 0 0 1 4 4" />
      </svg>
    ),
  },
  INTERVIEW: {
    status: 'INTERVIEW',
    label: 'Interview',
    bg: 'bg-purple-50/90',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
    solidBg: 'bg-purple-600 text-white border-purple-600 shadow-xs',
    colorHex: '#9333ea',
    renderIcon: (className = 'w-3 h-3') => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
      </svg>
    ),
  },
  OFFER: {
    status: 'OFFER',
    label: 'Offer',
    bg: 'bg-emerald-50/90',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    solidBg: 'bg-emerald-600 text-white border-emerald-600 shadow-xs',
    colorHex: '#059669',
    renderIcon: (className = 'w-3 h-3') => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34" />
        <path d="M18 4H6v7a6 6 0 0 0 12 0V4z" />
      </svg>
    ),
  },
  ACCEPTED: {
    status: 'ACCEPTED',
    label: 'Accepted',
    bg: 'bg-teal-50/90',
    text: 'text-teal-800',
    border: 'border-teal-200',
    dot: 'bg-teal-500',
    solidBg: 'bg-teal-600 text-white border-teal-600 shadow-xs',
    colorHex: '#0d9488',
    renderIcon: (className = 'w-3 h-3') => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  REJECTED: {
    status: 'REJECTED',
    label: 'Rejected',
    bg: 'bg-rose-50/90',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
    solidBg: 'bg-rose-600 text-white border-rose-600 shadow-xs',
    colorHex: '#e11d48',
    renderIcon: (className = 'w-3 h-3') => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
  WITHDRAWN: {
    status: 'WITHDRAWN',
    label: 'Withdrawn',
    bg: 'bg-slate-100/90',
    text: 'text-slate-600',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
    solidBg: 'bg-slate-600 text-white border-slate-600 shadow-xs',
    colorHex: '#64748b',
    renderIcon: (className = 'w-3 h-3') => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 14 4 9l5-5" />
        <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
      </svg>
    ),
  },
};

export const StageIcon: React.FC<{
  status: ApplicationStatus;
  className?: string;
}> = ({ status, className = 'w-3.5 h-3.5' }) => {
  const config = STAGE_CONFIG[status] || STAGE_CONFIG.SAVED;
  return <>{config.renderIcon(className)}</>;
};

interface StageBadgeProps {
  status: ApplicationStatus;
  size?: 'xs' | 'sm' | 'md';
  iconOnly?: boolean;
  withDot?: boolean;
  className?: string;
}

export const StageBadge: React.FC<StageBadgeProps> = ({
  status,
  size = 'sm',
  iconOnly = false,
  withDot = false,
  className = '',
}) => {
  const config = STAGE_CONFIG[status] || STAGE_CONFIG.SAVED;

  const sizeStyles = {
    xs: {
      pill: 'px-1.5 py-0.5 text-[9px] gap-1',
      icon: 'w-2.5 h-2.5',
      dot: 'w-1 h-1',
    },
    sm: {
      pill: 'px-2 py-0.5 text-[10px] gap-1.5',
      icon: 'w-3 h-3',
      dot: 'w-1.5 h-1.5',
    },
    md: {
      pill: 'px-2.5 py-1 text-xs gap-1.5',
      icon: 'w-3.5 h-3.5',
      dot: 'w-2 h-2',
    },
  }[size];

  if (iconOnly) {
    return (
      <span
        title={config.label}
        className={`inline-flex items-center justify-center p-1 rounded-md border ${config.bg} ${config.text} ${config.border} shadow-2xs ${className}`}
      >
        {config.renderIcon(sizeStyles.icon)}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded-md border ${config.bg} ${config.text} ${config.border} ${sizeStyles.pill} shadow-2xs ${className}`}
    >
      {withDot && <span className={`rounded-full shrink-0 ${config.dot} ${sizeStyles.dot}`} />}
      {config.renderIcon(sizeStyles.icon)}
      <span>{config.label}</span>
    </span>
  );
};

export default StageBadge;
