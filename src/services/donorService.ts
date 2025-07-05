
import api from './api';

export interface DonationData {
  ngoId: number;
  type: 'money' | 'item';
  amount?: number;
  itemName?: string;
  quantity?: number;
}

export const donorService = {
  async getNGOs() {
    const response = await api.get('/donor/ngos');
    return response.data;
  },

  async donate(data: DonationData) {
    const response = await api.post('/donor/donate', data);
    return response.data;
  },

  async getDonationHistory(donorId: number) {
    const response = await api.get(`/donor/donations/${donorId}`);
    return response.data;
  },

  async getDonationImpact(donorId: number) {
    const response = await api.get(`/donor/impact/${donorId}`);
    return response.data;
  }
};
