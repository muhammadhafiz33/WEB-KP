import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Users, UserRound, Mail, Phone, GraduationCap, Building2 } from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:4000/api/pembimbing';

const PembimbingMahasiswa = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMahasiswa = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/mahasiswa`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Gagal memuat data mahasiswa bimbingan');
      const data = await response.json();
      setMahasiswaList(data);
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMahasiswa();
  }, [fetchMahasiswa]);

  const filteredMahasiswa = mahasiswaList.filter(m =>
    (m.nama_lengkap && m.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (m.nim && m.nim.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Mahasiswa Bimbingan</h2>
          <p className="text-gray-500 mt-1">Daftar mahasiswa yang Anda bimbing</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari mahasiswa (nama atau NIM)..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-10 pr-4 py-2 border rounded-lg w-full" 
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Daftar Mahasiswa ({filteredMahasiswa.length})</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="p-12 text-center">Memuat data...</div>
          ) : filteredMahasiswa.length > 0 ? (
            filteredMahasiswa.map((mahasiswa) => (
              <div key={mahasiswa.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-semibold text-gray-900">{mahasiswa.nama_lengkap || '(Nama Belum Diisi)'}</span>
                      <span className="text-sm text-gray-500">({mahasiswa.nim})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 text-sm text-gray-600">
                      <span className="flex items-center space-x-2 truncate"><Mail size={16} /><span>{mahasiswa.email || '-'}</span></span>
                      <span className="flex items-center space-x-2"><Phone size={16} /><span>{mahasiswa.telepon || '-'}</span></span>
                      <span className="flex items-center space-x-2"><GraduationCap size={16} /><span>{mahasiswa.jurusan || '-'}</span></span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {/* Mengarahkan ke rute profil mahasiswa bimbingan */}
                    <button onClick={() => navigate(`/pembimbing/mahasiswa/${mahasiswa.nim}`)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-md" title="Lihat Profile">
                      <Eye size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Users className="mx-auto h-12 w-12" />
              <h3 className="mt-2 text-lg font-medium">Tidak ada mahasiswa</h3>
              <p className="mt-1 text-sm text-gray-500">Belum ada mahasiswa yang ditugaskan kepada Anda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PembimbingMahasiswa;