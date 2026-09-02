import {
  Bookmark,
  Send,
  Users,
  Video,
  Award,
  XCircle,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { useApplicationSummaryQuery } from '../../hooks/useApplications';
import { ApplicationsTable } from '../../components/applications/ApplicationsTable';

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useApplicationSummaryQuery();

  const total = summary?.total || 0;
  const offers = summary?.offer || 0;
  const interviews = summary?.interview || 0;
  const applied = summary?.applied || 0;
  const responseRate = total > 0 ? Math.round(((interviews + offers) / total) * 100) : 0;

  const kpis = [
    { label: 'Total Tracked', value: total, icon: Bookmark, color: 'text-slate-700', bg: 'bg-slate-100' },
    { label: 'Applied', value: applied, icon: Send, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Screening', value: summary?.screening || 0, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Interviews', value: interviews, icon: Video, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Offers', value: offers, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Rejected', value: summary?.rejected || 0, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Application Pipeline Overview</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Monitor your job hunt progress, interview schedules, and response conversions.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">{kpi.label}</span>
                <div className={`p-1.5 rounded-lg ${kpi.bg} ${kpi.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-xl font-extrabold text-slate-900 mt-2">
                {summaryLoading ? '—' : kpi.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <TrendingUp className="w-6 h-6 text-indigo-100" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Interview Response Rate: {responseRate}%</h3>
            <p className="text-xs text-indigo-100 mt-0.5">
              {interviews} interviews and {offers} offers from {total} tracked job applications.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-white/20 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1">
            Active Funnel <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Recent Applications</h2>
          <span className="text-xs text-slate-400">Live synchronized</span>
        </div>
        <ApplicationsTable />
      </div>
    </div>
  );
}
