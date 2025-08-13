import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
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
  MessageSquare
} from 'lucide-react';

const Jurnal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMahasiswa, setFilterMahasiswa] = useState('all');
  const [selectedJurnal, setSelectedJurnal] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // Mock data jurnal
  const [jurnals, setJurnals] = useState([
    {
      id: 1,
      mahasiswa: 'Ahmad Fadillah',
      nim: '2021001',
      tanggal: '2024-12-10',
      kegiatan: 'Mempelajari sistem informasi kepegawaian',
      output: 'Memahami alur kerja sistem kepegawaian',
      jamKerja: 8,
      status: 'pending',
      komentar: '',
      hambatan: 'Kurang familiar dengan istilah teknis',
      rencanaBesok: 'Lanjutkan pembelajaran dan praktik'
    },
    {
      id: 2,
      mahasiswa: 'Siti Nurhaliza',
      nim: '2021002',
      tanggal: '2024-12-10',
      kegiatan: 'Membantu input data pegawai',
      output: 'Berhasil input 50 data pegawai baru',
      jamKerja: 7.5,
      status: 'approved',
      komentar: 'Kerja bagus, data tersimpan dengan baik',
      hambatan: 'Tidak ada',
      rencanaBesok: 'Input data pegawai lainnya'
    },
    {
      id: 3,
      mahasiswa: 'Budi Santoso',
      nim: '2021003',
      tanggal: '2024-12-09',
      kegiatan: 'Meeting dengan tim IT',
      output: 'Mendapatkan insight tentang pengembangan sistem',
      jamKerja: 6,
      status: 'rejected',
      komentar: 'Jurnal terlalu singkat, perlu detail lebih lanjut',
      hambatan: 'Meeting berlangsung singkat',
      rencanaBesok: 'Dokumentasikan meeting dengan lebih detail'
    }
  ]);

  const [mahasiswaList] = useState([
    'Ahmad Fadillah',
    'Siti Nurhaliza', 
    'Budi Santoso'
  ]);

  const handleStatusChange = (jurnalId, newStatus, komentar = '') => {
    setJurnals(prev => 
      prev.map(jurnal => 
        jurnal.id === jurnalId 
          ? { ...jurnal, status: newStatus, komentar }
          : jurnal
      )
    );
  };

  const filteredJurnals = jurnals.filter(jurnal => {
    const matchesSearch = 
      jurnal.kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jurnal.mahasiswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jurnal.output.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || jurnal.status === filterStatus;
    const matchesMahasiswa = filterMahasiswa === 'all' || jurnal.mahasiswa === filterMahasiswa;
    return matchesSearch && matchesStatus && matchesMahasiswa;
  });

  const getStatusBadge = (status) => {
    switch (status) {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={16} />;
      case 'rejected':
        return <XCircle className="text-red-500" size={16} />;
      default:
        return null;
    }
  };

  const openDetail = (jurnal) => {
    setSelectedJurnal(jurnal);
    setShowDetail(true);
  };

  return (
    <Layout title="Jurnal Kegiatan" isAdmin={true}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Review Jurnal Kegiatan</h2>
            <p className="text-gray-600">Review dan approval jurnal mahasiswa kerja praktek</p>
          </div>
          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
            <Download size={16} />
            <span>Export Laporan</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari jurnal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="approved">Disetujui</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <User size={20} className="text-gray-500" />
              <select
                value={filterMahasiswa}
                onChange={(e) => setFilterMahasiswa(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Mahasiswa</option>
                {mahasiswaList.map((mahasiswa, index) => (
                  <option key={index} value={mahasiswa}>{mahasiswa}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Jurnal List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Daftar Jurnal</h3>
                <p className="text-sm text-gray-600">Total {filteredJurnals.length} jurnal</p>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>{jurnals.filter(j => j.status === 'pending').length} Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>{jurnals.filter(j => j.status === 'approved').length} Approved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>{jurnals.filter(j => j.status === 'rejected').length} Rejected</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredJurnals.map((jurnal) => (
              <div key={jurnal.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{jurnal.mahasiswa}</span>
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
                        <span className="text-sm text-gray-600">{jurnal.jamKerja} jam</span>
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
                        <p className="text-gray-700">{jurnal.output}</p>
                      </div>
                      {jurnal.hambatan && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Hambatan:</h4>
                          <p className="text-gray-700">{jurnal.hambatan}</p>
                        </div>
                      )}
                      {jurnal.rencanaBesok && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Rencana Besok:</h4>
                          <p className="text-gray-700">{jurnal.rencanaBesok}</p>
                        </div>
                      )}
                      {jurnal.komentar && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-1">Komentar Admin:</h4>
                          <p className="text-blue-800">{jurnal.komentar}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {getStatusIcon(jurnal.status)}
                    <button 
                      onClick={() => openDetail(jurnal)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    {jurnal.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(jurnal.id, 'approved', 'Jurnal disetujui')}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(jurnal.id, 'rejected', 'Jurnal ditolak, perlu perbaikan')}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredJurnals.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada jurnal</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus !== 'all' || filterMahasiswa !== 'all'
                  ? 'Coba ubah filter atau kata kunci pencarian'
                  : 'Belum ada jurnal yang tersubmit'
                }
              </p>
            </div>
          )}
        </div>

        {/* Jurnal Detail Modal */}
        {showDetail && selectedJurnal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Detail Jurnal</h3>
                  <button
                    onClick={() => setShowDetail(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mahasiswa</label>
                    <p className="text-gray-900">{selectedJurnal.mahasiswa}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIM</label>
                    <p className="text-gray-900">{selectedJurnal.nim}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                    <p className="text-gray-900">
                      {new Date(selectedJurnal.tanggal).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jam Kerja</label>
                    <p className="text-gray-900">{selectedJurnal.jamKerja} jam</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kegiatan</label>
                  <p className="text-gray-900">{selectedJurnal.kegiatan}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Output/Hasil</label>
                  <p className="text-gray-900">{selectedJurnal.output}</p>
                </div>
                
                {selectedJurnal.hambatan && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hambatan</label>
                    <p className="text-gray-900">{selectedJurnal.hambatan}</p>
                  </div>
                )}
                
                {selectedJurnal.rencanaBesok && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rencana Besok</label>
                    <p className="text-gray-900">{selectedJurnal.rencanaBesok}</p>
                  </div>
                )}
                
                {selectedJurnal.komentar && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Komentar Admin</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedJurnal.komentar}</p>
                  </div>
                )}
              </div>
              
              {selectedJurnal.status === 'pending' && (
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        handleStatusChange(selectedJurnal.id, 'approved', 'Jurnal disetujui');
                        setShowDetail(false);
                      }}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle size={16} className="inline mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedJurnal.id, 'rejected', 'Jurnal ditolak, perlu perbaikan');
                        setShowDetail(false);
                      }}
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
    </Layout>
  );
};

export default Jurnal;
