import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  FileText,
  Download,
  Users,
} from "lucide-react";

const API_URL = "http://localhost:4000/api/admin";

// 🔹 Utility: Format Tanggal
const formatTanggal = (date) =>
  new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// 🔹 Status Badge Component
const StatusBadge = ({ status }) => {
  const statusMap = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
  };
  const labelMap = {
    approved: "Disetujui",
    pending: "Menunggu",
    rejected: "Ditolak",
  };

  return status ? (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${statusMap[status.toLowerCase()]}`}
    >
      {labelMap[status.toLowerCase()] || status}
    </span>
  ) : null;
};

// 🔹 Confirm Swal
const confirmAction = async (title, callback) => {
  const result = await Swal.fire({
    title,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
  });
  if (result.isConfirmed) await callback();
};

// 🔹 Reject with reason Swal
const rejectWithReason = async (callback) => {
  const { value } = await Swal.fire({
    input: "textarea",
    inputLabel: "Tulis komentar untuk menolak jurnal",
    inputPlaceholder: "Masukkan alasan penolakan...",
    showCancelButton: true,
    confirmButtonText: "Tolak",
    cancelButtonText: "Batal",
    inputValidator: (v) => (!v ? "Alasan penolakan tidak boleh kosong!" : null),
  });
  if (value) await callback(value);
};

// 🔹 Jurnal Card
const JurnalCard = ({ jurnal, onDetail, onApprove, onReject }) => (
  <div className="p-6 border-b last:border-none">
    <div className="flex items-start justify-between">
      {/* Left Content */}
      <div className="flex-1 space-y-3">
        <div className="flex items-center space-x-3 flex-wrap">
          <div className="flex items-center space-x-2">
            <User size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-900">
              {jurnal.nama_lengkap || "(Nama Belum Diisi)"}
            </span>
            <span className="text-sm text-gray-500">({jurnal.nim})</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {formatTanggal(jurnal.tanggal)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">{jurnal.jam_kerja} jam</span>
          </div>
          <StatusBadge status={jurnal.status} />
        </div>

        <div>
          <h4 className="font-medium text-gray-900">Kegiatan:</h4>
          <p className="text-gray-700">{jurnal.kegiatan}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">Output/Hasil:</h4>
          <p className="text-gray-700">{jurnal.deskripsi}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 ml-4">
        <button
          onClick={() => onDetail(jurnal)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          <Eye size={16} />
        </button>
        {(!jurnal.status || jurnal.status.toLowerCase() === "pending") && (
          <>
            <button
              onClick={() => onApprove(jurnal.id)}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
            >
              <CheckCircle size={16} />
            </button>
            <button
              onClick={() => onReject(jurnal.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
            >
              <XCircle size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  </div>
);

const Jurnal = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMahasiswa, setFilterMahasiswa] = useState("all");
  const [jurnals, setJurnals] = useState([]);
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJurnal, setSelectedJurnal] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // 🔹 Fetch Data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [jurnalRes, userRes] = await Promise.all([
        fetch(`${API_URL}/jurnals`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!jurnalRes.ok) throw new Error("Gagal mengambil data jurnal");
      if (!userRes.ok) throw new Error("Gagal mengambil data mahasiswa");

      setJurnals(await jurnalRes.json());
      const users = await userRes.json();
      setMahasiswaList(users.map((u) => ({ nama: u.nama_lengkap, nim: u.identifier })));
    } catch (e) {
      Swal.fire("Error", e.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 🔹 Approve/Reject
  const updateStatus = async (id, status, komentar = "") => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/jurnals/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: status.toUpperCase(), komentar_admin: komentar }),
      });
      if (!res.ok) throw new Error("Gagal update status");
      Swal.fire("Berhasil!", `Jurnal berhasil di${status === "approved" ? "setujui" : "tolak"}.`, "success");
      fetchData();
    } catch (e) {
      Swal.fire("Error", e.message, "error");
    }
  };

  const handleApprove = (id) =>
    confirmAction("Apakah Anda yakin ingin menyetujui jurnal ini?", () => updateStatus(id, "approved"));

  const handleReject = (id) =>
    rejectWithReason((komentar) => updateStatus(id, "rejected", komentar));

  // 🔹 Export PDF
  const handleExportPDF = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/jurnals/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal mengekspor laporan");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), {
        href: url,
        download: `laporan-jurnal-${new Date().toISOString().split("T")[0]}.pdf`,
      });
      a.click();
      URL.revokeObjectURL(url);
      Swal.fire("Berhasil!", "Laporan berhasil diekspor.", "success");
    } catch (e) {
      Swal.fire("Error", e.message, "error");
    }
  };

  // 🔹 Filtered Data
  const filteredJurnals = jurnals.filter((j) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (j.kegiatan || "").toLowerCase().includes(term) ||
      (j.nama_lengkap || "").toLowerCase().includes(term) ||
      (j.nim || "").toLowerCase().includes(term);
    const matchesStatus = filterStatus === "all" || j.status?.toLowerCase() === filterStatus;
    const matchesMahasiswa =
      filterMahasiswa === "all" || j.nama_lengkap?.toLowerCase() === filterMahasiswa.toLowerCase();
    return matchesSearch && matchesStatus && matchesMahasiswa;
  });

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Review Jurnal Kegiatan</h2>
          <p className="text-gray-500 mt-1">Review dan approval jurnal mahasiswa kerja praktek</p>
        </div>
        <button
          onClick={handleExportPDF}
          className="flex items-center space-x-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-lg font-semibold hover:opacity-90"
        >
          <Download size={18} />
          <span>Export Laporan</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari jurnal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <Users size={20} className="text-gray-500" />
          <select
            value={filterMahasiswa}
            onChange={(e) => setFilterMahasiswa(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full"
          >
            <option value="all">Semua Mahasiswa</option>
            {mahasiswaList.map((m, i) => (
              <option key={i} value={m.nama}>
                {m.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Jurnal List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Daftar Jurnal</h3>
          <p className="text-sm text-gray-500">Total {filteredJurnals.length} jurnal</p>
        </div>
        {isLoading ? (
          <div className="text-center p-12 text-gray-500">Memuat data jurnal...</div>
        ) : filteredJurnals.length > 0 ? (
          filteredJurnals.map((j) => (
            <JurnalCard
              key={j.id}
              jurnal={j}
              onDetail={setSelectedJurnal}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        ) : (
          <div className="p-12 text-center text-gray-500">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada jurnal</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== "all" || filterMahasiswa !== "all"
                ? "Coba ubah filter atau kata kunci pencarian"
                : "Belum ada jurnal yang tersubmit"}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedJurnal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Detail Jurnal</h3>
              <button onClick={() => setSelectedJurnal(null)}>&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Mahasiswa</label>
                  <p className="font-semibold">{selectedJurnal.nama_lengkap}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">NIM</label>
                  <p>{selectedJurnal.nim}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Tanggal</label>
                  <p>{formatTanggal(selectedJurnal.tanggal)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Jam Kerja</label>
                  <p>{selectedJurnal.jam_kerja} jam</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Kegiatan</label>
                <p>{selectedJurnal.kegiatan}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Deskripsi</label>
                <p>{selectedJurnal.deskripsi}</p>
              </div>
              {selectedJurnal.hambatan && (
                <div>
                  <label className="text-sm font-medium">Hambatan</label>
                  <p>{selectedJurnal.hambatan}</p>
                </div>
              )}
              {selectedJurnal.rencana_selanjutnya && (
                <div>
                  <label className="text-sm font-medium">Rencana Selanjutnya</label>
                  <p>{selectedJurnal.rencana_selanjutnya}</p>
                </div>
              )}
              {selectedJurnal.komentar_admin && (
                <div>
                  <label className="text-sm font-medium">Komentar Admin</label>
                  <p className="bg-blue-50 p-3 rounded-lg">{selectedJurnal.komentar_admin}</p>
                </div>
              )}
            </div>
            {(selectedJurnal.status === "pending" || selectedJurnal.status === "rejected") && (
              <div className="p-6 border-t flex space-x-3 bg-gray-50">
                <button
                  onClick={() => {
                    handleApprove(selectedJurnal.id);
                    setSelectedJurnal(null);
                  }}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg"
                >
                  <CheckCircle size={16} className="inline mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedJurnal.id);
                    setSelectedJurnal(null);
                  }}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg"
                >
                  <XCircle size={16} className="inline mr-2" />
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Jurnal;
