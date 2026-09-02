import React, { useState } from 'react';
import { X, Video, Calendar } from 'lucide-react';
import { useApplicationsQuery } from '../../hooks/useApplications';
import { useScheduleInterviewMutation } from '../../hooks/useInterviews';

interface ScheduleModalProps {
  onClose: () => void;
  defaultApplicationId?: number;
}

const COMMON_ROUNDS = [
  'Recruiter Phone Screen',
  'Technical Coding Round 1',
  'Technical Coding Round 2',
  'System Design',
  'Hiring Manager / Team Lead',
  'Behavioral / Values Fit',
  'Executive / Final Round',
  'Offer Discussion',
];

export default function ScheduleInterviewModal({ onClose, defaultApplicationId }: ScheduleModalProps) {
  const { data: pageData } = useApplicationsQuery({ size: 100 });
  const [applicationId, setApplicationId] = useState<number | string>(defaultApplicationId || '');
  const [roundName, setRoundName] = useState(COMMON_ROUNDS[0]);
  const [customRound, setCustomRound] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const scheduleMutation = useScheduleInterviewMutation();
  const applications = pageData?.content || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!applicationId || !scheduledAt) {
      setError('Please select an application and scheduled date/time.');
      return;
    }

    try {
      await scheduleMutation.mutateAsync({
        applicationId: Number(applicationId),
        roundName: customRound.trim() || roundName,
        scheduledAt: new Date(scheduledAt).toISOString(),
        interviewer: interviewer.trim() || undefined,
        meetingUrl: meetingUrl.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to schedule interview');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-purple-600 text-white p-1.5 rounded-md">
              <Video className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Schedule Interview Round</h2>
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
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Application *</label>
            <select
              required
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-purple-500 outline-none bg-white font-medium"
            >
              <option value="">Select an application...</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.job.title} at {app.job.company} ({app.status})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Interview Round</label>
              <select
                value={roundName}
                onChange={(e) => setRoundName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-500 outline-none bg-white font-medium"
              >
                {COMMON_ROUNDS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
                <option value="Other">Custom Round Name...</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Scheduled Date & Time *</label>
              <input
                type="datetime-local"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          {roundName === 'Other' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Custom Round Name *</label>
              <input
                type="text"
                required
                value={customRound}
                onChange={(e) => setCustomRound(e.target.value)}
                placeholder="e.g. Architecture Deep Dive"
                className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Interviewer Name</label>
              <input
                type="text"
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
                placeholder="e.g. Sarah Connor (Tech Lead)"
                className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Video Meeting Link</label>
              <input
                type="url"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://meet.google.com/xyz-abc"
                className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Preparation Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key concepts, projects to highlight, questions to ask..."
              className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
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
              disabled={scheduleMutation.isPending}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />{' '}
              {scheduleMutation.isPending ? 'Scheduling...' : 'Confirm Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
