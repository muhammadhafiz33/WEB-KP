import React from 'react';
import { LogOut, User, Users } from 'lucide-react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2'; // 1. Import SweetAlert2

const Header = ({ isAdmin = false }) => {
  const navigate = useNavigate();

  const studentMenuItems = [
    { path: '/student/dashboard', label: 'Dashboard' },
    { path: '/student/jurnal', label: 'Jurnal Kegiatan' },
    { path: '/student/absensi', label: 'Absensi' },
  ];

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/mahasiswa', label: 'Data Mahasiswa' },
    { path: '/admin/jurnal', label: 'Jurnal Kegiatan' },
    { path: '/admin/absensi', label: 'Absensi' },
  ];

  const menuItems = isAdmin ? adminMenuItems : studentMenuItems;

  // 2. Modifikasi fungsi handleLogout
  const handleLogout = () => {
    Swal.fire({
      title: 'Anda yakin ingin keluar?',
      text: "Anda akan diarahkan ke halaman login.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, keluar!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        // Hapus data dari localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Arahkan ke halaman login
        navigate('/login');
      }
    });
  };

  const headerTitle = isAdmin ? 'Dashboard Admin' : 'Dashboard Mahasiswa';
  
  // Ambil data user dari localStorage untuk ditampilkan
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <header className="bg-white text-gray-800 shadow-md sticky top-0 z-10">
      <div className="flex justify-between items-center px-6 py-4 lg:px-12">
        {/* Logo dan Judul */}
        <div className="flex items-center space-x-4">
          {/* Logo JURNAL KERJA PRAKTEK */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm border border-gray-100">
              {isAdmin ? (
                // Logo Admin - Tameng/Shield
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  {/* Tameng/Shield */}
                  <path 
                    d="M16 2 L28 8 L28 20 C28 26 22 30 16 30 C10 30 4 26 4 20 L4 8 L16 2 Z" 
                    fill="#7c3aed" 
                    stroke="#5b21b6" 
                    strokeWidth="1"
                  />
                  
                  {/* Bagian dalam tameng */}
                  <path 
                    d="M16 4 L26 9 L26 20 C26 24 21 27 16 27 C11 27 6 24 6 20 L6 9 L16 4 Z" 
                    fill="#a855f7" 
                    stroke="none"
                  />
                  
                  {/* Garis horizontal di tengah tameng */}
                  <line x1="8" y1="16" x2="24" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  
                  {/* Titik di tengah */}
                  <circle cx="16" cy="16" r="2" fill="white"/>
                </svg>
              ) : (
                // Logo Mahasiswa - Buku Terbuka
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  {/* Buku terbuka - bentuk V */}
                  <path 
                    d="M8 24 L8 8 L16 4 L24 8 L24 24 L16 28 L8 24 Z" 
                    fill="#1e40af" 
                    stroke="#1e3a8a" 
                    strokeWidth="1.5"
                  />
                  
                  {/* Halaman buku - bagian dalam putih */}
                  <path 
                    d="M9 23 L9 9 L16 5.5 L23 9 L23 23 L16 26.5 L9 23 Z" 
                    fill="white" 
                    stroke="none"
                  />
                  
                  {/* Garis pemisah halaman */}
                  <path 
                    d="M16 5.5 L16 26.5" 
                    stroke="#1e3a8a" 
                    strokeWidth="0.5"
                  />
                  
                  {/* Dokumen oranye dengan sudut terlipat */}
                  <rect x="18" y="6" width="8" height="10" fill="#f97316" rx="1"/>
                  
                  {/* Sudut terlipat - diagonal yang tepat */}
                  <path 
                    d="M26 6 L26 8 L24 6 Z" 
                    fill="#fef3c7"
                  />
                  
                  {/* Garis teks di dokumen - 3 garis paralel */}
                  <line x1="19.5" y1="8.5" x2="24.5" y2="8.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
                  <line x1="19.5" y1="10.5" x2="24.5" y2="10.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
                  <line x1="19.5" y1="12.5" x2="24.5" y2="12.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
                </svg>
              )}
            </div>
            {/* Logo Text */}
            <div className="hidden sm:block">
              <div className={`font-bold leading-tight ${isAdmin ? 'text-purple-800' : 'text-blue-800'}`}>
                <div className="text-lg tracking-wide">JURNAL</div>
                <div className="text-sm tracking-wide">KERJA PRAKTEK</div>
              </div>
            </div>
            
            {/* Dashboard Admin/Mahasiswa Text */}
            <div className="ml-4">
              <div className={`font-semibold border-l-2 pl-4 ${isAdmin ? 'text-purple-700 border-purple-300' : 'text-blue-700 border-blue-300'}`}>
                <div className="text-lg">Dashboard</div>
                <div className="text-base">{isAdmin ? 'Admin' : 'Mahasiswa'}</div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block border-l border-gray-300 h-8"></div>
          
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold text-gray-800">
              {headerTitle}
            </h1>
            <p className="text-sm text-gray-500">
              Jurnal Kegiatan & Dokumentasi Kerja Praktek
            </p>
          </div>
        </div>

        {/* Informasi Pengguna & Tombol Keluar */}
        <div className="flex items-center space-x-4">
          <Link to={isAdmin ? '/admin/profile' : '/student/profile'} className="flex items-center space-x-3 group cursor-pointer">
            <div className="text-right hidden sm:block">
              {/* 3. Tampilkan data user yang login */}
              <p className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">{user ? user.identifier : 'User'}</p>
              <p className="text-sm text-gray-500">{user ? user.role : 'Role'}</p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg
              ${isAdmin ? 'bg-purple-600' : 'bg-blue-600'}`}>
              {isAdmin ? <Users size={20} /> : <User size={20} />}
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors duration-200"
          >
            <LogOut size={24} />
          </button>
        </div>
      </div>

      {/* Navigasi Menu */}
      <nav className="bg-gray-50 border-t border-gray-200">
        <ul className="flex space-x-1 px-6 lg:px-12 py-2 overflow-x-auto">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${
                    isActive
                      ? isAdmin
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' // Gradasi biru-indigo untuk Admin
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' // Gradasi biru-indigo untuk Mahasiswa
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
