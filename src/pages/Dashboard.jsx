import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/donor-dashboard');
    }
  }, [user, navigate]);

  return <div className="min-h-screen bg-[#070a13] py-20 text-center text-slate-400 font-extrabold text-sm">Redirecting to portal...</div>;
}
