import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, RefreshCcw, Search, BarChart3, Users, Clock, CheckCircle, TrendingUp, Filter, Calendar, MapPin, Globe, UserPlus, X, Plus } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, Legend
} from 'recharts';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:5000/api';

export default function AdminDashboard() {
    const [leads, setLeads] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newLead, setNewLead] = useState({ name: '', email: '', source: 'Manual Entry', notes: '' });
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
            return;
        }
        fetchData();
    }, [token, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };

            const [leadsRes, analyticsRes] = await Promise.all([
                axios.get(`${API_URL}/leads`, { headers }),
                axios.get(`${API_URL}/analytics`, { headers })
            ]);

            setLeads(leadsRes.data.leads);
            setAnalytics(analyticsRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/admin/login');
            }
        } finally {
            setLoading(false);
        }
    };

    // Process data for charts
    const getChartData = () => {
        if (!leads.length) return [];

        // Group leads by date
        const groups = leads.reduce((acc, lead) => {
            const date = new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(groups)
            .map(([date, count]) => ({ date, count }))
            .reverse() // Correct chronological order
            .slice(-7); // Last 7 days/entries
    };

    const getPieData = () => {
        if (!analytics) return [];
        return [
            { name: 'New', value: analytics.newLeads, color: '#3b82f6' },
            { name: 'Contacted', value: analytics.contactedLeads, color: '#f59e0b' },
            { name: 'Converted', value: analytics.convertedLeads, color: '#10b981' }
        ];
    };

    const getSourceData = () => {
        if (!leads.length) return [];
        const sourceMap = leads.reduce((acc, lead) => {
            acc[lead.source] = (acc[lead.source] || 0) + 1;
            return acc;
        }, {});

        const colors = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'];
        return Object.entries(sourceMap).map(([name, value], i) => ({
            name, value, fill: colors[i % colors.length]
        })).sort((a, b) => b.value - a.value);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            await axios.put(`${API_URL}/leads/${id}`, { status: newStatus }, { headers });
            fetchData(); // Refresh data to update analytics and list
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    const handleAddLead = async (e) => {
        e.preventDefault();
        setAdding(true);
        setError('');
        try {
            const headers = { Authorization: `Bearer ${token}` };
            await axios.post(`${API_URL}/admin/leads`, newLead, { headers });
            setShowAddModal(false);
            setNewLead({ name: '', email: '', source: 'Manual Entry', notes: '' });
            fetchData();
        } catch (error) {
            console.error('Failed to add lead:', error);
            setError(error.response?.data?.message || 'Failed to add lead. Please try again.');
        } finally {
            setAdding(false);
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || lead.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusClass = (status) => {
        switch (status) {
            case 'New': return 'status-new';
            case 'Contacted': return 'status-contacted';
            case 'Converted': return 'status-converted';
            default: return '';
        }
    };

    const getSourceClass = (source) => {
        const s = source.toLowerCase();
        if (s.includes('instagram')) return 'source-instagram';
        if (s.includes('linkedin')) return 'source-linkedin';
        if (s.includes('google')) return 'source-google';
        if (s.includes('referral')) return 'source-referral';
        if (s.includes('direct')) return 'source-direct';
        return 'source-default';
    };

    return (
        <div className="bg-dark app-container flex-col">
            {/* Navbar */}
            <nav className="admin-nav">
                <div className="container nav-content">
                    <div className="flex items-center gap-3">
                        <div className="logo-box">
                            <BarChart3 size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold" style={{ margin: 0, lineHeight: 1 }}>Mini CRM</h1>
                            <span style={{ fontSize: '0.65rem', color: 'var(--primary-color)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Panel</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', background: 'rgba(30, 41, 59, 0.5)', padding: '0.375rem 0.75rem', borderRadius: '999px', border: '1px solid var(--border-color)' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)', animation: 'pulse 2s infinite' }}></span>
                            Live Tracking
                        </span>
                        <button
                            onClick={handleLogout}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', background: 'transparent', padding: '0.5rem', borderRadius: '8px' }}
                            onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)' }}
                            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
                            title="Logout"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container flex-1 dashboard-main animate-fade-in" style={{ animationDelay: '0.1s' }}>

                {/* Header */}
                <div className="dashboard-header">
                    <div>
                        <h2 className="text-2xl font-bold font-heading mb-2">Dashboard Overview</h2>
                        <p className="text-muted text-sm">Track and manage your incoming website leads seamlessly.</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="btn btn-primary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}
                        >
                            <UserPlus size={16} />
                            Add New Lead
                        </button>
                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        >
                            <RefreshCcw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                            Refresh Data
                        </button>
                    </div>
                </div>

                {/* Analytics Cards */}
                {analytics && (
                    <div className="analytics-grid">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-panel stat-card-large"
                        >
                            <div className="stat-header">
                                <div>
                                    <p className="text-sm font-bold text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Leads</p>
                                    <h3 className="text-4xl font-bold mt-2">{analytics.totalLeads}</h3>
                                </div>
                                <div className="stat-icon indigo">
                                    <Users size={28} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4 text-xs text-muted">
                                <TrendingUp size={14} className="text-green-500" />
                                <span className="text-green-500 font-bold">+12%</span> from last month
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-panel stat-card-large"
                        >
                            <div className="stat-header">
                                <div>
                                    <p className="text-sm font-bold text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Progress</p>
                                    <h3 className="text-4xl font-bold mt-2">{analytics.newLeads + analytics.contactedLeads}</h3>
                                </div>
                                <div className="stat-icon blue">
                                    <Clock size={28} />
                                </div>
                            </div>
                            <div className="progress-bar-bg mt-4">
                                <div className="progress-bar-fill" style={{ background: 'var(--accent-blue)', width: `${analytics.totalLeads ? ((analytics.newLeads + analytics.contactedLeads) / analytics.totalLeads) * 100 : 0}%` }}></div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-panel stat-card-large"
                        >
                            <div className="stat-header">
                                <div>
                                    <p className="text-sm font-bold text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Success Rate</p>
                                    <h3 className="text-4xl font-bold mt-2">
                                        {analytics.totalLeads ? Math.round((analytics.convertedLeads / analytics.totalLeads) * 100) : 0}%
                                    </h3>
                                </div>
                                <div className="stat-icon green">
                                    <CheckCircle size={28} />
                                </div>
                            </div>
                            <div className="progress-bar-bg mt-4">
                                <div className="progress-bar-fill" style={{ background: 'var(--accent-green)', width: `${analytics.totalLeads ? (analytics.convertedLeads / analytics.totalLeads) * 100 : 0}%` }}></div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Dashboard Visualization Grid */}
                <div className="grid-2 mb-8">

                    {/* Trend Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-panel chart-panel"
                    >
                        <div className="chart-header">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <TrendingUp size={20} className="text-indigo-400" />
                                Growth Trajectory
                            </h3>
                        </div>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={getChartData()}>
                                    <defs>
                                        <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} axisLine={false} tickLine={false} />
                                    <YAxis stroke="var(--text-muted)" fontSize={11} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                                    <Area type="monotone" dataKey="count" stroke="var(--primary-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorPrimary)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Funnel/Bar Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-panel chart-panel"
                    >
                        <div className="chart-header">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Filter size={20} className="text-green-400" />
                                Sales Funnel Velocity
                            </h3>
                        </div>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={getPieData()} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={11} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {getPieData().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Source Distribution Pie */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="glass-panel chart-panel"
                    >
                        <div className="chart-header">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Globe size={20} className="text-blue-400" />
                                Acquisition Channels
                            </h3>
                        </div>
                        <div className="chart-container flex flex-col md-flex-row items-center">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={getSourceData()} innerRadius={60} outerRadius={80} dataKey="value">
                                        {getSourceData().map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="w-full" style={{ padding: '0 1rem' }}>
                                {getSourceData().slice(0, 4).map((item, i) => (
                                    <div key={i} className="flex flex-col mb-3">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-muted">{item.name}</span>
                                            <span className="font-bold">{item.value}</span>
                                        </div>
                                        <div style={{ height: 4, width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                                            <div style={{ height: '100%', width: `${(item.value / (analytics?.totalLeads || 1)) * 100}%`, background: item.fill, borderRadius: 2 }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Comparison or Other Metric */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="glass-panel chart-panel"
                    >
                        <div className="chart-header">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <MapPin size={20} className="text-pink-400" />
                                Top Source Efficiency
                            </h3>
                        </div>
                        <div className="chart-container flex-col justify-center gap-6">
                            <div className="flex justify-between items-center p-4 glass-panel" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                <div className="flex gap-3 items-center">
                                    <div style={{ padding: 10, background: 'rgba(236, 72, 153, 0.1)', borderRadius: 50, color: '#ec4899' }}><Globe size={18} /></div>
                                    <span className="font-bold">Organic Growth</span>
                                </div>
                                <span className="text-green-500 font-bold">+24%</span>
                            </div>
                            <div className="flex justify-between items-center p-4 glass-panel" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                <div className="flex gap-3 items-center">
                                    <div style={{ padding: 10, background: 'rgba(59, 130, 246, 0.1)', borderRadius: 50, color: '#3b82f6' }}><Users size={18} /></div>
                                    <span className="font-bold">Team Outreach</span>
                                </div>
                                <span className="text-pink-500 font-bold">-5%</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Filters and List */}
                <div className="glass-panel table-panel animate-fade-in" style={{ animationDelay: '0.3s' }}>

                    <div className="table-header">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Users size={20} style={{ color: 'var(--primary-color)' }} /> Recent Leads
                        </h3>

                        <div className="filters">
                            {/* Search */}
                            <div style={{ position: 'relative' }}>
                                <Search className="input-icon" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search leads..."
                                    className="form-input pl-10"
                                    style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', fontSize: '0.875rem' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Filter */}
                            <select
                                className="form-input"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', width: 'auto', appearance: 'none' }}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="All">All Statuses</option>
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Converted">Converted</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="crm-table">
                            <thead>
                                <tr>
                                    <th>Lead Info</th>
                                    <th>Date</th>
                                    <th>Source</th>
                                    <th>Notes</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center" style={{ padding: '3rem 1rem' }}>
                                            <div className="flex-col items-center justify-center gap-3">
                                                <RefreshCcw size={32} style={{ color: 'var(--primary-color)', animation: 'spin 1s linear infinite' }} />
                                                <p className="text-muted mt-2">Loading leads...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredLeads.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center" style={{ padding: '3rem 1rem' }}>
                                            <div style={{ background: 'rgba(30,41,59,0.3)', padding: '2rem', borderRadius: '1rem', display: 'inline-block', border: '1px dashed var(--border-color)' }}>
                                                <Users size={48} style={{ color: 'var(--text-muted)', opacity: 0.5, marginBottom: '1rem' }} />
                                                <p className="text-xl mb-2">No leads found</p>
                                                <p className="text-sm text-muted">Try adjusting your filters or wait for new submissions.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLeads.map(lead => (
                                        <tr key={lead.id}>
                                            <td>
                                                <div className="font-bold" style={{ color: 'var(--text-main)' }}>{lead.name}</div>
                                                <div className="text-xs text-muted mt-1">{lead.email}</div>
                                            </td>
                                            <td className="text-muted">
                                                {new Date(lead.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                })}
                                            </td>
                                            <td>
                                                <span className={`source-tag ${getSourceClass(lead.source)}`}>
                                                    {lead.source}
                                                </span>
                                            </td>
                                            <td>
                                                <p className="text-sm text-muted" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={lead.notes}>
                                                    {lead.notes || <span style={{ fontStyle: 'italic', opacity: 0.5 }}>No notes</span>}
                                                </p>
                                            </td>
                                            <td className="text-center">
                                                <span className={`status-badge ${getStatusClass(lead.status)}`}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <select
                                                    className="select-action"
                                                    value={lead.status}
                                                    onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                                                >
                                                    <option value="New">Mark New</option>
                                                    <option value="Contacted">Mark Contacted</option>
                                                    <option value="Converted">Mark Converted</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Add Lead Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="modal-content"
                    >
                        <div className="modal-header">
                            <div>
                                <h3 className="text-xl font-bold">Add New Lead</h3>
                                <p className="text-xs text-muted">Manually enter lead information</p>
                            </div>
                            <button className="modal-close" onClick={() => setShowAddModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        {error && <div className="error-msg">{error}</div>}

                        <form onSubmit={handleAddLead}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="form-input"
                                    placeholder="John Doe"
                                    value={newLead.name}
                                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="form-input"
                                    placeholder="john@example.com"
                                    value={newLead.email}
                                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Lead Source</label>
                                <select
                                    className="form-input"
                                    value={newLead.source}
                                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                                >
                                    <option value="Manual Entry">Manual Entry</option>
                                    <option value="Direct Call">Direct Call</option>
                                    <option value="Referral">Referral</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Notes (Optional)</label>
                                <textarea
                                    className="form-input"
                                    rows="3"
                                    placeholder="Add any specific details here..."
                                    value={newLead.notes}
                                    onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                                    style={{ resize: 'none' }}
                                ></textarea>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    type="button"
                                    className="btn w-full"
                                    style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={adding}
                                    className="btn btn-primary w-full"
                                >
                                    {adding ? (
                                        <RefreshCcw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                    ) : (
                                        <>
                                            <Plus size={18} />
                                            Create Lead
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
