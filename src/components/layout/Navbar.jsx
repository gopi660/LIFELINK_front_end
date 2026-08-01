import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useThemeStore } from '../../store/themeStore';
import { 
  HeartPulse, 
  Bell, 
  User, 
  LogOut, 
  PlusCircle, 
  Map, 
  Shield, 
  Menu, 
  X,
  Activity,
  Sun,
  Moon,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { unreadCount, fetchNotifications } = useNotificationStore();
  const { theme, toggleTheme, initTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    initTheme();
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user, initTheme, fetchNotifications]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-[#070a13]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 via-red-600 to-rose-700 flex items-center justify-center shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-all duration-300">
                <HeartPulse className="w-5 h-5 text-white animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#070a13]"></span>
            </div>
            <div>
              <span className="text-xl font-heading font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-0.5">
                Life<span className="text-rose-600 dark:text-rose-500">Link</span>
              </span>
              <span className="block text-[9px] uppercase font-extrabold text-slate-400 dark:text-slate-400 -mt-1 tracking-widest">
                Emergency Dispatch System
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md">
            <Link 
              to="/" 
              className={`text-xs font-extrabold px-4 py-2 rounded-xl transition-all ${
                isActive('/') 
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-md font-bold' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Home
            </Link>

            <Link 
              to="/map" 
              className={`text-xs font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                isActive('/map') 
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-md font-bold' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5 text-rose-500" />
              Live Radar Map
            </Link>

            <Link 
              to="/about" 
              className={`text-xs font-extrabold px-4 py-2 rounded-xl transition-all ${
                isActive('/about') 
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-md font-bold' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Compatibility Guide
            </Link>

            {user && (
              <>
                <Link 
                  to="/donor-dashboard" 
                  className={`text-xs font-extrabold px-4 py-2 rounded-xl transition-all ${
                    isActive('/donor-dashboard') 
                      ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-md font-bold' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Donor Portal
                </Link>

                <Link 
                  to="/my-requests" 
                  className={`text-xs font-extrabold px-4 py-2 rounded-xl transition-all ${
                    isActive('/my-requests') 
                      ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-md font-bold' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  My Requests
                </Link>

                {user.role === 'admin' && (
                  <Link 
                    to="/admin-dashboard" 
                    className={`text-xs font-extrabold px-3 py-2 rounded-xl text-amber-600 dark:text-amber-400 hover:text-amber-500 flex items-center gap-1.5 ${
                      isActive('/admin-dashboard') ? 'bg-amber-500/10 border border-amber-500/30' : ''
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Action CTAs & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* Request Blood Button */}
            <Link 
              to="/request-blood"
              className="bg-gradient-to-r from-rose-500 via-red-600 to-rose-600 hover:from-rose-600 hover:to-red-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-rose-600/35 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:scale-95 border-t border-white/20"
            >
              <PlusCircle className="w-4 h-4" />
              Post Request
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <Link 
                  to="/notifications" 
                  className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse border-2 border-[#070a13]">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Menu Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
                  >
                    <img 
                      src={user.donor_profile?.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                      alt="User avatar" 
                      className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 object-cover border border-slate-300 dark:border-slate-700"
                    />
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {profileDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-60 glass-card rounded-2xl shadow-2xl py-2 z-50 border border-slate-200 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-3">
                        <p className="text-xs font-black text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user.email}</p>
                        {user.donor_profile && (
                          <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-extrabold rounded-md border border-rose-500/20">
                            <Sparkles className="w-2.5 h-2.5" /> Group: {user.donor_profile.blood_group}
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors">
                          <User className="w-4 h-4 text-slate-400" />
                          My Donor Profile
                        </Link>

                        <Link to="/settings" className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors">
                          <Activity className="w-4 h-4 text-slate-400" />
                          Account Settings
                        </Link>
                      </div>

                      <div className="py-1">
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login"
                  className="text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  Log In
                </Link>
                <Link 
                  to="/register"
                  className="text-xs font-extrabold bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white px-4 py-2 rounded-xl border border-slate-700 transition-all shadow-sm"
                >
                  Register Donor
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions & Menu */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <Link 
              to="/request-blood"
              className="bg-rose-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Request
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 dark:text-slate-200 font-bold text-sm">Home</Link>
          <Link to="/map" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 dark:text-slate-200 font-bold text-sm">Live Map</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 dark:text-slate-200 font-bold text-sm">Compatibility Guide</Link>
          {user ? (
            <>
              <Link to="/donor-dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 dark:text-slate-200 font-bold text-sm">Donor Portal</Link>
              <Link to="/my-requests" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 dark:text-slate-200 font-bold text-sm">My Requests</Link>
              <Link to="/notifications" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 dark:text-slate-200 font-bold text-sm">Notifications ({unreadCount})</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 dark:text-slate-200 font-bold text-sm">My Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin-dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-amber-600 dark:text-amber-400 font-extrabold text-sm">Admin Dashboard</Link>
              )}
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-rose-600 dark:text-rose-400 font-bold text-sm">Sign Out</button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white font-bold text-sm">Log In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2 bg-rose-600 rounded-xl text-white font-bold text-sm">Register Donor</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
