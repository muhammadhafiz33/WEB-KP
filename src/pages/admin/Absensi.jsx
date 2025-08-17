import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  TrendingUp,
  Users,
  BarChart3,
  UserRound
} from 'lucide-react';
import Layout from '../../components/layout/Layout'; // Impor Layout

const Absensi = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMahasiswa, setFilterMahasiswa] = useState('all');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock data absensi
  const [attendanceData] = useState([
    {
      id: 1,
      mahasiswa: 'Ahmad Fadillah',
      nim: '2021001',
      tanggal: '2024-12-10',
      checkIn: '08:00',
      checkOut: '17:00',
      totalHours: 9,
      status: 'hadir',
      keterangan: 'Tepat waktu'
    },
    {
      id: 2,
      mahasiswa: 'Siti Nurhaliza',
      nim: '2021002',
      tanggal: '2024-12-10',
      checkIn: '08:15',
      checkOut: '16:45',
      totalHours: 8.5,
      status: 'terlambat',
      keterangan: 'Terlambat 15 menit'
    },
    {
      id: 3,
      mahasiswa: 'Budi Santoso',
      nim: '2021003',
      tanggal: '2024-12-10',
      checkIn: null,
      checkOut: null,
      totalHours: 0,
      status: 'tidak_hadir',
      keterangan: 'Izin sakit'
    },
    {
      id: 4,
      mahasiswa: 'Ahmad Fadillah',
      nim: '2021001',
      tanggal: '2024-12-09',
      checkIn: '08:00',
      checkOut: '17:30',
      totalHours: 9.5,
      status: 'hadir',
      keterangan: 'Lembur 30 menit'
    }
  ]);

  const [mahasiswaList] = useState([
    'Ahmad Fadillah',
    'Siti Nurhaliza', 
    'Budi Santoso'
  ]);

  const filteredAttendance = attendanceData.filter(attendance => {
    const matchesSearch = 
      attendance.mahasiswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendance.nim.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || attendance.status === filterStatus;
    const matchesMahasiswa = filterMahasiswa === 'all' || attendance.mahasiswa === filterMahasiswa;
    const matchesDate = filterDate === '' || attendance.tanggal === filterDate;
    return matchesSearch && matchesStatus && matchesMahasiswa && matchesDate;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'hadir':
        return <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">Hadir</span>;
      case 'terlambat':
        return <span className="px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">Terlambat</span>;
      case 'tidak_hadir':
        return <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">Tidak Hadir</span>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'hadir':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'terlambat':
        return <AlertCircle className="text-yellow-500" size={16} />;
      case 'tidak_hadir':
        return <XCircle className="text-red-500" size={16} />;
      default:
        return null;
    }
  };

  // Calculate statistics
  const totalMahasiswa = mahasiswaList.length;
  const hadirHariIni = attendanceData.filter(a => a.tanggal === filterDate && a.status === 'hadir').length;
  const terlambatHariIni = attendanceData.filter(a => a.tanggal === filterDate && a.status === 'terlambat').length;
  const tidakHadirHariIni = attendanceData.filter(a => a.tanggal === filterDate && a.status === 'tidak_hadir').length;
  const tingkatKehadiran = totalMahasiswa > 0 ? Math.round((hadirHariIni / totalMahasiswa) * 100) : 0;

  return (
    <div className="space-y-8 p-6 md:p-8">
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between border border-gray-200">
        <div className="md:mr-8 text-center md:text-left">
          <h1 className="text-3xl font-bold mb-1">Monitoring Absensi</h1>
          <p className="text-blue-100 text-lg">
            Pantau kehadiran mahasiswa kerja praktek
          </p>
        </div>
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-4 md:mt-0">
          <Users className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 transition-shadow hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Mahasiswa</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalMahasiswa}</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="text-blue-600" size={28} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 transition-shadow hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Hadir Hari Ini</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{hadirHariIni}</p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600" size={28} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 transition-shadow hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Terlambat</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{terlambatHariIni}</p>
            </div>
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="text-yellow-600" size={28} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 transition-shadow hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tingkat Kehadiran</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{tingkatKehadiran}%</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-blue-600" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari mahasiswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-colors"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="all">Semua Status</option>
            <option value="hadir">Hadir</option>
            <option value="terlambat">Terlambat</option>
            <option value="tidak_hadir">Tidak Hadir</option>
          </select>
          <select
            value={filterMahasiswa}
            onChange={(e) => setFilterMahasiswa(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="all">Semua Mahasiswa</option>
            {mahasiswaList.map((mahasiswa, index) => (
              <option key={index} value={mahasiswa}>{mahasiswa}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Data Absensi</h3>
              <p className="text-sm text-gray-500">Total {filteredAttendance.length} data</p>
            </div>
            <button className="flex items-center space-x-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors">
              <Download size={18} />
              <span>Export Laporan</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mahasiswa
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Masuk
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Keluar
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total Jam
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Keterangan
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendance.map((attendance) => (
                <tr key={attendance.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserRound className="text-blue-600" size={20} />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{attendance.mahasiswa}</div>
                        <div className="text-sm text-gray-500">{attendance.nim}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(attendance.tanggal).toLocaleDateString('id-ID', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <Clock size={16} className="text-gray-400" />
                      <span>{attendance.checkIn || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <Clock size={16} className="text-gray-400" />
                      <span>{attendance.checkOut || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {attendance.totalHours > 0 ? `${attendance.totalHours} jam` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(attendance.status)}
                      {getStatusBadge(attendance.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {attendance.keterangan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredAttendance.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada data absensi</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus !== 'all' || filterMahasiswa !== 'all' || filterDate !== ''
                  ? 'Coba ubah filter atau kata kunci pencarian'
                  : 'Belum ada data absensi untuk tanggal yang dipilih'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Chart Placeholder */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Grafik Kehadiran Bulanan</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
            Lihat Detail
          </button>
        </div>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Grafik kehadiran akan ditampilkan di sini</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Absensi;
