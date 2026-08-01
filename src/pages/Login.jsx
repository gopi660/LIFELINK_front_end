import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Mail, Lock, HeartPulse, Shield, UserCheck, Heart, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/donor-dashboard');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    toast.success(`Demo credentials filled for ${demoEmail}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070a13] text-slate-900 dark:text-slate-100 py-16 flex items-center justify-center px-4 transition-colors">
      <div className="max-w-md w-full glass-card rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 border border-slate-200 dark:border-slate-800/80 relative overflow-hidden">
        
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-rose-500 via-red-600 to-rose-700 text-white flex items-center justify-center mx-auto shadow-xl shadow-rose-600/35 border-t border-white/20">
            <HeartPulse className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-3xl font-heading font-black text-slate-900 dark:text-white">Welcome Back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Log in to access emergency response dispatch & donor portal</p>
        </div>

        {/* Quick Fill Demo Accounts Banner */}
        <div className="glass-card border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-2.5">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-rose-500" /> One-Tap Demo Credentials:
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button 
              type="button" 
              onClick={() => handleQuickFill('admin@lifelink.org', 'admin123')}
              className="py-2 px-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-extrabold rounded-xl truncate flex items-center justify-center gap-1 cursor-pointer text-[11px]"
            >
              <Shield className="w-3 h-3" /> Admin
            </button>

            <button 
              type="button" 
              onClick={() => handleQuickFill('arjun@lifelink.org', 'donor123')}
              className="py-2 px-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-extrabold rounded-xl truncate flex items-center justify-center gap-1 cursor-pointer text-[11px]"
            >
              <Heart className="w-3 h-3" /> Donor (A+)
            </button>

            <button 
              type="button" 
              onClick={() => handleQuickFill('ramesh@gmail.com', 'user123')}
              className="py-2 px-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-extrabold rounded-xl truncate flex items-center justify-center gap-1 cursor-pointer text-[11px]"
            >
              <UserCheck className="w-3 h-3" /> Requester
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">Password</label>
              <button 
                type="button" 
                onClick={() => toast.success('Password reset link dispatched (Mock)')}
                className="text-[10px] uppercase font-bold text-rose-500 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-500 via-red-600 to-rose-600 hover:from-rose-600 hover:to-red-700 text-white font-heading font-black py-4 rounded-2xl shadow-xl shadow-rose-600/35 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer border-t border-white/20 mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In to LifeLink'}
          </button>

        </form>

        <div className="text-center pt-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
          Don't have an account? <Link to="/register" className="text-rose-500 font-extrabold hover:underline">Register Donor</Link>
        </div>

      </div>
    </div>
  );
}
