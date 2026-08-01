import api from './axios';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  verifyEmail: (email) => api.post('/auth/verify-email', { email }),
  verifyPhone: (phone, otp) => api.post('/auth/verify-phone', { phone, otp }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
};
