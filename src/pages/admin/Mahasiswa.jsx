import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Users, UserRound, Mail, Phone, GraduationCap, Building, Plus, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:4000/api/admin';

const Mahasiswa = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMahasiswa = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Gagal memuat data mahasiswa');
      const data = await response.json();
      setMahasiswaList(data);
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMahasiswa();
  }, []);

  const handleDelete = (mahasiswaId, nama) => {
    Swal.fire({
      title: `Yakin ingin menghapus ${nama}?`,
      text: "Data mahasiswa dan semua data terkait (jurnal, absensi) akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_URL}/users/${mahasiswaId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) throw new Error('Gagal menghapus mahasiswa');
          Swal.fire('Terhapus!', 'Data mahasiswa telah dihapus.', 'success');
          fetchMahasiswa(); // Refresh list
        } catch (error) {
          Swal.fire('Error', error.message, 'error');
        }
      }
    });
  };

  const filteredMahasiswa = mahasiswaList.filter(m =>
    (m.nama_lengkap && m.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (m.nim && m.nim.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Data Mahasiswa</h2>
          <p className="text-gray-500 mt-1">Kelola data mahasiswa kerja praktek</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
          <Plus size={18} /> <span>Tambah Mahasiswa</span>
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Cari mahasiswa (nama atau NIM)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg w-full" />
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
                      <span className="flex items-center space-x-2 truncate"><Mail size={16} /><span>{mahasiswa.email}</span></span>
                      <span className="flex items-center space-x-2"><Phone size={16} /><span>{mahasiswa.telepon || '-'}</span></span>
                      <span className="flex items-center space-x-2"><GraduationCap size={16} /><span>{mahasiswa.jurusan || '-'}</span></span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button onClick={() => navigate(`/admin/mahasiswa/${mahasiswa.nim}`)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-md" title="Lihat Profile">
                      <Eye size={20} />
                    </button>
                    <button onClick={() => handleDelete(mahasiswa.id, mahasiswa.nama_lengkap || mahasiswa.nim)} className="p-2 text-red-600 hover:bg-red-100 rounded-md" title="Hapus">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Users className="mx-auto h-12 w-12" />
              <h3 className="mt-2 text-lg font-medium">Tidak ada mahasiswa</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mahasiswa;
