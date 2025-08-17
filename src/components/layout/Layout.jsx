import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
// Menghapus import Sidebar karena menu akan dipindahkan ke Header

const Layout = ({ isAdmin = false }) => {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      
      {/* Konten Utama - Bagian Kanan */}
      <div className="flex-grow flex flex-col">
        {/* Header - Bagian Atas */}
        <Header isAdmin={isAdmin} />
        
        {/* Konten Halaman */}
        <main className="p-6 md:p-8 flex-grow overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
