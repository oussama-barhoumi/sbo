import { Head, Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/Components/Landing/Navbar';
import Footer from '@/Components/Landing/Footer';
import { AppProvider, useApp } from '@/hooks/useApp';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Eye, EyeOff, Loader2, ShieldCheck, Lock, ArrowRight, Info, CheckCircle2 } from 'lucide-react';

function getCsrfToken() {
    const el = document.querySelector('meta[name="csrf-token"]');
    if (el) return el.getAttribute('content');
    return '';
}

function LoginContent({ status, canResetPassword }) {
    const { t } = useLaravelReactI18n();
    const { isDark } = useApp();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);
    const emailRef = useRef(null);

    useEffect(() => { emailRef.current?.focus(); }, []);

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        setErrors(prev => ({ ...prev, [field]: null, form: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        try {
            const res = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => { window.location.href = '/banking'; }, 2000);
            } else {
                setErrors(data.errors || { form: data.message || 'Invalid credentials.' });
            }
        } catch {
            setErrors({ form: 'Connection error. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500">
            <Head title={t('auth.login.title')} />
            <Navbar />

            <main className="pt-40 pb-24 px-6 flex flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-[480px]"
                >
                    <div className="bg-white dark:bg-white/5 rounded-[3rem] p-12 border border-gray-100 dark:border-white/10 shadow-2xl relative overflow-hidden">
                        
                        {/* Status bar */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-50 dark:bg-white/5">
                            {submitting && (
                                <motion.div 
                                    className="h-full bg-black dark:bg-white"
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 2, ease: "linear" }}
                                />
                            )}
                        </div>

                        <div className="text-center mb-12">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-gray-100 dark:border-white/10">
                                <Lock className="w-8 h-8 text-black dark:text-white" />
                            </div>
                            <h1 className="text-4xl font-black text-black dark:text-white uppercase italic tracking-tighter mb-4">{t('auth.login.title')}</h1>
                            <p className="text-xs font-black text-gray-400 dark:text-white/20 uppercase tracking-widest">{t('auth.login.subtitle')}</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {success ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-8"
                                >
                                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h2 className="text-xl font-black text-black dark:text-white uppercase italic mb-2">{t('auth.login.success')}</h2>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-widest">{t('auth.login.redirecting')}</p>
                                </motion.div>
                            ) : (
                                <motion.form key="form" onSubmit={handleSubmit} className="space-y-6">
                                    {errors.form && (
                                        <div className="flex items-center gap-3 px-6 py-4 bg-red-500/10 rounded-2xl border border-red-500/20 mb-6">
                                            <Info className="w-4 h-4 text-red-500 flex-shrink-0" />
                                            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">{errors.form}</p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-widest mb-3 ml-2">{t('auth.login.email_label')}</label>
                                        <input
                                            ref={emailRef}
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange('email')}
                                            placeholder="institutional@harbor.test"
                                            className="w-full px-8 py-6 bg-gray-50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 rounded-3xl text-black dark:text-white text-lg font-black placeholder-gray-300 dark:placeholder-white/10 focus:outline-none focus:border-black dark:focus:border-white transition-all"
                                        />
                                        {errors.email && <p className="mt-2 ml-4 text-[10px] font-black text-red-500 uppercase tracking-widest">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-3 ml-2">
                                            <label className="block text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-widest">{t('auth.login.password_label')}</label>
                                            {canResetPassword && (
                                                <Link href={route('password.request')} className="text-[9px] font-black text-gray-400 dark:text-white/20 uppercase tracking-widest hover:text-black dark:hover:text-white transition-colors">{t('auth.login.forgot_password')}</Link>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={handleChange('password')}
                                                placeholder="••••••••"
                                                className="w-full px-8 py-6 bg-gray-50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 rounded-3xl text-black dark:text-white text-lg font-black placeholder-gray-300 dark:placeholder-white/10 focus:outline-none focus:border-black dark:focus:border-white transition-all pr-20"
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-300 dark:text-white/20 hover:text-black dark:hover:text-white transition-colors">
                                                {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                                            </button>
                                        </div>
                                        {errors.password && <p className="mt-2 ml-4 text-[10px] font-black text-red-500 uppercase tracking-widest">{errors.password}</p>}
                                    </div>

                                    <button disabled={submitting} className="w-full bg-black dark:bg-white text-white dark:text-black py-6 rounded-[2rem] text-xs font-black uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-10">
                                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : t('auth.login.submit')}
                                        {!submitting && <ArrowRight className="w-4 h-4" />}
                                    </button>

                                    <div className="text-center pt-8 border-t border-gray-50 dark:border-white/5 mt-10">
                                        <p className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-widest">
                                            {t('auth.login.no_account')}{' '}
                                            <Link href="/register-account" className="text-black dark:text-white hover:underline underline-offset-4">
                                                {t('auth.login.open_account')}
                                            </Link>
                                        </p>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-8 opacity-40">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-black dark:text-white" />
                            <span className="text-[9px] font-black text-gray-500 dark:text-white uppercase tracking-widest">SSL Secure</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-black dark:text-white" />
                            <span className="text-[9px] font-black text-gray-500 dark:text-white uppercase tracking-widest">Encrypted Data</span>
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}

export default function Login(props) {
    return (
        <AppProvider>
            <LoginContent {...props} />
        </AppProvider>
    );
}
