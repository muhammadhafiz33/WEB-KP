import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserRound, Mail, Phone, MapPin, Calendar, GraduationCap, Building, FileText, CheckCircle, Clock } from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:4000/api/admin';

const ProfileMahasiswa = () => {
  const { nim } = useParams();
  const navigate = useNavigate();
  const [mahasiswa, setMahasiswa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/${nim}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Gagal memuat profil mahasiswa');
        const data = await response.json();
        setMahasiswa(data);
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [nim]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  if (loading) {
    return <div className="text-center p-10">Memuat profil...</div>;
  }

  if (!mahasiswa) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Mahasiswa Tidak Ditemukan</h2>
        <button onClick={() => navigate('/admin/mahasiswa')} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg">
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 md:p-8">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/admin/mahasiswa')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Mahasiswa</h1>
          <p className="text-gray-600 mt-1">Detail informasi mahasiswa kerja praktek</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border p-6">
            <div className="text-center mb-6">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <UserRound size={64} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{mahasiswa.nama_lengkap || '(Nama Belum Diisi)'}</h2>
              <p className="text-lg text-blue-600 font-semibold">{mahasiswa.nim}</p>
            </div>
            <div className="space-y-4">
              <InfoItem icon={Mail} text={mahasiswa.email} />
              <InfoItem icon={Phone} text={mahasiswa.telepon} />
              <InfoItem icon={MapPin} text={mahasiswa.alamat} />
              <InfoItem icon={Calendar} text={formatDate(mahasiswa.tanggal_lahir)} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md border p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center"><GraduationCap size={24} className="mr-2 text-blue-600" />Informasi Akademik</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Fakultas" value={mahasiswa.fakultas} />
              <DetailItem label="Program Studi" value={mahasiswa.jurusan} />
              <DetailItem label="Angkatan" value={mahasiswa.angkatan} />
              <DetailItem label="IPK" value={mahasiswa.ipk} />
              <DetailItem label="SKS" value={mahasiswa.sks} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center"><Building size={24} className="mr-2 text-blue-600" />Informasi Kerja Praktek</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Divisi" value={mahasiswa.divisi} />
              <DetailItem label="Pembimbing Lapangan" value={mahasiswa.pembimbing_lapangan} />
              <DetailItem label="Periode KP" value={`${formatDate(mahasiswa.tanggal_mulai_kp)} - ${formatDate(mahasiswa.tanggal_selesai_kp)}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, text }) => (
  <div className="flex items-center space-x-3">
    <Icon size={20} className="text-gray-400" />
    <span className="text-gray-700">{text || '-'}</span>
  </div>
);

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
    <p className="font-semibold text-gray-900">{value || '-'}</p>
  </div>
);

export default ProfileMahasiswa;
