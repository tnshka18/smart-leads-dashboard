import { Request } from 'express';
import { Types } from 'mongoose';

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

// ─── User Types ───────────────────────────────────────────────────────────────

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserPublic {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

// ─── Lead Types ───────────────────────────────────────────────────────────────

export interface ILead {
  _id: Types.ObjectId;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadDocument extends ILead {}

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

// ─── Query / Pagination ───────────────────────────────────────────────────────

export interface LeadQueryParams {
  page?: string;
  limit?: string;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: SortOrder;
}

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

// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  success: true;
  token: string;
  user: IUserPublic;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  message?: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>[];
  stack?: string;
}

// ─── Extended Request ─────────────────────────────────────────────────────────

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
