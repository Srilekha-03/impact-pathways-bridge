
import api from './api';

export interface RequestData {
  ngoId: number;
  type: 'money' | 'item';
  amount?: number;
  itemName?: string;
  quantity?: number;
}

export const orphanageService = {
  async getNGOs() {
    const response = await api.get('/orphanage/ngos');
    return response.data;
  },

  async submitRequest(data: RequestData) {
    const response = await api.post('/orphanage/request', data);
    return response.data;
  },

  async getRequestHistory(orphanageId: number) {
    const response = await api.get(`/orphanage/requests/history/${orphanageId}`);
    return response.data;
  },

  async getAcceptedRequests(orphanageId: number) {
    const response = await api.get(`/orphanage/requests/accepted/${orphanageId}`);
    return response.data;
  },

  async updateProfile(id: number, data: any) {
    const response = await api.put(`/orphanage/profile/${id}`, data);
    return response.data;
  }
};
