// ─── Enums ────────────────────────────────────────────────────────────────────

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  LOST = 'Lost',
}

export enum LeadSource {
  WEBSITE = 'Website',
  INSTAGRAM = 'Instagram',
  REFERRAL = 'Referral',
}

export enum UserRole {
  ADMIN = 'Admin',
  SALES = 'Sales',
}

export enum SortOrder {
  LATEST = 'latest',
  OLDEST = 'oldest',
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// ─── Lead ─────────────────────────────────────────────────────────────────────

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  createdBy: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadDto {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
  notes?: string;
}

export interface UpdateLeadDto {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
  notes?: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  message?: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  success: true;
  token: string;
  user: User;
  message: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface LeadFilters {
  page: number;
  limit: number;
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search: string;
  sort: SortOrder;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
}
