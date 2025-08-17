import React, { useState } from 'react';
import { 
  UserRound, 
  Mail, 
  Phone, 
  Building2,
  Edit,
  Save,
  X,
  Briefcase
} from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock data untuk Admin
  const [profileData, setProfileData] = useState({
    nama: 'Admin Kominfo',
    email: 'admin.kominfo@email.com',
    telepon: '081234567890',
    jabatan: 'Kepala Divisi',
    divisi: 'Dinas Komunikasi dan Informatika',
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

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Profil Admin</h2>
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
            <p className="text-gray-500 mb-6">Jabatan: {profileData.jabatan}</p>

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
                    className={`w-full text-sm text-gray-900 font-medium bg-transparent border-b ${isEditing ? 'border-gray-300' : 'border-transparent'} focus:outline-none focus:border-blue-600 transition-colors p-0`}
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
                    className={`w-full text-sm text-gray-900 font-medium bg-transparent border-b ${isEditing ? 'border-gray-300' : 'border-transparent'} focus:outline-none focus:border-blue-600 transition-colors p-0`}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Building2 className="text-blue-600 flex-shrink-0" size={20} />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500">Divisi</span>
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
        </div>
      </div>

      {/* Admin specific details */}
      <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Informasi Jabatan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <Briefcase className="text-blue-600" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500">Jabatan</p>
              <input
                type="text"
                name="jabatan"
                value={isEditing ? editData.jabatan : profileData.jabatan}
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
    </div>
  );
};

export default Profile;
