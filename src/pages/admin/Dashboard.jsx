import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Eye,
  Download,
  Calendar,
  Layers,
  Book,
  UserRound
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data untuk admin dashboard
  const stats = [
    {
      title: 'Total Mahasiswa KP',
      value: '12',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Jurnal Pending',
      value: '8',
      icon: FileText,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100'
    },
    {
      title: 'Kehadiran Hari Ini',
      value: '10',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Rata-rata Jam Kerja',
      value: '8.2',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      activity: 'Ahmad Fadillah submit jurnal mingguan',
      time: '2 jam yang lalu',
      type: 'jurnal'
    },
    {
      id: 2,
      activity: 'Siti Nurhaliza absen masuk',
      time: '08:00 WIB',
      type: 'absensi'
    },
    {
      id: 3,
      activity: 'Budi Santoso submit laporan akhir',
      time: 'Kemarin',
      type: 'laporan'
    },
    {
      id: 4,
      activity: 'Ahmad Fadillah request approval jurnal',
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

  const quickActions = [
    { title: 'Kelola Mahasiswa', icon: Users, color: 'text-blue-600', onClick: () => navigate('/admin/mahasiswa') },
    { title: 'Review Jurnal', icon: Book, color: 'text-yellow-600', onClick: () => navigate('/admin/jurnal') },
    { title: 'Monitor Absensi', icon: Clock, color: 'text-green-600', onClick: () => navigate('/admin/absensi') },
    { title: 'Generate Laporan', icon: BarChart3, color: 'text-purple-600', onClick: () => navigate('/admin/dashboard') }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'jurnal':
        return <FileText className="text-blue-600" size={16} />;
      case 'absensi':
        return <Clock className="text-green-600" size={16} />;
      case 'laporan':
        return <BarChart3 className="text-purple-600" size={16} />;
      default:
        return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">Menunggu</span>;
      case 'approved':
        return <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">Disetujui</span>;
      case 'rejected':
        return <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">Ditolak</span>;
      default:
        return null;
    }
  };

  const attendanceOverview = [
    { name: 'Hadir', value: 10, color: 'bg-green-500' },
    { name: 'Terlambat', value: 1, color: 'bg-yellow-500' },
    { name: 'Tidak Hadir', value: 1, color: 'bg-red-500' }
  ];

  const totalAttendance = attendanceOverview.reduce((sum, item) => sum + item.value, 0);
  const totalHadir = attendanceOverview.find(item => item.name === 'Hadir')?.value || 0;
  const tingkatKehadiran = totalAttendance > 0 ? Math.round((totalHadir / totalAttendance) * 100) : 0;


  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Selamat Datang, Admin!</h2>
        <p className="text-blue-100 text-lg">
          Monitor dan kelola mahasiswa kerja praktek. Ada <span className="font-bold">{stats.find(s => s.title === 'Jurnal Pending')?.value || 0}</span> jurnal yang menunggu approval.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-200 transition-shadow hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-full flex items-center justify-center`}>
                  <Icon size={28} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Jurnals (Kolom Kiri) */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 lg:col-span-2">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Jurnal Menunggu Approval</h3>
                <p className="text-sm text-gray-500">Total {pendingJurnals.length} jurnal pending</p>
              </div>
              <button className="flex items-center space-x-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors">
                <Download size={18} />
                <span>Export</span>
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {pendingJurnals.map((jurnal) => (
              <div key={jurnal.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{jurnal.mahasiswa}</h4>
                    {getStatusBadge(jurnal.status)}
                  </div>
                <p className="text-sm text-gray-600 mb-2">{jurnal.kegiatan}</p>
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <Calendar size={16} />
                    <span>{jurnal.tanggal}</span>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                    <Eye size={16} />
                    <span>Lihat</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1.5 text-green-600 bg-green-50 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                    <CheckCircle size={16} />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {pendingJurnals.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada jurnal pending</h3>
              <p className="mt-1 text-sm text-gray-500">Semua jurnal telah diproses</p>
            </div>
          )}
        </div>

        {/* Recent Activities & Attendance Overview (Kolom Kanan) */}
        <div className="space-y-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Aktivitas Terbaru</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                Lihat Semua
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 flex-shrink-0">
                        {Icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Attendance Overview */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Overview Kehadiran Hari Ini</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
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
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{tingkatKehadiran}%</div>
                <div className="text-sm text-gray-600 mt-1">Tingkat Kehadiran</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
