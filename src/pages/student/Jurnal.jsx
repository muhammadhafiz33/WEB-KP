import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, CheckCircle, Clock, AlertCircle, Calendar, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:4000/api';

const Jurnal = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [jurnalEntries, setJurnalEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJurnal, setSelectedJurnal] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formEntry, setFormEntry] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    kegiatan: '',
    deskripsi: '',
    jam_kerja: '',
    hambatan: '',
    rencana_selanjutnya: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormEntry(prev => ({ ...prev, [name]: value }));
  };

  const showMessage = (title, message, icon) => {
    Swal.fire({
      title: title,
      text: message,
      icon: icon
    });
  };

  const fetchJurnals = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token tidak ditemukan");

      const response = await fetch(`${API_URL}/jurnals`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil data jurnal');
      }
      const data = await response.json();
      setJurnalEntries(data);
    } catch (error) {
      showMessage('Error', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJurnals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token tidak ditemukan");

      let response;
      if (isEditing) {
        // Logika untuk mengedit data
        response = await fetch(`${API_URL}/jurnals/${selectedJurnal.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formEntry)
        });
      } else {
        // Logika untuk membuat data baru
        response = await fetch(`${API_URL}/jurnals`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formEntry)
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal menyimpan jurnal');
      }

      showMessage('Sukses!', 'Jurnal berhasil disimpan.', 'success');
      setShowForm(false);
      setIsEditing(false);
      setFormEntry({
        tanggal: new Date().toISOString().split('T')[0],
        kegiatan: '',
        deskripsi: '',
        jam_kerja: '',
        hambatan: '',
        rencana_selanjutnya: ''
      });
      fetchJurnals();
    } catch (error) {
      showMessage('Error', error.message, 'error');
    }
  };

  const openEditForm = (jurnal) => {
    setIsEditing(true);
    setSelectedJurnal(jurnal);
    setFormEntry({
      tanggal: jurnal.tanggal.split('T')[0],
      kegiatan: jurnal.kegiatan,
      deskripsi: jurnal.deskripsi,
      jam_kerja: jurnal.jam_kerja,
      hambatan: jurnal.hambatan || '',
      rencana_selanjutnya: jurnal.rencana_selanjutnya || ''
    });
    setShowForm(true);
  };
  
  const handleDelete = async (jurnalId) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Anda tidak akan dapat mengembalikan ini!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/jurnals/${jurnalId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Gagal menghapus jurnal');
        
        showMessage('Terhapus!', 'Jurnal berhasil dihapus.', 'success');
        fetchJurnals();
      } catch (error) {
        showMessage('Error', error.message, 'error');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Disetujui
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3 mr-1" />
            Menunggu
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            <AlertCircle className="w-3 h-3 mr-1" />
            Ditolak
          </span>
        );
      default:
        return null;
    }
  };
  
  const openDetail = (jurnal) => {
    setSelectedJurnal(jurnal);
    setShowDetail(true);
  };

  const filteredEntries = jurnalEntries.filter(entry => {
    const matchesSearch = entry.kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || entry.status.toUpperCase() === filterStatus.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 p-6 md:p-8">
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg text-white p-8">
        <h1 className="text-3xl font-bold mb-2">Jurnal Kegiatan</h1>
        <p className="text-blue-100 text-lg">
          Catat dan dokumentasikan kegiatan kerja praktek Anda setiap hari
        </p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <button
            onClick={() => { setShowForm(true); setIsEditing(false); }}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg font-semibold text-sm transition-colors w-full md:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Jurnal Baru</span>
          </button>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari jurnal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full sm:w-auto"
            >
              <option value="all">Semua Status</option>
              <option value="APPROVED">Disetujui</option>
              <option value="PENDING">Menunggu</option>
              <option value="REJECTED">Ditolak</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jurnal Entries */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Daftar Jurnal</h2>
          <p className="text-gray-500">Total {filteredEntries.length} jurnal</p>
        </div>
        
        <div className="space-y-4 p-6">
          {isLoading ? (
            <div className="text-center p-12 text-gray-500">Memuat data jurnal...</div>
          ) : filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <div 
                key={entry.id} 
                className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1" onClick={() => openDetail(entry)}>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{entry.kegiatan}</h3>
                        <p className="text-sm text-gray-500">
                          <Calendar size={14} className="inline-block mr-1 text-gray-400" />
                          {new Date(entry.tanggal).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mt-2 mb-3">{entry.deskripsi}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>{entry.jam_kerja} jam</span>
                      </span>
                      {entry.komentar_admin && (
                        <span className="flex items-center space-x-1 text-blue-600">
                          <AlertCircle size={16} />
                          <span>Feedback: {entry.komentar_admin}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                    {getStatusBadge(entry.status)}
                    {(entry.status === 'PENDING' || entry.status === 'REJECTED') && (
                      <>
                        <button
                          onClick={() => openEditForm(entry)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Jurnal"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Jurnal"
                        >
                          <Trash2 size={16} />
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
                {searchTerm || filterStatus !== 'all' 
                  ? 'Coba ubah filter atau kata kunci pencarian'
                  : 'Mulai buat jurnal pertama Anda'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New/Edit Entry Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {isEditing ? 'Edit Jurnal' : 'Buat Jurnal Baru'}
                </h2>
                <p className="text-gray-600">
                  {isEditing ? 'Perbarui detail kegiatan kerja praktek Anda' : 'Isi detail kegiatan kerja praktek Anda'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input type="date" name="tanggal" value={formEntry.tanggal} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (Jam)</label>
                  <input type="number" name="jam_kerja" step="0.5" min="0" max="24" value={formEntry.jam_kerja} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="8" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kegiatan</label>
                <input type="text" name="kegiatan" value={formEntry.kegiatan} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Contoh: Pengembangan sistem informasi" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Detail</label>
                <textarea name="deskripsi" value={formEntry.deskripsi} onChange={handleInputChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Jelaskan detail kegiatan yang dilakukan..." required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tantangan/Hambatan</label>
                <textarea name="hambatan" value={formEntry.hambatan} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Apa tantangan yang dihadapi?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rencana Selanjutnya</label>
                <textarea name="rencana_selanjutnya" value={formEntry.rencana_selanjutnya} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Apa yang akan dilakukan selanjutnya?" />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => { setShowForm(false); setIsEditing(false); }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  {isEditing ? 'Simpan Perubahan' : 'Simpan Jurnal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kegiatan</label>
                  <p className="text-gray-900 font-semibold">{selectedJurnal.kegiatan}</p>
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <p className="text-gray-900">{selectedJurnal.deskripsi}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durasi</label>
                  <p className="text-gray-900">{selectedJurnal.jam_kerja} jam</p>
                </div>
                {selectedJurnal.hambatan && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tantangan/Hambatan</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedJurnal.hambatan}</p>
                  </div>
                )}
                {selectedJurnal.rencana_selanjutnya && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rencana Selanjutnya</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedJurnal.rencana_selanjutnya}</p>
                  </div>
                )}
                {selectedJurnal.komentar_admin && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                    <p className="text-blue-800 bg-blue-50 p-3 rounded-lg">{selectedJurnal.komentar_admin}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jurnal;
