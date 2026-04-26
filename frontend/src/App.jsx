import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Search as SearchIcon, Bell, BarChart3, Settings,
  AlertTriangle, BedDouble, Activity, Users, LogOut, Clock,
  Filter, Plus, MoreVertical, Edit2, CheckCircle2, Info, X, MapPin,
  Phone, ExternalLink, ChevronRight, ArrowUpRight, ArrowDownRight,
  TrendingUp, AlertCircle, Shield, User, Menu, RefreshCcw, Lock, Mail, Eye, EyeOff,
  UserPlus
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { api, setToken, clearToken } from './lib/api';

// --- COMPONENTS ---

const Badge = ({ children, color = 'cyan' }) => {
  const colors = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    gray: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.cyan}`}>
      {children}
    </span>
  );
};

const StatCard = ({ title, value, label, icon: Icon, color, trend }) => (
  <div className="glass-card p-5 rounded-xl flex flex-col gap-3 relative overflow-hidden group border border-slate-800/50">
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${color}-500/5 rounded-full blur-2xl group-hover:bg-${color}-500/10 transition-colors`} />
    <div className="flex justify-between items-start">
      <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400`}>
        <Icon size={20} />
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-medium flex items-center ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend > 0 ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div>
      <div className="text-2xl font-bold font-mono tracking-tight text-white">{value}</div>
      <div className="text-sm text-slate-400 font-medium">{title}</div>
      {label && <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{label}</div>}
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-card w-full max-w-2xl rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200 border border-slate-700">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  );
};

const Toast = ({ message, type = 'success', onClose }) => (
  <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 glass-card px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-right duration-300 border-l-4 ${type === 'error' ? 'border-l-red-500' : 'border-l-cyan-500'}`}>
    {type === 'success' && <CheckCircle2 className="text-emerald-400" size={18} />}
    {type === 'error' && <AlertCircle className="text-red-400" size={18} />}
    {type === 'info' && <Info className="text-cyan-400" size={18} />}
    <span className="text-sm text-slate-200 font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 text-slate-500 hover:text-white"><X size={14} /></button>
  </div>
);

const LoadingSkeleton = ({ count = 3 }) => (
  <div className="animate-pulse space-y-4 w-full">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="h-24 bg-slate-800/50 rounded-xl border border-slate-700/30" />
    ))}
  </div>
);

// --- LOGIN COMPONENT ---

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@medigrid.in');
  const [password, setPassword] = useState('Admin@1234');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await onLogin(email, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0E1A] medi-grid-bg p-4">
      <div className="w-full max-w-md space-y-8 glass-card p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500 text-white mb-4 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <Shield size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tighter">MediGrid</h2>
          <p className="text-slate-400 text-sm">Hospital Resource Management System</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 ring-cyan-500/20 focus:border-cyan-500/50 transition-all"
                placeholder="Email address"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-12 text-white focus:outline-none focus:ring-2 ring-cyan-500/20 focus:border-cyan-500/50 transition-all"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? <RefreshCcw className="animate-spin" size={18} /> : "Sign In"}
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="pt-6 border-t border-slate-800/50">
          <div className="text-xs text-center space-y-2">
            <p className="text-slate-500 uppercase tracking-widest font-bold">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-slate-900/50 rounded-lg border border-slate-800 text-[10px] text-slate-400">
                <span className="block text-white font-bold mb-1">System Admin</span>
                admin@medigrid.in / Admin@1234
              </div>
              <div className="p-2 bg-slate-900/50 rounded-lg border border-slate-800 text-[10px] text-slate-400">
                <span className="block text-white font-bold mb-1">Hospital Admin</span>
                priya.rao@citygeneral.in / Hospital@123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('medigrid_token'));
  // Pre-populate from localStorage so we don't flash a loading spinner on every render
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('medigrid_user') || 'null'); } catch { return null; }
  });
  const [activePage, setActivePage] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [toast, setToast] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  // App State
  const [hospitals, setHospitals] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [alertStats, setAlertStats] = useState(null);
  const [dashStats, setDashStats] = useState(null);
  const [trends, setTrends] = useState(null);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [thresholds, setThresholds] = useState([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [hospitalFilters, setHospitalFilters] = useState({ type: 'All', zone: 'All', status: 'All' });
  const [modals, setModals] = useState({ hospitalDetails: null, addHospital: false, addUser: false, editThresholds: null });

  // Extracted Page States
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchFilters, setSearchFilters] = useState({ resource: 'general_bed', zone: 'All Zones' });

  const [allAlerts, setAllAlerts] = useState([]);
  const [alertFilter, setAlertFilter] = useState('Active');

  const [analyticsSummary, setAnalyticsSummary] = useState(null);
  const [analyticsTrends, setAnalyticsTrends] = useState(null);
  const [range, setRange] = useState('7d');

  const [hospitalForm, setHospitalForm] = useState({
    general_bed: 0,
    icu_bed: 0,
    ventilator: 0
  });

  const [adminTab, setAdminTab] = useState('Users');

  // Hospital form state
  const [addHospitalForm, setAddHospitalForm] = useState({ name: '', type: 'Public', zone: 'Central', address: '', phone: '', general_bed: 0, icu_bed: 0, ventilator: 0 });
  const [editHospital, setEditHospital] = useState(null);
  const [editHospitalForm, setEditHospitalForm] = useState({ name: '', type: 'Public', zone: 'Central', address: '', phone: '', general_bed: 0, icu_bed: 0, ventilator: 0 });
  const [savingHospital, setSavingHospital] = useState(false);

  // Add User form state
  const [addUserForm, setAddUserForm] = useState({ name: '', email: '', password: '', role: 'hospital_admin', hospital_id: '' });
  const [savingUser, setSavingUser] = useState(false);

  // Effects
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCurrentUser();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (currentUser) {
      loadInitialData();
      // Set default page based on role
      const allowed = getAllowedPages(currentUser.role);
      if (!allowed.includes(activePage)) {
        setActivePage(allowed[0]);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (isLoggedIn) {
      api.getAlerts({ status: alertFilter.toLowerCase() }).then(d => setAllAlerts(d.data.alerts)).catch(() => {});
    }
  }, [alertFilter, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      api.getAnalyticsSummary().then(d => setAnalyticsSummary(d.data)).catch(() => {});
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      api.getAnalyticsTrends(range).then(d => setAnalyticsTrends(d.data)).catch(() => {});
    }
  }, [range, isLoggedIn]);

  useEffect(() => {
    if (dashStats?.resources) {
      setHospitalForm({
        general_bed: dashStats.resources.general_bed?.available || 0,
        icu_bed: dashStats.resources.icu_bed?.available || 0,
        ventilator: dashStats.resources.ventilator?.available || 0
      });
    }
  }, [dashStats]);

  // Data Fetching
  const fetchCurrentUser = async () => {
    try {
      const data = await api.me();
      if (data.status === 'success') {
        setCurrentUser(data.data);
      } else {
        handleLogout();
      }
    } catch (err) {
      handleLogout();
    }
  };

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const role = currentUser.role;
      const promises = [
        api.getHospitals().then(d => setHospitals(d.data.hospitals)),
        api.getAlerts({ status: 'active' }).then(d => setAlerts(d.data.alerts)),
      ];

      if (['system_admin', 'authority'].includes(role)) {
        promises.push(api.getAnalyticsSummary().then(d => setDashStats(d.data)));
        promises.push(api.getAnalyticsTrends('7d').then(d => setTrends(d.data)));
      }

      if (role === 'system_admin') {
        promises.push(api.getUsers().then(d => setUsers(d.data.users)));
        promises.push(api.getAuditLogs({ per_page: 10 }).then(d => setAuditLogs(d.data.logs)));
        promises.push(api.getThresholds().then(d => setThresholds(d.data.thresholds)));
      }

      if (role === 'hospital_admin') {
        promises.push(api.getAlertStats().then(d => setAlertStats(d.data)));
        promises.push(api.getHospital(currentUser.hospital_id).then(d => setDashStats(d.data))); // Reuse dashStats for single hospital
      }

      await Promise.all(promises);
    } catch (err) {
      showToast('Failed to load system data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const showToast = (msg, type = 'success') => setToast({ message: msg, type });

  const handleLogin = async (email, password) => {
    const result = await api.login(email, password);
    if (result.status === 'success') {
      setToken(result.data.access_token);
      setCurrentUser(result.data.user);
      localStorage.setItem('medigrid_user', JSON.stringify(result.data.user));
      setIsLoggedIn(true);
      showToast(`Welcome back, ${result.data.user.name}`);
      return result;
    } else {
      showToast(result.message || 'Login failed', 'error');
      return result;
    }
  };

  const handleLogout = async () => {
    await api.logout().catch(() => {});
    clearToken();
    localStorage.removeItem('medigrid_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    navigate('/admin/login');
  };

  const handleAddUser = async () => {
    if (!addUserForm.name || !addUserForm.email || !addUserForm.password) {
      showToast('Name, email, and password are required', 'error');
      return;
    }
    if (addUserForm.role === 'hospital_admin' && !addUserForm.hospital_id) {
      showToast('Please select a hospital for the Hospital Admin', 'error');
      return;
    }
    setSavingUser(true);
    try {
      const payload = {
        name: addUserForm.name,
        email: addUserForm.email,
        password: addUserForm.password,
        role: addUserForm.role,
        hospital_id: addUserForm.role === 'hospital_admin' ? addUserForm.hospital_id : null,
      };
      const res = await api.createUser(payload);
      if (res.status === 'success') {
        showToast(`User "${addUserForm.name}" created successfully`);
        setModals({ ...modals, addUser: false });
        setAddUserForm({ name: '', email: '', password: '', role: 'hospital_admin', hospital_id: '' });
        api.getUsers().then(d => setUsers(d.data.users)).catch(() => {});
      } else {
        showToast(res.message || 'Failed to create user', 'error');
      }
    } catch {
      showToast('Connection error', 'error');
    } finally {
      setSavingUser(false);
    }
  };

  const handleResolveAlert = async (id) => {
    const res = await api.resolveAlert(id);
    if (res.status === 'success') {
      setAlerts(prev => prev.filter(a => a.alert_id !== id));
      showToast('Alert marked as resolved');
    }
  };

  const handleAddHospital = async () => {
    setSavingHospital(true);
    try {
      const payload = {
        name: addHospitalForm.name,
        type: addHospitalForm.type,
        zone: addHospitalForm.zone,
        address: addHospitalForm.address,
        contact: addHospitalForm.phone,
        general_bed_total: Number(addHospitalForm.general_bed),
        icu_bed_total: Number(addHospitalForm.icu_bed),
        ventilator_total: Number(addHospitalForm.ventilator),
      };
      const res = await api.createHospital(payload);
      if (res.status === 'success') {
        showToast('Hospital added successfully');
        setModals({ ...modals, addHospital: false });
        setAddHospitalForm({ name: '', type: 'Public', zone: 'Central', address: '', phone: '', general_bed: 0, icu_bed: 0, ventilator: 0 });
        api.getHospitals().then(d => setHospitals(d.data.hospitals));
      } else {
        showToast(res.message || 'Failed to add hospital', 'error');
      }
    } catch (e) {
      showToast('Failed to add hospital', 'error');
    } finally {
      setSavingHospital(false);
    }
  };

  const openEditHospital = (h) => {
    setEditHospital(h);
    setEditHospitalForm({
      name: h.name,
      type: h.type,
      zone: h.zone,
      address: h.address || '',
      phone: h.phone || '',
      general_bed: h.resources?.general_bed?.total || 0,
      icu_bed: h.resources?.icu_bed?.total || 0,
      ventilator: h.resources?.ventilator?.total || 0,
    });
  };

  const handleEditHospital = async () => {
    if (!editHospital) return;
    setSavingHospital(true);
    try {
      const payload = {
        name: editHospitalForm.name,
        type: editHospitalForm.type,
        zone: editHospitalForm.zone,
        address: editHospitalForm.address,
        contact: editHospitalForm.phone,
        general_bed_total: Number(editHospitalForm.general_bed),
        icu_bed_total: Number(editHospitalForm.icu_bed),
        ventilator_total: Number(editHospitalForm.ventilator),
      };
      const res = await api.updateHospital(editHospital.hospital_id, payload);
      if (res.status === 'success') {
        showToast('Hospital updated successfully');
        setEditHospital(null);
        api.getHospitals().then(d => setHospitals(d.data.hospitals));
      } else {
        showToast(res.message || 'Failed to update hospital', 'error');
      }
    } catch (e) {
      showToast('Failed to update hospital', 'error');
    } finally {
      setSavingHospital(false);
    }
  };

  const getAllowedPages = (role) => {
    if (role === 'system_admin') return ['dashboard', 'hospitals', 'alerts', 'analytics', 'users', 'admin'];
    if (role === 'hospital_admin') return ['dashboard', 'myhospital', 'alerts'];
    if (role === 'authority') return ['dashboard', 'hospitals', 'alerts', 'analytics'];
    if (role === 'operator') return ['hospitals', 'search', 'alerts'];
    return ['hospitals', 'search'];
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hospitals', label: 'Hospitals', icon: Building2 },
    { id: 'search', label: 'Search', icon: SearchIcon },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: alerts.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'myhospital', label: 'My Hospital', icon: Building2 },
    { id: 'admin', label: 'Admin Panel', icon: Settings },
  ].filter(item => getAllowedPages(currentUser?.role).includes(item.id));

  // --- PAGE RENDERS ---

  const renderDashboard = () => {
    if (loading && !dashStats) return <LoadingSkeleton count={4} />;
    
    // System Admin / Authority View
    if (['system_admin', 'authority'].includes(currentUser.role)) {
      return (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Hospitals" value={dashStats?.total_hospitals || 0} icon={Building2} color="cyan" />
            <StatCard 
              title="General Bed Availability" 
              value={`${dashStats?.city_totals?.general_bed?.available || 0} / ${dashStats?.city_totals?.general_bed?.total || 0}`} 
              icon={BedDouble} color="emerald" 
              label={`${Math.round((dashStats?.city_totals?.general_bed?.available / (dashStats?.city_totals?.general_bed?.total || 1)) * 100)}% Available`}
            />
            <StatCard title="Active Alerts" value={alerts.length} icon={AlertTriangle} color="red" label="Require Action" />
            <StatCard 
              title="ICU Occupancy" 
              value={`${100 - Math.round((dashStats?.city_totals?.icu_bed?.available / (dashStats?.city_totals?.icu_bed?.total || 1)) * 100)}%`} 
              icon={Activity} color="amber" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-800">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <TrendingUp size={18} className="text-cyan-400" />
                Resource Trends (7 Days)
              </h3>
              <div className="h-[300px] w-full">
                {trends ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trends.labels.map((l, i) => ({
                      name: l,
                      general: trends.datasets.general_bed[i],
                      icu: trends.datasets.icu_bed[i],
                      vent: trends.datasets.ventilator[i]
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                      <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', color: '#F9FAFB', borderRadius: '8px' }}
                        itemStyle={{ fontSize: '12px' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                      <Bar dataKey="general" name="General Beds" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="icu" name="ICU Beds" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="vent" name="Ventilators" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <div className="h-full flex items-center justify-center text-slate-500 text-sm">Loading trend data...</div>}
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl flex flex-col h-full border border-slate-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Bell size={18} className="text-red-400" />
                Active Alerts
              </h3>
              <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-hide">
                {alerts.length > 0 ? alerts.map(alert => (
                  <div key={alert.alert_id} className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-white">{alert.hospital_name}</h4>
                        <p className="text-xs text-red-400 font-medium mt-1 capitalize">{alert.resource_type.replace('_', ' ')} Low</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-red-500 pulse-dot danger" />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <Clock size={10} /> {new Date(alert.triggered_at).toLocaleTimeString()}
                      <AlertCircle size={10} className="ml-auto" /> {alert.severity}
                    </div>
                    <button
                      onClick={() => handleResolveAlert(alert.alert_id)}
                      className="w-full py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg transition-colors border border-red-500/20"
                    >
                      Mark Resolved
                    </button>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2">
                    <CheckCircle2 size={32} />
                    <p className="text-sm font-medium">No active alerts</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Hospital Admin View
    if (currentUser.role === 'hospital_admin') {
      const h = dashStats; // For hospital admin, dashStats is their hospital object
      return (
        <div className="space-y-6 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Active Alerts" value={alerts.length} icon={AlertTriangle} color="red" />
            <StatCard title="Resolved Today" value={alertStats?.resolved_today || 0} icon={CheckCircle2} color="emerald" />
            <StatCard title="Avg. Resolution" value={`${alertStats?.avg_resolution_minutes || 0}m`} icon={Clock} color="cyan" />
          </div>

          <div className="glass-card rounded-2xl p-8 border border-slate-800">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">{h?.name}</h2>
                <p className="text-slate-400 text-sm">Real-time resource dashboard</p>
              </div>
              <Badge color="green">Active</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['general_bed', 'icu_bed', 'ventilator'].map(type => {
                const res = h?.resources?.[type] || { total: 0, available: 0 };
                const perc = Math.round((res.available / (res.total || 1)) * 100);
                return (
                  <div key={type} className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{type.replace('_', ' ')}</div>
                      <div className="text-2xl font-bold font-mono text-white">{res.available}/{res.total}</div>
                    </div>
                    <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className={`h-full transition-all duration-1000 ${perc < 20 ? 'bg-red-500' : perc < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${perc}%` }}
                      />
                    </div>
                    <p className="text-center text-[10px] text-slate-500 font-bold">{perc}% CAPACITY AVAILABLE</p>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-10 pt-10 border-t border-slate-800 flex justify-center">
              <button onClick={() => setActivePage('myhospital')} className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2">
                Update Availability <RefreshCcw size={18} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderHospitals = () => {
    const filteredHospitals = hospitals.filter(h => {
      const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.zone.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = hospitalFilters.type === 'All' || h.type.toLowerCase() === hospitalFilters.type.toLowerCase();
      const matchesZone = hospitalFilters.zone === 'All' || h.zone === hospitalFilters.zone;
      const matchesStatus = hospitalFilters.status === 'All' || h.status === hospitalFilters.status.toLowerCase();
      return matchesSearch && matchesType && matchesZone && matchesStatus;
    });

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search hospitals or zones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <select
              value={hospitalFilters.type}
              onChange={(e) => setHospitalFilters({ ...hospitalFilters, type: e.target.value })}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
            >
              <option>All Types</option>
              <option>Public</option>
              <option>Private</option>
            </select>
            <select
              value={hospitalFilters.zone}
              onChange={(e) => setHospitalFilters({ ...hospitalFilters, zone: e.target.value })}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
            >
              <option>All Zones</option>
              {['North', 'South', 'East', 'West', 'Central', 'Suburban'].map(z => <option key={z} value={z}>{z}</option>)}
            </select>
            {currentUser.role === 'system_admin' && (
              <button
                onClick={() => setModals({ ...modals, addHospital: true })}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-2 transition-all whitespace-nowrap"
              >
                <Plus size={16} /> Add Hospital
              </button>
            )}
          </div>
        </div>

        {loading ? <LoadingSkeleton count={6} /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map(h => (
              <div key={h.hospital_id} className="glass-card rounded-2xl p-5 flex flex-col gap-4 group border border-slate-800/50 hover:border-cyan-500/30 transition-all">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{h.name}</h4>
                    <div className="flex gap-2">
                      <Badge color={h.type.toLowerCase() === 'public' ? 'blue' : 'purple'}>{h.type}</Badge>
                      <Badge color="gray">{h.zone}</Badge>
                      <Badge color={h.status === 'active' ? 'green' : 'red'}>{h.status}</Badge>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-slate-800 rounded-lg text-slate-500"><MoreVertical size={16} /></button>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'general_bed', label: 'General Beds', color: 'emerald' },
                    { key: 'icu_bed', label: 'ICU Beds', color: 'amber' },
                    { key: 'ventilator', label: 'Ventilators', color: 'cyan' },
                  ].map((res) => {
                    const data = h.resources?.[res.key] || { available: 0, total: 0 };
                    const perc = Math.round((data.available / (data.total || 1)) * 100);
                    return (
                      <div key={res.key} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-medium">
                          <span className="text-slate-400">{res.label}</span>
                          <span className="text-white font-mono">{data.available}/{data.total}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-${res.color}-500 transition-all duration-1000`}
                            style={{ width: `${perc}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-2 pt-4 border-t border-slate-800 flex justify-between items-center text-[10px]">
                  <span className="text-slate-500">Updated: {new Date(h.last_updated).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setModals({ ...modals, hospitalDetails: h })} className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/5 text-slate-300 hover:text-cyan-400 transition-all">Details</button>
                    {currentUser.role === 'system_admin' && <button onClick={() => openEditHospital(h)} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center gap-1"><Edit2 size={12} /> Edit</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSearch = () => {
    const handleSearchAction = async () => {
      setSearching(true);
      try {
        const res = await api.search({
          resource_type: searchFilters.resource,
          zone: searchFilters.zone,
          q: searchQuery
        });
        setSearchResults(res.data.results);
      } catch (err) {
        showToast('Search failed', 'error');
      } finally {
        setSearching(false);
      }
    };

    return (
      <div className="space-y-12 animate-in fade-in duration-500">
        <div className="max-w-4xl mx-auto text-center space-y-6 py-12">
          <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">Find Available Resources</h1>
          <p className="text-slate-400 text-lg">Real-time capacity tracking across all hospitals in Pune city.</p>

          <div className="glass-card p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl relative z-10 border border-slate-800">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" size={20} />
              <input
                type="text"
                placeholder="Enter hospital name or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchAction()}
                className="w-full bg-slate-900/50 border-none rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 ring-cyan-500/20"
              />
            </div>
            <button 
              onClick={handleSearchAction}
              disabled={searching}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
            >
              {searching ? <RefreshCcw className="animate-spin" size={20} /> : <SearchIcon size={20} />} Search
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <span className="text-slate-500 uppercase tracking-widest font-bold">Filters:</span>
            {['general_bed', 'icu_bed', 'ventilator'].map(type => (
              <button 
                key={type}
                onClick={() => setSearchFilters({ ...searchFilters, resource: type })}
                className={`px-4 py-2 rounded-full border transition-all ${searchFilters.resource === type ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-bold' : 'border-slate-800 hover:border-slate-700 text-slate-400'}`}
              >
                {type.replace('_', ' ').toUpperCase()}
              </button>
            ))}
            <select 
              value={searchFilters.zone}
              onChange={(e) => setSearchFilters({ ...searchFilters, zone: e.target.value })}
              className="bg-slate-900 border border-slate-800 rounded-full px-4 py-2 text-slate-400 focus:outline-none"
            >
              <option>All Zones</option>
              {['North', 'South', 'East', 'West', 'Central', 'Suburban'].map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
        </div>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 max-w-5xl mx-auto">
            <h3 className="text-lg font-bold mb-2">Search Results ({searchResults.length})</h3>
            {searchResults.map((h, idx) => (
              <div key={h.hospital_id} className={`glass-card rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch group relative border border-slate-800 ${idx === 0 ? 'border-cyan-500/40' : ''}`}>
                <div className="w-2 md:w-3 bg-gradient-to-b from-emerald-500 to-emerald-600" />
                <div className="p-6 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">{h.name}</h4>
                      <Badge color={h.type.toLowerCase() === 'public' ? 'blue' : 'purple'}>{h.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><MapPin size={12} className="text-cyan-500" /> {h.zone}</span>
                      <span className="flex items-center gap-1"><Shield size={12} className="text-emerald-500" /> Verified</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-2">{h.address}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    {['general_bed', 'icu_bed', 'ventilator'].map(type => (
                      <div key={type} className="flex-1 p-3 rounded-xl bg-slate-900/50 border border-white/5 text-center">
                        <div className={`text-lg font-bold font-mono ${h.resources?.[type]?.available > 0 ? 'text-white' : 'text-slate-600'}`}>{h.resources?.[type]?.available || 0}</div>
                        <div className="text-[9px] uppercase tracking-wider font-bold opacity-80">{type.split('_')[0]}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col justify-center gap-2">
                    <button className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20">Get Directions</button>
                    <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
                      <Phone size={14} /> Call Hospital
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !searching && (
          <div className="text-center py-20 text-slate-600">
            <SearchIcon size={48} className="mx-auto mb-4 opacity-20" />
            <p>Search for hospitals to view availability</p>
          </div>
        )}
      </div>
    );
  };

  const renderAlerts = () => {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Active Alerts" value={alerts.length} icon={AlertTriangle} color="red" />
          <StatCard title="Resolved Today" value={alertStats?.resolved_today || 0} icon={CheckCircle2} color="emerald" />
          <StatCard title="Avg. Resolution" value={`${alertStats?.avg_resolution_minutes || 0}m`} icon={Clock} color="cyan" />
        </div>

        <div className="glass-card rounded-2xl p-6 min-h-[500px] border border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              {['Active', 'Resolved'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setAlertFilter(tab)}
                  className={`pb-2 px-1 text-sm font-bold transition-colors border-b-2 ${tab === alertFilter ? 'text-cyan-400 border-cyan-400' : 'text-slate-500 border-transparent hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {allAlerts.length > 0 ? allAlerts.map(alert => (
              <div key={alert.alert_id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col md:flex-row items-center gap-4 hover:border-slate-700 transition-all">
                <div className={`w-2 h-2 rounded-full ${alert.status === 'active' ? 'bg-red-500 pulse-dot danger' : 'bg-emerald-500'}`} />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{alert.hospital_name}</h4>
                    <Badge color={alert.severity === 'critical' ? 'red' : 'amber'}>{alert.severity}</Badge>
                  </div>
                  <p className="text-xs text-slate-400 capitalize">{alert.resource_type.replace('_', ' ')} triggered at {alert.current_value} (Threshold: {alert.threshold_value})</p>
                </div>
                <div className="text-right space-y-1 md:w-32">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest">{alert.status}</div>
                  <div className="text-[11px] text-slate-400">{new Date(alert.triggered_at).toLocaleTimeString()}</div>
                </div>
                <div className="md:w-40 flex justify-end">
                  {alert.status === 'active' ? (
                    <button onClick={() => handleResolveAlert(alert.alert_id)} className="px-4 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-500 text-[11px] font-bold rounded-lg border border-emerald-500/20 transition-all">Mark Resolved</button>
                  ) : (
                    <div className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 size={12} /> Resolved</div>
                  )}
                </div>
              </div>
            )) : (
              <div className="text-center py-20 text-slate-600">No {alertFilter.toLowerCase()} alerts found</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => {
    const handleExport = async () => {
      const res = await api.exportCSV(range);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medigrid_report_${range}.csv`;
      a.click();
      showToast('Report exported successfully');
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="text-cyan-400" /> System Insights</h2>
          <div className="flex gap-2">
            <select 
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 3 Months</option>
            </select>
            <button onClick={handleExport} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors">Export CSV</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Bed Availability Trend</h3>
            <div className="h-[300px]">
              {analyticsTrends ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsTrends.labels.map((l, i) => ({
                    name: l,
                    general: analyticsTrends.datasets.general_bed[i],
                    icu: analyticsTrends.datasets.icu_bed[i],
                    vent: analyticsTrends.datasets.ventilator[i]
                  }))}>
                    <CartesianGrid stroke="#1F2937" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="general" stroke="#06B6D4" strokeWidth={3} dot={{ fill: '#06B6D4', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#fff' }} />
                    <Line type="monotone" dataKey="icu" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 0, r: 4 }} />
                    <Line type="monotone" dataKey="vent" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', strokeWidth: 0, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <LoadingSkeleton count={1} />}
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Utilization by Zone</h3>
            <div className="h-[300px]">
              {analyticsSummary ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsSummary.zone_utilization}>
                    <XAxis dataKey="zone" stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                    <Bar dataKey="utilization_pct" name="Utilization %" radius={[6, 6, 0, 0]}>
                      {analyticsSummary.zone_utilization.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.utilization_pct > 80 ? '#EF4444' : entry.utilization_pct > 60 ? '#F59E0B' : '#10B981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <LoadingSkeleton count={1} />}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMyHospital = () => {
    const h = dashStats; // For hospital admin, dashStats is their hospital object

    const handleUpdate = async () => {
      const res = await api.updateResources(currentUser.hospital_id, hospitalForm);
      if (res.status === 'success') {
        showToast('Resources updated successfully');
        loadInitialData(); // Reload stats
      } else {
        showToast(res.message || 'Update failed', 'error');
      }
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto py-8">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-bold text-white">Resource Management</h2>
          <p className="text-slate-400">Update current availability for {h?.name}</p>
        </div>

        <div className="glass-card rounded-2xl p-8 space-y-8 border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: 'general_bed', label: 'General Beds', max: h?.resources?.general_bed?.total || 0, icon: BedDouble },
              { key: 'icu_bed', label: 'ICU Beds', max: h?.resources?.icu_bed?.total || 0, icon: Activity },
              { key: 'ventilator', label: 'Ventilators', max: h?.resources?.ventilator?.total || 0, icon: TrendingUp },
            ].map((field) => (
              <div key={field.key} className="space-y-3">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <field.icon size={14} /> {field.label}
                </div>
                <input
                  type="number"
                  value={hospitalForm[field.key]}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, [field.key]: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-2xl font-mono text-white focus:outline-none focus:border-cyan-500 focus:ring-1 ring-cyan-500/50 transition-all"
                />
                <div className="text-[10px] text-slate-500 text-center font-bold">MAX CAPACITY: {field.max}</div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-800">
            <button onClick={handleUpdate} className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2">
              <RefreshCcw size={18} /> Update Resources
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAdmin = () => {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex gap-4 border-b border-slate-800 pb-px">
          {['Users', 'Thresholds', 'Audit Logs'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setAdminTab(tab)}
              className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${tab === adminTab ? 'text-cyan-400 border-cyan-400' : 'text-slate-500 border-transparent hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {adminTab === 'Users' && (
          <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">All Users</p>
              <button
                onClick={() => setModals({ ...modals, addUser: true })}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold rounded-xl transition-colors"
              >
                <UserPlus size={14} /> Add User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/50 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Last Login</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map(u => (
                    <tr key={u.user_id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">{u.name}<div className="text-[10px] text-slate-500 font-normal">{u.email}</div></td>
                      <td className="px-6 py-4"><Badge color="cyan">{u.role.replace('_', ' ')}</Badge></td>
                      <td className="px-6 py-4"><span className={`flex items-center gap-1.5 text-xs ${u.status === 'active' ? 'text-emerald-400' : 'text-slate-500'}`}><div className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`} /> {u.status}</span></td>
                      <td className="px-6 py-4 text-xs text-slate-500">{u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-all"><Edit2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === 'Audit Logs' && (
          <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/50 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Entity</th>
                    <th className="px-6 py-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {auditLogs.map(log => (
                    <tr key={log.log_id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{log.user}</td>
                      <td className="px-6 py-4"><Badge color="gray">{log.action}</Badge></td>
                      <td className="px-6 py-4 text-slate-400 text-xs capitalize">{log.entity_type}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };


  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0E1A] text-cyan-500">
        <RefreshCcw className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0A0E1A] text-slate-200 medi-grid-bg">
      {/* Sidebar */}
      <aside className={`w-[240px] border-r border-slate-800 bg-[#0D1117] flex flex-col h-screen fixed inset-y-0 z-40 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActivePage('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">MediGrid</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${activePage === item.id ? 'active-nav-item' : 'text-slate-500 hover:text-white hover:bg-slate-800/50'}`}
            >
              <item.icon size={20} className={activePage === item.id ? 'text-cyan-400' : 'group-hover:text-cyan-400 transition-colors'} />
              <span className="text-sm font-bold">{item.label}</span>
              {item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-slate-900">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/20">
          <div className="flex items-center gap-3 p-2">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                <User size={20} className="text-slate-500" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-bold text-white truncate">{currentUser?.name || 'User'}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest truncate">{currentUser?.role.replace('_', ' ')}</div>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-400 transition-colors"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'lg:pl-[240px]' : ''}`}>
        <header className="h-16 border-b border-slate-800 bg-[#0A0E1A]/80 backdrop-blur-xl sticky top-0 z-30 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 lg:hidden">
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-bold text-white capitalize">{activePage.replace(/([A-Z])/g, ' $1')}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-tighter">
                <Clock size={12} className="text-cyan-400" />
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-[10px] text-slate-500">{currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            </div>

            <div className="h-8 w-px bg-slate-800 mx-2" />

            <button className="relative p-2 text-slate-500 hover:text-white transition-colors" onClick={() => setActivePage('alerts')}>
              <Bell size={20} />
              {alerts.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0A0E1A]" />}
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {activePage === 'dashboard' && renderDashboard()}
          {activePage === 'hospitals' && renderHospitals()}
          {activePage === 'search' && renderSearch()}
          {activePage === 'alerts' && renderAlerts()}
          {activePage === 'analytics' && renderAnalytics()}
          {activePage === 'myhospital' && renderMyHospital()}
          {activePage === 'admin' && renderAdmin()}
        </div>
      </main>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Hospital Details Modal */}
      <Modal isOpen={!!modals.hospitalDetails} onClose={() => setModals({ ...modals, hospitalDetails: null })} title="Hospital Details">
        {modals.hospitalDetails && (() => {
          const h = modals.hospitalDetails;
          return (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{h.name}</h3>
                  <div className="flex gap-2 mt-2">
                    <Badge color={h.type?.toLowerCase() === 'public' ? 'blue' : 'purple'}>{h.type}</Badge>
                    <Badge color="gray">{h.zone}</Badge>
                    <Badge color={h.status === 'active' ? 'green' : 'red'}>{h.status}</Badge>
                  </div>
                </div>
              </div>
              {h.address && <div className="flex items-start gap-2 text-sm text-slate-400"><MapPin size={16} className="text-cyan-400 mt-0.5 shrink-0" />{h.address}</div>}
              {h.phone && <div className="flex items-center gap-2 text-sm text-slate-400"><Phone size={16} className="text-cyan-400 shrink-0" />{h.phone}</div>}
              <div className="border-t border-slate-800 pt-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Resource Availability</h4>
                <div className="grid grid-cols-3 gap-4">
                  {['general_bed', 'icu_bed', 'ventilator'].map(type => {
                    const res = h.resources?.[type] || { total: 0, available: 0 };
                    const perc = Math.round((res.available / (res.total || 1)) * 100);
                    return (
                      <div key={type} className="glass-card p-4 rounded-xl border border-slate-800 text-center space-y-2">
                        <div className="text-2xl font-bold font-mono text-white">{res.available}<span className="text-slate-600 text-base">/{res.total}</span></div>
                        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{type.replace(/_/g, ' ')}</div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full transition-all ${perc < 20 ? 'bg-red-500' : perc < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${perc}%` }} />
                        </div>
                        <div className={`text-[10px] font-bold ${perc < 20 ? 'text-red-400' : perc < 50 ? 'text-amber-400' : 'text-emerald-400'}`}>{perc}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                Last Updated: {new Date(h.last_updated).toLocaleString()}
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Add Hospital Modal */}
      <Modal isOpen={modals.addHospital} onClose={() => setModals({ ...modals, addHospital: false })} title="Add New Hospital">
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Hospital Name *</label>
              <input value={addHospitalForm.name} onChange={e => setAddHospitalForm({ ...addHospitalForm, name: e.target.value })} placeholder="e.g. City General Hospital" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Type</label>
              <select value={addHospitalForm.type} onChange={e => setAddHospitalForm({ ...addHospitalForm, type: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500">
                <option>Public</option><option>Private</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Zone</label>
              <select value={addHospitalForm.zone} onChange={e => setAddHospitalForm({ ...addHospitalForm, zone: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500">
                {['North','South','East','West','Central','Suburban'].map(z => <option key={z}>{z}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Address</label>
              <input value={addHospitalForm.address} onChange={e => setAddHospitalForm({ ...addHospitalForm, address: e.target.value })} placeholder="Full address" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone</label>
              <input value={addHospitalForm.phone} onChange={e => setAddHospitalForm({ ...addHospitalForm, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
          </div>
          <div className="border-t border-slate-800 pt-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Initial Capacity</p>
            <div className="grid grid-cols-3 gap-3">
              {[{ key: 'general_bed', label: 'General Beds' }, { key: 'icu_bed', label: 'ICU Beds' }, { key: 'ventilator', label: 'Ventilators' }].map(f => (
                <div key={f.key}>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{f.label}</label>
                  <input type="number" min="0" value={addHospitalForm[f.key]} onChange={e => setAddHospitalForm({ ...addHospitalForm, [f.key]: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white text-lg font-mono focus:outline-none focus:border-cyan-500 transition-colors" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModals({ ...modals, addHospital: false })} className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800 transition-colors text-sm font-bold">Cancel</button>
            <button onClick={handleAddHospital} disabled={savingHospital || !addHospitalForm.name} className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2">
              {savingHospital ? <RefreshCcw size={16} className="animate-spin" /> : <Plus size={16} />} Add Hospital
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Hospital Modal */}
      <Modal isOpen={!!editHospital} onClose={() => setEditHospital(null)} title="Edit Hospital">
        {editHospital && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Hospital Name *</label>
                <input value={editHospitalForm.name} onChange={e => setEditHospitalForm({ ...editHospitalForm, name: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Type</label>
                <select value={editHospitalForm.type} onChange={e => setEditHospitalForm({ ...editHospitalForm, type: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500">
                  <option>Public</option><option>Private</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Zone</label>
                <select value={editHospitalForm.zone} onChange={e => setEditHospitalForm({ ...editHospitalForm, zone: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500">
                  {['North','South','East','West','Central','Suburban'].map(z => <option key={z}>{z}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Address</label>
                <input value={editHospitalForm.address} onChange={e => setEditHospitalForm({ ...editHospitalForm, address: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone</label>
                <input value={editHospitalForm.phone} onChange={e => setEditHospitalForm({ ...editHospitalForm, phone: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
              </div>
            </div>
            <div className="border-t border-slate-800 pt-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Total Capacity</p>
              <div className="grid grid-cols-3 gap-3">
                {[{ key: 'general_bed', label: 'General Beds' }, { key: 'icu_bed', label: 'ICU Beds' }, { key: 'ventilator', label: 'Ventilators' }].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{f.label}</label>
                    <input type="number" min="0" value={editHospitalForm[f.key]} onChange={e => setEditHospitalForm({ ...editHospitalForm, [f.key]: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white text-lg font-mono focus:outline-none focus:border-cyan-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditHospital(null)} className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800 transition-colors text-sm font-bold">Cancel</button>
              <button onClick={handleEditHospital} disabled={savingHospital || !editHospitalForm.name} className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2">
                {savingHospital ? <RefreshCcw size={16} className="animate-spin" /> : <Edit2 size={16} />} Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>
      <Modal isOpen={modals.addUser} onClose={() => { setModals({ ...modals, addUser: false }); setAddUserForm({ name: '', email: '', password: '', role: 'hospital_admin', hospital_id: '' }); }} title="Add New User">
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name *</label>
            <input value={addUserForm.name} onChange={e => setAddUserForm({ ...addUserForm, name: e.target.value })} placeholder="e.g. Dr. Priya Rao" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address *</label>
            <input type="email" value={addUserForm.email} onChange={e => setAddUserForm({ ...addUserForm, email: e.target.value })} placeholder="user@hospital.com" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Temporary Password *</label>
            <input type="password" value={addUserForm.password} onChange={e => setAddUserForm({ ...addUserForm, password: e.target.value })} placeholder="Min. 6 characters" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Role *</label>
            <select value={addUserForm.role} onChange={e => setAddUserForm({ ...addUserForm, role: e.target.value, hospital_id: '' })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500">
              <option value="hospital_admin">Hospital Admin</option>
              <option value="operator">Operator</option>
              <option value="authority">Authority</option>
              <option value="system_admin">System Admin</option>
            </select>
          </div>
          {addUserForm.role === 'hospital_admin' && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Assign Hospital *</label>
              <select value={addUserForm.hospital_id} onChange={e => setAddUserForm({ ...addUserForm, hospital_id: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500">
                <option value="">-- Select a Hospital --</option>
                {hospitals.filter(h => h.status === 'active').map(h => (
                  <option key={h.hospital_id} value={h.hospital_id}>{h.name} ({h.zone})</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={() => { setModals({ ...modals, addUser: false }); setAddUserForm({ name: '', email: '', password: '', role: 'hospital_admin', hospital_id: '' }); }} className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800 transition-colors text-sm font-bold">Cancel</button>
            <button onClick={handleAddUser} disabled={savingUser || !addUserForm.name || !addUserForm.email} className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2">
              {savingUser ? <RefreshCcw size={16} className="animate-spin" /> : <UserPlus size={14} />} Create User
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
