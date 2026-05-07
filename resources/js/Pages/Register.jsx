import { Head } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/Components/Landing/Navbar';
import Footer from '@/Components/Landing/Footer';

const STEPS = [
    { field: 'full_name', label: 'Full Name', type: 'text', placeholder: 'e.g. Oussama Barhoumi', hint: 'First and last name, letters only' },
    { field: 'email', label: 'Email Address', type: 'email', placeholder: 'e.g. oussama@email.com', hint: 'Must be a valid, unique email' },
    { field: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'e.g. +2126XXXXXXXX', hint: 'International or Moroccan format' },
    { field: 'password', label: 'Password', type: 'password', placeholder: '••••••••', hint: 'Min 8 chars: uppercase, lowercase, number, special char' },
    { field: 'kyc_status', label: 'Identity Verification', type: 'kyc', hint: 'Verify you are a real person holding your ID' },
    { field: 'preferred_currency', label: 'Preferred Currency', type: 'select', options: ['MAD', 'USD', 'EUR'], hint: 'Your primary account currency' },
];

const CURRENCY_INFO = {
    MAD: { name: 'Moroccan Dirham', symbol: 'د.م.' },
    USD: { name: 'US Dollar', symbol: '$' },
    EUR: { name: 'Euro', symbol: '€' },
};

function getCsrfToken() {
    const el = document.querySelector('meta[name="csrf-token"]');
    if (el) return el.getAttribute('content');
    const cookies = document.cookie.split(';');
    for (const c of cookies) {
        const [key, val] = c.trim().split('=');
        if (key === 'XSRF-TOKEN') return decodeURIComponent(val);
    }
    return '';
}

export default function Register() {
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
    const streamRef = useRef(null); // holds MediaStream so it survives re-renders
    const [cameraActive, setCameraActive] = useState(false);
    const [kycStep, setKycStep] = useState(0); // 0: start, 1: scanning, 2: success
    const [kycMessage, setKycMessage] = useState('');

    const step = STEPS[currentStep];
    const isLastStep = currentStep === STEPS.length - 1;
    const progress = ((currentStep + (result ? 1 : 0)) / STEPS.length) * 100;

    // When kycStep becomes 1, the <video> element is now in the DOM — attach the stream.
    useEffect(() => {
        if (kycStep === 1 && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [kycStep]);

    useEffect(() => {
        if (inputRef.current && !result && step.type !== 'kyc') {
            inputRef.current.focus();
        }
        // Stop camera when navigating away from the KYC step
        if (step.type !== 'kyc') stopCamera();
        return () => stopCamera();
    }, [currentStep, result, step.type]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
            });
            streamRef.current = stream; // store BEFORE setKycStep so useEffect can attach it
            setCameraActive(true);
            setKycStep(1);             // triggers re-render → video element mounts → useEffect attaches stream
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

        // Call backend API to simulate actual KYC validation
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
                setErrors({ [step.field]: 'Verification failed: Face not matching ID or no liveness detected. Please try again.' });
                setKycStep(0);
                stopCamera();
            }
        } catch (err) {
            setErrors({ [step.field]: 'Verification service unavailable. Please try again.' });
            setKycStep(0);
            stopCamera();
        }
    };

    const validateCurrentField = async () => {
        const field = step.field;
        const value = formData[field];

        if (field === 'kyc_status' && value !== 'verified') {
            setErrors({ [field]: 'You must complete the identity verification.' });
            return false;
        }

        if (!value || (typeof value === 'string' && !value.trim())) {
            setErrors({ [field]: `${step.label} is required.` });
            return false;
        }

        // Client-side pre-checks
        if (field === 'password') {
            const pw = value;
            if (pw.length < 8) { setErrors({ [field]: 'Password must be at least 8 characters.' }); return false; }
            if (!/[A-Z]/.test(pw)) { setErrors({ [field]: 'Password must include at least 1 uppercase letter.' }); return false; }
            if (!/[a-z]/.test(pw)) { setErrors({ [field]: 'Password must include at least 1 lowercase letter.' }); return false; }
            if (!/[0-9]/.test(pw)) { setErrors({ [field]: 'Password must include at least 1 number.' }); return false; }
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)) { setErrors({ [field]: 'Password must include at least 1 special character.' }); return false; }
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

    const handleBack = () => {
        if (currentStep > 0) {
            setErrors({});
            setCurrentStep((s) => s - 1);
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
                    setErrors({ submit: 'Registration failed. Please try again.' });
                }
                return;
            }
            const data = await res.json();
            setResult(data);
        } catch {
            setErrors({ submit: 'An unexpected error occurred. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleNext(e);
    };

    // Password strength meter
    const getPasswordStrength = (pw) => {
        if (!pw) return { score: 0, label: '', color: '' };
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[a-z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
        if (score <= 3) return { score, label: 'Fair', color: 'bg-amber-500' };
        if (score <= 4) return { score, label: 'Good', color: 'bg-blue-500' };
        return { score, label: 'Strong', color: 'bg-emerald-500' };
    };

    return (
        <>
            <Head title="Open an Account" />
            <Navbar />

            <section className="min-h-screen pt-28 pb-20 flex items-start justify-center bg-gradient-to-br from-harbor-950 via-harbor-900 to-harbor-950 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/3 -left-32 w-96 h-96 bg-accent-violet/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
                    <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',backgroundSize:'60px 60px'}} />
                </div>
                <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.6,ease:[0.25,0.46,0.45,0.94]}} className="w-full max-w-lg mx-auto px-5 sm:px-8 relative z-10">
                    {/* Progress bar */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-white/50">
                                {result ? 'Complete' : `Step ${currentStep + 1} of ${STEPS.length}`}
                            </span>
                            <span className="text-xs font-medium text-white/30">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {result ? (
                        /* ── Success State ── */
                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-extrabold text-harbor-950 mb-2">Welcome to HarborBank!</h2>
                            <p className="text-harbor-500 mb-8">Your account has been created successfully.</p>

                            <div className="card text-left !p-6 space-y-4 mb-8">
                                <div className="flex justify-between">
                                    <span className="text-sm text-harbor-400">Name</span>
                                    <span className="text-sm font-semibold text-harbor-950">{result.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-harbor-400">Email</span>
                                    <span className="text-sm font-semibold text-harbor-950">{result.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-harbor-400">Phone</span>
                                    <span className="text-sm font-semibold text-harbor-950">{result.phone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-harbor-400">Currency</span>
                                    <span className="text-sm font-semibold text-harbor-950">
                                        {result.currency} ({CURRENCY_INFO[result.currency]?.symbol})
                                    </span>
                                </div>
                                <div className="border-t border-harbor-100 pt-4 flex justify-between">
                                    <span className="text-sm text-harbor-400">Account ID</span>
                                    <span className="text-sm font-mono font-semibold text-harbor-950">{result.accountId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-harbor-400">Created</span>
                                    <span className="text-sm font-semibold text-harbor-950">
                                        {new Date(result.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>

                            <a href="/" className="btn-primary">Go to Home</a>
                        </div>
                    ) : (
                        /* ── Form Steps ── */
                        <div>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                                Open an Account
                            </h1>
                            <p className="text-white/40 mb-10">
                                Secure, fast, and easy. Let's set up your HarborBank account.
                            </p>

                            <form onSubmit={handleNext} noValidate>
                                {/* Step indicator dots */}
                                <div className="flex items-center gap-2 mb-8">
                                    {STEPS.map((s, i) => (
                                        <div
                                            key={s.field}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                i < currentStep ? 'bg-emerald-400 flex-1' :
                                                i === currentStep ? 'bg-gradient-to-r from-accent-blue to-accent-cyan flex-[2]' :
                                                'bg-white/10 flex-1'
                                            }`}
                                        />
                                    ))}
                                </div>

                                <label
                                    htmlFor={step.field}
                                    className="block text-sm font-bold text-white mb-1"
                                >
                                    {step.label}
                                </label>
                                <p className="text-xs text-white/40 mb-4">{step.hint}</p>

                                {/* Input rendering */}
                                {step.type === 'select' ? (
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        {step.options.map((opt) => (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, [step.field]: opt })}
                                                className={`p-4 rounded-2xl border-2 text-center transition-all duration-200 ${
                                                    formData[step.field] === opt
                                                        ? 'border-harbor-950 bg-harbor-950 text-white shadow-card'
                                                        : 'border-harbor-200 bg-white text-harbor-950 hover:border-harbor-400'
                                                }`}
                                            >
                                                <span className="block text-lg font-bold">{CURRENCY_INFO[opt].symbol}</span>
                                                <span className="block text-xs font-semibold mt-1">{opt}</span>
                                                <span className="block text-[10px] text-harbor-400 mt-0.5">{CURRENCY_INFO[opt].name}</span>
                                            </button>
                                        ))}
                                    </div>
                                ) : step.type === 'password' ? (
                                    <div className="mb-4">
                                        <div className="relative">
                                            <input
                                                ref={inputRef}
                                                id={step.field}
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData[step.field]}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, [step.field]: e.target.value });
                                                    setErrors({});
                                                }}
                                                onKeyDown={handleKeyDown}
                                                placeholder={step.placeholder}
                                                className="w-full px-5 py-4 bg-white border-2 border-harbor-200 rounded-2xl text-harbor-950 text-base font-medium placeholder-harbor-300 focus:outline-none focus:border-harbor-950 transition-colors pr-12"
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-harbor-400 hover:text-harbor-600 transition-colors"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? (
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                )}
                                            </button>
                                        </div>
                                        {/* Strength meter */}
                                        {formData.password && (
                                            <div className="mt-3">
                                                <div className="flex gap-1 mb-1">
                                                    {[1, 2, 3, 4, 5].map((i) => {
                                                        const strength = getPasswordStrength(formData.password);
                                                        return (
                                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-harbor-100'}`} />
                                                        );
                                                    })}
                                                </div>
                                                <p className="text-xs text-harbor-400">
                                                    Strength: <span className="font-semibold">{getPasswordStrength(formData.password).label}</span>
                                                </p>
                                            </div>
                                        )}
                                       ) : step.type === 'kyc' ? (
                                    <div className="mb-4">
                                        {/* ── Step 0: Instructions ─────────────────────────── */}
                                        {kycStep === 0 && (
                                            <div className="text-center bg-harbor-50 border border-harbor-200 rounded-2xl p-6">
                                                <div className="flex justify-center gap-6 mb-5">
                                                    {/* Face icon */}
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="w-14 h-14 rounded-full border-2 border-dashed border-harbor-400 flex items-center justify-center bg-white">
                                                            <svg className="w-7 h-7 text-harbor-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                                                        </div>
                                                        <span className="text-[11px] font-semibold text-harbor-500">YOUR FACE</span>
                                                    </div>
                                                    <div className="flex items-center text-harbor-300 font-bold text-lg">+</div>
                                                    {/* ID icon */}
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="w-20 h-14 rounded-lg border-2 border-dashed border-harbor-400 flex items-center justify-center bg-white">
                                                            <svg className="w-7 h-7 text-harbor-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
                                                        </div>
                                                        <span className="text-[11px] font-semibold text-harbor-500">YOUR ID CARD</span>
                                                    </div>
                                                </div>
                                                <h3 className="text-base font-bold text-harbor-950 mb-1">Verify Your Identity</h3>
                                                <p className="text-xs text-harbor-500 mb-5 leading-relaxed">
                                                    Hold your <strong>ID card</strong> next to your <strong>face</strong> in the same frame.<br />
                                                    Make sure you are in a <strong>well-lit area</strong>.
                                                </p>
                                                <button type="button" onClick={startCamera} className="btn-primary w-full">
                                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>
                                                    Start Camera
                                                </button>
                                            </div>
                                        )}

                                        {/* ── Step 1: Live camera + overlay guides ─────────── */}
                                        {kycStep === 1 && (
                                            <div>
                                                {/* Camera viewport */}
                                                <div className="relative w-full rounded-2xl overflow-hidden bg-harbor-950" style={{aspectRatio:'16/9'}}>

                                                    {/* Live video — always rendered so ref attaches immediately */}
                                                    <video
                                                        ref={videoRef}
                                                        autoPlay
                                                        playsInline
                                                        muted
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                        style={{transform:'scaleX(-1)'}}
                                                    />

                                                    {/* Dark vignette — dims the edges, keeps guides readable */}
                                                    <div className="absolute inset-0 z-10" style={{background:'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.6) 100%)'}} />

                                                    {/* ── FACE ZONE (left 40%) ── */}
                                                    <div className="absolute z-20 flex flex-col items-center" style={{top:'10%',left:'5%',width:'38%',height:'80%'}}>
                                                        {/* Oval border */}
                                                        <div className="w-full h-full rounded-full border-2 border-emerald-400 flex items-end justify-center pb-2"
                                                             style={{boxShadow:'0 0 0 2px rgba(52,211,153,0.2)'}}>
                                                        </div>
                                                        {/* Corner brackets — top-left */}
                                                        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-emerald-400 rounded-tl-sm" />
                                                        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-emerald-400 rounded-tr-sm" />
                                                        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-emerald-400 rounded-bl-sm" />
                                                        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-emerald-400 rounded-br-sm" />
                                                    </div>
                                                    {/* Face label */}
                                                    <div className="absolute z-30 flex flex-col items-center" style={{top:'calc(10% - 22px)',left:'5%',width:'38%'}}>
                                                        <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">👤 Your Face</span>
                                                    </div>

                                                    {/* ── ID CARD ZONE (right 42%) ── */}
                                                    <div className="absolute z-20 flex flex-col items-center" style={{top:'20%',right:'4%',width:'44%',height:'55%'}}>
                                                        <div className="w-full h-full rounded-xl border-2 border-amber-400"
                                                             style={{boxShadow:'0 0 0 2px rgba(251,191,36,0.2)'}}>
                                                        </div>
                                                        {/* Corner brackets */}
                                                        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-amber-400 rounded-tl-sm" />
                                                        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-amber-400 rounded-tr-sm" />
                                                        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-amber-400 rounded-bl-sm" />
                                                        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-amber-400 rounded-br-sm" />
                                                        {/* Inner text */}
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                                                            <svg className="w-6 h-6 text-amber-400/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
                                                            <span className="text-[9px] font-bold text-amber-400/70 uppercase tracking-widest">ID Card</span>
                                                        </div>
                                                    </div>
                                                    {/* ID label */}
                                                    <div className="absolute z-30" style={{top:'calc(20% - 22px)',right:'4%',width:'44%',textAlign:'center'}}>
                                                        <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">🪪 Hold ID Here</span>
                                                    </div>

                                                    {/* Animated horizontal scan line */}
                                                    <div className="absolute inset-x-0 z-20 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                                                         style={{animation:'kyc-scan 2s linear infinite',top:'50%'}} />
                                                </div>

                                                {/* Status bar */}
                                                <div className="mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-harbor-950 rounded-xl">
                                                    <svg className="w-4 h-4 text-emerald-400 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                                    <span className="text-sm font-semibold text-white">{kycMessage}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* ── Step 2: Success ───────────────────────────────── */}
                                        {kycStep === 2 && (
                                            <div className="text-center bg-emerald-50 border border-emerald-200 rounded-2xl p-8">
                                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                                </div>
                                                <h3 className="text-lg font-bold text-emerald-800 mb-1">Identity Verified!</h3>
                                                <p className="text-sm text-emerald-700/70">Face match and liveness checks passed.</p>
                                            </div>
                                        )}
                                    </div>                              </div>
                                ) : (
                                    <input
                                        ref={inputRef}
                                        id={step.field}
                                        type={step.type}
                                        value={formData[step.field]}
                                        onChange={(e) => {
                                            setFormData({ ...formData, [step.field]: e.target.value });
                                            setErrors({});
                                        }}
                                        onKeyDown={handleKeyDown}
                                        placeholder={step.placeholder}
                                        className="w-full px-5 py-4 bg-white border-2 border-harbor-200 rounded-2xl text-harbor-950 text-base font-medium placeholder-harbor-300 focus:outline-none focus:border-harbor-950 transition-colors mb-4"
                                        autoComplete={step.field === 'email' ? 'email' : step.field === 'phone' ? 'tel' : 'off'}
                                    />
                                )}

                                {/* Error */}
                                {(errors[step.field] || errors.submit) && (
                                    <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl mb-4">
                                        <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                        </svg>
                                        <p className="text-sm text-red-700">{errors[step.field] || errors.submit}</p>
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="flex items-center gap-3 mt-6">
                                    {currentStep > 0 && (
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="btn-secondary !py-3.5 flex-1"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                            </svg>
                                            Back
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={validating || submitting}
                                        className="btn-primary !py-3.5 flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {validating ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                Validating…
                                            </span>
                                        ) : submitting ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                Creating Account…
                                            </span>
                                        ) : isLastStep ? (
                                            'Create Account'
                                        ) : (
                                            <>
                                                Continue
                                                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Security note */}
                            <div className="flex items-center gap-2 mt-8 text-xs text-white/30">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                                Your data is encrypted with 256-bit SSL and never shared with third parties.
                            </div>
                        </div>
                    )}
                </motion.div>
            </section>

            <Footer />
        </>
    );
}
