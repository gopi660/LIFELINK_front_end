import api from './axios';

export const adminApi = {
  getUsers: (role) => api.get('/admin/users', { params: { role } }),
  verifyDonor: (userId) => api.put(`/admin/users/${userId}/verify`),
  toggleBlockUser: (userId) => api.put(`/admin/users/${userId}/block`),
  removeUser: (userId) => api.delete(`/admin/users/${userId}`),
  getAnalytics: () => api.get('/admin/analytics'),
  exportData: (type) => api.get(`/admin/export`, { params: { type }, responseType: 'blob' }),
};
