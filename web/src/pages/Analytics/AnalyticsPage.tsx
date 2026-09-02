import { useApplicationSummaryQuery } from '../../hooks/useApplications';

export default function AnalyticsPage() {
  const { data: summary } = useApplicationSummaryQuery();

  const total = summary?.total || 0;
  const applied = summary?.applied || 0;
  const interviews = summary?.interview || 0;
  const offers = summary?.offer || 0;
  const rejections = summary?.rejected || 0;

  const appToInterviewRate = applied > 0 ? Math.round((interviews / applied) * 100) : 0;
  const interviewToOfferRate = interviews > 0 ? Math.round((offers / interviews) * 100) : 0;

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Application Search Analytics</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Conversion funnels and metrics to optimize your job application strategy.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Application &rarr; Interview</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">{appToInterviewRate}%</p>
          <p className="text-[11px] text-slate-400 mt-1">{interviews} interviews from {applied} submissions</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Interview &rarr; Offer</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{interviewToOfferRate}%</p>
          <p className="text-[11px] text-slate-400 mt-1">{offers} offers from {interviews} interview stages</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Total Pipeline Volume</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{total}</p>
          <p className="text-[11px] text-slate-400 mt-1">{rejections} rejections recorded</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Pipeline Funnel Distribution</h3>

        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between text-slate-700 font-semibold mb-1">
              <span>Saved ({summary?.saved || 0})</span>
              <span>{total > 0 ? Math.round(((summary?.saved || 0) / total) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-slate-400 h-full rounded-full"
                style={{ width: `${total > 0 ? ((summary?.saved || 0) / total) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-700 font-semibold mb-1">
              <span>Applied ({applied})</span>
              <span>{total > 0 ? Math.round((applied / total) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${total > 0 ? (applied / total) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-700 font-semibold mb-1">
              <span>Interviews ({interviews})</span>
              <span>{total > 0 ? Math.round((interviews / total) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full"
                style={{ width: `${total > 0 ? (interviews / total) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-700 font-semibold mb-1">
              <span>Offers ({offers})</span>
              <span>{total > 0 ? Math.round((offers / total) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${total > 0 ? (offers / total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
