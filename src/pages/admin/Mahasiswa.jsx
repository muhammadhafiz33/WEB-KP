import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Eye, 
  Users,
  UserRound,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Building,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

const Mahasiswa = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProgramStudi, setFilterProgramStudi] = useState('all');
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // Mock data mahasiswa
  const [mahasiswaList, setMahasiswaList] = useState([
    {
      id: 1,
      nim: '2021001',
      nama: 'Ahmad Fadillah',
      email: 'ahmad.fadillah@email.com',
      telepon: '+62 812-3456-7890',
      alamat: 'Jl. Sudirman No. 123, Jakarta Selatan',
      programStudi: 'Teknik Informatika',
      fakultas: 'Fakultas Teknik',
      angkatan: '2021',
      semester: '6',
      status: 'aktif',
      mulaiKP: '2024-12-01',
      selesaiKP: '2025-02-28',
      lokasiKP: 'PT. Teknologi Indonesia',
      pembimbingKP: 'Dr. Budi Santoso, S.T., M.T.',
      dosenPembimbing: 'Ir. Siti Nurhaliza, M.T.',
      ipk: '3.75',
      sks: '120'
    },
    {
      id: 2,
      nim: '2021002',
      nama: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@email.com',
      telepon: '+62 813-4567-8901',
      alamat: 'Jl. Thamrin No. 45, Jakarta Pusat',
      programStudi: 'Sistem Informasi',
      fakultas: 'Fakultas Teknik',
      angkatan: '2021',
      semester: '6',
      status: 'aktif',
      mulaiKP: '2024-12-01',
      selesaiKP: '2025-02-28',
      lokasiKP: 'PT. Digital Solutions',
      pembimbingKP: 'Ir. Ahmad Hidayat, M.T.',
      dosenPembimbing: 'Dr. Rina Marlina, S.T., M.T.',
      ipk: '3.82',
      sks: '118'
    },
    {
      id: 3,
      nim: '2021003',
      nama: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      telepon: '+62 814-5678-9012',
      alamat: 'Jl. Gatot Subroto No. 67, Jakarta Selatan',
      programStudi: 'Teknik Informatika',
      fakultas: 'Fakultas Teknik',
      angkatan: '2021',
      semester: '6',
      status: 'aktif',
      mulaiKP: '2024-12-01',
      selesaiKP: '2025-02-28',
      lokasiKP: 'PT. Software Indonesia',
      pembimbingKP: 'Ir. Siti Aisyah, M.T.',
      dosenPembimbing: 'Dr. Muhammad Rizki, S.T., M.T.',
      ipk: '3.68',
      sks: '115'
    },
    {
      id: 4,
      nim: '2021004',
      nama: 'Dewi Sartika',
      email: 'dewi.sartika@email.com',
      telepon: '+62 815-6789-0123',
      alamat: 'Jl. Rasuna Said No. 89, Jakarta Selatan',
      programStudi: 'Sistem Informasi',
      fakultas: 'Fakultas Teknik',
      angkatan: '2021',
      semester: '6',
      status: 'aktif',
      mulaiKP: '2024-12-01',
      selesaiKP: '2025-02-28',
      lokasiKP: 'PT. Data Analytics',
      pembimbingKP: 'Ir. Bambang Wijaya, M.T.',
      dosenPembimbing: 'Dr. Sri Wahyuni, S.T., M.T.',
      ipk: '3.91',
      sks: '122'
    }
  ]);

  const programStudiList = ['Teknik Informatika', 'Sistem Informasi'];

  const filteredMahasiswa = mahasiswaList.filter(mahasiswa => {
    const matchesSearch = 
      mahasiswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mahasiswa.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mahasiswa.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || mahasiswa.status === filterStatus;
    const matchesProgramStudi = filterProgramStudi === 'all' || mahasiswa.programStudi === filterProgramStudi;
    return matchesSearch && matchesStatus && matchesProgramStudi;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'aktif':
        return <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">Aktif</span>;
      case 'tidak_aktif':
        return <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">Tidak Aktif</span>;
      case 'cuti':
        return <span className="px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">Cuti</span>;
      default:
        return null;
    }
  };

  const openDetail = (mahasiswa) => {
    setSelectedMahasiswa(mahasiswa);
    setShowDetail(true);
  };

  const viewProfile = (nim) => {
    navigate(`/admin/mahasiswa/${nim}`);
  };

  const totalMahasiswa = mahasiswaList.length;
  const totalAktif = mahasiswaList.filter(m => m.status === 'aktif').length;
  const totalTidakAktif = mahasiswaList.filter(m => m.status === 'tidak_aktif').length;

  return (
    <div className="space-y-8 p-6 md:p-8">
      
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Data Mahasiswa</h2>
          <p className="text-gray-500 mt-1">Kelola data mahasiswa kerja praktek</p>
        </div>
        <button className="flex items-center space-x-2 bg-primary-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          <Plus size={18} />
          <span>Tambah Mahasiswa</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Mahasiswa</p>
              <p className="text-3xl font-bold text-gray-900">{totalMahasiswa}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <UserRound size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Mahasiswa Aktif</p>
              <p className="text-3xl font-bold text-gray-900">{totalAktif}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <UserRound size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tidak Aktif</p>
              <p className="text-3xl font-bold text-gray-900">{totalTidakAktif}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari mahasiswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent w-full transition-colors"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-colors"
          >
            <option value="all">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="tidak_aktif">Tidak Aktif</option>
            <option value="cuti">Cuti</option>
          </select>
          <select
            value={filterProgramStudi}
            onChange={(e) => setFilterProgramStudi(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-colors"
          >
            <option value="all">Semua Program Studi</option>
            {programStudiList.map((program, index) => (
              <option key={index} value={program}>{program}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mahasiswa List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Daftar Mahasiswa</h3>
              <p className="text-sm text-gray-500">Total {filteredMahasiswa.length} mahasiswa</p>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredMahasiswa.length > 0 ? (
            filteredMahasiswa.map((mahasiswa) => (
              <div key={mahasiswa.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <UserRound size={20} className="text-primary-blue" />
                      <span className="font-semibold text-gray-900">{mahasiswa.nama}</span>
                      <span className="text-sm text-gray-500">({mahasiswa.nim})</span>
                      {getStatusBadge(mahasiswa.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail size={16} />
                        <span>{mahasiswa.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone size={16} />
                        <span>{mahasiswa.telepon}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <GraduationCap size={16} />
                        <span>{mahasiswa.programStudi}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Building size={16} />
                        <span>{mahasiswa.lokasiKP}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <span>IPK: {mahasiswa.ipk}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>SKS: {mahasiswa.sks}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>Semester: {mahasiswa.semester}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2 ml-4">
                    <button 
                      onClick={() => viewProfile(mahasiswa.nim)}
                      className="p-2 text-primary-blue bg-secondary-blue hover:bg-blue-200 rounded-md transition-colors"
                      title="Lihat Profile"
                    >
                      <Eye size={20} />
                    </button>
                    <button 
                      onClick={() => openDetail(mahasiswa)}
                      className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      title="Edit"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada mahasiswa</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus !== 'all' || filterProgramStudi !== 'all'
                  ? 'Coba ubah filter atau kata kunci pencarian'
                  : 'Belum ada mahasiswa yang terdaftar'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mahasiswa Detail Modal */}
      {showDetail && selectedMahasiswa && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Detail Mahasiswa</h3>
              <button
                onClick={() => setShowDetail(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Nama</p>
                  <p className="font-semibold text-gray-900">{selectedMahasiswa.nama}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">NIM</p>
                  <p className="font-semibold text-gray-900">{selectedMahasiswa.nim}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                  <p className="font-semibold text-gray-900">{selectedMahasiswa.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Telepon</p>
                  <p className="font-semibold text-gray-900">{selectedMahasiswa.telepon}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Program Studi</p>
                  <p className="font-semibold text-gray-900">{selectedMahasiswa.programStudi}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                  <p className="font-semibold text-gray-900">{selectedMahasiswa.status}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Lokasi KP</p>
                  <p className="text-gray-800">{selectedMahasiswa.lokasiKP}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Pembimbing KP</p>
                  <p className="text-gray-800">{selectedMahasiswa.pembimbingKP}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Dosen Pembimbing</p>
                  <p className="text-gray-800">{selectedMahasiswa.dosenPembimbing}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    viewProfile(selectedMahasiswa.nim);
                    setShowDetail(false);
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 bg-primary-blue text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Eye size={20} />
                  <span>Lihat Profile Lengkap</span>
                </button>
                <button
                  onClick={() => setShowDetail(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mahasiswa;
