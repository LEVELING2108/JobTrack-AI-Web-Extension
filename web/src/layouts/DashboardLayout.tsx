import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  Briefcase,
  LayoutDashboard,
  Kanban,
  TableProperties,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Menu,
  X,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AddApplicationModal from '../components/applications/AddApplicationModal';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Kanban Pipeline', path: '/kanban', icon: Kanban },
    { label: 'All Applications', path: '/applications', icon: TableProperties },
    { label: 'Interviews', path: '/interviews', icon: Calendar },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 justify-between">
        <div>
          <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-100">
            <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-sm">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base text-slate-900 leading-tight">JobTrack</h1>
              <p className="text-[10px] text-slate-400 font-medium">Application Manager</p>
            </div>
          </div>

          <div className="px-4 py-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
            >
              <Plus className="w-4 h-4" /> Add Application
            </button>
          </div>

          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs border border-slate-200">
                {user?.name ? user.name[0].toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-800 truncate max-w-[110px]">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[110px]">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-1.5 rounded-md">
            <Briefcase className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-slate-900">JobTrack</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="p-1.5 bg-indigo-600 text-white rounded-md text-xs"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-600 rounded-md hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs pt-14">
          <div className="bg-white p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-500">{user?.email}</span>
              <button onClick={logout} className="text-xs text-rose-600 font-semibold">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 md:pt-0 pt-14 overflow-y-auto">
        <Outlet />
      </main>

      {isAddModalOpen && <AddApplicationModal onClose={() => setIsAddModalOpen(false)} />}
    </div>
  );
}
