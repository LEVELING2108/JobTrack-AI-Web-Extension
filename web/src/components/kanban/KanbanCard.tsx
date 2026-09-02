import React from 'react';
import { Building, MapPin, DollarSign, ExternalLink, Calendar } from 'lucide-react';
import { Application, ApplicationStatus } from '../../types';

interface KanbanCardProps {
  application: Application;
  onSelect: (app: Application) => void;
  onStatusChange: (id: number, status: ApplicationStatus) => void;
}

const statusOptions: { label: string; value: ApplicationStatus }[] = [
  { label: 'Saved', value: 'SAVED' },
  { label: 'Applied', value: 'APPLIED' },
  { label: 'Screening', value: 'SCREENING' },
  { label: 'Interview', value: 'INTERVIEW' },
  { label: 'Offer', value: 'OFFER' },
  { label: 'Accepted', value: 'ACCEPTED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Withdrawn', value: 'WITHDRAWN' },
];

export const KanbanCard: React.FC<KanbanCardProps> = ({ application, onSelect, onStatusChange }) => {
  const { job } = application;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs hover:shadow-sm transition group">
      <div className="flex items-start justify-between gap-2">
        <h4
          onClick={() => onSelect(application)}
          className="font-bold text-xs text-slate-900 hover:text-indigo-600 cursor-pointer line-clamp-2 leading-snug flex-1"
        >
          {job.title}
        </h4>
        <a
          href={job.url}
          target="_blank"
          rel="noreferrer"
          className="text-slate-400 hover:text-indigo-600 p-0.5 rounded opacity-0 group-hover:opacity-100 transition"
          title="Open Job URL"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 mt-1">
        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="truncate">{job.company}</span>
      </div>

      {job.location && (
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
          <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>
      )}

      {(job.salaryMin || job.salaryMax) && (
        <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 mt-1">
          <DollarSign className="w-3 h-3 shrink-0" />
          <span>
            {job.currency || '$'}
            {job.salaryMin?.toLocaleString()}
            {job.salaryMax && ` - ${job.salaryMax.toLocaleString()}`}
          </span>
        </div>
      )}

      {application.notes && (
        <p className="mt-2 text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded line-clamp-2 border border-slate-100">
          {application.notes}
        </p>
      )}

      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
        <span className="text-slate-400 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(application.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>

        <select
          value={application.status}
          onChange={(e) => onStatusChange(application.id, e.target.value as ApplicationStatus)}
          className="bg-slate-50 text-[10px] text-slate-600 font-medium border border-slate-200 rounded px-1.5 py-0.5 focus:ring-1 focus:ring-indigo-500 outline-none"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Move: {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
