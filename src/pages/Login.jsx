import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';

// Ganti URL ini sesuai dengan alamat backend Anda
const API_URL = 'http://localhost:4000/api/auth';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      identifier: formData.identifier,
      password: formData.password,
    };

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan');
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil!',
        text: `Selamat datang, ${data.user.identifier}`,
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      }).then(() => {
        // Navigasi dilakukan berdasarkan peran yang diterima dari backend
        if (data.user.role === 'MAHASISWA') {
          navigate('/student/dashboard');
        } else if (data.user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          // Navigasi default jika peran tidak dikenali
          navigate('/');
        }
      });

    } catch (err) {
      console.error('Login failed:', err);
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm border border-gray-200">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-blue-900">
            <span className="text-black italic">Jurnal</span><span className="italic">KP</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">Jurnal Kerja Praktek</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="text-sm text-blue-900 font-medium mb-1 block">
              Username atau NIM
            </label>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleInputChange}
              required
              className="w-full py-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="relative">
            <label className="text-sm text-blue-900 font-medium mb-1 block">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full py-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 bottom-2 text-gray-400 hover:text-blue-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging In...' : 'LOGIN'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Belum punya akun?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-600 font-medium hover:underline"
            >
              Daftar sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;