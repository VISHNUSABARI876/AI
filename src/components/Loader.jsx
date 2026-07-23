import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';

export const ScannerLoader = ({ progress = 0, statusText = 'Analyzing neural frame vectors...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center">
      <div className="relative w-48 h-48 rounded-2xl overflow-hidden glass-card flex items-center justify-center border-2 border-[var(--accent-cyan)] shadow-[var(--glow-cyan)]">
        <Cpu size={64} className="text-[var(--accent-cyan)] animate-pulse" />
        <div className="scanner-laser"></div>
      </div>
      
      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-[var(--text-secondary)]">{statusText}</span>
          <span className="text-[var(--accent-cyan)] font-mono">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden p-0.5 border border-[var(--glass-border)]">
          <div 
            className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-[var(--accent-cyan)] via-[var(--accent-blue)] to-[var(--accent-purple)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-16 w-full skeleton"></div>
      ))}
    </div>
  );
};

export default ScannerLoader;
