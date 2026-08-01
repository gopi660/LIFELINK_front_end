import { create } from 'zustand';
import { donorsApi } from '../api/donors';
import toast from 'react-hot-toast';

export const useDonorStore = create((set) => ({
  nearbyDonors: [],
  loading: false,

  fetchNearbyDonors: async (params = {}) => {
    set({ loading: true });
    try {
      const res = await donorsApi.getNearbyDonors(params);
      set({ nearbyDonors: res.data.donors, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  toggleAvailability: async (currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const res = await donorsApi.toggleAvailability(newStatus);
      toast.success(res.data.message);
      return res.data.availability;
    } catch {
      toast.error('Failed to toggle availability');
    }
  },

  respondToRequest: async (requestId, response, notes) => {
    try {
      const res = await donorsApi.respondToRequest(requestId, response, notes);
      toast.success(res.data.message);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit response');
    }
  }
}));
