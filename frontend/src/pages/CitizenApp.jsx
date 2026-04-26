import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity, Search, Building2, LogOut, Phone, MapPin,
  BedDouble, Filter, ChevronRight, AlertCircle, RefreshCcw, Wifi
} from 'lucide-react';
import { api, clearToken } from '../lib/api';

// ─── Resource Bar ──────────────────────────────────────────────

function ResourceBar({ label, available, total }) {
  const perc = total > 0 ? Math.round((available / total) * 100) : 0;
  const barColor = perc < 20 ? 'bg-red-500' : perc < 50 ? 'bg-amber-400' : 'bg-cyan-400';
  const textColor = perc < 20 ? 'text-red-400' : perc < 50 ? 'text-amber-400' : 'text-cyan-400';
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-slate-500 font-medium">{label}</span>
        <span className={`font-bold font-mono ${textColor}`}>{available}/{total}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-700`}
          style={{ width: `${perc}%` }}
        />
      </div>
    </div>
  );
}

// ─── Hospital Card ─────────────────────────────────────────────

function HospitalCard({ hospital }) {
  const [expanded, setExpanded] = useState(false);
  const h = hospital;
  const resources = h.resources || {};

  const overallPerc = (() => {
    const types = ['general_bed', 'icu_bed', 'ventilator'];
    const totals = types.reduce((s, t) => s + (resources[t]?.total || 0), 0);
    const avail = types.reduce((s, t) => s + (resources[t]?.available || 0), 0);
    return totals > 0 ? Math.round((avail / totals) * 100) : 0;
  })();

  const statusBadge = overallPerc < 20
    ? { label: 'Critical', cls: 'bg-red-500/10 text-red-400 border-red-500/20' }
    : overallPerc < 50
    ? { label: 'Limited', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
    : { label: 'Available', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl hover:border-slate-700 hover:shadow-lg transition-all overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-sm truncate">{h.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin size={10} /> {h.zone}
              </span>
              <span className="text-slate-700">•</span>
              <span className="text-xs text-slate-500 capitalize">{h.type}</span>
            </div>
          </div>
          <span className={`ml-3 shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusBadge.cls}`}>
            {statusBadge.label}
          </span>
        </div>

        <div className="space-y-3">
          <ResourceBar label="General Beds" available={resources.general_bed?.available ?? 0} total={resources.general_bed?.total ?? 0} />
          <ResourceBar label="ICU Beds" available={resources.icu_bed?.available ?? 0} total={resources.icu_bed?.total ?? 0} />
          <ResourceBar label="Ventilators" available={resources.ventilator?.available ?? 0} total={resources.ventilator?.total ?? 0} />
        </div>
      </div>

      {/* Expandable Details */}
      <div className="border-t border-slate-800">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-5 py-3 flex items-center justify-between text-xs font-semibold text-slate-500 hover:bg-slate-800/50 transition-colors"
        >
          <span>{expanded ? 'Hide details' : 'View contact & details'}</span>
          <ChevronRight size={13} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>

        {expanded && (
          <div className="px-5 pb-4 space-y-3 border-t border-slate-800/50">
            {h.address && (
              <div className="flex items-start gap-2 text-sm text-slate-400">
                <MapPin size={13} className="text-cyan-500 mt-0.5 shrink-0" />
                {h.address}
              </div>
            )}
            {h.contact && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Phone size={13} className="text-cyan-500 shrink-0" />
                {h.contact}
              </div>
            )}
            {h.contact && (
              <a
                href={`tel:${h.contact}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-sm rounded-xl transition-colors"
              >
                <Phone size={13} /> Call Hospital
              </a>
            )}
            {!h.address && !h.contact && (
              <p className="text-xs text-slate-600 italic">No contact information available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Search Page ───────────────────────────────────────────────

function SearchPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState({ resource: 'general_bed', zone: '' });

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = { resource_type: filters.resource };
      if (filters.zone) params.zone = filters.zone;
      const res = await api.search(params);
      setResults(res.data?.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { handleSearch(); }, []);

  const inputCls = 'w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Search Hospitals</h2>
        <p className="text-slate-500 text-sm mt-1">Find hospitals by resource type and zone</p>
      </div>

      {/* Filters */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Resource Type</label>
            <select value={filters.resource} onChange={e => setFilters(f => ({ ...f, resource: e.target.value }))} className={inputCls}>
              <option value="general_bed">General Beds</option>
              <option value="icu_bed">ICU Beds</option>
              <option value="ventilator">Ventilators</option>
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Zone</label>
            <select value={filters.zone} onChange={e => setFilters(f => ({ ...f, zone: e.target.value }))} className={inputCls}>
              <option value="">All Zones</option>
              {['North', 'South', 'East', 'West', 'Central', 'Suburban'].map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2"
          >
            {loading ? <RefreshCcw size={15} className="animate-spin" /> : <Search size={15} />}
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#111827] border border-slate-800 rounded-2xl h-52 animate-pulse" />
          ))}
        </div>
      ) : searched && results.length === 0 ? (
        <div className="text-center py-20">
          <AlertCircle size={40} className="mx-auto text-slate-700 mb-4" />
          <p className="text-slate-400 font-medium">No hospitals found for this search.</p>
          <p className="text-slate-600 text-sm mt-1">Try a different zone or resource type.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {results.map(h => <HospitalCard key={h.hospital_id} hospital={h} />)}
        </div>
      )}
    </div>
  );
}

// ─── Availability Page ─────────────────────────────────────────

function AvailabilityPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zoneFilter, setZoneFilter] = useState('All');
  const [sortBy, setSortBy] = useState('availability');

  useEffect(() => {
    api.getHospitals({ per_page: 100 })
      .then(d => setHospitals(d.data?.hospitals || []))
      .catch(() => setHospitals([]))
      .finally(() => setLoading(false));
  }, []);

  const getPerc = (h) => {
    const types = ['general_bed', 'icu_bed', 'ventilator'];
    const tot = types.reduce((s, t) => s + (h.resources?.[t]?.total || 0), 0);
    const av = types.reduce((s, t) => s + (h.resources?.[t]?.available || 0), 0);
    return tot > 0 ? av / tot : 0;
  };

  const activeHospitals = hospitals.filter(h => h.status !== 'inactive');

  const filtered = activeHospitals
    .filter(h => zoneFilter === 'All' || h.zone === zoneFilter)
    .sort((a, b) => sortBy === 'availability' ? getPerc(b) - getPerc(a) : a.name.localeCompare(b.name));

  const zones = ['All', ...new Set(activeHospitals.map(h => h.zone).filter(Boolean))];

  const totalGeneral = activeHospitals.reduce((s, h) => s + (h.resources?.general_bed?.available || 0), 0);
  const totalIcu = activeHospitals.reduce((s, h) => s + (h.resources?.icu_bed?.available || 0), 0);
  const totalVent = activeHospitals.reduce((s, h) => s + (h.resources?.ventilator?.available || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">City-wide Availability</h2>
        <p className="text-slate-500 text-sm mt-1">Real-time overview of all registered hospitals</p>
      </div>

      {/* Summary Stats */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Hospitals', value: activeHospitals.length, color: 'text-cyan-400' },
            { label: 'General Beds Free', value: totalGeneral, color: 'text-emerald-400' },
            { label: 'ICU Beds Free', value: totalIcu, color: 'text-blue-400' },
            { label: 'Ventilators Free', value: totalVent, color: 'text-purple-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-[#111827] border border-slate-800 rounded-2xl p-5 text-center">
              <div className={`text-3xl font-bold font-mono ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Zone filter + sort */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter size={14} className="text-slate-600" />
        <div className="flex flex-wrap gap-2">
          {zones.map(z => (
            <button
              key={z}
              onClick={() => setZoneFilter(z)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                zoneFilter === z
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-cyan-500/50 hover:text-white'
              }`}
            >
              {z}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Sort:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-xs bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-400 focus:outline-none focus:border-cyan-500"
          >
            <option value="availability">Most Available</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      {/* Hospital Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#111827] border border-slate-800 rounded-2xl h-52 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Building2 size={40} className="mx-auto text-slate-700 mb-4" />
          <p className="text-slate-400 font-medium">No hospitals in this zone.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(h => <HospitalCard key={h.hospital_id} hospital={h} />)}
        </div>
      )}
    </div>
  );
}

// ─── Main Citizen App ──────────────────────────────────────────

const PAGES = [
  { id: 'search',       label: 'Search',       icon: Search },
  { id: 'availability', label: 'Availability',  icon: Building2 },
];

export default function CitizenApp() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('search');
  const currentUser = (() => { try { return JSON.parse(localStorage.getItem('medigrid_user') || 'null'); } catch { return null; } })();

  const handleLogout = async () => {
    await api.logout().catch(() => {});
    clearToken();
    localStorage.removeItem('medigrid_user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex" style={{ backgroundImage: 'radial-gradient(#1F2937 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}>

      {/* Sidebar — matches admin sidebar style */}
      <aside className="w-60 shrink-0 bg-[#111827] border-r border-slate-800 flex flex-col fixed inset-y-0 left-0 z-20">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Activity size={17} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-tight">MediGrid</div>
              <div className="text-cyan-400 text-[9px] font-bold uppercase tracking-widest">Citizen Portal</div>
            </div>
          </Link>
        </div>

        {/* Live indicator */}
        <div className="px-5 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Data
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {PAGES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group relative ${
                activePage === id
                  ? 'text-cyan-400 bg-cyan-500/10 border-l-4 border-cyan-400'
                  : 'text-slate-500 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon size={18} className={activePage === id ? 'text-cyan-400' : 'group-hover:text-cyan-400 transition-colors'} />
              {label}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/20">
          {currentUser && (
            <div className="flex items-center gap-3 p-2 mb-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <span className="text-cyan-400 font-bold text-sm">
                  {currentUser.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Citizen</div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pl-60 min-h-screen">
        {/* Top Bar */}
        <header className="bg-[#111827]/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white capitalize">
              {PAGES.find(p => p.id === activePage)?.label}
            </h1>
            <p className="text-xs text-slate-500">
              {activePage === 'search' ? 'Find hospitals with available resources near you' : 'Real-time availability across the city'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <Wifi size={12} /> Live
          </div>
        </header>

        <div className="p-8 max-w-7xl">
          {activePage === 'search' && <SearchPage />}
          {activePage === 'availability' && <AvailabilityPage />}
        </div>
      </main>
    </div>
  );
}
