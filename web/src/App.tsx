import { Briefcase, LayoutDashboard, CheckCircle } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-brand-600 text-white p-2 rounded-lg">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">JobTrack</h1>
            <p className="text-xs text-slate-500">AI-Powered Job Application Tracker</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" /> Web Dashboard Ready
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <LayoutDashboard className="w-6 h-6 text-brand-600" />
            <h2 className="text-lg font-semibold text-slate-800">Welcome to JobTrack Dashboard</h2>
          </div>
          <p className="text-slate-600 mb-6 text-sm">
            Phase 1 Project Scaffolding successfully initialized. The full Kanban pipeline, job details view,
            and application statistics will be connected in Phase 6.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs font-medium text-slate-500">Total Saved</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">0</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-xs font-medium text-blue-600">Applied</span>
              <p className="text-2xl font-bold text-blue-900 mt-1">0</p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <span className="text-xs font-medium text-purple-600">Interviews</span>
              <p className="text-2xl font-bold text-purple-900 mt-1">0</p>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="text-xs font-medium text-emerald-600">Offers</span>
              <p className="text-2xl font-bold text-emerald-900 mt-1">0</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
