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
  ChevronDown,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { unreadCount, fetchNotifications } = useNotificationStore();
  const { initTheme } = useThemeStore();
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
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo (Water drop shape, red colour) */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 flex items-center justify-center text-red-600 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <svg className="w-8 h-8 fill-red-600 text-red-600" viewBox="0 0 24 24">
                <path d="M12 2C12 2 4.5 10.5 4.5 15.5C4.5 19.64 7.86 23 12 23C16.14 23 19.5 19.64 19.5 15.5C19.5 10.5 12 2 12 2Z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                LifeLink
              </span>
              <span className="block text-[11px] uppercase font-semibold text-slate-500 -mt-0.5 tracking-wider">
                Emergency Dispatch System
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200/80">
            <Link 
              to="/" 
              className={`text-sm px-4 py-2 rounded-lg transition-all ${
                isActive('/') 
                  ? 'bg-white text-red-600 shadow-sm font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
              }`}
            >
              Home
            </Link>

            <Link 
              to="/map" 
              className={`text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                isActive('/map') 
                  ? 'bg-white text-red-600 shadow-sm font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
              }`}
            >
              <Map className="w-4 h-4 text-red-600" />
              Live Radar Map
            </Link>

            <Link 
              to="/about" 
              className={`text-sm px-4 py-2 rounded-lg transition-all ${
                isActive('/about') 
                  ? 'bg-white text-red-600 shadow-sm font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
              }`}
            >
              Compatibility Guide
            </Link>

            {user && (
              <>
                <Link 
                  to="/donor-dashboard" 
                  className={`text-sm px-4 py-2 rounded-lg transition-all ${
                    isActive('/donor-dashboard') 
                      ? 'bg-white text-red-600 shadow-sm font-semibold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
                  }`}
                >
                  Donor Portal
                </Link>

                <Link 
                  to="/my-requests" 
                  className={`text-sm px-4 py-2 rounded-lg transition-all ${
                    isActive('/my-requests') 
                      ? 'bg-white text-red-600 shadow-sm font-semibold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
                  }`}
                >
                  My Requests
                </Link>

                {user.role === 'admin' && (
                  <Link 
                    to="/admin-dashboard" 
                    className={`text-sm px-3.5 py-2 rounded-lg text-amber-700 hover:text-amber-800 flex items-center gap-1.5 font-semibold ${
                      isActive('/admin-dashboard') ? 'bg-amber-100/80 border border-amber-300' : ''
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Action CTAs (No Dark/Light switch) */}
          <div className="hidden md:flex items-center gap-2.5">
            
            {/* Request Blood Button */}
            <Link 
              to={user ? "/request-blood" : "/login"}
              state={user ? undefined : { from: { pathname: '/request-blood' }, message: 'Please sign in or create an account to post an emergency blood request.' }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Post Request
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <Link 
                  to="/notifications" 
                  aria-label="Notifications"
                  className="relative p-2 text-slate-600 hover:text-slate-900 rounded-xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Menu Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
                  >
                    <img 
                      src={user.donor_profile?.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                      alt="User avatar" 
                      className="w-7 h-7 rounded-lg bg-slate-200 object-cover border border-slate-200"
                    />
                    <span className="text-xs font-semibold text-slate-800 max-w-[95px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {profileDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-60 glass-card rounded-xl shadow-xl py-1 z-50 border border-slate-200 divide-y divide-slate-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-3">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.email}</p>
                        {user.donor_profile && (
                          <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-red-50 text-red-700 text-[10px] font-semibold rounded-md border border-red-200">
                            <Sparkles className="w-2.5 h-2.5" /> Group: {user.donor_profile.blood_group}
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                          <User className="w-4 h-4 text-slate-400" />
                          My Donor Profile
                        </Link>

                        <Link to="/settings" className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                          <Activity className="w-4 h-4 text-slate-400" />
                          Account Settings
                        </Link>
                      </div>

                      <div className="py-1">
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
              <div className="flex items-center gap-2.5">
                <Link 
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Log In
                </Link>
                <Link 
                  to="/register"
                  className="text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                  Register Donor
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions & Menu */}
          <div className="flex md:hidden items-center gap-2">
            <Link 
              to={user ? "/request-blood" : "/login"}
              state={user ? undefined : { from: { pathname: '/request-blood' }, message: 'Please sign in or create an account to post an emergency blood request.' }}
              className="bg-red-600 text-white font-semibold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Request
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 font-medium text-sm hover:text-red-600">Home</Link>
          <Link to="/map" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 font-medium text-sm hover:text-red-600">Live Map</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 font-medium text-sm hover:text-red-600">Compatibility Guide</Link>
          {user ? (
            <>
              <Link to="/donor-dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 font-medium text-sm hover:text-red-600">Donor Portal</Link>
              <Link to="/my-requests" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 font-medium text-sm hover:text-red-600">My Requests</Link>
              <Link to="/notifications" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 font-medium text-sm hover:text-red-600">Notifications ({unreadCount})</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 font-medium text-sm hover:text-red-600">My Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin-dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-amber-700 font-semibold text-sm">Admin Dashboard</Link>
              )}
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-red-600 font-semibold text-sm">Sign Out</button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2 bg-slate-100 rounded-xl text-slate-900 font-medium text-sm">Log In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2 bg-red-600 rounded-xl text-white font-semibold text-sm">Register Donor</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
