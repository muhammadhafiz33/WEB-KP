import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  UserRound,
  AlertCircle,
  CircleCheck,
  CircleX,
  Clock,
  Calendar
} from 'lucide-react';

const Absensi = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isWorkDay, setIsWorkDay] = useState(true);
  const [hasCheckedIn, setHasCheckedIn] = useState(
    JSON.parse(localStorage.getItem('hasCheckedIn')) || false
  );
  
  // Mock data untuk riwayat absensi 3 hari terakhir
  const [attendanceHistory] = useState([
    {
      date: '2024-12-11',
      checkIn: '07:50',
      checkOut: '16:05',
      status: 'Hadir'
    },
    {
      date: '2024-12-10',
      checkIn: '08:05',
      checkOut: '16:00',
      status: 'Terlambat'
    },
    {
      date: '2024-12-09',
      checkIn: '07:45',
      checkOut: '17:00',
      status: 'Hadir'
    },
  ]);

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
  
  const isCheckInTime = () => {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return (hour === 7 && minute >= 30) || (hour === 8 && minute <= 15);
  };
  
  const isCheckOutTime = () => {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return (hour === 15 && minute >= 59);
  };

  const checkWorkDay = (date) => {
    const day = date.getDay();
    return day >= 1 && day <= 5;
  };
  
  useEffect(() => {
    setIsWorkDay(checkWorkDay(currentTime));
  }, [currentTime]);

  const handleCheckIn = () => {
    if (isWorkDay && isCheckInTime()) {
      setHasCheckedIn(true);
      localStorage.setItem('hasCheckedIn', true);
      alert("Check-in berhasil!");
    } else {
      alert("Check-in hanya bisa dilakukan saat hari dan jam kerja (07:30 - 08:15 WIB).");
    }
  };

  const handleCheckOut = () => {
    if (hasCheckedIn && isCheckOutTime()) {
      setHasCheckedIn(false);
      localStorage.setItem('hasCheckedIn', false);
      alert("Check-out berhasil!");
    } else {
      alert("Anda belum Check-in atau ini bukan waktunya untuk Check-out.");
    }
  };

  const renderStatus = () => {
    if (hasCheckedIn) {
      return (
        <div className="flex items-center space-x-3 text-green-600">
          <CircleCheck size={24} />
          <span className="font-semibold">Anda Sudah Absen Masuk Hari Ini</span>
        </div>
      );
    }

    if (!isWorkDay) {
      return (
        <div className="flex items-center space-x-3 text-red-600">
          <CircleX size={24} />
          <span className="font-semibold">Hari ini bukan hari kerja</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-3 text-yellow-600">
        <AlertCircle size={24} />
        <span className="font-semibold">Anda Belum Absen Masuk Hari Ini</span>
      </div>
    );
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Hadir':
        return <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">Hadir</span>;
      case 'Terlambat':
        return <span className="px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">Terlambat</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 p-6 md:p-8">
      
      {/* Welcome & Info Section dengan gradasi */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between border border-gray-200">
        <div className="md:mr-8 text-center md:text-left">
          <h1 className="text-3xl font-bold mb-1">Absensi Kerja Praktek</h1>
          <p className="text-blue-100 text-lg">
            Sistem absensi otomatis untuk Kerja Praktek (Senin - Jumat)
          </p>
        </div>
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-4 md:mt-0">
          <UserRound className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Status Absensi Hari Ini */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Status Absensi Hari Ini</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {renderStatus()}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500">Waktu Absen</p>
            <div className="text-lg font-semibold text-gray-900">
              {hasCheckedIn ? formatTime(new Date()) : '-'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Attendance Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Aksi Absensi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <button
              onClick={handleCheckIn}
              disabled={!isWorkDay || hasCheckedIn || !isCheckInTime()}
              className={`w-full text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors shadow-lg
                ${(!isWorkDay || hasCheckedIn || !isCheckInTime()) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
            >
              Check In
            </button>
            <p className="text-gray-500 text-sm mt-2">Absen masuk pagi</p>
          </div>
          <div className="text-center">
            <button
              onClick={handleCheckOut}
              disabled={!hasCheckedIn || !isCheckOutTime()}
              className={`w-full text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors shadow-lg
                ${(!hasCheckedIn || !isCheckOutTime()) ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
            >
              Check Out
            </button>
            <p className="text-gray-500 text-sm mt-2">Absen keluar sore</p>
          </div>
        </div>
      </div>
      
      {/* Riwayat Absensi */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Riwayat Absensi (3 Hari Terakhir)</h3>
        <div className="space-y-4">
          {attendanceHistory.map((entry, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar size={20} className="text-gray-500"/>
                <div>
                  <p className="font-semibold text-gray-800">{entry.date}</p>
                  <p className="text-sm text-gray-500">Masuk: {entry.checkIn || '-'} | Keluar: {entry.checkOut || '-'}</p>
                </div>
              </div>
              {getStatusBadge(entry.status)}
            </div>
          ))}
        </div>
      </div>
      
      {/* Absensi Features Box */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <CheckCircle className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Fitur Absensi Terbaru</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span>Hari Kerja: Hanya aktif Senin-Jumat</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span>Jam Masuk: 07:30 dengan toleransi 45 menit (sampai 08:15)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span>Jam Keluar: 15:59 WIB</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span>Deteksi Jam Kerja: Status real-time jam kerja (07:00-18:00)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span>Validasi Otomatis: Cek hari dan jam sebelum absen</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span>Status Kehadiran: Tepat Waktu, Toleransi, atau Terlambat</span>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Absensi;
