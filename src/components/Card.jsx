import React from 'react';

const Card = ({ children, className = '', title, subtitle, icon: Icon, action }) => {
  return (
    <div className={`glass-card p-6 ${className}`}>
      {(title || Icon || action) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2.5 rounded-12 bg-[rgba(0,242,254,0.1)] text-[var(--accent-cyan)] border border-[rgba(0,242,254,0.2)]">
                <Icon size={20} />
              </div>
            )}
            <div>
              {title && <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>}
              {subtitle && <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
