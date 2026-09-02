import { useState } from 'react';
import {
  X,
  Building,
  MapPin,
  ExternalLink,
  Trash2,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { Application, ApplicationStatus } from '../../types';
import { useUpdateApplicationMutation, useDeleteApplicationMutation } from '../../hooks/useApplications';

interface DetailsProps {
  application: Application;
  onClose: () => void;
}

export default function ApplicationDetailsModal({ application, onClose }: DetailsProps) {
  const [notes, setNotes] = useState(application.notes || '');
  const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const [deadline, setDeadline] = useState(application.deadline ? application.deadline.split('T')[0] : '');
  const [followUpDate, setFollowUpDate] = useState(application.followUpDate ? application.followUpDate.split('T')[0] : '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const updateMutation = useUpdateApplicationMutation();
  const deleteMutation = useDeleteApplicationMutation();

  const handleSave = async () => {
    await updateMutation.mutateAsync({
      id: application.id,
      data: {
        notes,
        status,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        followUpDate: followUpDate ? new Date(followUpDate).toISOString() : undefined,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      await deleteMutation.mutateAsync(application.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex-1 pr-4">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 mb-1.5">
              {application.job.source}
            </span>
            <h2 className="text-lg font-bold text-slate-900">{application.job.title}</h2>
            <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {application.job.company}
              </span>
              {application.job.location && (
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {application.job.location}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <span className="text-[10px] text-slate-400 font-medium">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="mt-1 w-full bg-white border border-slate-300 rounded p-1 text-xs font-semibold focus:ring-1 focus:ring-indigo-500 outline-none"
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
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-medium">Salary</span>
              <p className="mt-1 text-xs font-bold text-slate-800">
                {application.job.salaryMin || application.job.salaryMax ? (
                  `$${application.job.salaryMin?.toLocaleString() || ''} - $${application.job.salaryMax?.toLocaleString() || ''}`
                ) : (
                  'Not specified'
                )}
              </p>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-medium">Deadline</span>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 w-full bg-white border border-slate-300 rounded p-1 text-xs outline-none"
              />
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-medium">Follow-Up Date</span>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="mt-1 w-full bg-white border border-slate-300 rounded p-1 text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <a
              href={application.job.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              View original job posting on {application.job.source} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Personal Notes & Research</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add key talking points, recruiter name, compensation target..."
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
            />
          </div>

          {application.job.description && (
            <div>
              <label className="block font-bold text-slate-800 mb-1">Job Description</label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-xs max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {application.job.description}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-medium text-xs transition"
          >
            <Trash2 className="w-4 h-4" /> Delete Application
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Changes Saved
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
