import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  UserRound, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  GraduationCap,
  Building,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Clock as ClockIcon
} from 'lucide-react';

const ProfileMahasiswa = () => {
  const { nim } = useParams();
  const navigate = useNavigate();
  const [mahasiswa, setMahasiswa] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data mahasiswa - dalam implementasi nyata ini akan diambil dari API
  const mockMahasiswa = {
    nim: '2021001',
    nama: 'Ahmad Fadillah',
    email: 'ahmad.fadillah@email.com',
    telepon: '+62 812-3456-7890',
    alamat: 'Jl. Sudirman No. 123, Jakarta Selatan',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2000-05-15',
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
    sks: '120',
    foto: null
  };

  useEffect(() => {
    // Simulasi loading data
    setTimeout(() => {
      setMahasiswa(mockMahasiswa);
      setLoading(false);
    }, 1000);
  }, [nim]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  if (!mahasiswa) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mahasiswa Tidak Ditemukan</h2>
        <p className="text-gray-600 mb-6">Mahasiswa dengan NIM {nim} tidak ditemukan dalam sistem.</p>
        <button
          onClick={() => navigate('/admin/mahasiswa')}
          className="bg-primary-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Kembali ke Daftar Mahasiswa
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/mahasiswa')}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Mahasiswa</h1>
            <p className="text-gray-600 mt-1">Detail informasi mahasiswa kerja praktek</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <CheckCircle size={18} />
            <span>Approve KP</span>
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
            <XCircle size={18} />
            <span>Reject KP</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                {mahasiswa.foto ? (
                  <img 
                    src={mahasiswa.foto} 
                    alt={mahasiswa.nama} 
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <UserRound size={64} className="text-gray-400" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{mahasiswa.nama}</h2>
              <p className="text-lg text-primary-blue font-semibold mb-1">{mahasiswa.nim}</p>
              <p className="text-gray-600">{mahasiswa.programStudi}</p>
              <div className="mt-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  mahasiswa.status === 'aktif' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {mahasiswa.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-gray-400" />
                <span className="text-gray-700">{mahasiswa.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-gray-400" />
                <span className="text-gray-700">{mahasiswa.telepon}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={20} className="text-gray-400" />
                <span className="text-gray-700">{mahasiswa.alamat}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar size={20} className="text-gray-400" />
                <span className="text-gray-700">
                  {mahasiswa.tempatLahir}, {new Date(mahasiswa.tanggalLahir).toLocaleDateString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Academic Information */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <GraduationCap size={24} className="text-primary-blue" />
              <span>Informasi Akademik</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Fakultas</p>
                <p className="font-semibold text-gray-900">{mahasiswa.fakultas}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Program Studi</p>
                <p className="font-semibold text-gray-900">{mahasiswa.programStudi}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Angkatan</p>
                <p className="font-semibold text-gray-900">{mahasiswa.angkatan}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Semester</p>
                <p className="font-semibold text-gray-900">{mahasiswa.semester}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">IPK</p>
                <p className="font-semibold text-gray-900">{mahasiswa.ipk}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">SKS</p>
                <p className="font-semibold text-gray-900">{mahasiswa.sks}</p>
              </div>
            </div>
          </div>

          {/* KP Information */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Building size={24} className="text-primary-blue" />
              <span>Informasi Kerja Praktek</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Lokasi KP</p>
                <p className="font-semibold text-gray-900">{mahasiswa.lokasiKP}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Pembimbing KP</p>
                <p className="font-semibold text-gray-900">{mahasiswa.pembimbingKP}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Dosen Pembimbing</p>
                <p className="font-semibold text-gray-900">{mahasiswa.dosenPembimbing}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Periode KP</p>
                <p className="font-semibold text-gray-900">
                  {new Date(mahasiswa.mulaiKP).toLocaleDateString('id-ID')} - {new Date(mahasiswa.selesaiKP).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Jurnal</p>
                  <p className="text-2xl font-bold text-blue-900">24</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Jurnal Approved</p>
                  <p className="text-2xl font-bold text-green-900">20</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <ClockIcon size={24} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-600">Kehadiran</p>
                  <p className="text-2xl font-bold text-yellow-900">85%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileMahasiswa;


