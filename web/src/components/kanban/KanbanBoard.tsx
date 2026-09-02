import React, { useState } from 'react';
import { Application, ApplicationStatus } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { useApplicationsQuery, useUpdateStatusMutation } from '../../hooks/useApplications';
import ApplicationDetailsModal from '../applications/ApplicationDetailsModal';

const COLUMNS: { title: string; status: ApplicationStatus; badgeColor: string }[] = [
  { title: 'Saved', status: 'SAVED', badgeColor: 'bg-slate-400' },
  { title: 'Applied', status: 'APPLIED', badgeColor: 'bg-blue-500' },
  { title: 'Screening', status: 'SCREENING', badgeColor: 'bg-amber-500' },
  { title: 'Interview', status: 'INTERVIEW', badgeColor: 'bg-purple-500' },
  { title: 'Offer', status: 'OFFER', badgeColor: 'bg-emerald-500' },
  { title: 'Rejected', status: 'REJECTED', badgeColor: 'bg-rose-500' },
];

export const KanbanBoard: React.FC = () => {
  const { data: pageData, isLoading } = useApplicationsQuery({ size: 100 });
  const updateStatusMutation = useUpdateStatusMutation();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const applications = pageData?.content || [];

  const handleStatusChange = (id: number, status: ApplicationStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-2">
      {COLUMNS.map((col) => (
        <KanbanColumn
          key={col.status}
          title={col.title}
          status={col.status}
          badgeColor={col.badgeColor}
          applications={applications.filter((a) => a.status === col.status)}
          onSelect={setSelectedApp}
          onStatusChange={handleStatusChange}
        />
      ))}

      {selectedApp && (
        <ApplicationDetailsModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
};
