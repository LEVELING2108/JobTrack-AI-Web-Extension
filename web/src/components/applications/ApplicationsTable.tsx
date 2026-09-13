import React, { useState } from 'react';
import { Building, MapPin, Search, Filter, ExternalLink, Calendar, Trash2 } from 'lucide-react';
import { Application, ApplicationStatus } from '../../types';
import { useApplicationsQuery, useDeleteApplicationMutation, useUpdateStatusMutation } from '../../hooks/useApplications';
import ApplicationDetailsModal from './ApplicationDetailsModal';
import PlatformBadge from '../common/PlatformBadge';
import { STAGE_CONFIG, StageIcon } from '../common/StageBadge';

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
                    <div className="relative inline-flex items-center">
                      <span className="pointer-events-none absolute left-2 text-current z-10">
                        <StageIcon status={app.status} className="w-2.5 h-2.5" />
                      </span>
                      <select
                        value={app.status}
                        onChange={(e) =>
                          updateStatusMutation.mutate({ id: app.id, status: e.target.value as ApplicationStatus })
                        }
                        className={`appearance-none text-[10px] font-bold uppercase tracking-wider pl-6 pr-5 py-1 rounded-md border cursor-pointer outline-none transition shadow-2xs ${
                          STAGE_CONFIG[app.status]?.bg || 'bg-slate-50'
                        } ${STAGE_CONFIG[app.status]?.text || 'text-slate-700'} ${STAGE_CONFIG[app.status]?.border || 'border-slate-200'}`}
                      >
                        <option value="SAVED" className="bg-white text-slate-800 font-medium normal-case">Saved</option>
                        <option value="APPLIED" className="bg-white text-slate-800 font-medium normal-case">Applied</option>
                        <option value="SCREENING" className="bg-white text-slate-800 font-medium normal-case">Screening</option>
                        <option value="INTERVIEW" className="bg-white text-slate-800 font-medium normal-case">Interview</option>
                        <option value="OFFER" className="bg-white text-slate-800 font-medium normal-case">Offer</option>
                        <option value="ACCEPTED" className="bg-white text-slate-800 font-medium normal-case">Accepted</option>
                        <option value="REJECTED" className="bg-white text-slate-800 font-medium normal-case">Rejected</option>
                        <option value="WITHDRAWN" className="bg-white text-slate-800 font-medium normal-case">Withdrawn</option>
                      </select>
                      <span className="pointer-events-none absolute right-1.5 text-current opacity-60">
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    <PlatformBadge source={app.job.source} size="xs" />
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
