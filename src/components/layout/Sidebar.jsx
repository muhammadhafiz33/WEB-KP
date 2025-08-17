import React from 'react';
import { NavLink } from 'react-router-dom'; // Menggunakan NavLink untuk styling aktif
import { LayoutDashboard, FileText, Calendar, User, Users } from 'lucide-react';

const Sidebar = ({ isAdmin = false }) => {

  const studentMenuItems = [
    { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/student/jurnal', label: 'Jurnal Kegiatan', icon: FileText },
    { path: '/student/absensi', label: 'Absensi', icon: Calendar },
    { path: '/student/profile', label: 'Profil Saya', icon: User },
  ];

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/mahasiswa', label: 'Data Mahasiswa', icon: Users },
    { path: '/admin/jurnal', label: 'Jurnal Kegiatan', icon: FileText },
    { path: '/admin/absensi', label: 'Absensi', icon: Calendar },
  ];

  const menuItems = isAdmin ? adminMenuItems : studentMenuItems;

  return (
    <div className="bg-gradient-to-b from-blue-600 to-white border-r border-gray-200 p-4 w-60 flex-shrink-0">
      <div className="flex items-center space-x-2 mb-8">
        <h2 className="text-xl font-bold text-gray-800">
          Menu {isAdmin ? 'Admin' : 'Mahasiswa'}
        </h2>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive ? 'bg-white text-blue-800 shadow-lg transform scale-105' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-semibold">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
