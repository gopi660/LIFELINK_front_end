import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DonorDashboard from './pages/DonorDashboard';
import RequestBlood from './pages/RequestBlood';
import MyRequests from './pages/MyRequests';
import Notifications from './pages/Notifications';
import MapView from './pages/MapView';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuthStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/donor-dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden bg-[#f8fafc] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans transition-colors">
        <Toaster 
          position="top-right" 
          toastOptions={{ 
            duration: 4000, 
            style: { 
              background: 'rgba(15, 23, 42, 0.95)', 
              color: '#fff', 
              border: '1px solid rgba(255, 255, 255, 0.12)', 
              backdropFilter: 'blur(16px)', 
              borderRadius: '16px',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
              fontSize: '13px',
              fontWeight: 600
            } 
          }} 
        />
        
        <Navbar />

        <main className="flex-1 w-full max-w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/map" element={<MapView />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/donor-dashboard" element={<ProtectedRoute><DonorDashboard /></ProtectedRoute>} />
            <Route path="/request-blood" element={<ProtectedRoute><RequestBlood /></ProtectedRoute>} />
            <Route path="/my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* Admin Route */}
            <Route path="/admin-dashboard" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
