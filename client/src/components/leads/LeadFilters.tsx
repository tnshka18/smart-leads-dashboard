import { Search, X } from 'lucide-react';
import { LeadStatus, LeadSource, SortOrder } from '@/types';
import { useLeadFilterStore } from '@/store/leadFilterStore';

export default function LeadFilters() {
  const { filters, setSearch, setStatus, setSource, setSort, resetFilters } = useLeadFilterStore();

  const hasActiveFilters = filters.search || filters.status || filters.source;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text3)' }} />
          <input
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="input-field pl-9"
          />
        </div>

        {/* Status */}
        <select
          value={filters.status ?? ''}
          onChange={(e) => setStatus(e.target.value as LeadStatus | '')}
          className="input-field min-w-36 w-auto"
        >
          <option value="">All Status</option>
          {Object.values(LeadStatus).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Source */}
        <select
          value={filters.source ?? ''}
          onChange={(e) => setSource(e.target.value as LeadSource | '')}
          className="input-field min-w-36 w-auto"
        >
          <option value="">All Sources</option>
          {Object.values(LeadSource).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Sort */}
        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg2)' }}>
          {[
            { label: 'Latest', value: SortOrder.LATEST },
            { label: 'Oldest', value: SortOrder.OLDEST },
            { label: 'A–Z', value: SortOrder.NAME_ASC },
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSort(value)}
              className="px-3 py-2 text-xs font-medium transition-all"
              style={{
                background: filters.sort === value ? 'var(--bg4)' : 'transparent',
                color: filters.sort === value ? 'var(--text)' : 'var(--text3)',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <button onClick={resetFilters} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
            style={{ color: 'var(--red)', background: 'rgba(242,87,87,.08)', border: '1px solid rgba(242,87,87,.2)' }}>
            <X size={12} /> Clear filters
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(79,125,255,.12)', color: 'var(--accent)', border: '1px solid rgba(79,125,255,.25)' }}>
              Search: "{filters.search}"
              <button onClick={() => setSearch('')}><X size={10} /></button>
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(79,125,255,.12)', color: 'var(--accent)', border: '1px solid rgba(79,125,255,.25)' }}>
              Status: {filters.status}
              <button onClick={() => setStatus('')}><X size={10} /></button>
            </span>
          )}
          {filters.source && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(79,125,255,.12)', color: 'var(--accent)', border: '1px solid rgba(79,125,255,.25)' }}>
              Source: {filters.source}
              <button onClick={() => setSource('')}><X size={10} /></button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
