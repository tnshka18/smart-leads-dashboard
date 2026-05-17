import { useState } from 'react';
import { Pencil, Trash2, ChevronRight } from 'lucide-react';
import { Lead } from '@/types';
import { StatusBadge, SourceBadge } from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import { PaginationMeta } from '@/types';

interface LeadsTableProps {
  leads: Lead[];
  pagination?: PaginationMeta;
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onRowClick: (lead: Lead) => void;
  onPageChange: (page: number) => void;
}

const AVATAR_COLORS = ['#4f7dff','#7c5cff','#22c987','#f59e1a','#e85c9a','#f25757'];
function getInitials(name: string) { return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2); }
function getColor(name: string) {
  let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function fmtDate(iso: string) {
  const d = new Date(iso); const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return 'Today'; if (diff === 1) return 'Yesterday'; if (diff < 7) return `${diff}d ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
}

function SkeletonRow() {
  return (
    <tr>
      {[1,2,3,4,5].map(i => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded animate-pulse" style={{ background: 'var(--bg3)', width: i === 1 ? '160px' : i === 5 ? '80px' : '90px' }} />
        </td>
      ))}
    </tr>
  );
}

export default function LeadsTable({ leads, pagination, isLoading, onEdit, onDelete, onRowClick, onPageChange }: LeadsTableProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Name & Email', 'Status', 'Source', 'Created', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text3)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <div className="text-4xl mb-3 opacity-20">🔍</div>
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--text2)' }}>No leads found</p>
                  <p className="text-xs" style={{ color: 'var(--text3)' }}>Try adjusting your filters or add a new lead</p>
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead._id}
                  onClick={() => onRowClick(lead)}
                  onMouseEnter={() => setHoveredId(lead._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer transition-colors"
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: hoveredId === lead._id ? 'rgba(255,255,255,.02)' : 'transparent',
                  }}
                >
                  {/* Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: getColor(lead.name) }}>
                        {getInitials(lead.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{lead.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text3)' }}>{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                  {/* Source */}
                  <td className="px-4 py-3"><SourceBadge source={lead.source} /></td>
                  {/* Date */}
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text3)' }}>{fmtDate(lead.createdAt)}</td>
                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1.5 justify-end transition-opacity ${hoveredId === lead._id ? 'opacity-100' : 'opacity-0'}`}>
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(lead); }}
                        className="w-7 h-7 rounded-md flex items-center justify-center transition-all"
                        style={{ border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--text2)' }}
                        title="Edit"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(lead._id); }}
                        className="w-7 h-7 rounded-md flex items-center justify-center transition-all"
                        style={{ border: '1px solid rgba(242,87,87,.25)', background: 'rgba(242,87,87,.08)', color: 'var(--red)' }}
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                      <ChevronRight size={14} style={{ color: 'var(--text3)' }} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pagination && pagination.totalCount > 0 && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  );
}
