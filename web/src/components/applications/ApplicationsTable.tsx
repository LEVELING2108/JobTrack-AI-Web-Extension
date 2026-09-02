import React, { useState } from 'react';
import { Building, MapPin, Search, Filter, ExternalLink, Calendar, Trash2 } from 'lucide-react';
import { Application, ApplicationStatus } from '../../types';
import { useApplicationsQuery, useDeleteApplicationMutation, useUpdateStatusMutation } from '../../hooks/useApplications';
import ApplicationDetailsModal from './ApplicationDetailsModal';

const statusBadgeStyles: Record<ApplicationStatus, string> = {
  SAVED: 'bg-slate-100 text-slate-700 border-slate-200',
  APPLIED: 'bg-blue-50 text-blue-700 border-blue-200',
  SCREENING: 'bg-amber-50 text-amber-700 border-amber-200',
  INTERVIEW: 'bg-purple-50 text-purple-700 border-purple-200',
  OFFER: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ACCEPTED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  WITHDRAWN: 'bg-slate-100 text-slate-500 border-slate-200',
};

export const ApplicationsTable: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [page, setPage] = useState(0);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const { data: pageData, isLoading } = useApplicationsQuery({
    search: search || undefined,
    status: statusFilter || undefined,
    page,
    size: 15,
  });

  const deleteMutation = useDeleteApplicationMutation();
  const updateStatusMutation = useUpdateStatusMutation();

  const applications = pageData?.content || [];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-2xs flex flex-col">
      {/* Search & Filter Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search by role or company..."
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as ApplicationStatus | '');
              setPage(0);
            }}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="SAVED">Saved</option>
            <option value="APPLIED">Applied</option>
            <option value="SCREENING">Screening</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Job Role & Company</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Stage</th>
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Loading applications...
                </td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No job applications found.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="font-bold text-slate-900 hover:text-indigo-600 text-left line-clamp-1"
                    >
                      {app.job.title}
                    </button>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span>{app.job.company}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {app.job.location ? (
                      <span className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {app.job.location}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        updateStatusMutation.mutate({ id: app.id, status: e.target.value as ApplicationStatus })
                      }
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        statusBadgeStyles[app.status]
                      } outline-none cursor-pointer`}
                    >
                      <option value="SAVED">Saved</option>
                      <option value="APPLIED">Applied</option>
                      <option value="SCREENING">Screening</option>
                      <option value="INTERVIEW">Interview</option>
                      <option value="OFFER">Offer</option>
                      <option value="ACCEPTED">Accepted</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="WITHDRAWN">Withdrawn</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-medium text-slate-600">
                      {app.job.source}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(app.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={app.job.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded transition"
                        title="View Original Job"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => deleteMutation.mutate(app.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pageData && pageData.totalPages > 1 && (
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Page {pageData.page + 1} of {pageData.totalPages} ({pageData.totalElements} total)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="px-2.5 py-1 border border-slate-200 rounded text-xs hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={pageData.last}
              onClick={() => setPage(page + 1)}
              className="px-2.5 py-1 border border-slate-200 rounded text-xs hover:bg-slate-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedApp && (
        <ApplicationDetailsModal application={selectedApp} onClose={() => setSelectedApp(null)} />
      )}
    </div>
  );
};
