import React, { useState } from 'react';
import { Plus, Search, Filter, FileText, CheckCircle, Clock, AlertCircle, Calendar, Eye } from 'lucide-react';

const Jurnal = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [jurnalEntries, setJurnalEntries] = useState([
    {
      id: 1,
      date: '2024-12-10',
      activity: 'Pengembangan Sistem Informasi',
      description: 'Mengembangkan modul laporan keuangan dengan teknologi React dan Node.js',
      hours: 8,
      status: 'approved',
      feedback: 'Bagus, lanjutkan pengembangan'
    },
    {
      id: 2,
      date: '2024-12-09',
      activity: 'Analisis Kebutuhan Sistem',
      description: 'Menganalisis kebutuhan sistem untuk departemen IT',
      hours: 7.5,
      status: 'approved',
      feedback: 'Analisis sudah tepat'
    },
    {
      id: 3,
      date: '2024-12-08',
      activity: 'Testing dan Debugging',
      description: 'Melakukan testing pada fitur yang sudah dikembangkan',
      hours: 6,
      status: 'pending',
      feedback: null
    },
    {
      id: 4,
      date: '2024-12-07',
      activity: 'Meeting dengan Tim',
      description: 'Koordinasi dengan tim pengembangan dan stakeholder',
      hours: 4,
      status: 'approved',
      feedback: 'Koordinasi berjalan lancar'
    }
  ]);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    activity: '',
    description: '',
    hours: '',
    challenges: '',
    nextPlan: ''
  });
  const [selectedJurnal, setSelectedJurnal] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = jurnalEntries.length > 0 ? Math.max(...jurnalEntries.map(entry => entry.id)) + 1 : 1;
    const newJurnal = { ...newEntry, id: newId, status: 'pending', feedback: null };
    setJurnalEntries(prev => [newJurnal, ...prev]);
    setShowForm(false);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      activity: '',
      description: '',
      hours: '',
      challenges: '',
      nextPlan: ''
    });
  };

  const openDetail = (jurnal) => {
    setSelectedJurnal(jurnal);
    setShowDetail(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Disetujui
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3 mr-1" />
            Menunggu
          </span>
        );
      case 'rejected':
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

  const filteredEntries = jurnalEntries.filter(entry => {
    const matchesSearch = entry.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
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
            onClick={() => setShowForm(true)}
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
              <option value="approved">Disetujui</option>
              <option value="pending">Menunggu</option>
              <option value="rejected">Ditolak</option>
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
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <div 
                key={entry.id} 
                className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => openDetail(entry)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{entry.activity}</h3>
                        <p className="text-sm text-gray-500">
                          <Calendar size={14} className="inline-block mr-1 text-gray-400" />
                          {new Date(entry.date).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mt-2 mb-3">{entry.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>{entry.hours} jam</span>
                      </span>
                      {entry.feedback && (
                        <span className="flex items-center space-x-1 text-blue-600">
                          <AlertCircle size={16} />
                          <span>Feedback: {entry.feedback}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-shrink-0">
                    {getStatusBadge(entry.status)}
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

      {/* New Entry Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Buat Jurnal Baru</h2>
                <p className="text-gray-600">Isi detail kegiatan kerja praktek Anda</p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durasi (Jam)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={newEntry.hours}
                    onChange={(e) => setNewEntry({...newEntry, hours: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="8"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kegiatan
                </label>
                <input
                  type="text"
                  value={newEntry.activity}
                  onChange={(e) => setNewEntry({...newEntry, activity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contoh: Pengembangan sistem informasi"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Detail
                </label>
                <textarea
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Jelaskan detail kegiatan yang dilakukan..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tantangan/Hambatan
                </label>
                <textarea
                  value={newEntry.challenges}
                  onChange={(e) => setNewEntry({...newEntry, challenges: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Apa tantangan yang dihadapi?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rencana Selanjutnya
                </label>
                <textarea
                  value={newEntry.nextPlan}
                  onChange={(e) => setNewEntry({...newEntry, nextPlan: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Apa yang akan dilakukan selanjutnya?"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Simpan Jurnal
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
                    <p className="text-gray-900 font-semibold">{selectedJurnal.activity}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                    <p className="text-gray-900">
                      {new Date(selectedJurnal.date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                    <p className="text-gray-900">{selectedJurnal.description}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durasi</label>
                    <p className="text-gray-900">{selectedJurnal.hours} jam</p>
                  </div>
                  {selectedJurnal.challenges && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tantangan/Hambatan</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedJurnal.challenges}</p>
                    </div>
                  )}
                  {selectedJurnal.nextPlan && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rencana Selanjutnya</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedJurnal.nextPlan}</p>
                    </div>
                  )}
                  {selectedJurnal.feedback && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                      <p className="text-blue-800 bg-blue-50 p-3 rounded-lg">{selectedJurnal.feedback}</p>
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
