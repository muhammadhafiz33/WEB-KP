import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserRound, Mail, Phone, Building2, FileText, CheckCircle, Clock, Users } from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:4000/api/admin';

const AdminPembimbingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pembimbing, setPembimbing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPembimbingDetail = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/pembimbing/${id}/details`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Gagal memuat detail pembimbing');
            const data = await response.json();
            setPembimbing(data);
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPembimbingDetail();
    }, [id]);

    if (isLoading) {
        return <div className="text-center p-10">Memuat data...</div>;
    }

    if (!pembimbing || !pembimbing.pembimbingInfo) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold">Pembimbing Tidak Ditemukan</h2>
                <button onClick={() => navigate('/admin/pembimbing')} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg">
                    Kembali
                </button>
            </div>
        );
    }
    
    const getStatusIcon = (status) => {
        switch (status) {
            case 'HADIR': return <CheckCircle size={16} className="text-green-500" />;
            case 'TERLAMBAT': return <Clock size={16} className="text-yellow-500" />;
            case 'IZIN': return <Clock size={16} className="text-blue-500" />;
            case 'SAKIT': return <CheckCircle size={16} className="text-red-500" />;
            default: return <Clock size={16} className="text-gray-400" />;
        }
    };
    
    return (
        <div className="space-y-8 p-6 md:p-8">
            <div className="flex items-center space-x-4">
                <button onClick={() => navigate('/admin/pembimbing')} className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Detail Pembimbing</h1>
                    <p className="text-gray-600 mt-1">Monitoring aktivitas {pembimbing.pembimbingInfo.nama_lengkap}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bagian Kiri: Info Profil */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-md border p-6">
                        <div className="text-center mb-6">
                            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <UserRound size={64} className="text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{pembimbing.pembimbingInfo.nama_lengkap || '-'}</h2>
                            <p className="text-lg text-blue-600 font-semibold">{pembimbing.pembimbingInfo.identifier || '-'}</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Mail size={20} className="text-gray-400" />
                                <span className="text-gray-700">{pembimbing.pembimbingInfo.email || '-'}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone size={20} className="text-gray-400" />
                                <span className="text-gray-700">{pembimbing.pembimbingInfo.telepon || '-'}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Building2 size={20} className="text-gray-400" />
                                <span className="text-gray-700">{pembimbing.pembimbingInfo.divisi || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bagian Kanan: Detail Aktivitas */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-md border p-6">
                        <h3 className="text-xl font-semibold mb-4">Aktivitas Mahasiswa Bimbingan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg flex items-center space-x-2">
                                <FileText size={24} />
                                <div>
                                    <p className="text-xl font-bold">{pembimbing.jurnalList.filter(j => j.status === 'PENDING').length}</p>
                                    <p className="text-sm">Jurnal Pending</p>
                                </div>
                            </div>
                            <div className="p-4 bg-green-100 text-green-800 rounded-lg flex items-center space-x-2">
                                <CheckCircle size={24} />
                                <div>
                                    <p className="text-xl font-bold">{pembimbing.jurnalList.filter(j => j.status === 'APPROVED').length}</p>
                                    <p className="text-sm">Jurnal Disetujui</p>
                                </div>
                            </div>
                            <div className="p-4 bg-blue-100 text-blue-800 rounded-lg flex items-center space-x-2">
                                <Users size={24} />
                                <div>
                                    <p className="text-xl font-bold">{pembimbing.mahasiswaList.length}</p>
                                    <p className="text-sm">Total Mahasiswa</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabel Jurnal */}
                    <div className="bg-white rounded-xl shadow-md border overflow-hidden">
                        <h3 className="text-xl font-semibold p-6 border-b">Daftar Jurnal Mahasiswa Bimbingan</h3>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mahasiswa</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kegiatan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pembimbing.jurnalList.length > 0 ? (
                                    pembimbing.jurnalList.map((jurnal) => (
                                        <tr key={jurnal.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{jurnal.nama_lengkap}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(jurnal.tanggal).toLocaleDateString('id-ID')}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{jurnal.kegiatan}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${jurnal.status === 'APPROVED' ? 'bg-green-100 text-green-700' : jurnal.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                    {jurnal.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="text-center p-4 text-gray-500">Tidak ada jurnal.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPembimbingDetail;