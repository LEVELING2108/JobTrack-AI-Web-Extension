import React, { useState } from 'react';
import { X, Bell, Plus } from 'lucide-react';
import { useApplicationsQuery } from '../../hooks/useApplications';
import { useCreateReminderMutation } from '../../hooks/useReminders';

interface ReminderModalProps {
  onClose: () => void;
}

export default function CreateReminderModal({ onClose }: ReminderModalProps) {
  const { data: pageData } = useApplicationsQuery({ size: 100 });
  const [title, setTitle] = useState('');
  const [applicationId, setApplicationId] = useState<string>('');
  const [reminderTime, setReminderTime] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const createReminderMutation = useCreateReminderMutation();
  const applications = pageData?.content || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !reminderTime) {
      setError('Title and reminder date/time are required.');
      return;
    }

    try {
      await createReminderMutation.mutateAsync({
        title: title.trim(),
        applicationId: applicationId ? Number(applicationId) : undefined,
        reminderTime: new Date(reminderTime).toISOString(),
        description: description.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create reminder');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 text-white p-1.5 rounded-md">
              <Bell className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Set Follow-Up Reminder</h2>
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
            <label className="block font-semibold text-slate-700 mb-1">Reminder Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Send thank you note to recruiter"
              className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Linked Application (Optional)</label>
            <select
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-amber-500 outline-none bg-white font-medium"
            >
              <option value="">General reminder (no specific job)</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.job.title} at {app.job.company}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Reminder Time *</label>
            <input
              type="datetime-local"
              required
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notes / Checklist</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details..."
              className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
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
              disabled={createReminderMutation.isPending}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />{' '}
              {createReminderMutation.isPending ? 'Setting...' : 'Set Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
