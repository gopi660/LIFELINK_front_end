import api from './axios';

export const donorsApi = {
  registerDonor: (donorData) => api.post('/donors/register', donorData),
  getNearbyDonors: (params) => api.get('/donors/nearby', { params }),
  toggleAvailability: (availability) => api.put('/donors/availability', { availability }),
  respondToRequest: (requestId, response, notes) => api.post(`/donors/respond/${requestId}`, { response, notes }),
  getPublicStats: () => api.get('/donors/public-stats'),
};
