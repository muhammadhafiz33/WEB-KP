import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  User,
  FileText,
  Download,
  Users
} from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:4000/api/pembimbing';

const Jurnal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMahasiswa, setFilterMahasiswa] = useState('all');
  const [jurnals, setJurnals] = useState([]);
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJurnal, setSelectedJurnal] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const fetchJurnalsAndUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [jurnalRes, userRes] = await Promise.all([
        fetch(`${API_URL}/jurnals`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/mahasiswa`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (!jurnalRes.ok) throw new Error('Gagal mengambil data jurnal');
      if (!userRes.ok) throw new Error('Gagal mengambil data mahasiswa bimbingan');

      const jurnalData = await jurnalRes.json();
      const userData = await userRes.json();

      setJurnals(jurnalData);
      setMahasiswaList(userData);

    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJurnalsAndUsers();
  }, [fetchJurnalsAndUsers]);

  const handleStatusChange = async (jurnalId, newStatus, komentar = '') => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/jurnals/${jurnalId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus.toUpperCase(), komentar_admin: komentar })
      });
      if (!response.ok) throw new Error('Gagal memperbarui status jurnal');
      
      Swal.fire('Berhasil!', `Jurnal berhasil di${newStatus === 'approved' ? 'setujui' : 'tolak'}.`, 'success');
      fetchJurnalsAndUsers();
      setShowDetail(false); // Close modal after action
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const handleApprove = async (jurnalId) => {
    const result = await Swal.fire({
      title: `Apakah Anda yakin ingin menyetujui jurnal ini?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Setujui',
      cancelButtonText: 'Batal'
    });
    if (result.isConfirmed) {
      handleStatusChange(jurnalId, 'approved');
    }
  };
  
  const handleReject = async (jurnalId) => {
    const { value: text } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'Tulis komentar untuk menolak jurnal',
      inputPlaceholder: 'Masukkan alasan penolakan...',
      showCancelButton: true,
      confirmButtonText: 'Tolak',
      cancelButtonText: 'Batal',
      inputValidator: (value) => {
        if (!value) {
          return 'Alasan penolakan tidak boleh kosong!'
        }
      }
    });

    if (text) {
      handleStatusChange(jurnalId, 'rejected', text);
    }
  };


  const filteredJurnals = jurnals.filter(jurnal => {
    const matchesSearch = 
      (jurnal.kegiatan && jurnal.kegiatan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (jurnal.nama_lengkap && jurnal.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (jurnal.nim && jurnal.nim.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || (jurnal.status && jurnal.status.toLowerCase() === filterStatus);
    const matchesMahasiswa = filterMahasiswa === 'all' || (jurnal.nim && jurnal.nim === filterMahasiswa);
    return matchesSearch && matchesStatus && matchesMahasiswa;
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Disetujui</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Menunggu</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Ditolak</span>;
      default:
        return null;
    }
  };

  const openDetail = (jurnal) => {
    setSelectedJurnal(jurnal);
    setShowDetail(true);
  };

  const handleExportPDF = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/jurnals/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal mengekspor laporan");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), {
        href: url,
        download: `laporan-jurnal-bimbingan-${new Date().toISOString().split("T")[0]}.pdf`,
      });
      a.click();
      URL.revokeObjectURL(url);
      Swal.fire("Berhasil!", "Laporan berhasil diekspor.", "success");
    } catch (e) {
      Swal.fire("Error", e.message, "error");
    }
  };


  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Review Jurnal Kegiatan Mahasiswa Bimbingan</h2>
          <p className="text-gray-500 mt-1">Review dan approval jurnal mahasiswa kerja praktek</p>
        </div>
        <button onClick={handleExportPDF} className="flex items-center space-x-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors">
          <Download size={18} />
          <span>Export Laporan</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari jurnal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-colors"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-colors"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Users size={20} className="text-gray-500" />
            <select
              value={filterMahasiswa}
              onChange={(e) => setFilterMahasiswa(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-colors"
            >
              <option value="all">Semua Mahasiswa Bimbingan</option>
              {mahasiswaList.map((mahasiswa, index) => (
                <option key={index} value={mahasiswa.nim}>{mahasiswa.nama_lengkap}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Jurnal List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Daftar Jurnal</h3>
          <p className="text-sm text-gray-500">Total {filteredJurnals.length} jurnal</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="text-center p-12 text-gray-500">Memuat data jurnal...</div>
          ) : filteredJurnals.length > 0 ? (
            filteredJurnals.map((jurnal) => (
              <div key={jurnal.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{jurnal.nama_lengkap}</span>
                        <span className="text-sm text-gray-500">({jurnal.nim})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(jurnal.tanggal).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{jurnal.jam_kerja} jam</span>
                      </div>
                      {getStatusBadge(jurnal.status)}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Kegiatan:</h4>
                        <p className="text-gray-700">{jurnal.kegiatan}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Output/Hasil:</h4>
                        <p className="text-gray-700">{jurnal.deskripsi}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button 
                      onClick={() => openDetail(jurnal)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    {(!jurnal.status || jurnal.status.toLowerCase() === 'pending') && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApprove(jurnal.id)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(jurnal.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada jurnal</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus !== 'all' || filterMahasiswa !== 'all'
                  ? 'Coba ubah filter atau kata kunci pencarian'
                  : 'Belum ada jurnal dari mahasiswa bimbingan Anda yang tersubmit'
                }
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Jurnal Detail Modal */}
      {showDetail && selectedJurnal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Detail Jurnal</h3>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mahasiswa</label>
                  <p className="text-gray-900 font-semibold">{selectedJurnal.nama_lengkap}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIM</label>
                  <p className="text-gray-900">{selectedJurnal.nim}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <p className="text-gray-900">
                    {new Date(selectedJurnal.tanggal).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jam Kerja</label>
                  <p className="text-gray-900">{selectedJurnal.jam_kerja} jam</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kegiatan</label>
                <p className="text-gray-900">{selectedJurnal.kegiatan}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <p className="text-gray-900">{selectedJurnal.deskripsi}</p>
              </div>
              
              {selectedJurnal.hambatan && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hambatan</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedJurnal.hambatan}</p>
                </div>
              )}
              
              {selectedJurnal.rencana_selanjutnya && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rencana Selanjutnya</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedJurnal.rencana_selanjutnya}</p>
                </div>
              )}
              
              {selectedJurnal.komentar_admin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Komentar Pembimbing</label>
                  <p className="text-blue-800 bg-blue-50 p-3 rounded-lg">{selectedJurnal.komentar_admin}</p>
                </div>
              )}
            </div>
            
            {(selectedJurnal.status === 'PENDING' || selectedJurnal.status === 'REJECTED') && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApprove(selectedJurnal.id)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle size={16} className="inline mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedJurnal.id)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle size={16} className="inline mr-2" />
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Jurnal;