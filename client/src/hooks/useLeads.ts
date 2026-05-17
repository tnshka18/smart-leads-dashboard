import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { leadService } from '@/services/leadService';
import { useLeadFilterStore } from '@/store/leadFilterStore';
import { CreateLeadDto, UpdateLeadDto } from '@/types';

// ─── useDebounce ──────────────────────────────────────────────────────────────

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ─── useLeads ─────────────────────────────────────────────────────────────────

export function useLeads() {
  const { filters } = useLeadFilterStore();
  const debouncedSearch = useDebounce(filters.search, 400);
  const queryClient = useQueryClient();

  const queryFilters = { ...filters, search: debouncedSearch };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['leads', queryFilters],
    queryFn: () => leadService.getLeads(queryFilters),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['lead-stats'],
    queryFn: leadService.getStats,
    staleTime: 60_000,
  });

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['leads'] });
    void queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
  }, [queryClient]);

  // Create
  const createMutation = useMutation({
    mutationFn: (data: CreateLeadDto) => leadService.createLead(data),
    onSuccess: () => {
      toast.success('Lead created successfully!');
      invalidate();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to create lead');
    },
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadDto }) =>
      leadService.updateLead(id, data),
    onSuccess: () => {
      toast.success('Lead updated successfully!');
      invalidate();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update lead');
    },
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadService.deleteLead(id),
    onSuccess: () => {
      toast.success('Lead deleted');
      invalidate();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete lead');
    },
  });

  // Export CSV
  const exportCSV = useCallback(async () => {
    try {
      await leadService.exportCSV(queryFilters);
      toast.success('CSV exported successfully!');
    } catch {
      toast.error('Failed to export CSV');
    }
  }, [queryFilters]);

  return {
    leads: data?.data ?? [],
    pagination: data?.pagination,
    stats: statsData,
    isLoading,
    statsLoading,
    isError,
    error,
    createLead: createMutation.mutate,
    updateLead: updateMutation.mutate,
    deleteLead: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    exportCSV,
  };
}
