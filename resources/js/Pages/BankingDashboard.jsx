import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    LogOut,
    Bell,
    Settings,
    User,
    ChevronRight,
    ArrowRight,
    Clock,
    Info,
    CheckCircle
} from 'lucide-react';
import Magnetic from '@/Components/Landing/Animations/Magnetic';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useApp } from '@/hooks/useApp';

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

const fmt = (n, cur = 'EUR', locale = 'en-US') => new Intl.NumberFormat(locale, { style: 'currency', currency: cur }).format(n);

// ── Components ───────────────────────────────────────────────────────────────
function WordReveal({ text, className }) {
    return (
        <span className={className}>
            {text.split(' ').map((word, i) => (
                <motion.span 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block mr-[0.2em]"
                >
                    {word}
                </motion.span>
            ))}
        </span>
    );
}

function TiltCard({ children, className }) {
    return (
        <motion.div 
            whileHover={{ y: -5, transition: { duration: 0.4 } }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

function Field({ label, error, children }) {
    return (
        <div className="mb-8">
            <label className="block text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.3em] mb-3 px-1">{label}</label>
            {children}
            {error && (
                <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-3 text-[10px] text-red-600 font-black uppercase tracking-widest flex items-center gap-2"
                >
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full" /> {error}
                </motion.p>
            )}
        </div>
    );
}

const inputCls = (err) => `w-full px-6 py-5 bg-gray-50 dark:bg-white/5 border ${err ? 'border-red-500' : 'border-gray-100 dark:border-white/10'} rounded-2xl text-black dark:text-white text-base font-bold placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:ring-[12px] focus:ring-black/5 dark:focus:ring-white/5 focus:border-black dark:focus:border-white transition-all duration-500`;

function Alert({ msg, ok }) {
    if (!msg) return null;
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-8 flex items-center gap-4 px-6 py-5 rounded-[2rem] text-sm font-black border transition-colors ${ok ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}
        >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${ok ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                {ok ? '✓' : '!'}
            </div>
            <span className="uppercase tracking-widest text-[10px]">{msg}</span>
        </motion.div>
    );
}

// ── Modals ────────────────────────────────────────────────────────────
function ModalWrapper({ open, onClose, title, children }) {
    const { t } = useLaravelReactI18n();
    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-xl bg-white dark:bg-[#0a0a0a] rounded-[3.5rem] p-12 overflow-hidden shadow-2xl transition-colors duration-500"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-black text-black dark:text-white tracking-tighter uppercase italic">{title}</h2>
                            <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-all">
                                <Repeat className="w-5 h-5 rotate-45" />
                            </button>
                        </div>
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function DepositModal({ open, onClose, userId, onSuccess }) {
    const { t } = useLaravelReactI18n();
    const [form, setForm] = useState({ amount: '', currency: 'EUR', method: 'card' });
    const [err, setErr] = useState({});
    const [msg, setMsg] = useState(null);
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (!form.amount || +form.amount <= 0) { setErr({ amount: t('dashboard.common.required') }); return; }
        setLoading(true); setMsg(null); setErr({});
        const res = await API('/deposit', { method: 'POST', body: JSON.stringify({ userId, ...form, amount: +form.amount }) });
        setLoading(false);
        if (res.success) { setOk(true); setMsg(`${t('dashboard.common.complete')}: ${fmt(res.newBalance, profile?.account?.currency, t('locale'))}`); onSuccess(); }
        else setMsg(res.message || t('dashboard.common.error'));
    };

    return (
        <ModalWrapper open={open} onClose={onClose} title={t('dashboard.modals.deposit.title')}>
            <Alert msg={msg} ok={ok} />
            <form onSubmit={submit}>
                <Field label={t('dashboard.modals.deposit.amount')} error={err.amount}>
                    <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className={inputCls(err.amount)} placeholder="0.00" />
                </Field>
                <Field label={t('dashboard.modals.deposit.method')}>
                    <select value={form.method} onChange={e => setForm({...form, method: e.target.value})} className={inputCls()}>
                        <option value="card">{t('dashboard.modals.deposit.method_card')}</option>
                        <option value="transfer">{t('dashboard.modals.deposit.method_wire')}</option>
                        <option value="crypto">{t('dashboard.modals.deposit.method_crypto')}</option>
                    </select>
                </Field>
                <button disabled={loading} className="w-full bg-black dark:bg-white text-white dark:text-black py-6 rounded-2xl text-xs font-black uppercase tracking-[0.4em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                    {loading ? t('dashboard.common.processing') : t('dashboard.modals.deposit.confirm')}
                </button>
            </form>
        </ModalWrapper>
    );
}

function TransferModal({ open, onClose, userId, onSuccess }) {
    const { t } = useLaravelReactI18n();
    const [form, setForm] = useState({ amount: '', recipientId: '', note: '' });
    const [err, setErr] = useState({});
    const [msg, setMsg] = useState(null);
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        let eObj = {};
        if (!form.amount || +form.amount <= 0) eObj.amount = t('dashboard.common.required');
        if (!form.recipientId) eObj.recipientId = t('dashboard.common.required');
        if (Object.keys(eObj).length) { setErr(eObj); return; }

        setLoading(true); setMsg(null); setErr({});
        const res = await API('/transfer', { method: 'POST', body: JSON.stringify({ userId, ...form, amount: +form.amount }) });
        setLoading(false);
        if (res.success) { setOk(true); setMsg(`${t('dashboard.common.complete')}: ${fmt(res.newBalance, profile?.account?.currency, t('locale'))}`); onSuccess(); }
        else setMsg(res.message || t('dashboard.common.error'));
    };

    return (
        <ModalWrapper open={open} onClose={onClose} title={t('dashboard.modals.transfer.title')}>
            <Alert msg={msg} ok={ok} />
            <form onSubmit={submit}>
                <Field label={t('dashboard.modals.transfer.recipient')} error={err.recipientId}>
                    <input value={form.recipientId} onChange={e => setForm({...form, recipientId: e.target.value})} className={inputCls(err.recipientId)} placeholder="HB-XXXX-XXXX" />
                </Field>
                <Field label={t('dashboard.modals.deposit.amount')} error={err.amount}>
                    <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className={inputCls(err.amount)} placeholder="0.00" />
                </Field>
                <button disabled={loading} className="w-full bg-black dark:bg-white text-white dark:text-black py-6 rounded-2xl text-xs font-black uppercase tracking-[0.4em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                    {loading ? t('dashboard.common.processing') : t('dashboard.modals.transfer.confirm')}
                </button>
            </form>
        </ModalWrapper>
    );
}

// ── Main Page Component ───────────────────────────────────────────────────────
export default function BankingDashboard() {
    const { t } = useLaravelReactI18n();
    const { isDark } = useApp();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authErr, setAuthErr] = useState(false);
    const [modal, setModal] = useState(null);

    const loadProfile = useCallback(async () => {
        const res = await API('/profile');
        if (res.success) setProfile(res.profile);
        else setAuthErr(true);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('bank_token');
        if (!token) { setAuthErr(true); setLoading(false); return; }
        loadProfile().finally(() => setLoading(false));
    }, [loadProfile]);

    const logout = async () => {
        await API('/logout', { method: 'POST' });
        localStorage.removeItem('bank_token');
        window.location.href = '/login';
    };

    if (loading) return (
        <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center font-sans overflow-hidden transition-colors duration-500">
            <div className="relative">
                <motion.div 
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-24 h-24 border-[1px] border-gray-100 dark:border-white/5 border-t-black dark:border-t-white rounded-full" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-black dark:text-white">Secure</span>
                </div>
            </div>
        </div>
    );

    if (authErr) { window.location.href = '/login'; return null; }

    const containerVars = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
    };

    const itemVars = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500">
            <Head title="Banking Command Center" />
            
            {/* Global Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 px-10 py-6 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-12">
                    <Link href="/" className="text-2xl font-black tracking-tighter italic dark:text-white">HB.</Link>
                    <div className="hidden md:flex items-center gap-8">
                        {['Banking', 'Treasury', 'Wealth'].map((item) => (
                            <Link 
                                key={item} 
                                href={`/${item.toLowerCase()}`} 
                                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${item === 'Banking' ? 'text-black dark:text-white' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-black dark:text-white">Nodes Verified</span>
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-white/20 hover:text-black dark:hover:text-white transition-all">
                        <Bell className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-xl">
                        <User className="w-4 h-4" />
                    </button>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-10 max-w-[1600px] mx-auto">
                <motion.div 
                    variants={containerVars}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                >
                    {/* Welcome Header */}
                    <motion.div variants={itemVars} className="lg:col-span-12 flex flex-col sm:flex-row sm:items-end justify-between gap-8 pb-10 border-b border-gray-100 dark:border-white/5">
                        <div>
                            <WordReveal 
                                text={`${t('dashboard.header.hello')}, ${profile?.name?.split(' ')[0] || 'Member'}`} 
                                className="text-8xl font-black tracking-tighter block mb-4 leading-[0.8] text-black dark:text-white italic" 
                            />
                            <p className="text-gray-400 dark:text-white/40 font-medium tracking-tight text-xl">
                                {t('dashboard.header.session')} <span className="text-black dark:text-white font-black uppercase text-sm ml-1 tracking-[0.2em]">Session 0x4A</span>
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Magnetic>
                                <button onClick={logout} className="flex items-center gap-4 bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl">
                                    <LogOut className="w-4 h-4" /> {t('dashboard.header.sign_out')}
                                </button>
                            </Magnetic>
                        </div>
                    </motion.div>

                    {/* Left Column: Stats & Performance */}
                    <div className="lg:col-span-8 space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <TiltCard className="bg-white dark:bg-white/5 rounded-[3.5rem] p-12 border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden group transition-colors">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-black/[0.02] dark:bg-white/[0.02] rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-1000" />
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-black dark:bg-white rounded-2xl flex items-center justify-center mb-10 shadow-2xl border border-white/10">
                                        <Landmark className="w-7 h-7 text-white dark:text-black" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-white/20 mb-3">{t('dashboard.stats.liquid_assets')}</p>
                                    <h3 className="text-6xl font-black tracking-tighter mb-6 italic text-black dark:text-white">{fmt(profile?.balance ?? 0, profile?.currency)}</h3>
                                    
                                    <div className="space-y-4">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 dark:text-white/10">{t('dashboard.stats.account_id')}: <span className="text-black dark:text-white ml-2">{profile?.accountNumber}</span></p>
                                        <div className="flex items-center gap-3">
                                            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase rounded-lg tracking-widest border border-emerald-500/20">+12.4%</div>
                                            <span className="text-[9px] font-black text-gray-400 dark:text-white/20 uppercase tracking-widest">{t('dashboard.stats.active_growth')}</span>
                                        </div>
                                    </div>
                                </div>
                            </TiltCard>

                            <div className="grid grid-rows-2 gap-8">
                                <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-10 border border-gray-100 dark:border-white/10 shadow-sm flex items-center justify-between transition-colors">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-white/20 mb-2">{t('dashboard.stats.monthly_yield')}</p>
                                        <p className="text-3xl font-black italic text-black dark:text-white">{fmt(840.00, 'EUR')}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-black dark:text-white" />
                                    </div>
                                </div>
                                <div className="bg-black dark:bg-white text-white dark:text-black rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden transition-colors">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent dark:from-black/5 opacity-50" />
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">{t('dashboard.stats.security_score')}</p>
                                        <p className="text-3xl font-black italic">98.2<span className="text-sm opacity-40 ml-1">/100</span></p>
                                    </div>
                                    <ShieldCheck className="w-12 h-12 absolute right-10 top-1/2 -translate-y-1/2 opacity-20" />
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <motion.div variants={itemVars} className="bg-white dark:bg-white/5 rounded-[3.5rem] p-12 border border-gray-100 dark:border-white/10 shadow-sm transition-colors">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h3 className="text-3xl font-black tracking-tighter mb-2 text-black dark:text-white uppercase italic">{t('dashboard.performance.title')}</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-white/20">{t('dashboard.performance.subtitle')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {['week', 'month', 'year'].map(period => (
                                        <button key={period} className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${period === 'week' ? 'bg-black dark:bg-white text-white dark:text-black shadow-xl' : 'bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-white/20 hover:bg-gray-100 dark:hover:bg-white/10'}`}>
                                            {t(`dashboard.performance.${period}`)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={profile?.chartData || [
                                        { name: 'Mon', value: 2400 },
                                        { name: 'Tue', value: 3200 },
                                        { name: 'Wed', value: 2800 },
                                        { name: 'Thu', value: 4500 },
                                        { name: 'Fri', value: 3800 },
                                        { name: 'Sat', value: 5200 },
                                        { name: 'Sun', value: 4800 },
                                    ]}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={isDark ? "#fff" : "#000"} stopOpacity={0.05}/>
                                                <stop offset="95%" stopColor={isDark ? "#fff" : "#000"} stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 10, fontWeight: 900, fill: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}
                                            dy={10}
                                        />
                                        <YAxis hide />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: isDark ? "#0a0a0a" : "white", 
                                                border: "none", 
                                                borderRadius: "16px", 
                                                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                                                fontSize: "12px",
                                                fontWeight: 900
                                            }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="value" 
                                            stroke={isDark ? "white" : "black"} 
                                            strokeWidth={4} 
                                            fillOpacity={1} 
                                            fill="url(#colorValue)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Actions & Ledger */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Quick Actions */}
                        <motion.div variants={itemVars} className="bg-white dark:bg-white/5 rounded-[3.5rem] p-10 border border-gray-100 dark:border-white/10 shadow-sm transition-colors">
                            <h3 className="text-xl font-black text-black dark:text-white tracking-tighter uppercase italic mb-8">Asset Operations</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setModal('deposit')} className="flex flex-col items-center gap-4 p-8 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 hover:border-black dark:hover:border-white transition-all group">
                                    <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <ArrowDownLeft className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Deposit</span>
                                </button>
                                <button onClick={() => setModal('transfer')} className="flex flex-col items-center gap-4 p-8 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 hover:border-black dark:hover:border-white transition-all group">
                                    <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <ArrowUpRight className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Transfer</span>
                                </button>
                            </div>
                        </motion.div>

                        {/* Recent Ledger */}
                        <motion.div variants={itemVars} className="bg-white dark:bg-white/5 rounded-[3.5rem] p-10 border border-gray-100 dark:border-white/10 shadow-sm h-[600px] flex flex-col transition-colors">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-black dark:text-white tracking-tighter uppercase italic">{t('dashboard.recent_ledger')}</h3>
                                <Activity className="w-5 h-5 text-gray-400 dark:text-white/20" />
                            </div>
                            
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                {(profile?.ledger || []).length > 0 ? (
                                    profile.ledger.map((entry, i) => (
                                        <div key={i} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-black/20 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${entry.type === 'credit' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                                    {entry.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black uppercase tracking-tight text-black dark:text-white">{entry.description || 'Institutional Trx'}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <Clock className="w-3 h-3 text-gray-300 dark:text-white/10" />
                                                        <p className="text-[9px] font-black text-gray-400 dark:text-white/20 uppercase tracking-widest">{new Date(entry.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-xs font-black italic ${entry.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                                                    {entry.type === 'credit' ? '+' : '-'}{fmt(entry.amount, profile.currency)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                                        <Info className="w-12 h-12 mb-4" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">{t('dashboard.no_history')}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </main>

            {/* Modals */}
            <DepositModal 
                open={modal === 'deposit'} 
                onClose={() => setModal(null)} 
                userId={profile?.id} 
                onSuccess={loadProfile} 
            />
            <TransferModal 
                open={modal === 'transfer'} 
                onClose={() => setModal(null)} 
                userId={profile?.id} 
                onSuccess={loadProfile} 
            />
        </div>
    );
}
