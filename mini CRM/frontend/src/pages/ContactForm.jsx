import { useState } from 'react';
import axios from 'axios';
import { Send, CheckCircle, Smartphone, BarChart, Target, ShieldCheck, Globe, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        notes: '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:5000/api/leads', {
                ...formData,
                source: 'Landing Page Form'
            });
            setSuccess(true);
            setFormData({ name: '', email: '', notes: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit form.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-container">
            {/* Public Navbar */}
            <nav className="admin-nav" style={{ position: 'fixed', width: '100%', top: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)' }}>
                <div className="container nav-content">
                    <div className="flex items-center gap-3">
                        <div className="logo-box">
                            <BarChart3 size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold" style={{ margin: 0, lineHeight: 1 }}>Mini CRM</h1>
                            <span style={{ fontSize: '0.65rem', color: 'var(--primary-color)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Smart Lead Management</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Background elements */}
            <div className="decor-circle-1"></div>
            <div className="decor-circle-2"></div>

            <div className="container" style={{ paddingTop: '40px' }}>
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="hero-section"
                >

                    <h1 className="landing-title">Capture. Convert.<br />Scale Your Business.</h1>
                    <p className="text-muted text-xl" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        Stop losing leads in messy spreadsheets. Our smart CRM helps you track every interaction and close deals faster.
                    </p>
                </motion.div>

                {/* Main Layout */}
                <div className="contact-layout">
                    {/* Left Side: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="contact-info"
                    >
                        <h2 className="text-3xl font-bold mb-6">Why Choose Mini CRM?</h2>

                        <div className="feature-pill">
                            <div className="feature-icon"><BarChart size={20} /></div>
                            <div>
                                <h4 className="font-bold">Real-time Analytics</h4>
                                <p className="text-xs text-muted">Track your performance with live data visualization.</p>
                            </div>
                        </div>

                        <div className="feature-pill">
                            <div className="feature-icon"><Smartphone size={20} /></div>
                            <div>
                                <h4 className="font-bold">Instant Notifications</h4>
                                <p className="text-xs text-muted">Never miss a follow-up with smart automated alerts.</p>
                            </div>
                        </div>

                        <div className="feature-pill">
                            <div className="feature-icon"><ShieldCheck size={20} /></div>
                            <div>
                                <h4 className="font-bold">Enterprise Security</h4>
                                <p className="text-xs text-muted">Your database is encrypted and stored securely.</p>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} style={{
                                        width: 40, height: 40, borderRadius: '50%',
                                        border: '2px solid var(--bg-dark)',
                                        background: `linear-gradient(135deg, hsl(${i * 40}, 70%, 50%), hsl(${i * 40 + 60}, 70%, 40%))`
                                    }} />
                                ))}
                            </div>
                            <p className="text-sm text-muted">Joined by 500+ growing agencies</p>
                        </div>
                    </motion.div>

                    {/* Right Side: Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="glass-panel contact-card"
                    >
                        {success ? (
                            <div className="text-center animate-fade-in" style={{ padding: '2.5rem 0' }}>
                                <div style={{ width: 80, height: 80, background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                    <CheckCircle className="text-green-500" size={40} />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                                <p className="text-muted mb-6">Your inquiry has been received. Our team will contact you shortly.</p>
                                <button onClick={() => setSuccess(false)} className="btn btn-primary w-full">Send Another Inquiry</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <h3 className="text-xl font-bold mb-6">Send an Inquiry</h3>
                                {error && <div className="error-msg">{error}</div>}

                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="Your name" required />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Business Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="name@company.com" required />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Project Details</label>
                                    <textarea name="notes" value={formData.notes} onChange={handleChange} className="form-input" placeholder="Tell us about your project goals..." rows="3"></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
                                    {loading ? 'Processing...' : (
                                        <span className="flex items-center gap-2">Get Started Now <Send size={18} /></span>
                                    )}
                                </button>

                                <div className="text-center mt-6">
                                    <a href="/admin/login" className="text-xs text-muted" style={{ padding: '0.5rem', display: 'inline-block' }} onMouseOver={(e) => e.target.style.color = 'white'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>Access Team Dashboard</a>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>

                <footer className="mt-20 text-center text-xs text-muted pb-8 border-t border-slate-800 pt-8" style={{ zIndex: 10 }}>
                    <div className="flex justify-center gap-6 mb-4">
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                        <span>Cookie Settings</span>
                    </div>
                    <p>&copy; 2026 Mini CRM Inc. Built for scale.</p>
                </footer>
            </div>
        </div>
    );
}
