import { ApplicationsTable } from '../../components/applications/ApplicationsTable';

export default function ApplicationsPage() {
  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">All Tracked Applications</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Filter, search, and manage your complete portfolio of job applications.
        </p>
      </div>

      <ApplicationsTable />
    </div>
  );
}
