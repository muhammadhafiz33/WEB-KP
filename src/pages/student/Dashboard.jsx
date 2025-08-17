import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Clock, CheckCircle, Briefcase, FileText, UserRound, Save, Trash2, Edit } from 'lucide-react';
import Layout from '../../components/layout/Layout';

// ===== Mock Data =====
const stats = [
  { title: 'Total Hari Kerja', value: '24', icon: Calendar, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { title: 'Jam Kerja', value: '192', icon: Clock, color: 'text-green-600', bgColor: 'bg-green-100' },
  { title: 'Jurnal Disetujui', value: '22', icon: BookOpen, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { title: 'Tingkat Kehadiran', value: '96%', icon: CheckCircle, color: 'text-blue-600', bgColor: 'bg-blue-100' }
];

const recentActivities = [
  { id: 1, activity: 'Check-in pagi', time: '07:45', status: 'success', description: 'Absen masuk tepat waktu' },
  { id: 2, activity: 'Jurnal harian', time: '16:30', status: 'success', description: 'Laporan kegiatan hari ini' },
  { id: 3, activity: 'Check-out', time: '17:00', status: 'success', description: 'Selesai kerja hari ini' }
];

const mockJurnal = [
  { id: 1, date: '10 Des 2024', activity: 'Mengembangkan fitur login', status: 'pending' },
  { id: 2, date: '09 Des 2024', activity: 'Melakukan riset user experience', status: 'approved' },
  { id: 3, date: '08 Des 2024', activity: 'Meeting dengan tim proyek', status: 'approved' },
];

// ===== Helper Functions =====
const getStatusColor = (status) => {
  const colors = {
    success: 'text-green-600 bg-green-100',
    warning: 'text-yellow-600 bg-yellow-100',
    error: 'text-red-600 bg-red-100'
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
};

const getRecentActivityIcon = (activity) => {
  switch (activity) {
    case 'Check-in pagi':
    case 'Check-out':
      return <Clock size={20} />;
    case 'Jurnal harian':
      return <FileText size={20} />;
    default:
      return <Briefcase size={20} />;
  }
};

const getJurnalStatusBadge = (status) => {
  switch (status) {
    case 'approved':
      return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">Disetujui</span>;
    case 'pending':
      return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">Menunggu</span>;
    default:
      return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">Draft</span>;
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [noteContent, setNoteContent] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [showPopup, setShowPopup] = useState(localStorage.getItem('hasSeenWelcomePopup') === null);

  const handleQuickAction = (path) => navigate(path);

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem('hasSeenWelcomePopup', 'true');
  };

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Pop-up Pemberitahuan */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Selamat Datang di Website Kerja Praktek Kominfo Bukittinggi!
            </h2>
            <p className="text-gray-600 mb-6">
              Website ini dirancang untuk memudahkan mahasiswa dalam mengelola kegiatan Kerja Praktek, seperti mencatat jurnal harian dan memantau absensi.
            </p>
            <button
              onClick={handleClosePopup}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Mulai Sekarang
            </button>
          </div>
        </div>
      )}

      {/* Welcome Section dengan gradasi */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Selamat Datang di Dashboard KP!</h1>
        <p className="text-blue-100 text-lg">
          Kelola kegiatan kerja praktek Anda dengan mudah dan efisien
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ title, value, icon: Icon, color, bgColor }, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 transition-shadow hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
              <div className={`w-14 h-14 ${bgColor} rounded-full flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Aktivitas Terbaru</h2>
            <button
              onClick={() => navigate('/student/absensi')}
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
            >
              Lihat Semua
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map(({ id, activity, time, status, description }) => (
              <div
                key={id}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(
                    status
                  )}`}
                >
                  {getRecentActivityIcon(activity)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity}</p>
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
                <span className="text-sm text-gray-500">{time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Note Pad */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Note Pad</h2>
            {isEditingNote ? (
              <div className="flex space-x-2">
                <button 
                  onClick={() => { /* logika simpan */ setIsEditingNote(false); }}
                  className="p-2 text-green-600 hover:text-white hover:bg-green-600 rounded-lg transition-colors"
                >
                  <Save size={20} />
                </button>
                <button
                  onClick={() => { /* logika hapus */ setNoteContent(''); setIsEditingNote(false); }}
                  className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingNote(true)}
                className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-colors"
              >
                <Edit size={20} />
              </button>
            )}
          </div>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            disabled={!isEditingNote}
            className={`w-full h-40 p-3 rounded-lg border focus:outline-none ${isEditingNote ? 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500' : 'bg-gray-50 border-transparent'}`}
            placeholder="Tulis catatan Anda di sini..."
          />
        </div>
      </div>

      {/* Jurnal Kegiatan Table */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Jurnal Kegiatan</h2>
          <button
            onClick={() => navigate('/student/jurnal')}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
          >
            Lihat Semua
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kegiatan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockJurnal.map((jurnal) => (
                <tr key={jurnal.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{jurnal.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{jurnal.activity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getJurnalStatusBadge(jurnal.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
