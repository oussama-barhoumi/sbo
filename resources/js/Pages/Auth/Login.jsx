import { Head, Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import Navbar from '@/Components/Landing/Navbar';
import Footer from '@/Components/Landing/Footer';

function getCsrfToken() {
    const el = document.querySelector('meta[name="csrf-token"]');
    if (el) return el.getAttribute('content');
    return '';
}

export default function Login({ status, canResetPassword }) {
    const [formData, setFormData]     = useState({ email: '', password: '' });
    const [errors, setErrors]         = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [attemptsLeft, setAttemptsLeft] = useState(null);
    const [locked, setLocked]         = useState(false);
    const [success, setSuccess]       = useState(null);
    const emailRef = useRef(null);

    useEffect(() => { emailRef.current?.focus(); }, []);

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        setErrors(prev => ({ ...prev, [field]: null }));
    };

    const validate = () => {
        const errs = {};
        if (!formData.email.trim())            errs.email    = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email.';
        if (!formData.password)                errs.password = 'Password is required.';
        else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters.';
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
                // Store token for future API calls
                localStorage.setItem('bank_token', data.token);
                setSuccess(data);
                // Redirect to dashboard after short delay
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

            <main className="min-h-screen bg-harbor-50 flex items-center justify-center px-4 py-24">
                <div className="w-full max-w-md">

                    {/* ── Card ── */}
                    <div className="bg-white rounded-3xl shadow-card-hover overflow-hidden">

                        {/* Header bar */}
                        <div className="bg-harbor-950 px-8 pt-10 pb-8">
                            {/* Logo mark */}
                            <div className="flex justify-center mb-5">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                                    </svg>
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-white text-center tracking-tight">Welcome back</h1>
                            <p className="text-harbor-300 text-sm text-center mt-1">Sign in to your HarborBank account</p>
                        </div>

                        {/* Form body */}
                        <div className="px-8 py-8">

                            {/* Status flash (e.g. password reset success) */}
                            {status && (
                                <div className="mb-5 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium px-4 py-3 rounded-xl">
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                    {status}
                                </div>
                            )}

                            {/* Success state */}
                            {success ? (
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                    </div>
                                    <h2 className="text-lg font-bold text-harbor-950 mb-1">Welcome back, {success.name.split(' ')[0]}!</h2>
                                    <p className="text-sm text-harbor-500">Redirecting to your dashboard…</p>
                                    <div className="mt-4 h-1 bg-harbor-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-harbor-950 rounded-full animate-[shrink_1.2s_linear_forwards]" style={{ width: '100%' }} />
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} noValidate>

                                    {/* Form-level error banner */}
                                    {errors.form && (
                                        <div className={`mb-5 flex items-start gap-2.5 text-sm font-medium px-4 py-3 rounded-xl border ${locked ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                                            <span>
                                                {errors.form}
                                                {attemptsLeft !== null && !locked && (
                                                    <span className="block mt-0.5 text-xs font-normal text-red-600">{attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining before lockout.</span>
                                                )}
                                                {locked && canResetPassword && (
                                                    <Link href={route('password.request')} className="block mt-1 text-xs font-semibold text-amber-700 underline underline-offset-2">
                                                        Recover your account →
                                                    </Link>
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {/* Email */}
                                    <div className="mb-5">
                                        <label htmlFor="email" className="block text-sm font-semibold text-harbor-700 mb-1.5">
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
                                            className={`w-full px-5 py-4 bg-harbor-50 border-2 rounded-2xl text-harbor-950 text-base font-medium placeholder-harbor-300 focus:outline-none focus:bg-white transition-all ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-harbor-200 focus:border-harbor-950'}`}
                                        />
                                        {errors.email && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email}</p>}
                                    </div>

                                    {/* Password */}
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="password" className="block text-sm font-semibold text-harbor-700">
                                                Password
                                            </label>
                                            {canResetPassword && (
                                                <Link href={route('password.request')} className="text-xs text-harbor-400 hover:text-harbor-700 transition-colors font-medium">
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
                                                className={`w-full px-5 py-4 bg-harbor-50 border-2 rounded-2xl text-harbor-950 text-base font-medium placeholder-harbor-300 focus:outline-none focus:bg-white transition-all pr-12 ${errors.password ? 'border-red-400 focus:border-red-500' : 'border-harbor-200 focus:border-harbor-950'}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(p => !p)}
                                                tabIndex={-1}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-harbor-400 hover:text-harbor-600 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password}</p>}
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={submitting || locked}
                                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                                    >
                                        {submitting ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                                Signing in…
                                            </span>
                                        ) : locked ? 'Account temporarily locked' : 'Sign In'}
                                    </button>

                                    {/* Divider + register link */}
                                    <div className="mt-6 text-center">
                                        <p className="text-sm text-harbor-400">
                                            Don't have an account?{' '}
                                            <Link href="/register-account" className="font-semibold text-harbor-950 hover:underline underline-offset-2 transition-colors">
                                                Open an account
                                            </Link>
                                        </p>
                                    </div>

                                    {/* Trust badges */}
                                    <div className="mt-6 pt-6 border-t border-harbor-100 flex items-center justify-center gap-4">
                                        <div className="flex items-center gap-1.5 text-[11px] text-harbor-400 font-medium">
                                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                                            256-bit encryption
                                        </div>
                                        <div className="w-px h-3 bg-harbor-200" />
                                        <div className="flex items-center gap-1.5 text-[11px] text-harbor-400 font-medium">
                                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                                            Secure login
                                        </div>
                                        <div className="w-px h-3 bg-harbor-200" />
                                        <div className="flex items-center gap-1.5 text-[11px] text-harbor-400 font-medium">
                                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>
                                            Bank-grade security
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </>
    );
}
