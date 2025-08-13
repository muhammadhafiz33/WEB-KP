import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, Building2, GraduationCap, Sparkles, Shield } from 'lucide-react';

const Login = () => {
  const [userType, setUserType] = useState('mahasiswa');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    
    // Simulasi loading
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (formData.username && formData.password) {
      if (userType === 'mahasiswa') {
        console.log('Navigating to student dashboard');
      } else {
        console.log('Navigating to admin dashboard');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className={`max-w-md w-full relative z-10 transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        {/* Logo dan Header */}
        <div className="text-center mb-8">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-75 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
              <Building2 className="text-white drop-shadow-lg" size={48} />
              <div className="absolute top-1 right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-3">
            Kominfo KP
          </h1>
          <p className="text-gray-300 text-lg font-light">Sistem Kerja Praktek Digital</p>
          <div className="flex items-center justify-center mt-2 text-gray-400">
            <Shield size={16} className="mr-2" />
            <span className="text-sm">Secure & Modern Platform</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-3xl"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* User Type Selector */}
            <div className="flex bg-black/20 backdrop-blur-sm rounded-xl p-1.5 mb-8 border border-white/10">
              <button
                type="button"
                onClick={() => setUserType('mahasiswa')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 ${
                  userType === 'mahasiswa'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <GraduationCap size={22} />
                <span className="font-semibold">Mahasiswa</span>
                {userType === 'mahasiswa' && <Sparkles size={16} className="animate-pulse" />}
              </button>
              <button
                type="button"
                onClick={() => setUserType('admin')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 ${
                  userType === 'admin'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Building2 size={22} />
                <span className="font-semibold">Admin</span>
                {userType === 'admin' && <Sparkles size={16} className="animate-pulse" />}
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200 mb-3">
                  {userType === 'mahasiswa' ? 'Nomor Induk Mahasiswa' : 'Username Admin'}
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors z-10" size={22} />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder={userType === 'mahasiswa' ? 'Masukkan NIM Anda' : 'Masukkan username'}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-black/20 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-black/30"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200 mb-3">
                  Kata Sandi
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors z-10" size={22} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Masukkan kata sandi"
                    required
                    className="w-full pl-12 pr-14 py-4 bg-black/20 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:bg-black/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-white/30 rounded bg-transparent group-hover:border-blue-400 transition-colors relative">
                    <div className="absolute inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <span className="ml-3 text-gray-300 group-hover:text-white transition-colors">Ingat saya</span>
                </label>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors font-medium hover:underline">
                  Lupa kata sandi?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit}
                className="w-full relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-bold text-lg tracking-wide transform transition-transform group-hover:scale-105 group-active:scale-95 flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk Sekarang</span>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-8 p-6 bg-gradient-to-r from-black/20 to-black/10 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="flex items-center mb-3">
                <Sparkles className="text-yellow-400 mr-2" size={18} />
                <h4 className="text-sm font-bold text-white">Demo Access:</h4>
              </div>
              <div className="text-xs text-gray-300 space-y-2">
                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="font-semibold text-blue-300">👨‍🎓 Mahasiswa</div>
                  <div className="mt-1">NIM: <span className="text-blue-200">2021001</span></div>
                  <div>Password: <span className="text-blue-200">123456</span></div>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="font-semibold text-purple-300">👨‍💼 Admin</div>
                  <div className="mt-1">Username: <span className="text-purple-200">admin</span></div>
                  <div>Password: <span className="text-purple-200">123456</span></div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400">
                © 2024 Dinas Komunikasi dan Informatika
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Secure Digital Platform • All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

