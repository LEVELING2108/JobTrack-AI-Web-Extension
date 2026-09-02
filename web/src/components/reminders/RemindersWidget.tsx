import { useState } from 'react';
import { Bell, CheckSquare, Square, Trash2, Plus, Clock } from 'lucide-react';
import { useRemindersQuery, useToggleReminderMutation, useDeleteReminderMutation } from '../../hooks/useReminders';
import CreateReminderModal from './CreateReminderModal';

export default function RemindersWidget() {
  const { data: reminders = [], isLoading } = useRemindersQuery();
  const toggleMutation = useToggleReminderMutation();
  const deleteMutation = useDeleteReminderMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-amber-50 text-amber-700 p-1.5 rounded-lg border border-amber-200">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Follow-Ups & Reminders</h3>
            <p className="text-[10px] text-slate-400">{reminders.length} active tasks</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-md font-semibold text-[11px] border border-amber-200 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <p className="text-xs text-slate-400 py-4 text-center">Loading reminders...</p>
        ) : reminders.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No active reminders. You're all caught up!</p>
        ) : (
          reminders.slice(0, 5).map((rem) => (
            <div
              key={rem.id}
              className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 transition ${
                rem.completed
                  ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <button
                  onClick={() => toggleMutation.mutate(rem.id)}
                  className="text-slate-400 hover:text-emerald-600 transition shrink-0"
                >
                  {rem.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold truncate">{rem.title}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {new Date(rem.reminderTime).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteMutation.mutate(rem.id)}
                className="p-1 text-slate-300 hover:text-rose-600 rounded transition shrink-0"
                title="Delete reminder"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {isModalOpen && <CreateReminderModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
