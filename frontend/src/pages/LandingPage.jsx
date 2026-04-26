import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Search, Building2, Bell, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-[#0A0E1A] flex flex-col"
      style={{ backgroundImage: 'radial-gradient(#1F2937 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}
    >
      {/* Nav */}
      <nav className="px-6 py-5 flex justify-between items-center max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Activity size={18} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-lg tracking-tight leading-none">MediGrid</div>
            <div className="text-cyan-400 text-[9px] font-bold uppercase tracking-widest">Hospital Resource System</div>
          </div>
        </div>
        <Link
          to="/admin/login"
          className="text-sm text-slate-500 hover:text-cyan-400 transition-colors font-medium border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-xl"
        >
          Staff Login →
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Live City-wide Hospital Data
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
          Find real-time<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            hospital availability
          </span><br />
          in your city
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Know before you go. Check bed availability, ICU capacity, and ventilator status
          at every hospital — updated in real time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            to="/login"
            className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-2xl text-lg shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/40"
          >
            Login as Citizen
          </Link>
          <Link
            to="/register"
            className="px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 text-white font-bold rounded-2xl text-lg border border-slate-700 hover:border-slate-600 shadow-sm transition-all hover:scale-105"
          >
            Create Free Account
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
          {[
            {
              icon: Search,
              title: 'Search by Need',
              desc: 'Filter by zone, resource type, or hospital name to find exactly what you need.'
            },
            {
              icon: Building2,
              title: 'Full Availability',
              desc: 'See beds, ICU, and ventilator counts across every registered hospital in the city.'
            },
            {
              icon: Bell,
              title: 'Always Updated',
              desc: 'Hospital admins update availability continuously so you see the latest numbers.'
            }
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-[#111827]/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-slate-700 hover:shadow-lg transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                <Icon size={18} className="text-cyan-400" />
              </div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Shield size={13} />
            <span>MediGrid © 2025 — Hospital Resource Management</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/register" className="hover:text-slate-400 transition-colors">Register</Link>
            <Link to="/login" className="hover:text-slate-400 transition-colors">Citizen Login</Link>
            <Link to="/admin/login" className="hover:text-cyan-400 transition-colors font-medium text-slate-500">Staff Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
