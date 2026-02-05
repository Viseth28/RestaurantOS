import React, { useState } from 'react';
import { Lock, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onLogin: (success: boolean) => void;
  onCancel: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'cckadmin' && password === 'cck1234') {
      onLogin(true);
    } else {
      setError('Invalid credentials');
      setPassword(''); // clear password on fail
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-brand-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-sm animate-in fade-in zoom-in duration-500 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-900/30 transform rotate-3">
            <Lock size={28} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Portal</h2>
          <p className="text-slate-500 font-medium">Please verify your identity</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 text-sm font-medium border border-red-100 animate-in shake">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider ml-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-stone-50 border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all font-medium text-slate-800"
              placeholder="Enter username"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-50 border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all font-medium text-slate-800"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all flex justify-center items-center gap-2 shadow-lg shadow-slate-900/20 active:scale-[0.98]"
            >
              Access Dashboard <ArrowRight size={16} />
            </button>
             <button 
              type="button" 
              onClick={onCancel}
              className="w-full py-3 text-slate-500 rounded-xl font-bold hover:bg-stone-50 transition-colors text-sm"
            >
              Return to Landing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};