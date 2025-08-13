import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Eye,
  Download,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  MapPin
} from 'lucide-react';

const Mahasiswa = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingMahasiswa, setEditingMahasiswa] = useState(null);

  // Mock data mahasiswa
  const [mahasiswaList, setMahasiswaList] = useState([
    {
      id: 1,
      nim: '2021001',
      nama: 'Ahmad Fadillah',
      email: 'ahmad.fadillah@email.com',
      telepon: '081234567890',
      universitas: 'Universitas Indonesia',
      jurusan: 'Teknik Informatika',
      angkatan: '2021',
      tanggalMulai: '2024-11-01',
      tanggalSelesai: '2025-01-31',
      status: 'active',
      pembimbing: 'Ir. Budi Santoso, M.Kom',
      divisi: 'Divisi Sistem Informasi'
    },
    {
      id: 2,
      nim: '2021002',
      nama: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@email.com',
      telepon: '081234567891',
      universitas: 'Institut Teknologi Bandung',
      jurusan: 'Sistem Informasi',
      angkatan: '2021',
      tanggalMulai: '2024-11-01',
      tanggalSelesai: '2025-01-31',
      status: 'active',
      pembimbing: 'Ir. Siti Aminah, M.T',
      divisi: 'Divisi Infrastruktur IT'
    },
    {
      id: 3,
      nim: '2021003',
      nama: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      telepon: '081234567892',
      universitas: 'Universitas Gadjah Mada',
      jurusan: 'Teknik Komputer',
      angkatan: '2021',
      tanggalMulai: '2024-11-01',
      tanggalSelesai: '2025-01-31',
      status: 'completed',
      pembimbing: 'Ir. Ahmad Hidayat, M.Kom',
      divisi: 'Divisi Keamanan Siber'
    }
  ]);

  const [formData, setFormData] = useState({
    nim: '',
    nama: '',
    email: '',
    telepon: '',
    universitas: '',
    jurusan: '',
    angkatan: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    status: 'active',
    pembimbing: '',
    divisi: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingMahasiswa) {
      // Update existing mahasiswa
      setMahasiswaList(prev => 
        prev.map(item => 
          item.id === editingMahasiswa.id 
            ? { ...formData, id: item.id }
            : item
        )
      );
      setEditingMahasiswa(null);
    } else {
      // Add new mahasiswa
      const newMahasiswa = {
        id: Date.now(),
        ...formData
      };
      setMahasiswaList(prev => [newMahasiswa, ...prev]);
    }

    setFormData({
      nim: '',
      nama: '',
      email: '',
      telepon: '',
      universitas: '',
      jurusan: '',
      angkatan: '',
      tanggalMulai: '',
      tanggalSelesai: '',
      status: 'active',
      pembimbing: '',
      divisi: ''
    });
    setShowForm(false);
  };

  const handleEdit = (mahasiswa) => {
    setEditingMahasiswa(mahasiswa);
    setFormData(mahasiswa);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus mahasiswa ini?')) {
      setMahasiswaList(prev => prev.filter(item => item.id !== id));
    }
  };

  const filteredMahasiswa = mahasiswaList.filter(mahasiswa => {
    const matchesSearch = 
      mahasiswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mahasiswa.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mahasiswa.universitas.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || mahasiswa.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Aktif</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Selesai</span>;
      case 'inactive':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Tidak Aktif</span>;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'completed':
        return 'text-blue-600';
      case 'inactive':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Layout title="Data Mahasiswa" isAdmin={true}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Data Mahasiswa</h2>
            <p className="text-gray-600">Kelola data mahasiswa kerja praktek</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Tambah Mahasiswa</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari mahasiswa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="completed">Selesai</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mahasiswa Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingMahasiswa ? 'Edit Mahasiswa' : 'Tambah Mahasiswa Baru'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingMahasiswa(null);
                  setFormData({
                    nim: '',
                    nama: '',
                    email: '',
                    telepon: '',
                    universitas: '',
                    jurusan: '',
                    angkatan: '',
                    tanggalMulai: '',
                    tanggalSelesai: '',
                    status: 'active',
                    pembimbing: '',
                    divisi: ''
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIM
                  </label>
                  <input
                    type="text"
                    name="nim"
                    value={formData.nim}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telepon
                  </label>
                  <input
                    type="tel"
                    name="telepon"
                    value={formData.telepon}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Universitas
                  </label>
                  <input
                    type="text"
                    name="universitas"
                    value={formData.universitas}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jurusan
                  </label>
                  <input
                    type="text"
                    name="jurusan"
                    value={formData.jurusan}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Angkatan
                  </label>
                  <input
                    type="number"
                    name="angkatan"
                    value={formData.angkatan}
                    onChange={handleInputChange}
                    required
                    min="2000"
                    max="2030"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Aktif</option>
                    <option value="completed">Selesai</option>
                    <option value="inactive">Tidak Aktif</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    name="tanggalMulai"
                    value={formData.tanggalMulai}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    name="tanggalSelesai"
                    value={formData.tanggalSelesai}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pembimbing
                  </label>
                  <input
                    type="text"
                    name="pembimbing"
                    value={formData.pembimbing}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Divisi
                  </label>
                  <input
                    type="text"
                    name="divisi"
                    value={formData.divisi}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingMahasiswa(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingMahasiswa ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mahasiswa List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Daftar Mahasiswa</h3>
                <p className="text-sm text-gray-600">Total {filteredMahasiswa.length} mahasiswa</p>
              </div>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                <Download size={16} />
                <span>Export Data</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mahasiswa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Universitas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Periode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pembimbing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMahasiswa.map((mahasiswa) => (
                  <tr key={mahasiswa.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {mahasiswa.nama.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{mahasiswa.nama}</div>
                          <div className="text-sm text-gray-500">{mahasiswa.nim}</div>
                          <div className="text-sm text-gray-500">{mahasiswa.jurusan}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{mahasiswa.universitas}</div>
                      <div className="text-sm text-gray-500">Angkatan {mahasiswa.angkatan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(mahasiswa.tanggalMulai).toLocaleDateString('id-ID')}
                      </div>
                      <div className="text-sm text-gray-500">
                        s/d {new Date(mahasiswa.tanggalSelesai).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(mahasiswa.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{mahasiswa.pembimbing}</div>
                      <div className="text-sm text-gray-500">{mahasiswa.divisi}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEdit(mahasiswa)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(mahasiswa.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredMahasiswa.length === 0 && (
              <div className="p-12 text-center">
                <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada data mahasiswa</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Coba ubah filter atau kata kunci pencarian'
                    : 'Mulai dengan menambahkan mahasiswa pertama'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Mahasiswa;
