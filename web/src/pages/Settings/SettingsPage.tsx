import { Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-4xl w-full mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Account & Preferences</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your profile and extension connections.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">{user?.name}</h3>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium">User Account ID</label>
            <p className="font-semibold text-slate-800 mt-0.5">#{user?.id}</p>
          </div>
          <div>
            <label className="block text-slate-400 font-medium">Authentication Method</label>
            <p className="font-semibold text-slate-800 mt-0.5">Stateless JWT (HMAC-SHA256)</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Chrome Extension Connection</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          The JobTrack Chrome Extension uses your account JWT session to save jobs from LinkedIn, Indeed,
          and company portals directly to your dashboard.
        </p>
      </div>
    </div>
  );
}
