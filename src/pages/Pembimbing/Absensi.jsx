import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Clock, CheckCircle2, XCircle, Calendar, UserRound } from 'lucide-react';

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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'HADIR':
                return <CheckCircle2 size={16} className="text-green-500" />;
            case 'TERLAMBAT':
                return <Clock size={16} className="text-yellow-500" />;
            case 'IZIN':
                return <Clock size={16} className="text-blue-500" />;
            case 'SAKIT':
                return <XCircle size={16} className="text-red-500" />;
            default:
                return <Clock size={16} className="text-gray-400" />;
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Memuat data absensi...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="space-y-6 p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-900">Monitoring Absensi Mahasiswa Bimbingan</h1>
            <p className="text-gray-500 mt-1">Lihat status kehadiran harian mahasiswa yang Anda bimbing.</p>

            <div className="bg-white rounded-xl shadow-md border overflow-hidden">
                <div className="p-6 border-b">
                    <h3 className="text-xl font-semibold">Daftar Absensi</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mahasiswa</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu Masuk</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catatan</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {absensiList.length > 0 ? (
                                absensiList.map((absensi) => (
                                    <tr key={absensi.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <UserRound size={20} className="text-gray-400 mr-2" />
                                                <span className="text-sm font-medium text-gray-900">{absensi.nama_mahasiswa}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <Calendar size={16} />
                                                <span>{new Date(absensi.tanggal).toLocaleDateString('id-ID')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{absensi.waktu_masuk || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center space-x-1">
                                                {getStatusIcon(absensi.status)}
                                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${
                                                    absensi.status === 'HADIR' ? 'bg-green-100 text-green-700' :
                                                    absensi.status === 'TERLAMBAT' ? 'bg-yellow-100 text-yellow-700' :
                                                    absensi.status === 'IZIN' ? 'bg-blue-100 text-blue-700' :
                                                    absensi.status === 'SAKIT' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {absensi.status || 'Tidak Absen'}
                                                </span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{absensi.keterangan || '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center p-4 text-gray-500">
                                        Tidak ada data absensi mahasiswa bimbingan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PembimbingAbsensi;