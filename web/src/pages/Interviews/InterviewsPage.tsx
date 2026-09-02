import { useState } from 'react';
import { Calendar, Video, ExternalLink, Trash2, Plus, Clock } from 'lucide-react';
import { useInterviewsQuery, useDeleteInterviewMutation } from '../../hooks/useInterviews';
import ScheduleInterviewModal from '../../components/interviews/ScheduleInterviewModal';

export default function InterviewsPage() {
  const { data: interviews = [], isLoading } = useInterviewsQuery();
  const deleteMutation = useDeleteInterviewMutation();
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Scheduled Interviews & Assessments</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Prepare, track rounds, and join meetings for your upcoming technical and HR calls.
          </p>
        </div>

        <button
          onClick={() => setIsScheduleOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Schedule Interview
        </button>
      </div>

      {isLoading ? (
        <div className="py-24 text-center text-slate-400 text-xs">Loading interview schedules...</div>
      ) : interviews.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-200 rounded-xl p-8 space-y-3">
          <Calendar className="w-10 h-10 text-purple-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Interview Rounds Scheduled</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Schedule a technical phone screen, coding round, or hiring manager interview to track deadlines and meeting links.
          </p>
          <button
            onClick={() => setIsScheduleOpen(true)}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-semibold border border-purple-200 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Schedule First Round
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between space-y-3 hover:shadow-sm transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 uppercase">
                    {interview.roundName}
                  </span>
                  <button
                    onClick={() => deleteMutation.mutate(interview.id)}
                    className="p-1 text-slate-300 hover:text-rose-600 rounded transition"
                    title="Cancel round"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                  <Clock className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span>
                    {new Date(interview.scheduledAt).toLocaleString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {interview.interviewer && (
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold">Interviewer:</span> {interview.interviewer}
                  </p>
                )}

                {interview.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {interview.notes}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {interview.meetingUrl ? (
                  <a
                    href={interview.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition"
                  >
                    <Video className="w-3.5 h-3.5" /> Join Meeting <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">No video link provided</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isScheduleOpen && <ScheduleInterviewModal onClose={() => setIsScheduleOpen(false)} />}
    </div>
  );
}
