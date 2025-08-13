import React, { useState } from 'react';
import { Plus, Search, Filter, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Layout from '../../components/layout/Layout';

const Jurnal = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    activity: '',
    description: '',
    hours: '',
    challenges: '',
    nextPlan: ''
  });

  // Mock data jurnal
  const jurnalEntries = [
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
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic untuk submit jurnal
    console.log('Jurnal submitted:', newEntry);
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Disetujui
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Menunggu
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
    <Layout title="Jurnal Kegiatan" isAdmin={false}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white p-8">
          <h1 className="text-3xl font-bold mb-2">Jurnal Kegiatan</h1>
          <p className="text-green-100 text-lg">
            Catat dan dokumentasikan kegiatan kerja praktek Anda setiap hari
          </p>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Buat Jurnal Baru</span>
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari jurnal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Daftar Jurnal</h2>
            <p className="text-gray-600">Total {filteredEntries.length} jurnal</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{entry.activity}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{entry.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Durasi: {entry.hours} jam</span>
                      {entry.feedback && (
                        <span className="text-green-600">
                          Feedback: {entry.feedback}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {getStatusBadge(entry.status)}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredEntries.length === 0 && (
              <div className="p-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada jurnal</h3>
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
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Buat Jurnal Baru</h2>
                <p className="text-gray-600">Isi detail kegiatan kerja praktek Anda</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Simpan Jurnal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Jurnal;
