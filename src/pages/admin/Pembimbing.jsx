import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Users, Plus, FileText, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:4000/api/admin';

const AdminPembimbing = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [pembimbingSummary, setPembimbingSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPembimbingSummary = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/pembimbing/summary`, { 
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Gagal memuat ringkasan data pembimbing');
      const data = await response.json();
      setPembimbingSummary(data);
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPembimbingSummary();
  }, []);

  const filteredPembimbing = pembimbingSummary.filter(p =>
    (p.nama_lengkap && p.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.identifier && p.identifier.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleAddPembimbing = () => {
    Swal.fire('Fitur Segera Hadir', 'Fungsionalitas untuk menambah pembimbing akan segera dibuat.', 'info');
  };

  return (
    <div className="space-y-8 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Kelola Pembimbing</h2>
          <p className="text-gray-500 mt-1">Monitoring dan manajemen aktivitas pembimbing</p>
        </div>
        <button onClick={handleAddPembimbing} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
          <Plus size={18} /> <span>Tambah Pembimbing</span>
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Cari pembimbing (nama atau NIP)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg w-full" />
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="p-12 text-center">Memuat data...</div>
        ) : filteredPembimbing.length > 0 ? (
          filteredPembimbing.map((pembimbing) => (
            <div key={pembimbing.id} className="bg-white rounded-xl shadow-md border p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{pembimbing.nama_lengkap}</h3>
                  <p className="text-sm text-gray-500">NIP: {pembimbing.identifier}</p>
                  <p className="text-sm text-gray-500">Email: {pembimbing.email}</p>
                </div>
                <button onClick={() => navigate(`/admin/pembimbing/${pembimbing.id}`)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-md" title="Lihat Detail">
                  <Eye size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-gray-100 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{pembimbing.totalMahasiswa || 0}</p>
                  <p className="text-sm text-gray-500">Mahasiswa Bimbingan</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg text-center">
                  <p className="text-2xl font-bold text-yellow-600">{pembimbing.jurnalPending || 0}</p>
                  <p className="text-sm text-gray-500">Jurnal Pending</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{pembimbing.jurnalApproved || 0}</p>
                  <p className="text-sm text-gray-500">Jurnal Disetujui</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Users className="mx-auto h-12 w-12" />
            <h3 className="mt-2 text-lg font-medium">Tidak ada data pembimbing</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPembimbing;