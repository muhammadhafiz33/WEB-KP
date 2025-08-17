import React, { useState } from 'react';
import { 
  UserRound, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Calendar,
  Edit,
  Save,
  X,
  Building2,
  Clock,
  CircleCheck,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import Layout from '../../components/layout/Layout'; // Menghapus impor Layout dari sini karena sudah ada di App.jsx

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock data mahasiswa
  const [profileData, setProfileData] = useState({
    nim: '2021001',
    nama: 'Ahmad Fadillah',
    email: 'ahmad.fadillah@email.com',
    telepon: '081234567890',
    alamat: 'Jl. Sudirman No. 123, Jakarta Pusat',
    universitas: 'Universitas Indonesia',
    jurusan: 'Teknik Informatika',
    angkatan: '2021',
    tanggalMulai: '2024-11-01',
    tanggalSelesai: '2025-01-31',
    pembimbing: 'Ir. Budi Santoso, M.Kom',
    divisi: 'Divisi Sistem Informasi',
    foto: null
  });

  const [editData, setEditData] = useState({ ...profileData });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData(prev => ({
        ...prev,
        foto: URL.createObjectURL(file)
      }));
    }
  };

  const getProgressPercentage = () => {
    const start = new Date(profileData.tanggalMulai);
    const end = new Date(profileData.tanggalSelesai);
    const today = new Date();
    
    const totalDuration = end - start;
    const elapsed = today - start;
    
    if (elapsed <= 0) return 0;
    if (elapsed >= totalDuration) return 100;
    
    return Math.round((elapsed / totalDuration) * 100);
  };

  const progressPercentage = getProgressPercentage();

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Profil Mahasiswa</h2>
          <p className="text-gray-500">Kelola informasi profil Anda</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            <Edit size={20} />
            <span>Edit Profil</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-md"
            >
              <X size={20} />
              <span>Batal</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
            >
              <Save size={20} />
              <span>Simpan</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Overview */}
      <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Photo & Info */}
          <div className="flex-shrink-0 relative">
            <div className="w-36 h-36 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-5xl font-bold">
              {profileData.foto ? (
                <img 
                  src={profileData.foto} 
                  alt="Profile" 
                  className="w-36 h-36 rounded-full object-cover"
                />
              ) : (
                profileData.nama.split(' ').map(n => n[0]).join('')
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Edit size={16} />
              </label>
            )}
          </div>

          {/* Profile Info Fields */}
          <div className="flex-1 w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {profileData.nama}
            </h3>
            <p className="text-gray-500 mb-6">NIM: {profileData.nim}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-600 flex-shrink-0" size={20} />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={isEditing ? editData.email : profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`text-sm text-gray-900 font-medium bg-transparent border-b ${isEditing ? 'border-gray-300' : 'border-transparent'} focus:outline-none focus:border-blue-600 transition-colors p-0`}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-blue-600 flex-shrink-0" size={20} />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500">Telepon</span>
                  <input
                    type="tel"
                    name="telepon"
                    value={isEditing ? editData.telepon : profileData.telepon}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`text-sm text-gray-900 font-medium bg-transparent border-b ${isEditing ? 'border-gray-300' : 'border-transparent'} focus:outline-none focus:border-blue-600 transition-colors p-0`}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3 lg:col-span-1 md:col-span-2">
                <MapPin className="text-blue-600 flex-shrink-0" size={20} />
                <div className="flex flex-col flex-1">
                  <span className="text-xs font-medium text-gray-500">Alamat</span>
                  <input
                    type="text"
                    name="alamat"
                    value={isEditing ? editData.alamat : profileData.alamat}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`text-sm text-gray-900 font-medium bg-transparent border-b ${isEditing ? 'border-gray-300' : 'border-transparent'} focus:outline-none focus:border-blue-600 transition-colors p-0 w-full`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Informasi Akademik</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <GraduationCap className="text-blue-600" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500">Universitas</p>
              <input
                type="text"
                name="universitas"
                value={isEditing ? editData.universitas : profileData.universitas}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full text-sm text-gray-900 font-medium bg-transparent border-b ${isEditing ? 'border-gray-300' : 'border-transparent'} focus:outline-none focus:border-blue-600 transition-colors p-0`}
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Briefcase className="text-blue-600" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500">Jurusan</p>
              <input
                type="text"
                name="jurusan"
                value={isEditing ? editData.jurusan : profileData.jurusan}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full text-sm text-gray-900 font-medium bg-transparent border-b ${isEditing ? 'border-gray-300' : 'border-transparent'} focus:outline-none focus:border-blue-600 transition-colors p-0`}
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="text-blue-600" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500">Angkatan</p>
              <input
                type="number"
                name="angkatan"
                value={isEditing ? editData.angkatan : profileData.angkatan}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="2000"
                max="2030"
                className={`w-full text-sm text-gray-900 font-medium bg-transparent border-b ${isEditing ? 'border-gray-300' : 'border-transparent'} focus:outline-none focus:border-blue-600 transition-colors p-0`}
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <UserRound className="text-blue-600" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500">Dosen Pembimbing</p>
              <input
                type="text"
                name="pembimbing"
                value={isEditing ? editData.pembimbing : profileData.pembimbing}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full text-sm text-gray-900 font-medium bg-transparent border-b ${isEditing ? 'border-gray-300' : 'border-transparent'} focus:outline-none focus:border-blue-600 transition-colors p-0`}
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Building2 className="text-blue-600" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500">Divisi</p>
              <input
                type="text"
                name="divisi"
                value={isEditing ? editData.divisi : profileData.divisi}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full text-sm text-gray-900 font-medium bg-transparent border-b ${isEditing ? 'border-gray-300' : 'border-transparent'} focus:outline-none focus:border-blue-600 transition-colors p-0`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* KP Progress & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KP Progress */}
        <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200 lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Progress Kerja Praktek</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Progress KP</span>
              <span className="text-sm font-semibold text-blue-600">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Tanggal Mulai</p>
                <p className="text-sm font-semibold text-gray-900">{profileData.tanggalMulai}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Tanggal Selesai</p>
                <p className="text-sm font-semibold text-gray-900">{profileData.tanggalSelesai}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-900">45</div>
            <div className="text-sm text-gray-500">Hari KP</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CircleCheck className="text-green-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-900">42</div>
            <div className="text-sm text-gray-500">Jurnal Disetujui</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 text-center">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-900">95%</div>
            <div className="text-sm text-gray-500">Kehadiran</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
