import { create } from 'zustand';
import { requestsApi } from '../api/requests';
import toast from 'react-hot-toast';

export const useRequestStore = create((set) => ({
  requests: [],
  myRequests: [],
  selectedRequest: null,
  loading: false,
  error: null,

  fetchRequests: async (filters = {}) => {
    set({ loading: true });
    try {
      const res = await requestsApi.getRequests(filters);
      set({ requests: res.data.requests, loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  fetchMyRequests: async (userId) => {
    if (!userId) return;
    set({ loading: true });
    try {
      const res = await requestsApi.getRequests({ my_requests: 'true', user_id: userId });
      set({ myRequests: res.data.requests, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchRequestDetails: async (id) => {
    set({ loading: true });
    try {
      const res = await requestsApi.getRequestDetails(id);
      set({ selectedRequest: res.data.request, loading: false });
      return res.data.request;
    } catch {
      set({ loading: false });
      toast.error('Failed to load request details');
    }
  },

  createBloodRequest: async (formData) => {
    set({ loading: true });
    try {
      const res = await requestsApi.createRequest(formData);
      toast.success('Emergency blood request posted! Donors are being notified.');
      set({ loading: false });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to submit request';
      toast.error(msg);
      set({ loading: false });
      throw new Error(msg);
    }
  },

  updateStatus: async (id, status) => {
    try {
      const res = await requestsApi.updateRequestStatus(id, { status });
      toast.success(`Request status updated to: ${status}`);
      set((state) => ({
        requests: state.requests.map((r) => (r.id === id ? { ...r, status } : r)),
        myRequests: state.myRequests.map((r) => (r.id === id ? { ...r, status } : r)),
      }));
      return res.data;
    } catch {
      toast.error('Failed to update status');
    }
  }
}));
