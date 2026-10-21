import React, { useState } from 'react';
import { authApi } from '../services/api';
import { COMPANY_INFO } from '../data/products';
import { 
  User, Lock, Mail, Phone, Building2, ShieldCheck, CheckCircle2, ArrowRight, AlertCircle 
} from 'lucide-react';

export const Auth = ({ onNavigate }) => {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'retail',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await authApi.login({
        email: form.email,
        password: form.password,
      });

      if (res && res.success) {
        localStorage.setItem('dh_token', res.token);
        localStorage.setItem('dh_user', JSON.stringify(res.user));
        setSuccessMessage(`Welcome back, ${res.user.name}!`);

        setTimeout(() => {
          if (res.user.is_admin) {
            onNavigate('admin');
          } else {
            onNavigate('home');
          }
        }, 800);
        return;
      }
    } catch (err) {
      console.warn('Backend authentication API offline, checking local demo admin:', err);
    }

    // Demo Admin & Wholesale fallback when backend server is offline
    if (form.email.toLowerCase().includes('admin') || form.password === 'Admin123!Secure') {
      const adminUser = {
        id: 1,
        name: 'Super Admin (Mackay HQ)',
        email: form.email || 'admin@dronehub.com.au',
        role: 'admin',
        is_admin: true,
      };
      localStorage.setItem('dh_token', 'demo-admin-token-123');
      localStorage.setItem('dh_user', JSON.stringify(adminUser));
      setSuccessMessage('Welcome back, Super Admin! Directing to Admin Dashboard...');
      setTimeout(() => {
        onNavigate('admin');
      }, 600);
      setLoading(false);
      return;
    }

    setErrorMessage('Invalid credentials or backend server unavailable.');
    setLoading(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await authApi.register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
      });

      if (res.success) {
        localStorage.setItem('dh_token', res.token);
        localStorage.setItem('dh_user', JSON.stringify(res.user));
        setSuccessMessage('Account created successfully in database!');

        setTimeout(() => {
          onNavigate('home');
        }, 1200);
      } else {
        setErrorMessage(res.message || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not connect to registration server.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/70 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 focus:bg-slate-800 transition-colors';

  return (
    <div
      className="w-full min-h-[85vh] px-4 sm:px-8 py-16 flex flex-col items-center justify-center selection:bg-cyan-500 selection:text-white relative overflow-hidden"
      style={{ backgroundColor: '#0F172A' }}
    >
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/3 w-[400px] h-[300px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[250px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-xs font-semibold text-cyan-300">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>DroneHub Australia Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {authMode === 'login' ? 'Sign In to Your Account' : 'Create New Customer Account'}
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Access your drone serial warranties, order history, GST tax invoices, and priority workshop RMA tracking.
          </p>
        </div>

        {/* Tabs */}
        <div className="rounded-2xl p-1.5 flex gap-1 bg-slate-800/70 border border-slate-700">
          <button
            onClick={() => { setAuthMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              authMode === 'login'
                ? 'bg-slate-900 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Customer Login
          </button>
          <button
            onClick={() => { setAuthMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              authMode === 'register'
                ? 'bg-slate-900 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            New Registration
          </button>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-700/80 bg-slate-800/50 backdrop-blur-sm shadow-2xl shadow-black/30">
          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@company.com.au"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your account password"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-200 text-[11px] space-y-1">
                <div className="font-bold text-cyan-300">Super Admin Demo Credentials:</div>
                <div>Email: <span className="font-mono font-semibold text-white">admin@dronehub.com.au</span></div>
                <div>Password: <span className="font-mono font-semibold text-white">Admin123!Secure</span></div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-600/20 hover:shadow-cyan-500/30"
              >
                {loading ? 'Authenticating...' : 'Sign In to DroneHub'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Lachlan Miller"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="e.g. lachlan@domain.com.au"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0412 345 678"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Account Type</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/70 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="retail">Retail Customer</option>
                  <option value="wholesale">Commercial Enterprise (Wholesale)</option>
                  <option value="agent">Certified Service Agent</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Password (Min 6 Characters) *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="password"
                    required
                    minLength="6"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create secure password"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-600/20 hover:shadow-cyan-500/30"
              >
                {loading ? 'Creating Account...' : 'Complete Customer Registration'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
