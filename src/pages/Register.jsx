import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, GraduationCap, Lock, Mail, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";

const API_URL = "http://localhost:4000/api/auth";

const InputField = ({ icon: Icon, type = "text", name, value, onChange, placeholder, required = true, rightElement }) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {rightElement && (
      <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
    )}
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    nim: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setIsLoading(false);
      return Swal.fire("Oops...", "Password dan konfirmasi tidak cocok.", "error");
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_lengkap: formData.nama_lengkap,
          nim: formData.nim,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registrasi gagal");

      Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil!",
        text: "Anda akan diarahkan ke halaman login.",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      }).then(() => navigate("/login"));
    } catch (err) {
      Swal.fire("Registrasi Gagal", err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Kerja Praktek Kominfo Bukittinggi
          </h1>
          <p className="text-gray-500 mt-2">Register Akun Baru</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            icon={User}
            name="nama_lengkap"
            value={formData.nama_lengkap}
            onChange={handleChange}
            placeholder="Nama Lengkap"
          />
          <InputField
            icon={GraduationCap}
            name="nim"
            value={formData.nim}
            onChange={handleChange}
            placeholder="NIM Mahasiswa"
          />
          <InputField
            icon={Mail}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <InputField
            icon={Lock}
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-blue-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />
          <InputField
            icon={Lock}
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Konfirmasi Password"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Mendaftarkan..." : "REGISTER"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p>
            Sudah punya akun?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
