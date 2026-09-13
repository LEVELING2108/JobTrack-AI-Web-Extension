import React, { useState } from 'react';
import { Application, ApplicationStatus } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { useApplicationsQuery, useUpdateStatusMutation } from '../../hooks/useApplications';
import ApplicationDetailsModal from '../applications/ApplicationDetailsModal';

const COLUMNS: { title: string; status: ApplicationStatus }[] = [
  { title: 'Saved', status: 'SAVED' },
  { title: 'Applied', status: 'APPLIED' },
  { title: 'Screening', status: 'SCREENING' },
  { title: 'Interview', status: 'INTERVIEW' },
  { title: 'Offer', status: 'OFFER' },
  { title: 'Accepted', status: 'ACCEPTED' },
  { title: 'Rejected', status: 'REJECTED' },
  { title: 'Withdrawn', status: 'WITHDRAWN' },
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
