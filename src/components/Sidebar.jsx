import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  History as HistoryIcon, 
  Settings as SettingsIcon,
  LogIn,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Image Detection', path: '/image-detection', icon: ImageIcon },
    { label: 'Video Detection', path: '/video-detection', icon: VideoIcon },
    { label: 'Analysis History', path: '/history', icon: HistoryIcon },
    { label: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <aside
      className={`fixed top-[var(--navbar-height)] left-0 bottom-0 z-30 glass-nav border-r border-[var(--glass-border)] flex flex-col justify-between transition-all duration-300 ${
        isOpen ? 'w-[var(--sidebar-width)]' : 'w-[var(--sidebar-collapsed-width)]'
      }`}
    >
      <div className="py-6 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-decoration-none ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 font-semibold border-l-4 border-l-blue-500'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.04)]'
                }`
              }
            >
              <Icon size={20} className="min-w-[20px]" />
              {isOpen && <span className="text-sm font-semibold truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 border-t border-[var(--glass-border)]">
        {user ? (
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} className="min-w-[20px]" />
            {isOpen && <span className="text-sm font-semibold">Sign Out</span>}
          </button>
        ) : (
          <NavLink
            to="/login"
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-blue-400 hover:bg-blue-500/10 transition-colors text-decoration-none"
          >
            <LogIn size={20} className="min-w-[20px]" />
            {isOpen && <span className="text-sm font-semibold">Sign In</span>}
          </NavLink>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
