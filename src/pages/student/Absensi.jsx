import React, { useState, useEffect } from 'react';
import { CheckCircle, User } from 'lucide-react';
import Layout from '../../components/layout/Layout';

const Absensi = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isWorkDay, setIsWorkDay] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/:/g, '.');
  };

  const formatDate = (date) => {
    const options = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('id-ID', options);
  };

  const checkWorkDay = (date) => {
    const day = date.getDay();
    return day >= 1 && day <= 5; // Senin = 1, Jumat = 5
  };

  useEffect(() => {
    setIsWorkDay(checkWorkDay(currentTime));
  }, [currentTime]);

  return (
    <Layout title="Absensi" isAdmin={false}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Absensi Overview Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-purple-600 mb-2">Absensi</h1>
              <p className="text-gray-600 text-lg">
                Sistem absensi otomatis untuk Kerja Praktek (Senin - Jumat)
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-12 h-12 text-white" />
              </div>
              <p className="text-gray-600 text-sm">Mahasiswa KP</p>
            </div>
          </div>
        </div>

        {/* Latest Attendance Features Box */}
        <div className="bg-green-50 rounded-xl shadow-lg p-6 border border-green-200">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-green-800">Fitur Absensi Terbaru:</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700">Hari Kerja: Hanya aktif Senin-Jumat</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700">Jam Masuk: 07:30 dengan toleransi 30 menit (sampai 08:00)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700">Jam Keluar: 16:00 - 18:00 WIB</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700">Deteksi Jam Kerja: Status real-time jam kerja (07:00-18:00)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700">Validasi Otomatis: Cek hari dan jam sebelum absen</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700">Status Kehadiran: Tepat Waktu, Toleransi, atau Terlambat</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700">Pesan Dinamis: Tombol menampilkan alasan jika tidak bisa digunakan</span>
            </div>
          </div>
        </div>

        {/* Current Time and Date Display */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Absensi Kerja Praktek</h2>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {formatTime(currentTime)}
            </div>
            <div className="text-gray-600 text-lg mb-1">
              {formatDate(currentTime)}
            </div>
            <div className={`text-lg font-medium ${isWorkDay ? 'text-green-600' : 'text-red-600'}`}>
              {isWorkDay ? 'Hari Kerja' : 'Hari Libur'}
            </div>
          </div>
        </div>

        {/* Attendance Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Aksi Absensi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors">
                Check In
              </button>
              <p className="text-gray-600 mt-2">Absen masuk pagi</p>
            </div>
            <div className="text-center">
              <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors">
                Check Out
              </button>
              <p className="text-gray-600 mt-2">Absen keluar sore</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Absensi;
