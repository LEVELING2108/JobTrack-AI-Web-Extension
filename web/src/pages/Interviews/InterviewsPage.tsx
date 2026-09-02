import { Calendar, Building } from 'lucide-react';
import { useApplicationsQuery } from '../../hooks/useApplications';

export default function InterviewsPage() {
  const { data: pageData, isLoading } = useApplicationsQuery({ status: 'INTERVIEW', size: 50 });
  const interviewApps = pageData?.content || [];

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Scheduled Interviews</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Keep track of upcoming technical assessments and interview rounds.
        </p>
      </div>

      {isLoading ? (
        <div className="py-24 text-center text-slate-400 text-xs">Loading interview schedules...</div>
      ) : interviewApps.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-200 rounded-xl p-8">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No active interview rounds</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            When you move a job to the 'Interview' stage, it will appear here for easy scheduling and round tracking.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interviewApps.map((app) => (
            <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 uppercase">
                    In Interview
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1.5">{app.job.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{app.job.company}</span>
                  </div>
                </div>
              </div>

              {app.notes && (
                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {app.notes}
                </p>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {app.followUpDate
                    ? `Follow up: ${new Date(app.followUpDate).toLocaleDateString()}`
                    : 'No date set'}
                </span>
                <a
                  href={app.job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold text-[11px]"
                >
                  Job Link
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
