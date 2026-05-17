import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface StatCardProps {
  label: string;
  value: number;
  change?: string;
  icon: ReactNode;
  color: 'blue' | 'green' | 'amber' | 'red';
  onClick?: () => void;
}

const colorMap = {
  blue:  { text: '#4f7dff', bg: 'rgba(79,125,255,.08)',  icon: 'rgba(79,125,255,.14)'  },
  green: { text: '#22c987', bg: 'rgba(34,201,135,.08)',  icon: 'rgba(34,201,135,.14)'  },
  amber: { text: '#f59e1a', bg: 'rgba(245,158,26,.08)',  icon: 'rgba(245,158,26,.14)'  },
  red:   { text: '#f25757', bg: 'rgba(242,87,87,.08)',   icon: 'rgba(242,87,87,.14)'   },
};

export default function StatCard({ label, value, change, icon, color, onClick }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div
      onClick={onClick}
      className={clsx('relative overflow-hidden p-5 rounded-xl transition-all', onClick && 'cursor-pointer')}
      style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
    >
      <div className="absolute top-4 right-4 w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ background: c.icon, color: c.text }}>
        {icon}
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text3)' }}>{label}</p>
      <p className="text-4xl font-serif mb-1" style={{ color: c.text }}>{value}</p>
      {change && <p className="text-xs" style={{ color: 'var(--text3)' }}>{change}</p>}
    </div>
  );
}
