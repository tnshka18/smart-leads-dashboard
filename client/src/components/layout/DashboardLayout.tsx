import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Settings, User, LogOut, Zap,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'U';

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside
        className="w-56 flex flex-col sticky top-0 h-screen flex-shrink-0"
        style={{ background: 'var(--bg2)', borderRight: '1px solid var(--border)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #4f7dff, #7c5cff)' }}>
            <Zap size={15} color="#fff" />
          </div>
          <span className="font-serif text-[17px]" style={{ color: 'var(--text)' }}>LeadsIQ</span>
          <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(79,125,255,.12)', color: 'var(--accent)' }}>v2</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          <p className="text-[10px] font-semibold px-3 py-2 uppercase tracking-widest" style={{ color: 'var(--text3)' }}>
            Dashboard
          </p>
          <NavLink to="/" end className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${isActive
              ? 'font-medium'
              : 'hover:opacity-80'}`
          } style={({ isActive }) => ({
            background: isActive ? 'rgba(79,125,255,.12)' : 'transparent',
            color: isActive ? 'var(--accent)' : 'var(--text2)',
          })}>
            <LayoutDashboard size={16} />
            Overview
          </NavLink>
          <NavLink to="/" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all"
            style={{ color: 'var(--text2)' }}>
            <Users size={16} />
            Leads
          </NavLink>

          <p className="text-[10px] font-semibold px-3 pt-4 pb-1 uppercase tracking-widest" style={{ color: 'var(--text3)' }}>
            Settings
          </p>
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left"
            style={{ color: 'var(--text2)' }}>
            <User size={16} />
            Profile
          </button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left"
            style={{ color: 'var(--text2)' }}>
            <Settings size={16} />
            Settings
          </button>
        </nav>

        {/* User */}
        <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ background: 'var(--bg3)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #4f7dff, #e85c9a)' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{user?.name}</div>
              <div className="text-[11px] truncate" style={{ color: 'var(--text3)' }}>{user?.email}</div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="flex-shrink-0 p-1 rounded transition-colors"
              style={{ color: 'var(--text3)' }}
            >
              <LogOut size={14} />
            </button>
          </div>
          <div className="mt-2 text-center">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded"
              style={{
                background: user?.role === UserRole.ADMIN ? 'rgba(34,201,135,.12)' : 'rgba(245,158,26,.12)',
                color: user?.role === UserRole.ADMIN ? 'var(--green)' : 'var(--amber)',
              }}>
              {user?.role}
            </span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
