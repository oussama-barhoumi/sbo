import { Head, Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/Components/Landing/Navbar';
import Footer from '@/Components/Landing/Footer';

function getCsrfToken() {
    const el = document.querySelector('meta[name="csrf-token"]');
    if (el) return el.getAttribute('content');
    return '';
}

export default function Login({ status, canResetPassword }) {
    const [formData, setFormData]         = useState({ email: '', password: '' });
    const [errors, setErrors]             = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting]     = useState(false);
    const [attemptsLeft, setAttemptsLeft] = useState(null);
    const [locked, setLocked]             = useState(false);
    const [success, setSuccess]           = useState(null);
    const emailRef = useRef(null);

    useEffect(() => { emailRef.current?.focus(); }, []);

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        setErrors(prev => ({ ...prev, [field]: null }));
    };

    const validate = () => {
        const errs = {};
        if (!formData.email.trim())                    errs.email    = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email   = 'Enter a valid email.';
        if (!formData.password)                         errs.password = 'Password is required.';
        else if (formData.password.length < 6)          errs.password = 'Password must be at least 6 characters.';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSubmitting(true);
        setErrors({});

        try {
            const res = await fetch('/api/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                localStorage.setItem('bank_token', data.token);
                setSuccess(data);
                setTimeout(() => { window.location.href = '/banking'; }, 1200);
            } else if (res.status === 429) {
                setLocked(true);
                setErrors({ form: data.message });
            } else {
                setAttemptsLeft(data.attemptsRemaining ?? null);
                setErrors({ form: data.message || 'Invalid credentials.' });
            }
        } catch {
            setErrors({ form: 'Connection error. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Head title="Sign In — HarborBank" />
            <Navbar />

            <main className="min-h-screen bg-gradient-to-br from-harbor-950 via-harbor-900 to-harbor-950 flex items-center justify-center px-4 py-24 relative overflow-hidden">

                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-violet/5 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-cyan/3 rounded-full blur-3xl" />
                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }} />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="w-full max-w-md relative z-10"
                >
                    {/* Card with glass effect */}
                    <div className="bg-white/[0.06] backdrop-blur-heavy rounded-3xl border border-white/[0.1] shadow-glass overflow-hidden">

                        {/* Header */}
                        <div className="px-8 pt-10 pb-8 text-center">
                            {/* Animated logo */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                                className="flex justify-center mb-6"
                            >
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner-glow">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                                    </svg>
                                </div>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl font-bold text-white tracking-tight"
                            >
                                Welcome back
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-white/40 text-sm mt-1"
                            >
                                Sign in to your HarborBank account
                            </motion.p>
                        </div>

                        {/* Form body */}
                        <div className="px-8 pb-8">
                            {/* Status flash */}
                            <AnimatePresence>
                                {status && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                        exit={{ opacity: 0, y: -10, height: 0 }}
                                        className="mb-5 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium px-4 py-3 rounded-xl"
                                    >
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                        {status}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Success state */}
                            <AnimatePresence mode="wait">
                                {success ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-6"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                                            className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30"
                                        >
                                            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                        </motion.div>
                                        <h2 className="text-lg font-bold text-white mb-1">Welcome back, {success.name.split(' ')[0]}!</h2>
                                        <p className="text-sm text-white/40">Redirecting to your dashboard…</p>
                                        <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: '100%' }}
                                                animate={{ width: '0%' }}
                                                transition={{ duration: 1.2, ease: 'linear' }}
                                                className="h-full bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full"
                                            />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onSubmit={handleSubmit}
                                        noValidate
                                    >
                                        {/* Form-level error */}
                                        <AnimatePresence>
                                            {errors.form && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10, height: 0 }}
                                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                                    className={`mb-5 flex items-start gap-2.5 text-sm font-medium px-4 py-3 rounded-xl border ${
                                                        locked
                                                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                                                    }`}
                                                >
                                                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                                                    <span>
                                                        {errors.form}
                                                        {attemptsLeft !== null && !locked && (
                                                            <span className="block mt-0.5 text-xs font-normal opacity-70">{attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining before lockout.</span>
                                                        )}
                                                        {locked && canResetPassword && (
                                                            <Link href={route('password.request')} className="block mt-1 text-xs font-semibold underline underline-offset-2 opacity-80 hover:opacity-100">
                                                                Recover your account →
                                                            </Link>
                                                        )}
                                                    </span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Email */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="mb-5"
                                        >
                                            <label htmlFor="email" className="block text-sm font-semibold text-white/60 mb-1.5">
                                                Email Address
                                            </label>
                                            <input
                                                ref={emailRef}
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange('email')}
                                                autoComplete="username"
                                                placeholder="you@example.com"
                                                className={`input-glass ${errors.email ? '!border-red-500/50 !bg-red-500/5' : ''}`}
                                            />
                                            <AnimatePresence>
                                                {errors.email && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -4 }}
                                                        className="mt-1.5 text-xs text-red-400 font-medium"
                                                    >
                                                        {errors.email}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>

                                        {/* Password */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="mb-6"
                                        >
                                            <div className="flex items-center justify-between mb-1.5">
                                                <label htmlFor="password" className="block text-sm font-semibold text-white/60">
                                                    Password
                                                </label>
                                                {canResetPassword && (
                                                    <Link href={route('password.request')} className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">
                                                        Forgot password?
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.password}
                                                    onChange={handleChange('password')}
                                                    autoComplete="current-password"
                                                    placeholder="••••••••"
                                                    className={`input-glass pr-12 ${errors.password ? '!border-red-500/50 !bg-red-500/5' : ''}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(p => !p)}
                                                    tabIndex={-1}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                                >
                                                    {showPassword ? (
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    )}
                                                </button>
                                            </div>
                                            <AnimatePresence>
                                                {errors.password && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -4 }}
                                                        className="mt-1.5 text-xs text-red-400 font-medium"
                                                    >
                                                        {errors.password}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>

                                        {/* Submit */}
                                        <motion.button
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={submitting || locked}
                                            className="w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300
                                                       bg-gradient-to-r from-accent-blue to-accent-cyan text-white
                                                       hover:shadow-glow-blue
                                                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
                                        >
                                            {submitting ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                                    Signing in…
                                                </span>
                                            ) : locked ? 'Account temporarily locked' : 'Sign In'}
                                        </motion.button>

                                        {/* Register link */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.7 }}
                                            className="mt-6 text-center"
                                        >
                                            <p className="text-sm text-white/30">
                                                Don't have an account?{' '}
                                                <Link href="/register-account" className="font-semibold text-white/70 hover:text-white transition-colors">
                                                    Open an account
                                                </Link>
                                            </p>
                                        </motion.div>

                                        {/* Trust badges */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.8 }}
                                            className="mt-6 pt-6 border-t border-white/[0.08] flex items-center justify-center gap-4"
                                        >
                                            {[
                                                { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />, text: '256-bit SSL' },
                                                { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />, text: 'Secure login' },
                                                { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />, text: 'Bank-grade' },
                                            ].map((badge, i) => (
                                                <div key={i} className="flex items-center gap-1.5 text-[11px] text-white/25 font-medium">
                                                    <svg className="w-3.5 h-3.5 text-emerald-400/60" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">{badge.icon}</svg>
                                                    {badge.text}
                                                    {i < 2 && <div className="w-px h-3 bg-white/10 ml-3" />}
                                                </div>
                                            ))}
                                        </motion.div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </>
    );
}
