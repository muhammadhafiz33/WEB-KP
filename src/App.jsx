import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/student/Dashboard';
import Jurnal from './pages/student/Jurnal';
import Absensi from './pages/student/Absensi';
import AdminDashboard from './pages/admin/Dashboard';
import AdminMahasiswa from './pages/admin/Mahasiswa';
import AdminJurnal from './pages/admin/Jurnal';
import AdminAbsensi from './pages/admin/Absensi';
import Profile from './pages/student/Profile';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Student Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jurnal" element={<Jurnal />} />
          <Route path="/absensi" element={<Absensi />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/mahasiswa" element={<AdminMahasiswa />} />
          <Route path="/admin/jurnal" element={<AdminJurnal />} />
          <Route path="/admin/absensi" element={<AdminAbsensi />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;