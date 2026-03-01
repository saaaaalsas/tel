
import React, { useState } from 'react';
import { User } from '../types';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Firebase Auth Sign In
      const userCredential = await signInWithEmailAndPassword(auth, identifier, password);
      const firebaseUser = userCredential.user;

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        onLogin(userDoc.data() as User);
      } else {
        setError('Data profil tidak ditemukan di database.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Email atau Password salah.');
      } else if (err.code === 'permission-denied') {
        setError('Izin ditolak. Pastikan Firestore Security Rules Anda sudah benar.');
      } else {
        setError('Terjadi kesalahan saat masuk. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-teladan-navy flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teladan-blue/20 dark:bg-teladan-blue/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teladan-red/20 dark:bg-teladan-red/10 rounded-full blur-[120px] animate-pulse"></div>

      <div className="w-full max-w-lg p-12 rounded-[3.5rem] bg-white/80 dark:bg-slate-800/80 backdrop-blur-3xl shadow-2xl border border-white dark:border-slate-700 text-center animate-fade-slide relative z-10">
        <div className="w-24 h-24 mx-auto flex items-center justify-center mb-8">
          <img 
            src="https://lh3.googleusercontent.com/d/1OjBe_s-XJKZ-44j1mk3FLocHg5JjzdMd" 
            alt="Tel-Finder Logo" 
            className="w-full h-full object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        <h1 className="text-4xl font-semibold text-teladan-navy dark:text-white mb-2 font-heading">Tel-Finder</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 px-6 font-medium">
          Pusat Monitoring Akademik SMAN 3 Jakarta.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-semibold flex items-center gap-3">
            <iconify-icon icon="solar:danger-bold-duotone" width="20"></iconify-icon>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">
              Email / NISN / NIP
            </label>
            <div className="relative">
              <iconify-icon icon="solar:user-bold-duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" width="24"></iconify-icon>
              <input 
                type="text" 
                required
                placeholder="Masukkan Email, NISN, atau NIP"
                className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl p-5 pl-14 outline-none focus:ring-2 ring-teladan-blue font-semibold transition-all text-slate-800 dark:text-white"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">Kata Sandi</label>
            <div className="relative">
              <iconify-icon icon="solar:lock-password-bold-duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" width="24"></iconify-icon>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl p-5 pl-14 outline-none focus:ring-2 ring-teladan-blue font-semibold transition-all text-slate-800 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-teladan-blue focus:ring-teladan-blue" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ingat Saya</span>
            </label>
            <button type="button" className="text-xs font-semibold text-teladan-blue hover:underline uppercase tracking-wide">Lupa Password?</button>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-5 rounded-[1.5rem] bg-teladan-blue text-white font-semibold text-base uppercase tracking-widest shadow-xl shadow-blue-100 dark:shadow-none hover:bg-blue-600 transition-all flex items-center justify-center gap-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
          >
            {isLoading ? (
              <>
                <iconify-icon icon="solar:restart-bold-duotone" className="animate-spin" width="24"></iconify-icon>
                Memverifikasi...
              </>
            ) : (
              <>
                Masuk ke Tel-Finder
                <iconify-icon icon="solar:login-bold-duotone" width="24"></iconify-icon>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
