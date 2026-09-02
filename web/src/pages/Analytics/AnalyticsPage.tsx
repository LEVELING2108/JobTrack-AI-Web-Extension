import {
  Target,
  Award,
  DollarSign,
  Compass,
  BarChart,
  Zap,
} from 'lucide-react';
import { useAnalyticsOverviewQuery } from '../../hooks/useAnalytics';

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useAnalyticsOverviewQuery();

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400 text-xs">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        Calculating performance metrics...
      </div>
    );
  }

  const total = analytics?.totalApplications || 0;
  const active = analytics?.activeApplications || 0;
  const interviewRate = analytics?.interviewRate || 0;
  const offerRate = analytics?.offerRate || 0;
  const sources = analytics?.sourceBreakdown || [];
  const velocity = analytics?.weeklyVelocity || [];

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Application Performance & Insights</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Data-driven metrics to optimize job search efficiency, source channels, and interview conversion.
        </p>
      </div>

      {/* Main KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Interview Rate</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{interviewRate}%</p>
          <p className="text-[11px] text-slate-400">Applications reaching interview stage</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Offer Conversion</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600">{offerRate}%</p>
          <p className="text-[11px] text-slate-400">Total applications resulting in offers</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Pipeline</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{active}</p>
          <p className="text-[11px] text-slate-400">{total} total submitted applications</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Average Salary Target</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {analytics?.averageSalaryMin
              ? `$${Math.round(analytics.averageSalaryMin / 1000)}k - $${Math.round((analytics.averageSalaryMax || 0) / 1000)}k`
              : 'N/A'}
          </p>
          <p className="text-[11px] text-slate-400">Based on disclosed job ranges</p>
        </div>
      </div>

      {/* Grid: Source Channel Performance & Application Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Board Effectiveness */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Job Board Effectiveness</h3>
            </div>
            <span className="text-xs text-slate-400">Conversion to interview</span>
          </div>

          <div className="space-y-3">
            {sources.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No source distribution data yet.</p>
            ) : (
              sources.map((src) => (
                <div key={src.source} className="p-3 border border-slate-100 rounded-lg bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{src.source}</span>
                    <span className="font-extrabold text-indigo-600">{src.conversionRate}% conversion</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${Math.min(src.conversionRate, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>{src.totalCount} applications</span>
                    <span>{src.interviewCount} interviews &bull; {src.offerCount} offers</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Application Velocity Timeline */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Application Velocity</h3>
            </div>
            <span className="text-xs text-slate-400">Submissions over time</span>
          </div>

          <div className="space-y-3">
            {velocity.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No timeline activity recorded yet.</p>
            ) : (
              velocity.slice(-6).map((v) => (
                <div key={v.weekLabel} className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-700">{v.weekLabel}</span>
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    +{v.count} submitted
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
