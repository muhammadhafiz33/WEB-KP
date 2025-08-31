import React, { useState, useEffect } from 'react';
import { UserRound, Mail, Phone, Building2, Edit, Save, X, Briefcase } from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:4000/api/profile';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Gagal memuat profil');
      const data = await response.json();
      
      // Konversi null menjadi string kosong untuk form
      const sanitizedData = {};
      for (const key in data) {
        sanitizedData[key] = data[key] === null ? '' : data[key];
      }

      setProfileData(sanitizedData);
      setEditData(sanitizedData);
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });
      if (!response.ok) throw new Error('Gagal menyimpan profil');
      
      Swal.fire('Sukses!', 'Profil berhasil diperbarui.', 'success');
      setProfileData(editData);
      setIsEditing(false);
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  if (isLoading) return <div className="p-10 text-center">Memuat profil admin...</div>;
  if (!profileData) return <div className="p-10 text-center">Gagal memuat data.</div>;

  return (
    <div className="space-y-8 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Profil Admin</h2>
          <p className="text-gray-500">Kelola informasi profil Anda</p>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
            <Edit size={20} /> <span>Edit Profil</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button onClick={handleCancel} className="flex items-center space-x-2 border px-4 py-2 rounded-lg">
              <X size={20} /> <span>Batal</span>
            </button>
            <button onClick={handleSave} className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold">
              <Save size={20} /> <span>Simpan</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-8 shadow-md border">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <div className="w-36 h-36 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-5xl font-bold">
            <UserRound size={64} />
          </div>
          <div className="flex-1 w-full">
            <input type="text" name="nama_lengkap" value={editData.nama_lengkap} onChange={handleInputChange} disabled={!isEditing} placeholder="Nama Lengkap Admin" className={`text-2xl font-bold w-full bg-transparent ${isEditing ? 'border-b' : ''}`} />
            <input type="text" name="jabatan" value={editData.jabatan} onChange={handleInputChange} disabled={!isEditing} placeholder="Jabatan" className={`text-gray-500 mb-6 w-full bg-transparent ${isEditing ? 'border-b' : ''}`} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              <InfoField icon={Mail} label="Email" name="email" value={editData.email} onChange={handleInputChange} isEditing={isEditing} />
              <InfoField icon={Phone} label="Telepon" name="telepon" value={editData.telepon} onChange={handleInputChange} isEditing={isEditing} />
              <InfoField icon={Building2} label="Divisi" name="divisi" value={editData.divisi} onChange={handleInputChange} isEditing={isEditing} className="md:col-span-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoField = ({ icon: Icon, label, name, value, onChange, isEditing, type = "text", className = "" }) => (
  <div className={`flex items-center space-x-3 ${className}`}>
    <Icon className="text-blue-600 flex-shrink-0" size={20} />
    <div className="flex-1">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <input type={type} name={name} value={value} onChange={onChange} disabled={!isEditing} className={`w-full text-sm font-medium bg-transparent border-b ${isEditing ? 'border-gray-300' : 'border-transparent'} focus:outline-none focus:border-blue-600 p-0`} />
    </div>
  </div>
);

export default Profile;
