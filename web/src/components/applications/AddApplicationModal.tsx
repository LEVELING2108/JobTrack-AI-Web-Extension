import React, { useState } from 'react';
import { X, Briefcase, Plus } from 'lucide-react';
import { useCreateApplicationMutation } from '../../hooks/useApplications';
import { ApplicationStatus, JobSource } from '../../types';
import { STAGE_CONFIG, StageIcon } from '../common/StageBadge';

interface AddModalProps {
  onClose: () => void;
  defaultStatus?: ApplicationStatus;
}

export default function AddApplicationModal({ onClose, defaultStatus = 'SAVED' }: AddModalProps) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [url, setUrl] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>(defaultStatus);
  const [source, setSource] = useState<JobSource>('COMPANY_WEBSITE');
  const [notes, setNotes] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const createMutation = useCreateApplicationMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !company || !url) {
      setError('Title, Company, and Job URL are required fields.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        job: {
          title,
          company,
          location: location || undefined,
          url,
          description: description || undefined,
          salaryMin: salaryMin ? parseFloat(salaryMin) : undefined,
          salaryMax: salaryMax ? parseFloat(salaryMax) : undefined,
          currency: 'USD',
          source,
        },
        status,
        notes: notes || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save application');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded-md">
              <Briefcase className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Add New Job Application</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Job Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Stripe"
                className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA (Remote)"
                className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Source Board</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as JobSource)}
                className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
              >
                <option value="LINKEDIN">LinkedIn</option>
                <option value="INDEED">Indeed</option>
                <option value="GLASSDOOR">Glassdoor</option>
                <option value="COMPANY_WEBSITE">Company Career Page</option>
                <option value="GENERIC">Other / Referral</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Job URL *</label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://company.com/careers/job-123"
              className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Min Salary ($)</label>
              <input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="100000"
                className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Max Salary ($)</label>
              <input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="140000"
                className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-2.5 top-2 z-10">
                  <StageIcon status={status} className="w-3.5 h-3.5" />
                </span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                  className={`appearance-none w-full border rounded-lg pl-8 pr-7 py-1.5 text-xs font-bold outline-none cursor-pointer shadow-2xs transition ${
                    STAGE_CONFIG[status]?.bg || 'bg-white'
                  } ${STAGE_CONFIG[status]?.text || 'text-slate-800'} ${STAGE_CONFIG[status]?.border || 'border-slate-300'}`}
                >
                  <option value="SAVED" className="bg-white text-slate-800 font-medium">Saved</option>
                  <option value="APPLIED" className="bg-white text-slate-800 font-medium">Applied</option>
                  <option value="SCREENING" className="bg-white text-slate-800 font-medium">Screening</option>
                  <option value="INTERVIEW" className="bg-white text-slate-800 font-medium">Interview</option>
                  <option value="OFFER" className="bg-white text-slate-800 font-medium">Offer</option>
                  <option value="ACCEPTED" className="bg-white text-slate-800 font-medium">Accepted</option>
                  <option value="REJECTED" className="bg-white text-slate-800 font-medium">Rejected</option>
                  <option value="WITHDRAWN" className="bg-white text-slate-800 font-medium">Withdrawn</option>
                </select>
                <span className="pointer-events-none absolute right-2.5 top-2.5 text-current opacity-60">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Job Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste job description..."
              className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Referral name, hiring manager info, key questions..."
              className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> {createMutation.isPending ? 'Saving...' : 'Create Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
