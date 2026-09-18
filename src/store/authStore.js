import { create } from 'zustand';
import { authApi } from '../api/auth';
import toast from 'react-hot-toast';

const getSavedUser = () => {
  try {
    const raw = localStorage.getItem('lifelink_user');
    return raw && raw !== 'undefined' ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
  user: getSavedUser(),
  token: localStorage.getItem('lifelink_token') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.login({ email, password });
      const { access_token, user } = res.data;
      
      localStorage.setItem('lifelink_token', access_token);
      localStorage.setItem('lifelink_user', JSON.stringify(user));
      
      set({ token: access_token, user, loading: false });
      toast.success(`Welcome back, ${user.name}!`);
      return user;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed. Check credentials.';
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.register(userData);
      const { access_token, user } = res.data;

      localStorage.setItem('lifelink_token', access_token);
      localStorage.setItem('lifelink_user', JSON.stringify(user));

      set({ token: access_token, user, loading: false });
      toast.success(`Account registered successfully!`);
      return user;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed.';
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  },

  fetchMe: async () => {
    if (!get().token) return;
    try {
      const res = await authApi.getMe();
      const user = res.data.user;
      localStorage.setItem('lifelink_user', JSON.stringify(user));
      set({ user });
    } catch (err) {
      if (err.response?.status === 401) {
        get().logout();
      }
    }
  },

  updateProfile: async (data) => {
    set({ loading: true });
    try {
      const res = await authApi.updateProfile(data);
      const user = res.data.user;
      localStorage.setItem('lifelink_user', JSON.stringify(user));
      set({ user, loading: false });
      toast.success('Profile updated successfully!');
      return user;
    } catch (err) {
      set({ loading: false });
      toast.error(err.response?.data?.error || 'Failed to update profile');
    }
  },

  logout: () => {
    localStorage.removeItem('lifelink_token');
    localStorage.removeItem('lifelink_user');
    set({ user: null, token: null });
    toast.success('Logged out');
  }
}));
