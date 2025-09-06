import React, { useState, useEffect } from "react";
import { UserRound, CircleCheck, Calendar, AlertCircle, Hand } from "lucide-react";
import Swal from "sweetalert2";

const API_URL = "http://localhost:4000/api/absensi";

// 🔹 Helper fetcher
const apiRequest = async (endpoint, method = "GET", body = null) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    if (body) headers["Content-Type"] = "application/json";

    const response = await fetch(`${API_URL}/${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Terjadi kesalahan");
    return data;
};

// 🔹 Helper alert
const showAlert = (title, msg, type = "info") => Swal.fire(title, msg, type);

const Absensi = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [attendanceStatus, setAttendanceStatus] = useState(null);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    // Tambahkan state baru untuk riwayat izin
    const [izinHistory, setIzinHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStatusAndHistory = async () => {
        try {
            setIsLoading(true);
            const [status, history, izin] = await Promise.all([
                apiRequest("status"),
                apiRequest("history"),
                // Tambahkan API call untuk riwayat izin
                apiRequest("izin/history"),
            ]);
            setAttendanceStatus(status);
            setAttendanceHistory(history);
            // Simpan riwayat izin
            setIzinHistory(izin);
        } catch (err) {
            // Tampilkan error di console saja
            console.error('Error fetching status and history:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStatusAndHistory();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // 🔹 Time check
    // Perbaikan: Fungsi ini sekarang selalu mengembalikan 'true' untuk menonaktifkan validasi waktu
    const isCheckInTime = () => {
        return true;
    };

    const isCheckOutTime = () => {
        const h = currentTime.getHours();
        return h >= 16 && h < 18;
    };

    // 🔹 Actions
    const handleCheckIn = async () => {
        if (!isCheckInTime()) return showAlert("Info", "Check-in hanya 06:50 - 08:30 WIB", "info");
        try {
            const data = await apiRequest("check-in", "POST");
            showAlert("Sukses!", data.message, "success");
            fetchStatusAndHistory();
        } catch (err) {
            showAlert("Error", err.message, "error");
        }
    };

    const handleCheckOut = async () => {
        if (!isCheckOutTime()) return showAlert("Info", "Check-out hanya 16:00 - 18:00 WIB", "info");
        try {
            const data = await apiRequest("check-out", "PATCH");
            showAlert("Sukses!", data.message, "success");
            fetchStatusAndHistory();
        } catch (err) {
            showAlert("Error", err.message, "error");
        }
    };

    const handleIzin = async () => {
        const today = new Date().toISOString().split("T")[0];
        const { value: formValues } = await Swal.fire({
            title: "Ajukan Izin",
            html: `
                <input id="swal-tgl" type="date" value="${today}" class="swal2-input" />
                <textarea id="swal-alasan" class="swal2-textarea" placeholder="Alasan..."></textarea>
            `,
            showCancelButton: true,
            confirmButtonText: "Kirim",
            cancelButtonText: "Batal",
            preConfirm: () => {
                const tanggal = document.getElementById("swal-tgl").value;
                const alasan = document.getElementById("swal-alasan").value;
                if (!tanggal || !alasan) {
                    Swal.showValidationMessage("Tanggal & alasan wajib diisi!");
                    return false;
                }
                return { tanggal, alasan };
            },
        });

        if (formValues) {
            try {
                await apiRequest("izin", "POST", {
                    alasan: formValues.alasan,
                    tanggal_izin: formValues.tanggal,
                });
                showAlert("Sukses!", "Permintaan izin berhasil dikirim.", "success");
                fetchStatusAndHistory();
            } catch (err) {
                showAlert("Error", err.message, "error");
            }
        }
    };

    // 🔹 Status Message
    const renderStatus = () => {
        if (isLoading) return <div>Memuat status...</div>;
        if (!attendanceStatus) return null;

        switch (attendanceStatus.status) {
            case "izin":
                return <StatusMessage icon={<Hand />} color="text-blue-600" text="Anda sudah izin hari ini" />;
            case "checked_in":
                return attendanceStatus.data.waktu_keluar
                    ? <StatusMessage icon={<CircleCheck />} color="text-blue-600" text="Absensi selesai hari ini" />
                    : <StatusMessage icon={<CircleCheck />} color="text-green-600" text="Anda sudah check-in" />;
            default:
                return <StatusMessage icon={<AlertCircle />} color="text-yellow-600" text="Belum check-in hari ini" />;
        }
    };

    // 🔹 Badge status
    const getStatusBadge = (status) => {
        const styles = {
            HADIR: "bg-green-100 text-green-700",
            TERLAMBAT: "bg-yellow-100 text-yellow-700",
            IZIN: "bg-blue-100 text-blue-700",
        };
        return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
    };

    // 🔹 Button state
    const isCheckInDisabled = attendanceStatus?.status === "checked_in" || attendanceStatus?.status === "izin";
    const isCheckOutDisabled = attendanceStatus?.status !== "checked_in" || !!attendanceStatus?.data?.waktu_keluar;
    const isIzinDisabled = attendanceStatus?.status === "checked_in" || attendanceStatus?.status === "izin";

    return (
        <div className="space-y-8 p-6 md:p-8">
            {/* Header */}
            <Header currentTime={currentTime} />

            {/* Status */}
            <Card title="Status Absensi Hari Ini">
                <div className="flex items-center justify-between">
                    {renderStatus()}
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Waktu Check-in</p>
                        <div className="text-lg font-semibold">{attendanceStatus?.data?.waktu_masuk || "-"}</div>
                    </div>
                </div>
            </Card>

            {/* Aksi */}
            <Card title="Aksi Absensi">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ActionButton label="Check In" onClick={handleCheckIn} disabled={isCheckInDisabled} color="green" />
                    <ActionButton label="Check Out" onClick={handleCheckOut} disabled={isCheckOutDisabled} color="red" />
                    <ActionButton label="Ajukan Izin" onClick={handleIzin} disabled={isIzinDisabled} color="blue" />
                </div>
            </Card>

            {/* Riwayat Absensi */}
            <Card title="Riwayat Absensi (5 Hari Terakhir)">
                {isLoading ? (
                    <div>Memuat riwayat...</div>
                ) : (
                    <div className="space-y-4">
                        {attendanceHistory.map((entry) => (
                            <div key={entry.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Calendar size={20} className="text-gray-500" />
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {new Date(entry.tanggal).toLocaleDateString("id-ID", {
                                                weekday: "long",
                                                day: "numeric",
                                                month: "long",
                                            })}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {entry.status === "IZIN"
                                                ? `Izin | Alasan: ${entry.alasan}`
                                                : `Masuk: ${entry.waktu_masuk || "-"} | Keluar: ${entry.waktu_keluar || "-"}`}
                                        </p>
                                    </div>
                                </div>
                                {getStatusBadge(entry.status)}
                            </div>
                        ))}
                        {attendanceHistory.length === 0 && (
                            <div className="text-center text-gray-500">Tidak ada riwayat absensi.</div>
                        )}
                    </div>
                )}
            </Card>

            {/* Riwayat Pengajuan Izin */}
            <Card title="Riwayat Pengajuan Izin (5 Hari Terakhir)">
                {isLoading ? (
                    <div>Memuat riwayat izin...</div>
                ) : (
                    <div className="space-y-4">
                        {izinHistory.map((izin) => (
                            <div key={izin.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Hand size={20} className="text-gray-500" />
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {new Date(izin.tanggal_izin).toLocaleDateString("id-ID", {
                                                weekday: "long",
                                                day: "numeric",
                                                month: "long",
                                            })}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Alasan: {izin.alasan}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700`}>IZIN</span>
                            </div>
                        ))}
                        {izinHistory.length === 0 && (
                            <div className="text-center text-gray-500">Tidak ada riwayat pengajuan izin.</div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

// 🔹 Sub Components
const Header = ({ currentTime }) => (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold">Absensi Kerja Praktek</h1>
            <p className="text-blue-100 text-lg">
                Waktu server saat ini: {currentTime.toLocaleTimeString("id-ID")}
            </p>
        </div>
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <UserRound className="w-10 h-10 text-white" />
        </div>
    </div>
);

const Card = ({ title, children }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        {children}
    </div>
);

const ActionButton = ({ label, onClick, disabled, color }) => {
    const colors = {
        green: "bg-green-500 hover:bg-green-600",
        red: "bg-red-500 hover:bg-red-600",
        blue: "bg-blue-500 hover:bg-blue-600",
    };
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors shadow-lg ${colors[color]} disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
            {label}
        </button>
    );
};

const StatusMessage = ({ icon, text, color }) => (
    <div className={`flex items-center space-x-3 ${color}`}>
        {icon}
        <span className="font-semibold">{text}</span>
    </div>
);

export default Absensi;