
import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'donor' | 'ngo' | 'orphanage';
  description?: string;
  experience?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
  description?: string;
  experience?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(data: LoginData) {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }
};
