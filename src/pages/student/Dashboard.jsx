import React, { useEffect, useState } from 'react'; // Perbaikan di sini
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle, FileText } from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:4000/api/dashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [latestJurnals, setLatestJurnals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ambil data user dari localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/student`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Gagal memuat data dashboard');
        const data = await response.json();
        setStats(data.stats);
        setLatestJurnals(data.latestJurnals);
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getJurnalStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">Disetujui</span>;
      case 'PENDING': return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">Menunggu</span>;
      case 'REJECTED': return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700">Ditolak</span>;
      default: return null;
    }
  };

  const statCards = [
    { title: 'Total Jurnal Dibuat', value: stats?.totalJurnals, icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Total Jam Kerja', value: stats?.totalJamKerja, icon: Clock, color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: 'Jurnal Disetujui', value: stats?.jurnalsApproved, icon: BookOpen, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { title: 'Tingkat Kehadiran', value: stats?.tingkatKehadiran, icon: CheckCircle, color: 'text-blue-600', bgColor: 'bg-blue-100' }
  ];

  return (
    <div className="space-y-8 p-6 md:p-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Selamat Datang, {user ? user.identifier : 'Mahasiswa'}!</h1>
        <p className="text-blue-100 text-lg">
          Kelola kegiatan kerja praktek Anda dengan mudah dan efisien.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center">Memuat statistik...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map(({ title, value, icon: Icon, color, bgColor }, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{value !== undefined ? value : '-'}</p>
                </div>
                <div className={`w-14 h-14 ${bgColor} rounded-full flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Jurnal Terbaru</h2>
          <button onClick={() => navigate('/student/jurnal')} className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
            Lihat Semua
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kegiatan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan="3" className="text-center p-4">Memuat jurnal...</td></tr>
              ) : latestJurnals.length > 0 ? (
                latestJurnals.map((jurnal) => (
                  <tr key={jurnal.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(jurnal.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{jurnal.kegiatan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getJurnalStatusBadge(jurnal.status)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" className="text-center p-4">Belum ada jurnal yang dibuat.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
