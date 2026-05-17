import api from './api';
import {
  Lead,
  CreateLeadDto,
  UpdateLeadDto,
  PaginatedResponse,
  ApiSuccess,
  LeadFilters,
  LeadStats,
} from '@/types';

export const leadService = {
  getLeads: async (filters: Partial<LeadFilters>): Promise<PaginatedResponse<Lead>> => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);

    const response = await api.get<PaginatedResponse<Lead>>(`/leads?${params.toString()}`);
    return response.data;
  },

  getLeadById: async (id: string): Promise<Lead> => {
    const response = await api.get<ApiSuccess<Lead>>(`/leads/${id}`);
    return response.data.data!;
  },

  createLead: async (data: CreateLeadDto): Promise<Lead> => {
    const response = await api.post<ApiSuccess<Lead>>('/leads', data);
    return response.data.data!;
  },

  updateLead: async (id: string, data: UpdateLeadDto): Promise<Lead> => {
    const response = await api.put<ApiSuccess<Lead>>(`/leads/${id}`, data);
    return response.data.data!;
  },

  deleteLead: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },

  getStats: async (): Promise<LeadStats> => {
    const response = await api.get<ApiSuccess<LeadStats>>('/leads/stats');
    return response.data.data!;
  },

  exportCSV: async (filters: Partial<LeadFilters>): Promise<void> => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/leads/export/csv?${params.toString()}`, {
      responseType: 'blob',
    });

    const url = URL.createObjectURL(new Blob([response.data as BlobPart]));
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
