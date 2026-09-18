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
      const list = Array.isArray(res?.data?.donors) ? res.data.donors : [];
      set({ nearbyDonors: list, loading: false });
    } catch {
      set({ nearbyDonors: [], loading: false });
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

  respondedMap: {},

  respondToRequest: async (requestId, response, notes) => {
    try {
      const res = await donorsApi.respondToRequest(requestId, response, notes);
      toast.success(res.data.message || `Response recorded: ${response}`);
      set((state) => ({
        respondedMap: {
          ...state.respondedMap,
          [requestId]: response
        }
      }));
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to submit response';
      toast.error(msg);
      throw new Error(msg);
    }
  }
}));
