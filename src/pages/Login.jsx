import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { HeartPulse, Lock, Mail, Shield, Heart, UserCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/donor-dashboard';
  const customMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      toast.success('Successfully logged in!');
      navigate(redirectPath, { replace: true });
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    toast.success(`Demo credentials loaded for ${demoEmail}`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full glass-card rounded-2xl p-8 space-y-6 border border-slate-200 shadow-sm">
        
        <div className="text-center space-y-2">
          <div className="w-10 h-10 flex items-center justify-center mx-auto text-red-600">
            <svg className="w-10 h-10 fill-red-600 text-red-600" viewBox="0 0 24 24">
              <path d="M12 2C12 2 4.5 10.5 4.5 15.5C4.5 19.64 7.86 23 12 23C16.14 23 19.5 19.64 19.5 15.5C19.5 10.5 12 2 12 2Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500">Log in to access emergency response dispatch & donor portal</p>
        </div>

        {/* Authentication Notice Banner */}
        {customMessage ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium p-3 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{customMessage}</span>
          </div>
        ) : redirectPath === '/request-blood' ? (
          <div className="bg-red-50 border border-red-200 text-red-900 text-xs font-medium p-3 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>Sign in or create an account to post an emergency blood request.</span>
          </div>
        ) : null}

        {/* Quick Fill Demo Accounts Banner */}
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
          <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
            One-Tap Demo Credentials:
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button 
              type="button" 
              onClick={() => handleQuickFill('admin@lifelink.org', 'admin123')}
              className="py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold rounded-lg truncate flex items-center justify-center gap-1 cursor-pointer text-[11px] shadow-xs"
            >
              <Shield className="w-3 h-3 text-red-600" /> Admin
            </button>

            <button 
              type="button" 
              onClick={() => handleQuickFill('arjun@lifelink.org', 'donor123')}
              className="py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold rounded-lg truncate flex items-center justify-center gap-1 cursor-pointer text-[11px] shadow-xs"
            >
              <Heart className="w-3 h-3 text-red-600" /> Donor (A+)
            </button>

            <button 
              type="button" 
              onClick={() => handleQuickFill('ramesh@gmail.com', 'user123')}
              className="py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold rounded-lg truncate flex items-center justify-center gap-1 cursor-pointer text-[11px] shadow-xs"
            >
              <UserCheck className="w-3 h-3 text-slate-600" /> Requester
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <button 
                type="button" 
                onClick={() => toast.success('Password reset instructions dispatched to your registered email.')}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 text-sm cursor-pointer mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to LifeLink'}
          </button>

        </form>

        <div className="text-center pt-1 text-xs text-slate-500 font-normal">
          Don't have an account? <Link to="/register" state={{ from: location.state?.from, message: customMessage }} className="text-red-600 font-semibold hover:underline">Register Donor</Link>
        </div>

      </div>
    </div>
  );
}
