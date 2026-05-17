import api from './api';
import { AuthResponse, LoginDto, RegisterDto, User } from '@/types';

export const authService = {
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<{ success: true; data: User }>('/auth/me');
    return response.data.data;
  },
};
