import { X, Pencil, Trash2 } from 'lucide-react';
import { Lead } from '@/types';
import { StatusBadge, SourceBadge } from '@/components/ui/Badge';

interface LeadDetailProps {
  lead: Lead | null;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

const AVATAR_COLORS = ['#4f7dff','#7c5cff','#22c987','#f59e1a','#e85c9a','#f25757'];

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function LeadDetail({ lead, onClose, onEdit, onDelete }: LeadDetailProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 transition-opacity"
        style={{ background: lead ? 'rgba(0,0,0,.5)' : 'transparent', pointerEvents: lead ? 'all' : 'none' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 w-80 flex flex-col overflow-y-auto transition-transform duration-300"
        style={{
          background: 'var(--bg2)',
          borderLeft: '1px solid var(--border2)',
          transform: lead ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {lead && (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 sticky top-0" style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0"
                style={{ background: getAvatarColor(lead.name) }}>
                {getInitials(lead.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif text-lg truncate" style={{ color: 'var(--text)' }}>{lead.name}</div>
                <div className="text-xs truncate" style={{ color: 'var(--text3)' }}>{lead.email}</div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg flex-shrink-0"
                style={{ color: 'var(--text3)', border: '1px solid var(--border)' }}>
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 px-5 py-4 space-y-6">
              {/* Lead Info */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text3)' }}>Lead Info</p>
                <div className="space-y-0">
                  {[
                    { label: 'Status', value: <StatusBadge status={lead.status} /> },
                    { label: 'Source', value: <SourceBadge source={lead.source} /> },
                    { label: 'Created', value: <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{formatDate(lead.createdAt)}</span> },
                    { label: 'Updated', value: <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{formatDate(lead.updatedAt)}</span> },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                      <span className="text-xs" style={{ color: 'var(--text3)' }}>{label}</span>
                      {value}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {lead.notes && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text3)' }}>Notes</p>
                  <p className="text-sm leading-relaxed p-3 rounded-lg" style={{ background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)' }}>
                    {lead.notes}
                  </p>
                </div>
              )}

              {/* Timeline */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text3)' }}>Activity</p>
                <div className="space-y-3">
                  {[
                    { label: 'Lead created', time: formatDate(lead.createdAt), active: true },
                    { label: 'Status set to ' + lead.status, time: 'On creation', active: true },
                    { label: 'Last updated', time: formatDate(lead.updatedAt), active: lead.createdAt !== lead.updatedAt },
                  ].map(({ label, time, active }) => (
                    <div key={label} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: active ? 'var(--green)' : 'var(--border2)' }} />
                      <div>
                        <p className="text-xs font-medium" style={{ color: 'var(--text2)' }}>{label}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text3)' }}>{time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-4 flex gap-3" style={{ borderTop: '1px solid var(--border)' }}>
              <button onClick={() => onEdit(lead)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white"
                style={{ background: 'var(--accent)' }}>
                <Pencil size={13} /> Edit
              </button>
              <button onClick={() => { onDelete(lead._id); onClose(); }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium"
                style={{ background: 'rgba(242,87,87,.12)', color: 'var(--red)', border: '1px solid rgba(242,87,87,.25)' }}>
                <Trash2 size={13} />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
