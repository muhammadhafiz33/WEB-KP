import React from 'react';
import { TrendingUp, BookOpen, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '../../components/layout/Layout';

const Dashboard = () => {
  // Mock data
  const stats = [
    {
      title: 'Total Hari Kerja',
      value: '24',
      change: '+2',
      changeType: 'positive',
      icon: Calendar,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Jam Kerja',
      value: '192',
      change: '+16',
      changeType: 'positive',
      icon: Clock,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Jurnal Disetujui',
      value: '22',
      change: '+3',
      changeType: 'positive',
      icon: BookOpen,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Kehadiran',
      value: '96%',
      change: '+4%',
      changeType: 'positive',
      icon: CheckCircle,
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      activity: 'Check-in pagi',
      time: '07:45',
      status: 'success',
      description: 'Absen masuk tepat waktu'
    },
    {
      id: 2,
      activity: 'Jurnal harian',
      time: '16:30',
      status: 'success',
      description: 'Laporan kegiatan hari ini'
    },
    {
      id: 3,
      activity: 'Check-out',
      time: '17:00',
      status: 'success',
      description: 'Selesai kerja hari ini'
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      task: 'Laporan mingguan',
      deadline: 'Jumat, 15 Desember',
      priority: 'high'
    },
    {
      id: 2,
      task: 'Presentasi progress',
      deadline: 'Senin, 18 Desember',
      priority: 'medium'
    },
    {
      id: 3,
      task: 'Evaluasi KP',
      deadline: 'Rabu, 20 Desember',
      priority: 'high'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Layout title="Dashboard" isAdmin={false}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8">
          <h1 className="text-3xl font-bold mb-2">Selamat Datang di Dashboard KP!</h1>
          <p className="text-blue-100 text-lg">
            Kelola kegiatan kerja praktek Anda dengan mudah dan efisien
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className={`w-4 h-4 ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'} mr-1`} />
                  <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">dari bulan lalu</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Aktivitas Terbaru</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Lihat Semua
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(activity.status)}`}>
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.activity}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Tugas Mendatang</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Lihat Semua
              </button>
            </div>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{task.task}</p>
                    <p className="text-sm text-gray-600">{task.deadline}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'high' ? 'Tinggi' : task.priority === 'medium' ? 'Sedang' : 'Rendah'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
              <Calendar className="w-6 h-6 text-blue-600" />
              <span className="font-medium text-blue-900">Absen Hari Ini</span>
            </button>
            <button className="flex items-center justify-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
              <BookOpen className="w-6 h-6 text-green-600" />
              <span className="font-medium text-green-900">Buat Jurnal</span>
            </button>
            <button className="flex items-center justify-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
              <Clock className="w-6 h-6 text-purple-600" />
              <span className="font-medium text-purple-900">Lihat Riwayat</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
