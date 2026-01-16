import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Enrolement from './pages/Enrolement';
import Paiements from './pages/Paiements';
import AdminDashboard from './pages/admin/Dashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            {user?.role?.nom_role === 'Admin' ? (
              <AdminDashboard />
            ) : (
              <Dashboard />
            )}
          </PrivateRoute>
        }
      />
      <Route
        path="/enrolement"
        element={
          <PrivateRoute>
            <Enrolement />
          </PrivateRoute>
        }
      />
      <Route
        path="/paiements"
        element={
          <PrivateRoute>
            <Paiements />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
