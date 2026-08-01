import api from './axios';

export const requestsApi = {
  createRequest: (requestData) => api.post('/requests', requestData),
  getRequests: (params) => api.get('/requests', { params }),
  getRequestDetails: (id) => api.get(`/requests/${id}`),
  updateRequestStatus: (id, statusData) => api.put(`/requests/${id}`, statusData),
  deleteRequest: (id) => api.delete(`/requests/${id}`),
};
