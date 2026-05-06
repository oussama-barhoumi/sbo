import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';

// ── helpers ──────────────────────────────────────────────────────────────────
const API = (path, opts = {}) => {
    const token = localStorage.getItem('bank_token');
    return fetch(`/api/v1${path}`, {
        headers: { 
            'Content-Type': 'application/json', 
            'Accept': 'application/json', 
            ...(token ? { Authorization: `Bearer ${token}` } : {}) 
        },
        ...opts,
    }).then(r => r.json());
};

const fmt = (n, cur = 'MAD') =>
    new Intl.NumberFormat('fr-MA', { 
        style: 'currency', 
        currency: cur === 'DH' || cur === 'MAD' ? 'MAD' : cur, 
        maximumFractionDigits: 2 
    }).format(n ?? 0);

const fmtDate = d => new Date(d).toLocaleDateString('en-GB', { 
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
});

// ── sub-components ────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 z-10 animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
}

const inputCls = (err) => `w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-medium placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all ${err ? 'border-red-400 bg-red-50' : ''}`;

function Alert({ msg, ok }) {
    if (!msg) return null;
    return (
        <div className={`mb-4 flex items-start gap-2 px-4 py-3 rounded-xl text-sm font-medium border ${ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {msg}
        </div>
    );
}

// ── Modals (Deposit, Withdraw, Transfer, Profile) ──────────────────────────────
function DepositModal({ open, onClose, userId, onSuccess }) {
    const [form, setForm] = useState({ amount: '', currency: 'DH', method: 'cash' });
    const [err, setErr] = useState({});
    const [msg, setMsg] = useState(null);
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (!form.amount || +form.amount <= 0) { setErr({ amount: 'Enter a valid amount.' }); return; }
        setLoading(true); setMsg(null); setErr({});
        const res = await API('/deposit', { method: 'POST', body: JSON.stringify({ userId, ...form, amount: +form.amount }) });
        setLoading(false);
        if (res.success) { setOk(true); setMsg(`Deposit successful! New balance: ${fmt(res.newBalance)}`); onSuccess(); }
        else { setOk(false); setMsg(res.message || 'Deposit failed.'); }
    };

    return (
        <Modal open={open} onClose={onClose} title="Deposit Funds">
            <Alert msg={msg} ok={ok} />
            <form onSubmit={submit}>
                <Field label="Amount" error={err.amount}>
                    <input type="number" min="1" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" className={inputCls(err.amount)} />
                </Field>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <Field label="Currency">
                        <select value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))} className={inputCls()}>
                            {['DH', 'USD', 'EUR'].map(c => <option key={c}>{c}</option>)}
                        </select>
                    </Field>
                    <Field label="Method">
                        <select value={form.method} onChange={e => setForm(p => ({ ...p, method: e.target.value }))} className={inputCls()}>
                            {['cash', 'card', 'online'].map(m => <option key={m}>{m}</option>)}
                        </select>
                    </Field>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50">
                    {loading ? 'Processing…' : 'Confirm Deposit'}
                </button>
            </form>
        </Modal>
    );
}

function WithdrawModal({ open, onClose, userId, onSuccess }) {
    const [form, setForm] = useState({ amount: '', currency: 'DH' });
    const [err, setErr] = useState({});
    const [msg, setMsg] = useState(null);
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (!form.amount || +form.amount <= 0) { setErr({ amount: 'Enter a valid amount.' }); return; }
        setLoading(true); setMsg(null); setErr({});
        const res = await API('/withdraw', { method: 'POST', body: JSON.stringify({ userId, ...form, amount: +form.amount }) });
        setLoading(false);
        if (res.success) { setOk(true); setMsg(`Withdrawn successfully! New balance: ${fmt(res.newBalance)}`); onSuccess(); }
        else { setOk(false); setMsg(res.message + (res.currentBalance != null ? ` (Balance: ${fmt(res.currentBalance)})` : '')); }
    };

    return (
        <Modal open={open} onClose={onClose} title="Withdraw Funds">
            <Alert msg={msg} ok={ok} />
            <form onSubmit={submit}>
                <Field label="Amount" error={err.amount}>
                    <input type="number" min="1" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" className={inputCls(err.amount)} />
                </Field>
                <Field label="Currency">
                    <select value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))} className={inputCls()}>
                        {['DH', 'USD', 'EUR'].map(c => <option key={c}>{c}</option>)}
                    </select>
                </Field>
                <button type="submit" disabled={loading} className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 mt-2">
                    {loading ? 'Processing…' : 'Confirm Withdrawal'}
                </button>
            </form>
        </Modal>
    );
}

function TransferModal({ open, onClose, userId, onSuccess }) {
    const [form, setForm] = useState({ recipientId: '', amount: '', currency: 'DH', note: '' });
    const [err, setErr] = useState({});
    const [msg, setMsg] = useState(null);
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!form.recipientId) errs.recipientId = 'Required.';
        if (!form.amount || +form.amount <= 0) errs.amount = 'Enter a valid amount.';
        if (Object.keys(errs).length) { setErr(errs); return; }
        setLoading(true); setMsg(null); setErr({});
        const res = await API('/transfer', { method: 'POST', body: JSON.stringify({ senderId: userId, recipientId: +form.recipientId, amount: +form.amount, currency: form.currency, note: form.note || null }) });
        setLoading(false);
        if (res.success) { setOk(true); setMsg(`Sent to ${res.recipientName}!`); onSuccess(); }
        else { setOk(false); setMsg(res.message || 'Transfer failed.'); }
    };

    return (
        <Modal open={open} onClose={onClose} title="Transfer Money">
            <Alert msg={msg} ok={ok} />
            <form onSubmit={submit}>
                <Field label="Recipient ID" error={err.recipientId}>
                    <input type="number" value={form.recipientId} onChange={e => setForm(p => ({ ...p, recipientId: e.target.value }))} placeholder="e.g. 18" className={inputCls(err.recipientId)} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Amount" error={err.amount}>
                        <input type="number" min="1" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" className={inputCls(err.amount)} />
                    </Field>
                    <Field label="Currency">
                        <select value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))} className={inputCls()}>
                            {['DH', 'USD', 'EUR'].map(c => <option key={c}>{c}</option>)}
                        </select>
                    </Field>
                </div>
                <Field label="Note (optional)">
                    <input type="text" value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="Reason" className={inputCls()} />
                </Field>
                <button type="submit" disabled={loading} className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 mt-1">
                    {loading ? 'Sending…' : 'Send Money'}
                </button>
            </form>
        </Modal>
    );
}

// ── Main Page Component ───────────────────────────────────────────────────────
export default function BankingDashboard() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authErr, setAuthErr] = useState(false);
    const [modal, setModal] = useState(null); // 'deposit' | 'withdraw' | 'transfer'
    const [timeoutProgress, setTimeoutProgress] = useState(100);

    const loadProfile = useCallback(async () => {
        const res = await API('/profile');
        if (res.success) setProfile(res.profile);
        else setAuthErr(true);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('bank_token');
        if (!token) { setAuthErr(true); setLoading(false); return; }
        loadProfile().finally(() => setLoading(false));
    }, []);

    // Mock timer for session timeout
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeoutProgress(prev => (prev > 0 ? prev - 0.1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const logout = async () => {
        await API('/logout', { method: 'POST' });
        localStorage.removeItem('bank_token');
        window.location.href = '/login';
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
                <span className="text-sm font-medium text-gray-500">Securing your session...</span>
            </div>
        </div>
    );

    if (authErr) {
        window.location.href = '/login';
        return null;
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] text-gray-900 font-sans selection:bg-black selection:text-white">
            <Head title="HarborBank — Secure Dashboard" />

            {/* Modals */}
            <DepositModal  open={modal === 'deposit'}  onClose={() => setModal(null)} userId={profile?.userId} onSuccess={loadProfile} />
            <WithdrawModal open={modal === 'withdraw'} onClose={() => setModal(null)} userId={profile?.userId} onSuccess={loadProfile} />
            <TransferModal open={modal === 'transfer'} onClose={() => setModal(null)} userId={profile?.userId} onSuccess={loadProfile} />

            {/* Top Navbar */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-8 h-8 bg-black rounded flex items-center justify-center transition-transform group-hover:scale-105">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
                        </div>
                        <span className="font-bold text-lg tracking-tight">HarborBank</span>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-500">
                        <a href="#" className="text-black">Home</a>
                        <a href="#" className="hover:text-black transition-colors">Personal Banking</a>
                        <a href="#" className="hover:text-black transition-colors">Business Banking</a>
                        <a href="#" className="hover:text-black transition-colors">Support & Resources</a>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end mr-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Secure Access
                        </span>
                        <span className="text-xs font-bold text-gray-900">{profile?.name}</span>
                    </div>
                    <div className="relative">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden border-2 border-white shadow-sm">
                            {profile?.name ? profile.name[0] : 'G'}
                        </div>
                        <span className="absolute -bottom-1 -right-1 bg-black text-[8px] text-white font-black px-1 rounded border border-white uppercase">Guest</span>
                    </div>
                </div>
            </nav>

            <div className="max-w-[1440px] mx-auto px-6 py-8">
                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column: Login Panel & Security */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Customer Portal Login Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Customer Portal Login</h2>
                            <div className="space-y-4">
                                <Field label="Customer ID / Username">
                                    <input type="text" defaultValue={profile?.userId} className={inputCls()} disabled />
                                </Field>
                                <Field label="Password">
                                    <input type="password" placeholder="••••••••" className={inputCls()} />
                                </Field>
                                <div className="flex items-center gap-2 mb-6">
                                    <input type="checkbox" id="remember" className="rounded border-gray-300 text-black focus:ring-black" />
                                    <label htmlFor="remember" className="text-xs font-medium text-gray-500">Remember Me</label>
                                </div>
                                <button className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-[0.98]">
                                    Sign In
                                </button>
                                <div className="flex flex-col gap-2 pt-2 text-center">
                                    <a href="#" className="text-xs font-bold text-gray-400 hover:text-black transition-colors">Forgot Password?</a>
                                    <a href="#" className="text-xs font-bold text-black border-b border-black w-fit mx-auto pb-0.5">Enroll Now</a>
                                </div>
                            </div>
                        </div>

                        {/* Security Info Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase text-gray-400 leading-none mb-1">Security Info</p>
                                    <p className="text-xs font-bold text-emerald-700">256-bit TLS encryption</p>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Session timeout</p>
                                    <p className="text-[10px] font-black text-gray-900">15:00 min</p>
                                </div>
                                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${timeoutProgress}%` }} />
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-50 flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.744c0 5.561 3.487 10.321 8.42 12.456 4.933-2.135 8.42-6.895 8.42-12.456 0-1.29-.203-2.526-.578-3.687A11.959 11.959 0 0112 5.714z" /></svg>
                                    Fraud monitoring
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.263a2.25 2.25 0 01-2.097 1.423H8.165a2.25 2.25 0 01-2.097-1.423 7.497 7.497 0 01-1.568-8.263 7.5 7.5 0 013.364-4.507z" /></svg>
                                    MFA available
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-black bg-gray-50 px-3 py-2 rounded-lg mt-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                                    1-800-HARBOR-BANK
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9 space-y-8">
                        
                        {/* Dashboard Header / Welcome */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Secure Dashboard Preview</p>
                                <h1 className="text-3xl font-black text-gray-900 leading-none">Welcome, {profile?.name?.split(' ')[0] || 'Alicia'}</h1>
                            </div>
                            <button onClick={logout} className="w-fit bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-bold hover:border-black hover:text-black transition-all shadow-sm active:scale-95">
                                Logout
                            </button>
                        </div>

                        {/* Top Cards Grid (3 Columns) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            
                            {/* Account Balances Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider">Account Balances</h3>
                                    <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>
                                </div>
                                <div className="space-y-5">
                                    <div className="flex justify-between items-center group cursor-pointer">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 group-hover:text-black transition-colors">Checking</p>
                                            <p className="text-[10px] font-medium text-gray-400">...{profile?.accountNumber?.slice(-4) || '8234'}</p>
                                        </div>
                                        <p className="text-base font-black text-gray-900">{fmt(profile?.balance ?? 0, profile?.currency)}</p>
                                    </div>
                                    <div className="flex justify-between items-center opacity-50">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Savings</p>
                                            <p className="text-[10px] font-medium text-gray-400">...1109</p>
                                        </div>
                                        <p className="text-base font-black text-gray-900">{fmt(12500, 'MAD')}</p>
                                    </div>
                                    <div className="flex justify-between items-center opacity-50">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Money Market</p>
                                            <p className="text-[10px] font-medium text-gray-400">...5562</p>
                                        </div>
                                        <p className="text-base font-black text-gray-900">{fmt(45000, 'MAD')}</p>
                                    </div>
                                </div>
                                <div className="mt-auto pt-6">
                                    <button className="text-[10px] font-black uppercase text-gray-400 hover:text-black transition-colors flex items-center gap-1">
                                        View Statement
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                    </button>
                                </div>
                            </div>

                            {/* Recent Transactions Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider">Recent Transactions</h3>
                                    <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { merchant: 'Starbucks Coffee', date: 'Oct 24', type: 'Card', amount: -45.50, color: 'bg-emerald-100 text-emerald-600' },
                                        { merchant: 'Amazon.com', date: 'Oct 22', type: 'Debit', amount: -299.00, color: 'bg-gray-100 text-gray-600' },
                                        { merchant: 'Employer Direct', date: 'Oct 21', type: 'Autopay', amount: 4500.00, color: 'bg-blue-100 text-blue-600' },
                                    ].map((txn, i) => (
                                        <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                            <div className={`w-10 h-10 ${txn.color} rounded-xl flex items-center justify-center font-black text-xs transition-transform group-hover:scale-105`}>
                                                {txn.merchant[0]}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-900 truncate">{txn.merchant}</p>
                                                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">{txn.date} · {txn.type}</p>
                                            </div>
                                            <p className={`text-sm font-black ${txn.amount < 0 ? 'text-gray-900' : 'text-emerald-600'}`}>
                                                {txn.amount < 0 ? '-' : '+'}{fmt(Math.abs(txn.amount), 'MAD').replace('MAD', '')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-6 py-2.5 border border-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:border-black hover:text-black transition-all">
                                    View All History
                                </button>
                            </div>

                            {/* Quick Actions Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider mb-6">Quick Actions</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <button onClick={() => setModal('transfer')} className="flex items-center gap-4 p-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all group active:scale-[0.97]">
                                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold">Transfer</p>
                                            <p className="text-[10px] text-gray-400 font-medium">Send money instantly</p>
                                        </div>
                                    </button>
                                    
                                    <button className="flex items-center gap-4 p-4 bg-gray-900 text-white rounded-xl hover:bg-black transition-all group active:scale-[0.97]">
                                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold">Pay Bill</p>
                                            <p className="text-[10px] text-gray-400 font-medium">Utilities, rent & more</p>
                                        </div>
                                    </button>

                                    <button onClick={() => setModal('deposit')} className="flex items-center gap-4 p-4 bg-gray-950 text-white rounded-xl hover:bg-black transition-all group active:scale-[0.97]">
                                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold">Deposit Check</p>
                                            <p className="text-[10px] text-gray-400 font-medium">Use your camera</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Full-Width Card: Alerts & Messages */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider mb-6">Alerts & Messages</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-red-50/50 border border-red-100 p-4 rounded-xl flex gap-3 group cursor-pointer hover:bg-red-50 transition-colors">
                                    <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-red-400 mb-0.5">Security Alert</p>
                                        <p className="text-xs font-bold text-gray-900 truncate">New login from Chrome on Mac OS</p>
                                    </div>
                                </div>
                                <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl flex gap-3 group cursor-pointer hover:bg-amber-50 transition-colors">
                                    <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-amber-500 mb-0.5">Payment Reminder</p>
                                        <p className="text-xs font-bold text-gray-900 truncate">Credit Card bill due in 3 days</p>
                                    </div>
                                </div>
                                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex gap-3 group cursor-pointer hover:bg-blue-50 transition-colors">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-blue-400 mb-0.5">Account Info</p>
                                        <p className="text-xs font-bold text-gray-900 truncate">October e-Statement is now ready</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-12 py-16">
                <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Contact</h4>
                        <div className="space-y-2 text-xs font-bold text-gray-600">
                            <p className="hover:text-black cursor-pointer transition-colors">Support Center</p>
                            <p className="hover:text-black cursor-pointer transition-colors">Branch Locator</p>
                            <p className="hover:text-black cursor-pointer transition-colors">Schedule Appointment</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Support</h4>
                        <div className="space-y-2 text-xs font-bold text-gray-600">
                            <p className="hover:text-black cursor-pointer transition-colors">Security Center</p>
                            <p className="hover:text-black cursor-pointer transition-colors">Fraud Prevention</p>
                            <p className="hover:text-black cursor-pointer transition-colors">Privacy Policy</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Accounts</h4>
                        <div className="space-y-2 text-xs font-bold text-gray-600">
                            <p className="hover:text-black cursor-pointer transition-colors">Checking Accounts</p>
                            <p className="hover:text-black cursor-pointer transition-colors">Savings & CDs</p>
                            <p className="hover:text-black cursor-pointer transition-colors">Credit Cards</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Connect</h4>
                        <div className="flex gap-4">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer">
                                    <div className="w-4 h-4 bg-current opacity-20 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="max-w-[1440px] mx-auto px-6 mt-16 pt-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">© 2026 HarborBank Financial Group. Member FDIC.</p>
                    <div className="flex gap-6 text-[10px] font-black uppercase text-gray-400">
                        <span className="hover:text-black cursor-pointer">Terms</span>
                        <span className="hover:text-black cursor-pointer">Privacy</span>
                        <span className="hover:text-black cursor-pointer">Cookies</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
