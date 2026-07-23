import React from 'react';
import { Menu, Sun, Moon, Eye, Shield, Bell, User } from 'lucide-react';
import useTheme from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-0 h-[var(--navbar-height)] z-40 glass-nav flex items-center justify-between px-6 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.06)] transition-all"
          title="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>

        <Link to="/" className="flex items-center gap-3 text-decoration-none">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
            <Eye className="text-white font-bold" size={22} />
          </div>
          <span className="font-bold text-xl tracking-tight text-[var(--text-primary)] hidden sm:inline">
            Gods<span className="text-blue-500">Eye</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Neural Engine Active
        </div>

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.06)] transition-all"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-400" />}
        </button>
      </div>
    </header>

  );
};

export default Navbar;
