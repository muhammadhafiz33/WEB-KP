import React, { useState, useEffect } from 'react';
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
  Briefcase,
  Camera
} from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:4000/api/profile/me';

// Fungsi helper untuk memformat tanggal
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  // Mengambil hanya bagian tanggal (yyyy-MM-dd) dari string ISO
  return dateString.split('T')[0];
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Hapus /me di sini, cukup API_URL saja
      const response = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Gagal memuat profil');
      const data = await response.json();
      
      // Format tanggal sebelum disimpan ke state
      const formattedData = {
        ...data,
        tanggalMulai: formatDateForInput(data.tanggalMulai),
        tanggalSelesai: formatDateForInput(data.tanggalSelesai),
      };
      
      // Konversi null menjadi string kosong untuk input form
      Object.keys(formattedData).forEach(key => {
        if (formattedData[key] === null) {
          formattedData[key] = '';
        }
      });

      setProfileData(formattedData);
      setEditData(formattedData);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData(prev => ({
        ...prev,
        foto: URL.createObjectURL(file), // Buat URL lokal untuk pratinjau
        fotoFile: file // Simpan objek file asli untuk diunggah
      }));
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      for (const key in editData) {
        if (key !== 'foto' && key !== 'fotoFile') {
          formData.append(key, editData[key]);
        }
      }
      if (editData.fotoFile) {
        formData.append('foto', editData.fotoFile);
      }

      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!response.ok) throw new Error('Gagal menyimpan profil');
      Swal.fire('Sukses!', 'Profil berhasil diperbarui.', 'success');
      fetchProfile();
      setIsEditing(false);
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  if (isLoading) {
    return <div className="text-center p-10">Memuat profil...</div>;
  }

  if (!profileData) {
    return <div className="text-center p-10">Gagal memuat profil.</div>;
  }

  return (
    <div className="space-y-8 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Profil Mahasiswa</h2>
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
          {/* Profile Photo & Info */}
          <div className="flex-shrink-0 relative">
            <div className="w-36 h-36 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-5xl font-bold">
              {editData.foto ? (
                <img 
                  src={editData.foto} 
                  alt="Profile" 
                  className="w-36 h-36 rounded-full object-cover"
                />
              ) : (
                profileData.nama ? profileData.nama.split(' ').map(n => n[0]).join('') : <UserRound size={64}/>
              )}
            </div>
            {isEditing && (
              <label 
                htmlFor="profile-photo-upload"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
              >
                <input
                  id="profile-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Camera size={16} />
              </label>
            )}
          </div>
          <div className="flex-1 w-full">
            <input
              type="text" name="nama" value={editData.nama} onChange={handleInputChange} disabled={!isEditing}
              placeholder="Masukkan nama lengkap..."
              className={`text-2xl font-bold text-gray-900 mb-2 w-full bg-transparent ${isEditing ? 'border-b' : ''}`}
            />
            <p className="text-gray-500 mb-6">NIM: {profileData.nim}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              <InfoField icon={Mail} label="Email" name="email" value={editData.email} onChange={handleInputChange} isEditing={isEditing} />
              <InfoField icon={Phone} label="Telepon" name="telepon" value={editData.telepon} onChange={handleInputChange} isEditing={isEditing} />
              <InfoField icon={MapPin} label="Alamat" name="alamat" value={editData.alamat} onChange={handleInputChange} isEditing={isEditing} className="md:col-span-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-md border">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Informasi Akademik & KP</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField icon={GraduationCap} label="Universitas" name="universitas" value={editData.universitas} onChange={handleInputChange} isEditing={isEditing} />
          <InfoField icon={Briefcase} label="Jurusan" name="jurusan" value={editData.jurusan} onChange={handleInputChange} isEditing={isEditing} />
          <InfoField icon={Calendar} label="Angkatan" name="angkatan" value={editData.angkatan} onChange={handleInputChange} isEditing={isEditing} type="number" />
          <InfoField icon={Building2} label="Divisi KP" name="divisi" value={editData.divisi} onChange={handleInputChange} isEditing={isEditing} />
          <InfoField icon={UserRound} label="Pembimbing Lapangan" name="pembimbing" value={editData.pembimbing} onChange={handleInputChange} isEditing={isEditing} className="md:col-span-2" />
          <InfoField icon={Calendar} label="Tanggal Mulai KP" name="tanggalMulai" value={editData.tanggalMulai} onChange={handleInputChange} isEditing={isEditing} type="date" />
          <InfoField icon={Calendar} label="Tanggal Selesai KP" name="tanggalSelesai" value={editData.tanggalSelesai} onChange={handleInputChange} isEditing={isEditing} type="date" />
        </div>
      </div>
    </div>
  );
};

// Komponen kecil untuk field info agar tidak repetitif
const InfoField = ({ icon: Icon, label, name, value, onChange, isEditing, type = "text", className = "" }) => (
  <div className={`flex items-center space-x-3 ${className}`}>
    <Icon className="text-blue-600 flex-shrink-0" size={20} />
    <div className="flex-1">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={!isEditing}
        className={`w-full text-sm text-gray-900 font-medium bg-transparent border-b ${isEditing ? 'border-gray-300' : 'border-transparent'} focus:outline-none focus:border-blue-600 transition-colors p-0`}
      />
    </div>
  </div>
);

export default Profile;
