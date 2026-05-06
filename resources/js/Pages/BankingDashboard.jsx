import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
    CreditCard, 
    TrendingUp, 
    Landmark, 
    ShieldCheck, 
    Zap, 
    Globe, 
    ArrowUpRight, 
    ArrowDownLeft, 
    Repeat, 
    MoreVertical,
    LogOut,
    Lock,
    Bell,
    Settings,
    User,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import Magnetic from '@/Components/Landing/Animations/Magnetic';

// ── fake data for graph ──────────────────────────────────────────────────────
const CHART_DATA = [
    { name: 'Mon', value: 2400 },
    { name: 'Tue', value: 3200 },
    { name: 'Wed', value: 2800 },
    { name: 'Thu', value: 4500 },
    { name: 'Fri', value: 3800 },
    { name: 'Sat', value: 5200 },
    { name: 'Sun', value: 4800 },
];

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

// ── sub-components ────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children }) {
    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                        onClick={onClose} 
                    />
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 z-10 border border-white/20" 
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-black text-black tracking-tighter">{title}</h2>
                            <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all duration-500 group">
                                <XIcon className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                            </button>
                        </div>
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

const XIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

function Field({ label, error, children }) {
    return (
        <div className="mb-8">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 px-1">{label}</label>
            {children}
            {error && (
                <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-3 text-[10px] text-black font-black uppercase tracking-widest flex items-center gap-2"
                >
                    <span className="w-1.5 h-1.5 bg-black rounded-full" /> {error}
                </motion.p>
            )}
        </div>
    );
}

const inputCls = (err) => `w-full px-6 py-5 bg-gray-50 border ${err ? 'border-black' : 'border-gray-100'} rounded-2xl text-black text-base font-bold placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-[12px] focus:ring-black/5 focus:border-black transition-all duration-500`;

function Alert({ msg, ok }) {
    if (!msg) return null;
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-8 flex items-center gap-4 px-6 py-5 rounded-[2rem] text-sm font-black border ${ok ? 'bg-black text-white border-black' : 'bg-gray-100 border-gray-200 text-black shadow-sm'}`}
        >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${ok ? 'bg-white text-black' : 'bg-black text-white'}`}>
                {ok ? '✓' : '!'}
            </div>
            <span className="uppercase tracking-widest text-[10px]">{msg}</span>
        </motion.div>
    );
}

// ── Modals ────────────────────────────────────────────────────────────
function DepositModal({ open, onClose, userId, onSuccess }) {
    const [form, setForm] = useState({ amount: '', currency: 'DH', method: 'cash' });
    const [err, setErr] = useState({});
    const [msg, setMsg] = useState(null);
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (!form.amount || +form.amount <= 0) { setErr({ amount: 'Invalid Amount' }); return; }
        setLoading(true); setMsg(null); setErr({});
        const res = await API('/deposit', { method: 'POST', body: JSON.stringify({ userId, ...form, amount: +form.amount }) });
        setLoading(false);
        if (res.success) { setOk(true); setMsg(`Success: ${fmt(res.newBalance)}`); onSuccess(); }
        else { setOk(false); setMsg(res.message || 'Error'); }
    };

    return (
        <Modal open={open} onClose={onClose} title="Deposit">
            <Alert msg={msg} ok={ok} />
            <form onSubmit={submit}>
                <Field label="Amount" error={err.amount}>
                    <input type="number" min="1" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" className={inputCls(err.amount)} />
                </Field>
                <div className="grid grid-cols-2 gap-5 mb-8">
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
                <Magnetic>
                    <button type="submit" disabled={loading} className="w-full bg-black text-white py-6 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50">
                        {loading ? 'Processing…' : 'Finalize Deposit'}
                    </button>
                </Magnetic>
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
        if (!form.amount || +form.amount <= 0) { setErr({ amount: 'Invalid Amount' }); return; }
        setLoading(true); setMsg(null); setErr({});
        const res = await API('/withdraw', { method: 'POST', body: JSON.stringify({ userId, ...form, amount: +form.amount }) });
        setLoading(false);
        if (res.success) { setOk(true); setMsg(`Withdrawn: ${fmt(res.newBalance)}`); onSuccess(); }
        else { setOk(false); setMsg(res.message); }
    };

    return (
        <Modal open={open} onClose={onClose} title="Withdraw">
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
                <Magnetic>
                    <button type="submit" disabled={loading} className="w-full bg-black text-white py-6 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 mt-6">
                        {loading ? 'Processing…' : 'Process Withdrawal'}
                    </button>
                </Magnetic>
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
        if (!form.recipientId) errs.recipientId = 'ID Required';
        if (!form.amount || +form.amount <= 0) errs.amount = 'Invalid Amount';
        if (Object.keys(errs).length) { setErr(errs); return; }
        setLoading(true); setMsg(null); setErr({});
        const res = await API('/transfer', { method: 'POST', body: JSON.stringify({ senderId: userId, recipientId: +form.recipientId, amount: +form.amount, currency: form.currency, note: form.note || null }) });
        setLoading(false);
        if (res.success) { setOk(true); setMsg(`Transferred to ${res.recipientName}`); onSuccess(); }
        else { setOk(false); setMsg(res.message || 'Failed'); }
    };

    return (
        <Modal open={open} onClose={onClose} title="Transfer">
            <Alert msg={msg} ok={ok} />
            <form onSubmit={submit}>
                <Field label="Recipient ID" error={err.recipientId}>
                    <input type="number" value={form.recipientId} onChange={e => setForm(p => ({ ...p, recipientId: e.target.value }))} placeholder="e.g. 1004" className={inputCls(err.recipientId)} />
                </Field>
                <div className="grid grid-cols-2 gap-5">
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
                    <input type="text" value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="Payment details" className={inputCls()} />
                </Field>
                <Magnetic>
                    <button type="submit" disabled={loading} className="w-full bg-black text-white py-6 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 mt-4">
                        {loading ? 'Sending…' : 'Execute Transfer'}
                    </button>
                </Magnetic>
            </form>
        </Modal>
    );
}

// ── Animations ────────────────────────────────────────────────────────────
const WordReveal = ({ text, className }) => {
    return (
        <span className={className}>
            {text.split(' ').map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-[0.2em] pb-[0.1em]">
                    <motion.span
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ 
                            duration: 0.8, 
                            delay: i * 0.1, 
                            ease: [0.22, 1, 0.36, 1] 
                        }}
                        className="inline-block"
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </span>
    );
};

function TiltCard({ children, className }) {
    const cardRef = useRef(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        setRotateX((y - centerY) / 20);
        setRotateY((centerX - x) / 20);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ rotateX, rotateY }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ transformStyle: "preserve-3d" }}
            className={className}
        >
            <div style={{ transform: "translateZ(50px)" }}>
                {children}
            </div>
        </motion.div>
    );
}

// ── Main Page Component ───────────────────────────────────────────────────────
export default function BankingDashboard() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authErr, setAuthErr] = useState(false);
    const [modal, setModal] = useState(null);
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

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl border border-white/10">
                    {fmt(payload[0].value)}
                </div>
            );
        }
        return null;
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center font-sans overflow-hidden">
            <div className="relative">
                <motion.div 
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-24 h-24 border-[1px] border-gray-100 border-t-black rounded-full" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-black">Secure</span>
                </div>
            </div>
        </div>
    );

    if (authErr) { window.location.href = '/login'; return null; }

    const containerVars = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } }
    };

    const itemVars = {
        initial: { opacity: 0, y: 40, filter: "blur(10px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-black font-sans selection:bg-black selection:text-white relative overflow-x-hidden">
            <Head title="Premium Banking — HarborBank" />

            {/* Decorative background shapes */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <motion.div 
                    animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute -top-64 -left-64 w-[800px] h-[800px] bg-gray-100/50 rounded-full blur-3xl opacity-30" 
                />
            </div>

            <DepositModal  open={modal === 'deposit'}  onClose={() => setModal(null)} userId={profile?.userId} onSuccess={loadProfile} />
            <WithdrawModal open={modal === 'withdraw'} onClose={() => setModal(null)} userId={profile?.userId} onSuccess={loadProfile} />
            <TransferModal open={modal === 'transfer'} onClose={() => setModal(null)} userId={profile?.userId} onSuccess={loadProfile} />

            {/* Premium Navbar */}
            <nav className="bg-white/70 backdrop-blur-3xl border-b border-gray-100 px-10 py-6 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-16">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-black rounded-[1.2rem] flex items-center justify-center transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110 shadow-lg shadow-black/10">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a3 3 0 00-3 3c0 1.66 1.34 3 3 3s3-1.34 3-3a3 3 0 00-3-3zm0 8v12m0 0c-4-1-7-4-7-8h3m4 8c4-1 7-4 7-8h-3" />
                            </svg>
                        </div>
                        <span className="font-black text-2xl tracking-tighter uppercase italic">Harbor</span>
                    </Link>
                    <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                        <Link href={route('dashboard')} className={`${route().current('dashboard') ? 'text-black border-b-2 border-black pb-1' : 'hover:text-black'} transition-all`}>Overview</Link>
                        <Link href={route('treasury')} className={`${route().current('treasury') ? 'text-black border-b-2 border-black pb-1' : 'hover:text-black'} transition-all`}>Treasury</Link>
                        <Link href={route('wealth')} className={`${route().current('wealth') ? 'text-black border-b-2 border-black pb-1' : 'hover:text-black'} transition-all`}>Wealth</Link>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <span className="text-sm font-black hidden sm:block">{profile?.name}</span>
                    <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center border border-black/10 overflow-hidden shadow-xl">
                        {profile?.name ? <span className="font-black text-sm italic">{profile.name[0]}</span> : <User className="w-5 h-5" />}
                    </div>
                </div>
            </nav>

            <motion.div 
                variants={containerVars}
                initial="initial"
                animate="animate"
                className="max-w-[1600px] mx-auto px-10 py-12 relative z-10"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Header Area */}
                    <motion.div variants={itemVars} className="lg:col-span-12 flex flex-col sm:flex-row sm:items-end justify-between gap-8 pb-8 border-b border-gray-100">
                        <div>
                            <WordReveal 
                                text={`Hello, ${profile?.name?.split(' ')[0] || 'Member'}`} 
                                className="text-7xl font-black tracking-tighter block mb-3 leading-[0.8]" 
                            />
                            <p className="text-gray-400 font-medium tracking-tight text-xl">Command center established for <span className="text-black font-black uppercase text-sm ml-1 tracking-[0.2em]">Session 0x4A</span></p>
                        </div>
                        <div className="flex gap-4">
                            <Magnetic>
                                <button onClick={logout} className="flex items-center gap-4 bg-black text-white px-10 py-5 rounded-[1.8rem] text-xs font-black uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-xl shadow-black/10">
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </Magnetic>
                        </div>
                    </motion.div>

                    {/* Stats & Graph Section */}
                    <div className="lg:col-span-8 space-y-12">
                        
                        {/* Solde & Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <TiltCard className="bg-white rounded-[4rem] p-12 border border-gray-100 shadow-2xl shadow-gray-200/50 group cursor-pointer overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-1000" />
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-gray-950 rounded-2xl flex items-center justify-center mb-10 border border-white/10 shadow-2xl">
                                        <Landmark className="w-7 h-7 text-white" />
                                    </div>
                                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3">Total Liquid Assets</p>
                                    <h3 className="text-5xl font-black tracking-tighter mb-8 tabular-nums">{fmt(profile?.balance ?? 0, profile?.currency)}</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="px-3 py-1 bg-black text-white text-[9px] font-black uppercase rounded-lg tracking-widest">+12.4%</div>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Active Growth</span>
                                    </div>
                                </div>
                            </TiltCard>

                            <div className="grid grid-rows-2 gap-8">
                                <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/30 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">Monthly Yield</p>
                                        <p className="text-2xl font-black tabular-nums">{fmt(840.00, 'MAD')}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-black" />
                                    </div>
                                </div>
                                <div className="bg-black text-white rounded-[3rem] p-8 shadow-2xl shadow-black/20 flex items-center justify-between relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-1">Security Score</p>
                                        <p className="text-2xl font-black tabular-nums">98.2<span className="text-xs opacity-50 ml-1">/100</span></p>
                                    </div>
                                    <ShieldCheck className="w-10 h-10 text-white relative z-10" />
                                </div>
                            </div>
                        </div>

                        {/* Graph Section */}
                        <motion.div variants={itemVars} className="bg-white rounded-[4rem] p-12 border border-gray-100 shadow-2xl shadow-gray-200/50">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h3 className="text-3xl font-black tracking-tighter mb-2">Performance Analytics</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">7-Day Transaction Volume</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {['1W', '1M', '1Y'].map(t => (
                                        <button key={t} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${t === '1W' ? 'bg-black text-white shadow-xl' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={profile?.chartData || CHART_DATA}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#000" stopOpacity={0.05}/>
                                                <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 10, fontWeight: 900, fill: '#D1D5DB' }}
                                            dy={10}
                                        />
                                        <YAxis hide />
                                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#000', strokeWidth: 1 }} />
                                        <Area 
                                            type="monotone" 
                                            dataKey="value" 
                                            stroke="#000" 
                                            strokeWidth={4} 
                                            fillOpacity={1} 
                                            fill="url(#colorValue)" 
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Panel: Transactions & Actions */}
                    <div className="lg:col-span-4 space-y-12">
                        
                        {/* Actions */}
                        <motion.div variants={itemVars} className="bg-white rounded-[4rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/30 space-y-4">
                            <button onClick={() => setModal('transfer')} className="w-full bg-black text-white py-6 rounded-[2.5rem] flex items-center justify-between px-10 hover:bg-gray-800 transition-all group overflow-hidden relative shadow-2xl shadow-black/20">
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <span className="text-xs font-black uppercase tracking-[0.4em] relative z-10">Transfer</span>
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
                            </button>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setModal('deposit')} className="py-6 bg-gray-50 border border-gray-100 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-500 shadow-sm">Deposit</button>
                                <button onClick={() => setModal('withdraw')} className="py-6 bg-gray-50 border border-gray-100 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-500 shadow-sm">Withdraw</button>
                            </div>
                        </motion.div>

                        {/* Recent Transactions */}
                        <motion.div variants={itemVars} className="bg-white rounded-[4rem] p-10 border border-gray-100 shadow-2xl shadow-gray-200/50 h-full max-h-[700px] flex flex-col">
                            <div className="flex items-center justify-between mb-12">
                                <h3 className="text-2xl font-black tracking-tighter">Activity Ledger</h3>
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                    <HistoryIcon className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
                                {(profile?.transactions?.length > 0 ? profile.transactions : [
                                    { icon: <Globe />, label: 'Swift Transfer', date: 'Oct 24', amount: -450.00 },
                                    { icon: <CreditCard />, label: 'POS Terminal', date: 'Oct 22', amount: -4.50 },
                                    { icon: <TrendingUp />, label: 'Asset Yield', date: 'Oct 21', amount: 125.40 },
                                    { icon: <Landmark />, label: 'Vault Deposit', date: 'Oct 20', amount: 2000.00 },
                                    { icon: <ArrowDownLeft />, label: 'Refund', date: 'Oct 19', amount: 50.00 },
                                ]).map((txn, i) => (
                                    <motion.div 
                                        key={i} 
                                        whileHover={{ x: 5 }}
                                        className="flex items-center justify-between p-5 rounded-[2.5rem] hover:bg-gray-50 transition-all cursor-pointer group border border-transparent hover:border-gray-100"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-black border border-gray-100 transition-all duration-500 group-hover:bg-black group-hover:text-white group-hover:scale-105">
                                                {txn.icon || <Globe />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black tracking-tighter uppercase italic">{txn.label || txn.description}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{txn.date}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-black tabular-nums">
                                            {txn.amount < 0 ? '-' : '+'}{fmt(Math.abs(txn.amount), 'MAD').replace('MAD', '')}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <footer className="max-w-[1600px] mx-auto px-10 py-16 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-10 opacity-30">
                <p className="text-[9px] font-black uppercase tracking-[0.5em]">Harbor Private Client Services © 2026</p>
                <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.5em]">
                    <a href="#">Privacy</a>
                    <a href="#">Security</a>
                </div>
            </footer>
        </div>
    );
}

const HistoryIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
