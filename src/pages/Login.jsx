import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, GraduationCap, Building2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('mahasiswa');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Akun admin yang sudah ditentukan (hardcoded)
    const defaultAccounts = [
      { username: 'admin', password: '123', userType: 'admin' }
    ];

    // Ambil akun mahasiswa dari localStorage (jika ada)
    const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
    
    // Gabungkan akun default dengan akun yang terdaftar
    const allAccounts = [...defaultAccounts, ...storedAccounts];

    // Cari akun yang cocok dengan username dan password yang diinput
    const foundAccount = allAccounts.find(
      account => account.username === formData.username && account.password === formData.password
    );

    if (foundAccount) {
      // Simpan data user yang berhasil login
      localStorage.setItem('currentUser', JSON.stringify(foundAccount));

      if (foundAccount.userType === 'mahasiswa') {
        navigate('/student/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } else {
      alert('Username atau password salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm border border-gray-200">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {/* Mengganti img dengan ikon Building2 */}
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-blue-900">
            <span className="text-black italic">Jurnal</span><span className="italic">KP</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">Jurnal Kerja Praktek</p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1.5 mb-6">
          <button
            type="button"
            onClick={() => setUserType('mahasiswa')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all duration-300 ${
              userType === 'mahasiswa'
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <GraduationCap size={20} />
            <span className="font-semibold text-sm">Mahasiswa</span>
          </button>
          <button
            type="button"
            onClick={() => setUserType('admin')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all duration-300 ${
              userType === 'admin'
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Building2 size={20} />
            <span className="font-semibold text-sm">Admin</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="text-sm text-blue-900 font-medium mb-1 block">
              {userType === 'mahasiswa' ? 'NIM' : 'Username'}
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
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
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            LOGIN
          </button>
        </form>

        {userType !== 'admin' && (
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
        )}
      </div>
    </div>
  );
};

export default Login;
