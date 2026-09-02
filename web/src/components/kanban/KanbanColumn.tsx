import React from 'react';
import { Application, ApplicationStatus } from '../../types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  title: string;
  status: ApplicationStatus;
  applications: Application[];
  badgeColor: string;
  onSelect: (app: Application) => void;
  onStatusChange: (id: number, status: ApplicationStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  applications,
  badgeColor,
  onSelect,
  onStatusChange,
}) => {
  return (
    <div className="flex-1 min-w-[260px] bg-slate-100/70 border border-slate-200/80 rounded-xl p-3 flex flex-col max-h-[calc(100vh-180px)]">
      {/* Column Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${badgeColor}`} />
          <h3 className="font-bold text-xs text-slate-800">{title}</h3>
        </div>
        <span className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
          {applications.length}
        </span>
      </div>

      {/* Cards Scroll Container */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {applications.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-[11px] border-2 border-dashed border-slate-200 rounded-lg">
            No applications
          </div>
        ) : (
          applications.map((app) => (
            <KanbanCard
              key={app.id}
              application={app}
              onSelect={onSelect}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
};
