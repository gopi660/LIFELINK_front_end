import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/donor-dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-900 font-sans">
        <Toaster 
          position="top-right" 
          toastOptions={{ 
            duration: 4000, 
            style: { 
              background: '#ffffff', 
              color: '#0f172a', 
              border: '1px solid #e2e8f0', 
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(15,23,42,0.1)',
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
