
import api from './api';

export interface MatchData {
  donationId: number;
  requestId: number;
}

export const ngoService = {
  async getDonations(ngoId: number) {
    const response = await api.get(`/ngo/donations/${ngoId}`);
    return response.data;
  },

  async getRequests(ngoId: number) {
    const response = await api.get(`/ngo/requests/${ngoId}`);
    return response.data;
  },

  async matchDonationToRequest(data: MatchData) {
    const response = await api.post('/ngo/match', data);
    return response.data;
  },

  async getDistributions(ngoId: number) {
    const response = await api.get(`/ngo/distributions/${ngoId}`);
    return response.data;
  },

  async updateProfile(id: number, data: any) {
    const response = await api.put(`/ngo/profile/${id}`, data);
    return response.data;
  }
};
