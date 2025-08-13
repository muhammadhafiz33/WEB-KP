import React from 'react';
import Layout from '../../components/layout/Layout';
import { 
  Users, 
  FileText, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  BarChart3,
  Eye,
  Download
} from 'lucide-react';

const Dashboard = () => {
  // Mock data untuk admin dashboard
  const stats = [
    {
      title: 'Total Mahasiswa KP',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Jurnal Pending',
      value: '8',
      change: '-3',
      changeType: 'negative',
      icon: FileText,
      color: 'bg-yellow-500'
    },
    {
      title: 'Kehadiran Hari Ini',
      value: '10',
      change: '+1',
      changeType: 'positive',
      icon: Clock,
      color: 'bg-green-500'
    },
    {
      title: 'Rata-rata Jam Kerja',
      value: '8.2',
      change: '+0.3',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      activity: 'Mahasiswa A submit jurnal mingguan',
      time: '2 jam yang lalu',
      type: 'jurnal'
    },
    {
      id: 2,
      activity: 'Mahasiswa B absen masuk',
      time: '08:00 WIB',
      type: 'absensi'
    },
    {
      id: 3,
      activity: 'Mahasiswa C submit laporan akhir',
      time: 'Kemarin',
      type: 'laporan'
    },
    {
      id: 4,
      activity: 'Mahasiswa D request approval jurnal',
      time: '2 hari yang lalu',
      type: 'jurnal'
    }
  ];

  const pendingJurnals = [
    {
      id: 1,
      mahasiswa: 'Ahmad Fadillah',
      tanggal: '2024-12-10',
      kegiatan: 'Mempelajari sistem informasi kepegawaian',
      status: 'pending'
    },
    {
      id: 2,
      mahasiswa: 'Siti Nurhaliza',
      tanggal: '2024-12-10',
      kegiatan: 'Membantu input data pegawai',
      status: 'pending'
    },
    {
      id: 3,
      mahasiswa: 'Budi Santoso',
      tanggal: '2024-12-09',
      kegiatan: 'Meeting dengan tim IT',
      status: 'pending'
    }
  ];

  const attendanceOverview = [
    { name: 'Hadir', value: 10, color: 'bg-green-500' },
    { name: 'Terlambat', value: 1, color: 'bg-yellow-500' },
    { name: 'Tidak Hadir', value: 1, color: 'bg-red-500' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'jurnal':
        return <FileText className="text-blue-500" size={16} />;
      case 'absensi':
        return <Clock className="text-green-500" size={16} />;
      case 'laporan':
        return <BarChart3 className="text-purple-500" size={16} />;
      default:
        return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Menunggu</span>;
      case 'approved':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Disetujui</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Ditolak</span>;
      default:
        return null;
    }
  };

  return (
    <Layout title="Dashboard Admin" isAdmin={true}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Selamat Datang, Admin!</h2>
          <p className="text-indigo-100">
            Monitor dan kelola mahasiswa kerja praktek di Dinas Kominfo. Ada {stats[1].value} jurnal yang menunggu approval.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">dari kemarin</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Lihat Semua
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Overview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Overview Kehadiran Hari Ini</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Detail
              </button>
            </div>
            <div className="space-y-4">
              {attendanceOverview.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.value} mahasiswa</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">83%</div>
                <div className="text-sm text-gray-600">Tingkat Kehadiran</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Jurnals */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Jurnal Menunggu Approval</h3>
                <p className="text-sm text-gray-600">Total {pendingJurnals.length} jurnal pending</p>
              </div>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {pendingJurnals.map((jurnal) => (
              <div key={jurnal.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
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
                      {getStatusBadge(jurnal.status)}
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Mahasiswa:</h4>
                        <p className="text-gray-700">{jurnal.mahasiswa}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Kegiatan:</h4>
                        <p className="text-gray-700">{jurnal.kegiatan}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye size={16} />
                      <span>Lihat</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <CheckCircle size={16} />
                      <span>Approve</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <AlertCircle size={16} />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {pendingJurnals.length === 0 && (
            <div className="p-12 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada jurnal pending</h3>
              <p className="mt-1 text-sm text-gray-500">
                Semua jurnal telah diproses
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center space-y-2 p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">
              <Users className="text-blue-600" size={24} />
              <span className="font-medium text-blue-600">Kelola Mahasiswa</span>
            </button>
            <button className="flex flex-col items-center justify-center space-y-2 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors">
              <FileText className="text-green-600" size={24} />
              <span className="font-medium text-green-600">Review Jurnal</span>
            </button>
            <button className="flex flex-col items-center justify-center space-y-2 p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors">
              <Clock className="text-purple-600" size={24} />
              <span className="font-medium text-purple-600">Monitor Absensi</span>
            </button>
            <button className="flex flex-col items-center justify-center space-y-2 p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors">
              <BarChart3 className="text-orange-600" size={24} />
              <span className="font-medium text-orange-600">Generate Laporan</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
