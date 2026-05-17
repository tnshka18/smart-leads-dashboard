import { PaginationMeta } from '../types';

export function buildPaginationMeta(
  totalCount: number,
  currentPage: number,
  limit: number
): PaginationMeta {
  const totalPages = Math.ceil(totalCount / limit);
  return {
    currentPage,
    totalPages,
    totalCount,
    limit,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}
