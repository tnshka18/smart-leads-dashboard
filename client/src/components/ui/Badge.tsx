import { LeadStatus, LeadSource } from '@/types';

interface StatusBadgeProps { status: LeadStatus }
interface SourceBadgeProps { source: LeadSource }

export function StatusBadge({ status }: StatusBadgeProps) {
  const classMap: Record<LeadStatus, string> = {
    [LeadStatus.NEW]: 'badge-new',
    [LeadStatus.CONTACTED]: 'badge-contacted',
    [LeadStatus.QUALIFIED]: 'badge-qualified',
    [LeadStatus.LOST]: 'badge-lost',
  };
  return (
    <span className={classMap[status]}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
}

const SOURCE_ICONS: Record<LeadSource, string> = {
  [LeadSource.WEBSITE]: '🌐',
  [LeadSource.INSTAGRAM]: '📸',
  [LeadSource.REFERRAL]: '🤝',
};

export function SourceBadge({ source }: SourceBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
      style={{ background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)' }}>
      {SOURCE_ICONS[source]} {source}
    </span>
  );
}
