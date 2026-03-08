import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, User } from 'lucide-react';

export default function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/admin/login', credentials);
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-container animate-fade-in items-center justify-center" style={{ background: '#0f172a', padding: 0 }}>
            <div className="glass-panel text-center" style={{ width: '100%', maxWidth: '350px', position: 'relative', zIndex: 10 }}>

                <div style={{
                    width: '64px', height: '64px', margin: '0 auto 1.5rem',
                    backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 30px rgba(59,130,246,0.2)'
                }}>
                    <Lock style={{ color: '#3b82f6', width: '32px', height: '32px' }} />
                </div>

                <h2 className="text-2xl font-bold mb-2">Admin Portal</h2>
                <p className="text-muted text-sm mb-6">Manage your leads and clients securely.</p>

                <form onSubmit={handleLogin} className="text-left" autoComplete="off">
                    {error && <div className="error-msg">{error}</div>}

                    <div className="form-group mb-4">
                        <User className="input-icon" size={20} />
                        <input
                            type="text"
                            className="form-input pl-10 w-full"
                            placeholder="Username"
                            value={credentials.username}
                            onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                            autoComplete="one-time-code"
                            required
                        />
                    </div>

                    <div className="form-group mb-6">
                        <Lock className="input-icon" size={20} />
                        <input
                            type="password"
                            className="form-input pl-10 w-full"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full" style={{ padding: '0.875rem' }} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6">
                    <p className="text-xs"><a href="/" className="text-muted" onMouseOver={(e) => e.target.style.color = 'white'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>← Back to Site</a></p>
                </div>
            </div>
        </div>
    );
}
