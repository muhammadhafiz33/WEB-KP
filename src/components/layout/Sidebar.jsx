import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isAdmin = false }) => {
  const location = useLocation();

  const studentMenuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/jurnal', label: 'Jurnal Kegiatan' },
    { path: '/absensi', label: 'Absensi' },
  ];

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/mahasiswa', label: 'Data Mahasiswa' },
    { path: '/admin/jurnal', label: 'Jurnal Kegiatan' },
    { path: '/admin/absensi', label: 'Absensi' },
  ];

  const menuItems = isAdmin ? adminMenuItems : studentMenuItems;

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="flex space-x-1 px-8 py-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isActive(item.path)
                ? 'bg-white text-gray-900 border border-gray-300'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
