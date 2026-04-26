import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { api, setToken } from '../lib/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@medigrid.in');
  const [password, setPassword] = useState('Admin@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await api.login(email, password);
      if (result.status === 'success') {
        const user = result.data.user;
        if (user.role === 'citizen') {
          setError('This is a citizen account. Please use the Citizen Login.');
          setLoading(false);
          return;
        }
        setToken(result.data.access_token);
        localStorage.setItem('medigrid_user', JSON.stringify(user));
        navigate('/admin/dashboard');
      } else {
        setError(result.message || 'Invalid credentials.');
      }
    } catch {
      setError('Connection error. Please check the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-4"
      style={{ backgroundImage: 'radial-gradient(#1F2937 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Activity size={24} className="text-white" />
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-2xl tracking-tight">MediGrid</div>
              <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Staff Portal</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Staff Login</h1>
          <p className="text-slate-500 mt-1 text-sm">For hospital staff and administrators only</p>
        </div>

        {/* Card */}
        <div className="bg-[#111827]/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 mb-6 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-12 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
              ) : 'Sign In to Staff Portal'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 text-sm text-slate-600">
          Not staff?{' '}
          <Link to="/login" className="text-cyan-500 hover:text-cyan-400 font-medium">
            Citizen Login →
          </Link>
        </div>
      </div>
    </div>
  );
}
