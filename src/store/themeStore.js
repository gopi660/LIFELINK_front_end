import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: 'light',

  setTheme: () => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    localStorage.setItem('lifelink_theme', 'light');
    set({ theme: 'light' });
  },

  toggleTheme: () => {
    // Light theme locked permanently per user request
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    localStorage.setItem('lifelink_theme', 'light');
    set({ theme: 'light' });
  },

  initTheme: () => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    localStorage.setItem('lifelink_theme', 'light');
    set({ theme: 'light' });
  }
}));
