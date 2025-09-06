import React, { useState, useEffect } from 'react';
import { Search, Calendar, CheckCircle, XCircle, AlertCircle, Download, Users, UserRound, Hand, Eye } from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:4000/api/admin';

// Helper function untuk format tanggal ke format YYYY-MM-DD
const formatDate = (date) => date.toISOString().split('T')[0];

// Helper function untuk mendapatkan tanggal-tanggal terakhir
const getLastNDays = (n) => {
    const dates = [];
    for (let i = 0; i < n; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(formatDate(d));
    }
    return dates;
};

const Absensi = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState(formatDate(new Date()));
    const [attendanceData, setAttendanceData] = useState([]);
    const [izinData, setIzinData] = useState([]); // State baru untuk data izin
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingIzin, setIsLoadingIzin] = useState(true); // State loading baru untuk izin
    const [viewMode, setViewMode] = useState('singleDay');

    // Fungsi untuk mengambil data absensi satu hari
    const fetchSingleDayData = async (date) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/absensi?tanggal=${date}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Gagal memuat data absensi');
            const data = await response.json();
            setAttendanceData(data);
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
            setAttendanceData([]);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Fungsi untuk mengambil data izin dari endpoint history
    const fetchIzinData = async () => {
        setIsLoadingIzin(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/admin/izin/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Gagal memuat data izin');
            const data = await response.json();
            setIzinData(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
            setIzinData([]);
        } finally {
            setIsLoadingIzin(false);
        }
    };

    // Fungsi untuk mengambil data absensi 3 hari ke belakang
    const fetchHistoryData = async () => {
        setIsLoading(true);
        const dates = getLastNDays(3);
        const token = localStorage.getItem('token');
        try {
            const promises = dates.map(date =>
                fetch(`${API_URL}/absensi?tanggal=${date}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(res => res.json())
            );
            const allData = await Promise.all(promises);
            const combinedData = allData.flatMap((data, index) =>
                data.map(item => ({ ...item, tanggal: dates[index] }))
            );
            setAttendanceData(combinedData);
        } catch (error) {
            Swal.fire('Error', 'Gagal memuat riwayat absensi', 'error');
            setAttendanceData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (viewMode === 'singleDay' && filterDate) {
            fetchSingleDayData(filterDate);
        } else if (viewMode === 'history') {
            fetchHistoryData();
        }
        // Panggil fungsi fetchIzinData saat komponen dimuat
        fetchIzinData();
    }, [filterDate, viewMode]);

    const handleDateChange = (e) => {
        setFilterDate(e.target.value);
        setViewMode('singleDay');
    };

    const handleExport = async () => {
        if (!filterDate) {
            Swal.fire('Error', 'Silakan pilih tanggal terlebih dahulu.', 'error');
            return;
        }
        Swal.fire({
            title: 'Mengekspor Laporan Absensi',
            text: 'Mohon tunggu sebentar...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/absensi/export?tanggal=${filterDate}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Gagal mengekspor data');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `laporan-absensi-${filterDate}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            Swal.close();
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    const handleExportIzin = async () => {
        Swal.fire({
            title: 'Mengekspor Riwayat Izin',
            text: 'Mohon tunggu sebentar...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        try {
            const token = localStorage.getItem('token');
            // UBAH BARIS INI
            const response = await fetch('http://localhost:4000/api/admin/izin/export/pdf', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Gagal mengekspor riwayat izin');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `riwayat-izin.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            Swal.close();
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'HADIR': return <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">Hadir</span>;
            case 'TERLAMBAT': return <span className="px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">Terlambat</span>;
            case 'TIDAK_HADIR': return <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">Tidak Hadir</span>;
            default: return null;
        }
    };
    
    // Badge untuk status Izin
    const getIzinStatusBadge = (status) => {
        switch (status) {
            case 'DISETUJUI': return <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">Disetujui</span>;
            case 'DITOLAK': return <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">Ditolak</span>;
            case 'PENDING': return <span className="px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">Pending</span>;
            default: return null;
        }
    };

    const filteredAttendance = attendanceData.filter(att =>
        (att.nama_lengkap && att.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (att.nim && att.nim.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const stats = {
        hadir: attendanceData.filter(a => a.status === 'HADIR').length,
        terlambat: attendanceData.filter(a => a.status === 'TERLAMBAT').length,
        tidakHadir: attendanceData.filter(a => a.status === 'TIDAK_HADIR').length
    };

    const groupedData = filteredAttendance.reduce((acc, curr) => {
        const date = curr.tanggal;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(curr);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));

    return (
        <div className="space-y-8 p-6 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Monitoring Absensi</h1>
                    <p className="text-gray-600 mt-1">Pantau kehadiran mahasiswa kerja praktek</p>
                </div>
                <button onClick={handleExport} className="flex items-center space-x-2 text-white bg-blue-600 px-4 py-2 rounded-lg font-semibold">
                    <Download size={18} /> <span>Export Laporan</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard icon={CheckCircle} title="Hadir" value={stats.hadir} color="green" />
                <StatCard icon={AlertCircle} title="Terlambat" value={stats.terlambat} color="yellow" />
                <StatCard icon={XCircle} title="Tidak Hadir" value={stats.tidakHadir} color="red" />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" placeholder="Cari mahasiswa (nama atau NIM)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg w-full" />
                    </div>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="date" value={filterDate} onChange={handleDateChange} className="pl-10 pr-4 py-2 border rounded-lg w-full" />
                    </div>
                </div>
            </div>

            {/* Tabel Riwayat Absensi */}
            <div className="bg-white rounded-xl shadow-md border overflow-hidden">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold">
                        {viewMode === 'singleDay'
                            ? `Data Absensi - ${new Date(filterDate).toLocaleDateString('id-ID', { dateStyle: 'full' })}`
                            : 'Riwayat Absensi 3 Hari Terakhir'}
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="text-center p-6">Memuat data...</div>
                    ) : (
                        viewMode === 'singleDay' ? (
                            <AttendanceTable data={filteredAttendance} getStatusBadge={getStatusBadge} />
                        ) : (
                            sortedDates.length > 0 ? (
                                sortedDates.map(date => (
                                    <div key={date}>
                                        <h4 className="bg-gray-50 text-gray-500 font-bold px-6 py-2 border-b">
                                            {new Date(date).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                                        </h4>
                                        <AttendanceTable data={groupedData[date]} getStatusBadge={getStatusBadge} />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center p-6 text-gray-500">Tidak ada data absensi untuk 3 hari terakhir.</div>
                            )
                        )
                    )}
                </div>
            </div>
            
            {/* Tabel Riwayat Izin (BARU) */}
            <div className="bg-white rounded-xl shadow-md border overflow-hidden mt-8">
                <div className="p-6 border-b flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Riwayat Pengajuan Izin</h3>
                    <button onClick={handleExportIzin} className="flex items-center space-x-2 text-white bg-blue-600 px-4 py-2 rounded-lg font-semibold">
                        <Download size={18} /> <span>Export PDF</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    {isLoadingIzin ? (
                        <div className="text-center p-6">Memuat data izin...</div>
                    ) : (
                        izinData.length > 0 ? (
                            <IzinTable data={izinData} />
                        ) : (
                            <div className="text-center p-6 text-gray-500">Tidak ada pengajuan izin.</div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

const AttendanceTable = ({ data, getStatusBadge }) => {
    return (
        <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Mahasiswa</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Masuk</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Keluar</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Status</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y">
                {data.length > 0 ? (
                    data.map((att) => (
                        <tr key={att.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"><UserRound className="text-blue-600" size={20} /></div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium">{att.nama_lengkap || att.nim}</div>
                                        <div className="text-sm text-gray-500">{att.nim}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{att.waktu_masuk || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{att.waktu_keluar || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(att.status)}</td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan="4" className="text-center p-6 text-gray-500">Tidak ada data absensi.</td></tr>
                )}
            </tbody>
        </table>
    );
};

// Helper untuk format tanggal ISO ke lokal
const formatDateTime = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString('id-ID', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
};

// Komponen tabel untuk Izin (UPDATE: format tanggal)
const IzinTable = ({ data }) => {
    return (
        <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">User ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">NIM</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Alasan</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Tanggal Izin</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Created At</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y">
                {data.length > 0 ? (
                    data.map((izin) => (
                        <tr key={izin.id}>
                            <td className="px-6 py-4">{izin.id}</td>
                            <td className="px-6 py-4">{izin.user_id}</td>
                            <td className="px-6 py-4">{izin.nim}</td>
                            <td className="px-6 py-4">{izin.email}</td>
                            <td className="px-6 py-4">{izin.alasan}</td>
                            <td className="px-6 py-4">{formatDateTime(izin.tanggal_izin)}</td>
                            <td className="px-6 py-4">{formatDateTime(izin.created_at)}</td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan="7" className="text-center p-6 text-gray-500">Tidak ada pengajuan izin.</td></tr>
                )}
            </tbody>
        </table>
    );
};

const StatCard = ({ icon: Icon, title, value, color }) => {
    const colors = {
        green: 'text-green-600 bg-green-100',
        yellow: 'text-yellow-600 bg-yellow-100',
        red: 'text-red-600 bg-red-100',
    };
    return (
        <div className="bg-white rounded-xl p-6 shadow-md border">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className={`text-3xl font-bold text-${color}-600 mt-1`}>{value}</p>
                </div>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${colors[color]}`}>
                    <Icon size={28} />
                </div>
            </div>
        </div>
    );
};

export default Absensi;