import { Head, Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/Components/Landing/Navbar';
import Footer from '@/Components/Landing/Footer';
import { AppProvider, useApp } from '@/hooks/useApp';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import Magnetic from '@/Components/Landing/Animations/Magnetic';
import { CheckCircle, Shield, Camera, ArrowRight, ArrowLeft, Eye, EyeOff, Loader2, Info, Globe, Lock } from 'lucide-react';

const CURRENCY_INFO = {
    MAD: { name: 'Moroccan Dirham', symbol: 'د.م.' },
    USD: { name: 'US Dollar', symbol: '$' },
    EUR: { name: 'Euro', symbol: '€' },
};

function getCsrfToken() {
    const el = document.querySelector('meta[name="csrf-token"]');
    if (el) return el.getAttribute('content');
    return '';
}

function RegisterContent() {
    const { t } = useLaravelReactI18n();
    const { isDark } = useApp();
    
    const STEPS = [
        { field: 'full_name', label: t('register.steps.full_name'), type: 'text', placeholder: 'e.g. Oussama Barhoumi', hint: t('register.hints.full_name') },
        { field: 'email', label: t('register.steps.email'), type: 'email', placeholder: 'e.g. oussama@email.com', hint: t('register.hints.email') },
        { field: 'phone', label: t('register.steps.phone'), type: 'tel', placeholder: 'e.g. +2126XXXXXXXX', hint: t('register.hints.phone') },
        { field: 'password', label: t('register.steps.password'), type: 'password', placeholder: '••••••••', hint: t('register.hints.password') },
        { field: 'kyc_status', label: t('register.steps.kyc'), type: 'kyc', hint: t('register.hints.kyc') },
        { field: 'preferred_currency', label: t('register.steps.currency'), type: 'select', options: ['MAD', 'USD', 'EUR'], hint: t('register.hints.currency') },
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        full_name: '', email: '', phone: '', password: '', kyc_status: '', preferred_currency: '',
    });
    const [errors, setErrors] = useState({});
    const [validating, setValidating] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [kycStep, setKycStep] = useState(0); 
    const [kycMessage, setKycMessage] = useState('');

    const step = STEPS[currentStep];
    const isLastStep = currentStep === STEPS.length - 1;
    const progress = ((currentStep + (result ? 1 : 0)) / STEPS.length) * 100;

    useEffect(() => {
        if (kycStep === 1 && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [kycStep]);

    useEffect(() => {
        if (inputRef.current && !result && step.type !== 'kyc') {
            inputRef.current.focus();
        }
        if (step.type !== 'kyc') stopCamera();
        return () => stopCamera();
    }, [currentStep, result, step.type]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
            });
            streamRef.current = stream;
            setCameraActive(true);
            setKycStep(1);
            runKycSequence();
        } catch (err) {
            setErrors({ [step.field]: 'Camera access denied. Please allow camera access and try again.' });
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        if (videoRef.current) videoRef.current.srcObject = null;
        setCameraActive(false);
    };

    const runKycSequence = async () => {
        const messages = [
            "Please show your face clearly...",
            "Face detected. Now hold your ID next to your face...",
            "ID detected. Processing OCR...",
            "Please turn your head slightly to the right...",
            "Liveness verified. Finalizing..."
        ];

        for (let i = 0; i < messages.length; i++) {
            setKycMessage(messages[i]);
            await new Promise(r => setTimeout(r, 1500));
        }

        try {
            const res = await fetch('/register-account/verify-kyc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ full_name: formData.full_name }),
            });
            const data = await res.json();
            
            if (data.kycStatus === 'verified') {
                stopCamera();
                setFormData(prev => ({ ...prev, kyc_status: 'verified' }));
                setKycStep(2);
                setErrors({});
            } else {
                setErrors({ [step.field]: 'Verification failed. Please try again.' });
                setKycStep(0);
                stopCamera();
            }
        } catch (err) {
            setErrors({ [step.field]: 'Verification service unavailable.' });
            setKycStep(0);
            stopCamera();
        }
    };

    const validateCurrentField = async () => {
        const field = step.field;
        const value = formData[field];

        if (field === 'kyc_status' && value !== 'verified') {
            setErrors({ [field]: t('register.hints.kyc') });
            return false;
        }

        if (!value || (typeof value === 'string' && !value.trim())) {
            setErrors({ [field]: `${step.label} is required.` });
            return false;
        }

        setValidating(true);
        try {
            const res = await fetch('/register-account/validate-field', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ field, value }),
            });
            const data = await res.json();
            if (!data.valid) {
                setErrors({ [field]: data.message });
                return false;
            }
            setErrors({});
            return true;
        } catch {
            setErrors({ [field]: 'Validation failed. Please try again.' });
            return false;
        } finally {
            setValidating(false);
        }
    };

    const handleNext = async (e) => {
        e.preventDefault();
        const valid = await validateCurrentField();
        if (!valid) return;

        if (isLastStep) {
            await handleSubmit();
        } else {
            setCurrentStep((s) => s + 1);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const res = await fetch('/register-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                const errData = await res.json();
                if (errData.errors) {
                    const firstField = Object.keys(errData.errors)[0];
                    const stepIdx = STEPS.findIndex((s) => s.field === firstField);
                    if (stepIdx >= 0) setCurrentStep(stepIdx);
                    setErrors({ [firstField]: errData.errors[firstField][0] });
                } else {
                    setErrors({ submit: 'Registration failed.' });
                }
                return;
            }
            const data = await res.json();
            if (data.token) localStorage.setItem('bank_token', data.token);
            setResult(data);
            setTimeout(() => { window.location.href = '/banking'; }, 3000);
        } catch {
            setErrors({ submit: 'An unexpected error occurred.' });
        } finally {
            setSubmitting(false);
        }
    };

    const getPasswordStrength = (pw) => {
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[!@#$%^&*]/.test(pw)) score++;
        if (pw.length >= 12) score++;
        
        const map = {
            0: { label: 'Weak', color: 'bg-red-500', score: 1 },
            1: { label: 'Weak', color: 'bg-red-500', score: 1 },
            2: { label: 'Fair', color: 'bg-amber-500', score: 2 },
            3: { label: 'Good', color: 'bg-blue-500', score: 3 },
            4: { label: 'Strong', color: 'bg-emerald-500', score: 4 },
            5: { label: 'Secure', color: 'bg-emerald-600', score: 5 },
        };
        return map[score];
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500">
            <Head title={t('register.title')} />
            <Navbar />

            <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                {/* Left Side: Branding */}
                <motion.div 
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="hidden lg:block"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-3 h-3 bg-black dark:bg-white rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-white/20">Onboarding Protocol</span>
                    </div>
                    <h1 className="text-8xl font-black tracking-tighter leading-[0.8] text-black dark:text-white uppercase italic mb-10">
                        Join The <br />
                        Network.
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-white/40 font-medium leading-relaxed max-w-md mb-12">
                        {t('register.subtitle')}
                    </p>

                    <div className="space-y-8">
                        {[
                            { icon: Shield, title: 'Institutional Security', desc: 'Military-grade 256-bit encryption' },
                            { icon: Globe, title: 'Global Recognition', desc: 'Accepted at 40M+ merchants worldwide' },
                            { icon: Lock, title: 'Privacy Guaranteed', desc: 'Zero data sharing with third parties' }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6">
                                <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-white/10">
                                    <item.icon className="w-5 h-5 text-black dark:text-white" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-black dark:text-white uppercase italic tracking-tight">{item.title}</h4>
                                    <p className="text-xs text-gray-400 dark:text-white/20">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side: Form */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    className="bg-white dark:bg-white/5 rounded-[4rem] p-12 border border-gray-100 dark:border-white/10 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100 dark:bg-white/5">
                        <motion.div 
                            className="h-full bg-black dark:bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-10"
                            >
                                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-500/20">
                                    <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h2 className="text-4xl font-black text-black dark:text-white tracking-tighter uppercase italic mb-4">{t('register.success.title')}</h2>
                                <p className="text-gray-500 dark:text-white/40 font-medium mb-12">{t('register.success.subtitle')}</p>

                                <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-8 text-left space-y-4 mb-10 border border-gray-100 dark:border-white/10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase text-gray-400 dark:text-white/20">Account Number</span>
                                        <span className="text-sm font-black text-black dark:text-white font-mono">{result.accountId}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase text-gray-400 dark:text-white/20">Initial Currency</span>
                                        <span className="text-sm font-black text-black dark:text-white">{result.currency}</span>
                                    </div>
                                </div>

                                <Link href="/banking" className="w-full bg-black dark:bg-white text-white dark:text-black py-6 rounded-2xl text-xs font-black uppercase tracking-[0.4em] shadow-2xl block hover:scale-[1.02] active:scale-95 transition-all">
                                    {t('register.success.cta')}
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="mb-12">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-widest">Step {currentStep + 1} of {STEPS.length}</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-black dark:text-white tracking-tighter uppercase italic">{step.label}</h3>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-widest mt-2">{step.hint}</p>
                                </div>

                                <form onSubmit={handleNext}>
                                    {step.type === 'select' ? (
                                        <div className="grid grid-cols-1 gap-4 mb-10">
                                            {step.options.map((opt) => (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, [step.field]: opt })}
                                                    className={`p-6 rounded-3xl border-2 text-left transition-all group ${
                                                        formData[step.field] === opt
                                                            ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-2xl'
                                                            : 'border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-white/20 hover:border-gray-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <span className="block text-lg font-black">{opt}</span>
                                                            <span className="block text-[10px] uppercase font-black opacity-40">{CURRENCY_INFO[opt].name}</span>
                                                        </div>
                                                        <span className="text-2xl font-black opacity-20 group-hover:opacity-100 transition-opacity">{CURRENCY_INFO[opt].symbol}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : step.type === 'kyc' ? (
                                        <div className="mb-10">
                                            {kycStep === 0 && (
                                                <div className="text-center bg-gray-50 dark:bg-white/5 rounded-[2.5rem] p-10 border border-gray-100 dark:border-white/10">
                                                    <div className="w-20 h-20 bg-black dark:bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                                        <Camera className="w-8 h-8 text-white dark:text-black" />
                                                    </div>
                                                    <h4 className="text-xl font-black text-black dark:text-white uppercase italic mb-4">{t('register.kyc.start_title')}</h4>
                                                    <p className="text-xs text-gray-400 dark:text-white/20 mb-10 leading-relaxed">{t('register.kyc.start_desc')}</p>
                                                    <button type="button" onClick={startCamera} className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                                                        {t('register.kyc.start_button')}
                                                    </button>
                                                </div>
                                            )}
                                            {kycStep === 1 && (
                                                <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-black aspect-video border-2 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                                                    <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[0.5]" style={{transform:'scaleX(-1)'}} />
                                                    <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)]" />
                                                    <div className="absolute inset-0 z-20 flex items-center justify-center border-4 border-dashed border-white/10 m-12 rounded-[2rem] animate-pulse" />
                                                    <div className="absolute bottom-8 left-0 right-0 z-30 px-10">
                                                        <div className="bg-black/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
                                                            <p className="text-[10px] font-black text-white uppercase tracking-widest text-center animate-pulse">{kycMessage}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {kycStep === 2 && (
                                                <div className="bg-emerald-500/10 rounded-[2.5rem] p-10 border border-emerald-500/20 text-center">
                                                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                                        <CheckCircle className="w-8 h-8 text-white" />
                                                    </div>
                                                    <h4 className="text-xl font-black text-emerald-600 dark:text-emerald-400 uppercase italic">{t('register.kyc.success')}</h4>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="mb-10">
                                            <div className="relative">
                                                <input
                                                    ref={inputRef}
                                                    type={step.type === 'password' ? (showPassword ? 'text' : 'password') : step.type}
                                                    value={formData[step.field]}
                                                    onChange={(e) => { setFormData({...formData, [step.field]: e.target.value}); setErrors({}); }}
                                                    placeholder={step.placeholder}
                                                    className={`w-full px-8 py-6 bg-gray-50 dark:bg-white/5 border-2 ${errors[step.field] ? 'border-red-500/50' : 'border-gray-100 dark:border-white/10'} rounded-3xl text-black dark:text-white text-lg font-black placeholder-gray-300 dark:placeholder-white/10 focus:outline-none focus:border-black dark:focus:border-white transition-all`}
                                                />
                                                {step.type === 'password' && (
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-300 dark:text-white/20 hover:text-black dark:hover:text-white transition-colors">
                                                        {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                                                    </button>
                                                )}
                                            </div>
                                            {step.type === 'password' && formData.password && (
                                                <div className="mt-4 flex gap-1">
                                                    {[1,2,3,4,5].map(i => {
                                                        const s = getPasswordStrength(formData.password);
                                                        return <div key={i} className={`h-1 flex-1 rounded-full ${i <= s.score ? s.color : 'bg-gray-100 dark:bg-white/5'}`} />
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {errors[step.field] && (
                                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-8 px-6 py-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                                            <Info className="w-4 h-4 text-red-500 flex-shrink-0" />
                                            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">{errors[step.field]}</p>
                                        </motion.div>
                                    )}

                                    <div className="flex gap-4">
                                        {currentStep > 0 && (
                                            <button type="button" onClick={() => setCurrentStep(s => s - 1)} className="flex-[0.5] flex items-center justify-center gap-4 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-white/20 px-8 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:text-black dark:hover:text-white transition-all">
                                                <ArrowLeft className="w-4 h-4" /> {t('register.buttons.back')}
                                            </button>
                                        )}
                                        <button disabled={validating || submitting} className="flex-1 bg-black dark:bg-white text-white dark:text-black py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                                            {validating || submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : isLastStep ? t('register.buttons.create') : t('register.buttons.next')}
                                            {!validating && !submitting && <ArrowRight className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
}

export default function Register() {
    return (
        <AppProvider>
            <RegisterContent />
        </AppProvider>
    );
}
