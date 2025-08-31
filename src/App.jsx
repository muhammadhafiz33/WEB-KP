import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';

// Import komponen ProtectedRoute
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import file CSS yang baru
import './App.css';

// Import semua halaman Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminAbsensi from './pages/admin/Absensi';
import AdminJurnal from './pages/admin/Jurnal';
import AdminMahasiswa from './pages/admin/Mahasiswa';
import AdminProfile from './pages/admin/Profile';
import AdminProfileMahasiswa from './pages/admin/ProfileMahasiswa'; 

// Import semua halaman Mahasiswa
import StudentDashboard from './pages/student/Dashboard';
import StudentAbsensi from './pages/student/Absensi';
import StudentJurnal from './pages/student/Jurnal';
import StudentProfile from './pages/student/Profile';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rute Publik (tanpa proteksi) */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rute yang Dilindungi untuk MAHASISWA */}
          <Route element={<ProtectedRoute allowedRoles={['MAHASISWA']} />}>
            <Route path="/student" element={<Layout isAdmin={false} />}>
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="jurnal" element={<StudentJurnal />} />
              <Route path="absensi" element={<StudentAbsensi />} />
              <Route path="profile" element={<StudentProfile />} />
            </Route>
          </Route>
          
          {/* Rute yang Dilindungi untuk ADMIN */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<Layout isAdmin={true} />}>
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="mahasiswa" element={<AdminMahasiswa />} />
              <Route path="jurnal" element={<AdminJurnal />} />
              <Route path="absensi" element={<AdminAbsensi />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="mahasiswa/:nim" element={<AdminProfileMahasiswa />} />
            </Route>
          </Route>
          
          {/* Fallback jika URL tidak cocok dengan rute mana pun */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;