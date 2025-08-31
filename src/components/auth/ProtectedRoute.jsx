import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Jalankan logika ini hanya sekali saat komponen dimuat
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    
    if (token && userString) {
      try {
        const userData = JSON.parse(userString);
        setUser(userData);
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        // Jika parsing gagal, anggap tidak ada user
        localStorage.clear();
      }
    }
    setIsLoading(false);
  }, []);

  // Tampilkan loading screen sementara data dimuat
  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>Loading...</div>;
  }

  // Cek apakah pengguna sudah login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Cek apakah peran user diizinkan untuk mengakses rute ini
  if (!allowedRoles.includes(user.role)) {
    // Jika tidak diizinkan, arahkan ke dashboard yang sesuai
    const redirectTo = user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  // Jika semua verifikasi berhasil, izinkan akses ke halaman
  return <Outlet />;
};

export default ProtectedRoute;