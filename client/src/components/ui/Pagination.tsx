import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '@/types';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { currentPage, totalPages, totalCount, limit } = pagination;
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalCount);

  const pages: (number | '...')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
      <span className="text-xs" style={{ color: 'var(--text3)' }}>
        Showing {start}–{end} of {totalCount}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
          style={{ border: '1px solid var(--border)', color: 'var(--text2)', background: 'transparent' }}
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((page, i) =>
          page === '...' ? (
            <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-xs"
              style={{ color: 'var(--text3)' }}>…</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all"
              style={{
                background: page === currentPage ? 'var(--accent)' : 'transparent',
                color: page === currentPage ? '#fff' : 'var(--text2)',
                border: `1px solid ${page === currentPage ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
          style={{ border: '1px solid var(--border)', color: 'var(--text2)', background: 'transparent' }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
