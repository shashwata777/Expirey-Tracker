import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Background3D from './components/3d/Background3D';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import UploadModal from './components/upload/UploadModal';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import ItemDetailPage from './pages/ItemDetailPage';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { useAuth } from './hooks/useAuth';

export const App = () => {
  const [globalUploadOpen, setGlobalUploadOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGlobalItemSaved = (newItem) => {
    if (newItem?._id) {
      navigate(`/items/${newItem._id}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-brown-950 text-brown-100 flex flex-col relative selection:bg-gold-500/30 selection:text-gold-200">
      {/* 3D Canvas Background in Brown & Yellow */}
      <Background3D />

      {/* Luxury Dark-Theme Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1a120b',
            color: '#f5eadb',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(245, 158, 11, 0.2)',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: 500,
            padding: '12px 18px',
          },
          success: {
            iconTheme: {
              primary: '#f59e0b',
              secondary: '#160e08',
            },
          },
          error: {
            style: {
              background: '#241010',
              color: '#fca5a5',
              border: '1px solid rgba(239, 68, 68, 0.4)',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#241010',
            },
          },
        }}
      />

      {/* Main Navigation Bar */}
      <Navbar onOpenUpload={() => setGlobalUploadOpen(true)} />

      {/* Main Page Routing */}
      <main className="flex-1 flex flex-col relative z-10">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/items/:id"
            element={
              <ProtectedRoute>
                <ItemDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Default Redirect */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Global Quick Scan Upload Modal */}
      {isAuthenticated && (
        <UploadModal
          isOpen={globalUploadOpen}
          onClose={() => setGlobalUploadOpen(false)}
          onItemSaved={handleGlobalItemSaved}
        />
      )}
    </div>
  );
};

export default App;
