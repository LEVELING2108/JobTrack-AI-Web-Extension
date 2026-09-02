import { KanbanBoard } from '../../components/kanban/KanbanBoard';

export default function KanbanPage() {
  return (
    <div className="p-6 max-w-[1600px] w-full mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Application Kanban Pipeline</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Drag or update your applications through each phase of the hiring lifecycle.
        </p>
      </div>

      <KanbanBoard />
    </div>
  );
}
