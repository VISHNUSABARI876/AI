import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto py-6 px-8 border-t border-[var(--glass-border)] text-center text-xs text-[var(--text-muted)] flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <ShieldCheck size={16} className="text-[var(--accent-cyan)]" />
        <span>GodsEye AI &copy; {new Date().getFullYear()} - Deep Learning Media Security System</span>
      </div>
      <div className="flex items-center gap-4">
        <a href="#privacy" className="hover:text-[var(--text-primary)] transition-colors">Privacy Policy</a>
        <a href="#terms" className="hover:text-[var(--text-primary)] transition-colors">Terms of Service</a>
        <a href="#docs" className="hover:text-[var(--text-primary)] transition-colors">API Docs</a>
      </div>
    </footer>
  );
};

export default Footer;
