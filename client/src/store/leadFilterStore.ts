import { create } from 'zustand';
import { LeadFilters, LeadSource, LeadStatus, SortOrder } from '@/types';

interface LeadFilterState {
  filters: LeadFilters;
  setSearch: (search: string) => void;
  setStatus: (status: LeadStatus | '') => void;
  setSource: (source: LeadSource | '') => void;
  setSort: (sort: SortOrder) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const defaultFilters: LeadFilters = {
  page: 1,
  limit: 10,
  status: '',
  source: '',
  search: '',
  sort: SortOrder.LATEST,
};

export const useLeadFilterStore = create<LeadFilterState>((set) => ({
  filters: defaultFilters,

  setSearch: (search) =>
    set((state) => ({ filters: { ...state.filters, search, page: 1 } })),

  setStatus: (status) =>
    set((state) => ({ filters: { ...state.filters, status, page: 1 } })),

  setSource: (source) =>
    set((state) => ({ filters: { ...state.filters, source, page: 1 } })),

  setSort: (sort) =>
    set((state) => ({ filters: { ...state.filters, sort, page: 1 } })),

  setPage: (page) =>
    set((state) => ({ filters: { ...state.filters, page } })),

  resetFilters: () => set({ filters: defaultFilters }),
}));
