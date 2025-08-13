import React from 'react';
import { Target, LogOut } from 'lucide-react';

const Header = ({ title, isAdmin = false }) => {
  return (
    <div className="bg-blue-600 text-white shadow-lg">
      <div className="flex justify-between items-center px-8 py-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Kerja Praktek</h1>
          <p className="text-blue-100 text-lg">Jurnal Kegiatan & Dokumentasi Kerja Praktek</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="font-medium">NIM-Dummy - Jurusan-Dummy</p>
            </div>
          </div>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
