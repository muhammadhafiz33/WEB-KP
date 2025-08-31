import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, CheckCircle, Eye, Download, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:4000/api/dashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingJurnals, setPendingJurnals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const admin = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchAdminDashboardData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Gagal memuat data dashboard');
        const data = await response.json();
        setStats(data.stats);
        setPendingJurnals(data.pendingJurnals);
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Mahasiswa KP', value: stats?.totalMahasiswa, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Jurnal Pending', value: stats?.jurnalPending, icon: FileText, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { title: 'Kehadiran Hari Ini', value: stats?.kehadiranHariIni, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' }
  ];

  return (
    <div className="space-y-8 p-6 md:p-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Selamat Datang, {admin?.identifier || 'Admin'}!</h2>
        <p className="text-blue-100 text-lg">
          Monitor dan kelola mahasiswa kerja praktek. Ada <span className="font-bold">{stats?.jurnalPending || 0}</span> jurnal yang menunggu approval.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center">Memuat statistik...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value !== undefined ? stat.value : '-'}</p>
                  </div>
                  <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-full flex items-center justify-center`}>
                    <Icon size={28} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Jurnal Terbaru (Menunggu Approval)</h3>
            <p className="text-sm text-gray-500">5 jurnal terbaru yang perlu diverifikasi</p>
          </div>
          <button onClick={() => navigate('/admin/jurnal')} className="text-sm font-semibold text-blue-600 hover:underline">
            Lihat Semua
          </button>
        </div>
        
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="p-12 text-center">Memuat jurnal...</div>
          ) : pendingJurnals.length > 0 ? (
            pendingJurnals.map((jurnal) => (
              <div key={jurnal.id} className="p-6 hover:bg-gray-50 transition-colors flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">{jurnal.kegiatan}</h4>
                  <div className="flex items-center space-x-4 text-gray-500 text-sm mt-1">
                    <span className="flex items-center space-x-1"><Users size={16} /><span>{jurnal.nim}</span></span>
                    <span className="flex items-center space-x-1"><Calendar size={16} /><span>{new Date(jurnal.tanggal).toLocaleDateString('id-ID')}</span></span>
                  </div>
                </div>
                <button onClick={() => navigate('/admin/jurnal')} className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 rounded-lg text-sm font-medium hover:bg-blue-100">
                  <Eye size={16} />
                  <span>Review</span>
                </button>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada jurnal pending</h3>
              <p className="mt-1 text-sm text-gray-500">Semua jurnal telah diproses.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
