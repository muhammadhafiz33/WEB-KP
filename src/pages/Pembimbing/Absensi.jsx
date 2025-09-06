import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Clock, CheckCircle2, XCircle, Calendar, UserRound, Users, Hand, Download } from 'lucide-react';

const API_URL = 'http://localhost:4000/api/pembimbing';

const PembimbingAbsensi = () => {
    const [absensiList, setAbsensiList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const location = useLocation();

    useEffect(() => {
        const fetchAbsensi = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/absensi`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('Gagal memuat data absensi.');
                }

                const data = await response.json();
                setAbsensiList(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
                Swal.fire('Error', err.message, 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAbsensi();
    }, [location.pathname]);

    const handleExportPDF = async () => {
        Swal.fire({
            title: 'Mengekspor Laporan',
            text: 'Mohon tunggu sebentar...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/absensi/export/pdf`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Gagal mengekspor laporan');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = Object.assign(document.createElement('a'), {
                href: url,
                download: `laporan-absensi-bimbingan-${new Date().toISOString().split('T')[0]}.pdf`,
            });
            a.click();
            URL.revokeObjectURL(url);
            Swal.close();
            Swal.fire('Berhasil!', 'Laporan berhasil diekspor.', 'success');
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };


    const getStatusIcon = (status) => {
        switch (status) {
            case 'HADIR':
                return <CheckCircle2 size={16} className="text-green-500" />;
            case 'TERLAMBAT':
                return <Clock size={16} className="text-yellow-500" />;
            case 'IZIN':
                return <Hand size={16} className="text-blue-500" />;
            default:
                return <Clock size={16} className="text-gray-400" />;
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'HADIR':
                return 'bg-green-100 text-green-700';
            case 'TERLAMBAT':
                return 'bg-yellow-100 text-yellow-700';
            case 'IZIN':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    }
    
    // Kelompokkan data berdasarkan tanggal
    const groupedAbsensi = absensiList.reduce((acc, curr) => {
        const date = new Date(curr.tanggal).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(curr);
        return acc;
    }, {});


    const sortedDates = Object.keys(groupedAbsensi).sort((a, b) => new Date(b) - new Date(a));
    const todayAbsensi = absensiList.filter(absensi => new Date(absensi.tanggal).toLocaleDateString('id-ID') === new Date().toLocaleDateString('id-ID'));
    const totalHadir = todayAbsensi.filter(a => a.status === 'HADIR').length;
    const totalTerlambat = todayAbsensi.filter(a => a.status === 'TERLAMBAT').length;
    const totalIzin = todayAbsensi.filter(a => a.status === 'IZIN').length;


    return (
        <div className="space-y-6 p-6 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Monitoring Absensi Mahasiswa Bimbingan</h1>
                    <p className="text-gray-500 mt-1">Lihat status kehadiran harian mahasiswa yang Anda bimbing.</p>
                </div>
                <button onClick={handleExportPDF} className="flex items-center space-x-2 text-white bg-blue-600 px-4 py-2 rounded-lg font-semibold">
                    <Download size={18} /> <span>Export Laporan</span>
                </button>
            </div>
            
            {isLoading ? (
                <div className="p-8 text-center">Memuat data absensi...</div>
            ) : (
                <>
                    {/* Kartu ringkasan absensi hari ini */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-md p-6 border flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold">{totalHadir}</h4>
                                <p className="text-sm text-gray-500">Hadir Hari Ini</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6 border flex items-center space-x-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold">{totalTerlambat}</h4>
                                <p className="text-sm text-gray-500">Terlambat Hari Ini</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6 border flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <Hand size={24} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold">{totalIzin}</h4>
                                <p className="text-sm text-gray-500">Izin Hari Ini</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabel Utama Absensi */}
                    <div className="bg-white rounded-xl shadow-md border overflow-hidden">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-semibold">Riwayat Absensi Mahasiswa</h3>
                            <p className="text-sm text-gray-500">Data kehadiran seluruh mahasiswa bimbingan</p>
                        </div>
                        <div className="overflow-x-auto">
                            {absensiList.length > 0 ? (
                                sortedDates.map(date => (
                                    <div key={date}>
                                        <h4 className="bg-gray-100 text-gray-700 font-bold px-6 py-2 border-b">
                                            {date}
                                        </h4>
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-white">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mahasiswa</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu Masuk</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {groupedAbsensi[date].map((absensi) => (
                                                    <tr key={absensi.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <UserRound size={20} className="text-gray-400 mr-2" />
                                                                <span className="text-sm font-medium text-gray-900">{absensi.nama_mahasiswa}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{absensi.waktu_masuk || '-'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${getStatusBadge(absensi.status)}`}>
                                                                {absensi.status || 'Tidak Absen'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center p-8 text-gray-500">
                                    <Users className="mx-auto h-12 w-12" />
                                    <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada data absensi</h3>
                                    <p className="mt-1 text-sm text-gray-500">Belum ada mahasiswa yang melakukan absensi.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PembimbingAbsensi;