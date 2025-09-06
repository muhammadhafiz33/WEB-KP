import React, { useState, useEffect } from "react";
import { UserRound, Mail, Phone, Building2, Edit, Save, X } from "lucide-react";
import Swal from "sweetalert2";

const API_URL = "http://localhost:4000/api/profile";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState(null);

  // 🔹 Helper: ubah null → string kosong
  const sanitizeData = (data) =>
    Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v ?? ""]));

  // 🔹 Fetch data profil
  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Gagal memuat profil");

      const data = await response.json();
      const sanitized = sanitizeData(data);

      setProfileData(sanitized);
      setEditData(sanitized);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 🔹 Handle input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Save profile
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) throw new Error("Gagal menyimpan profil");

      Swal.fire("Sukses!", "Profil berhasil diperbarui.", "success");
      setProfileData(editData);
      setIsEditing(false);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // 🔹 Cancel edit
  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  // 🔹 Loading & error state
  if (isLoading) return <div className="p-10 text-center">Memuat profil...</div>;
  if (!profileData) return <div className="p-10 text-center">Gagal memuat data.</div>;

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Profil Pembimbing</h2>
          <p className="text-gray-500">Kelola informasi profil Anda</p>
        </div>
        {!isEditing ? (
          <ActionButton
            onClick={() => setIsEditing(true)}
            color="blue"
            icon={Edit}
            label="Edit Profil"
          />
        ) : (
          <div className="flex space-x-2">
            <ActionButton onClick={handleCancel} icon={X} label="Batal" />
            <ActionButton
              onClick={handleSave}
              color="green"
              icon={Save}
              label="Simpan"
            />
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl p-8 shadow-md border">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar */}
          <div className="w-36 h-36 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <UserRound size={64} />
          </div>

          {/* Info */}
          <div className="flex-1 w-full">
            <EditableInput
              name="nama_lengkap"
              value={editData.nama_lengkap}
              onChange={handleInputChange}
              isEditing={isEditing}
              placeholder="Nama Lengkap Pembimbing"
              className="text-2xl font-bold"
            />
            <EditableInput
              name="jabatan"
              value={editData.jabatan}
              onChange={handleInputChange}
              isEditing={isEditing}
              placeholder="Jabatan"
              className="text-gray-500 mb-6"
            />

            {/* Grid fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              <InfoField
                icon={Mail}
                label="Email"
                name="email"
                value={editData.email}
                onChange={handleInputChange}
                isEditing={isEditing}
              />
              <InfoField
                icon={Phone}
                label="Telepon"
                name="telepon"
                value={editData.telepon}
                onChange={handleInputChange}
                isEditing={isEditing}
              />
              <InfoField
                icon={Building2}
                label="Divisi"
                name="divisi"
                value={editData.divisi}
                onChange={handleInputChange}
                isEditing={isEditing}
                className="md:col-span-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 🔹 Reusable Components */

// Tombol aksi
const ActionButton = ({ onClick, icon: Icon, label, color }) => {
  const base =
    "flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition";
  const styles = color
    ? `bg-${color}-600 text-white hover:bg-${color}-700`
    : "border hover:bg-gray-50";

  return (
    <button onClick={onClick} className={`${base} ${styles}`}>
      <Icon size={20} /> <span>{label}</span>
    </button>
  );
};

// Input editable (judul & jabatan)
const EditableInput = ({ name, value, onChange, isEditing, placeholder, className }) => (
  <input
    type="text"
    name={name}
    value={value}
    onChange={onChange}
    disabled={!isEditing}
    placeholder={placeholder}
    className={`w-full bg-transparent border-b ${
      isEditing ? "border-gray-300 focus:border-blue-600" : "border-transparent"
    } focus:outline-none ${className}`}
  />
);

// Field dengan ikon
const InfoField = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  isEditing,
  type = "text",
  className = "",
}) => (
  <div className={`flex items-center space-x-3 ${className}`}>
    <Icon className="text-blue-600 flex-shrink-0" size={20} />
    <div className="flex-1">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={!isEditing}
        placeholder={label}
        className={`w-full text-sm font-medium bg-transparent border-b ${
          isEditing ? "border-gray-300 focus:border-blue-600" : "border-transparent"
        } focus:outline-none`}
      />
    </div>
  </div>
);

export default Profile;
