import { create } from 'zustand';

export const useThemeStore = create((set, get) => ({
  theme: localStorage.getItem('lifelink_theme') || 'dark',

  setTheme: (newTheme) => {
    localStorage.setItem('lifelink_theme', newTheme);
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    set({ theme: newTheme });
  },

  toggleTheme: () => {
    const current = get().theme;
    const next = current === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },

  initTheme: () => {
    const saved = localStorage.getItem('lifelink_theme') || 'dark';
    get().setTheme(saved);
  }
}));
