import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Landmark, ArrowRight, Zap, ShieldCheck, Globe } from 'lucide-react';
import Magnetic from '@/Components/Landing/Animations/Magnetic';

export default function Welcome() {
    const { t } = useLaravelReactI18n();

    const containerVars = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.5 } }
    };

    const itemVars = {
        initial: { opacity: 0, y: 40, filter: "blur(10px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white selection:text-black overflow-hidden flex flex-col items-center justify-center relative">
            <Head title="HarborBank — Secure Entry Portal" />

            {/* Background Sophistication */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
            </div>

            {/* Main Content */}
            <motion.div 
                variants={containerVars}
                initial="initial"
                animate="animate"
                className="relative z-10 flex flex-col items-center text-center px-10"
            >
                {/* The "Vissage" Animation (Screwing/Rotation Effect) */}
                <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative mb-16"
                >
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-48 h-48 border-[1px] border-white/10 rounded-full flex items-center justify-center relative"
                    >
                        {/* Spinning Text Path or Markers */}
                        {[...Array(4)].map((_, i) => (
                            <div 
                                key={i} 
                                className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                                style={{ 
                                    top: '50%', 
                                    left: '50%', 
                                    transform: `rotate(${i * 90}deg) translateY(-96px) translateX(-4px)` 
                                }}
                            />
                        ))}
                    </motion.div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="w-32 h-32 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/20 flex items-center justify-center shadow-2xl"
                        >
                            <Landmark className="w-16 h-16 text-white" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Typography */}
                <motion.div variants={itemVars} className="mb-16">
                    <h1 className="text-8xl font-black tracking-tighter uppercase italic mb-4 leading-none">
                        Harbor<span className="text-white/20">Bank</span>
                    </h1>
                    <div className="flex items-center justify-center gap-6">
                        <div className="h-[1px] w-12 bg-white/20" />
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40">Institutional Network Access</p>
                        <div className="h-[1px] w-12 bg-white/20" />
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div variants={itemVars} className="flex flex-col sm:flex-row items-center gap-6">
                    <Magnetic>
                        <Link 
                            href="/login" 
                            className="w-64 bg-white text-black px-10 py-6 rounded-[2rem] text-xs font-black uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4 group"
                        >
                            Secure Login
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </Magnetic>
                    <Magnetic>
                        <Link 
                            href="/register-account" 
                            className="w-64 bg-transparent border border-white/10 text-white px-10 py-6 rounded-[2rem] text-xs font-black uppercase tracking-[0.4em] hover:bg-white/5 hover:border-white/40 active:scale-95 transition-all flex items-center justify-center gap-4 group"
                        >
                            Open Account
                            <Zap className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                        </Link>
                    </Magnetic>
                </motion.div>

                {/* Bottom Stats/Info */}
                <motion.div variants={itemVars} className="mt-24 grid grid-cols-3 gap-16 border-t border-white/5 pt-16">
                    <div className="flex flex-col items-center">
                        <ShieldCheck className="w-6 h-6 text-white/20 mb-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">AES-256 Bit</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Globe className="w-6 h-6 text-white/20 mb-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Node Verified</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Zap className="w-6 h-6 text-white/20 mb-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Ultra Low Latency</span>
                    </div>
                </motion.div>
            </motion.div>

            {/* Terminal Decorations */}
            <div className="absolute bottom-10 left-10 text-[9px] font-mono text-white/10 hidden lg:block">
                PROTOCOL_HB_VER: 4.0.2<br />
                STATUS: ENCRYPTED_READY
            </div>
            <div className="absolute bottom-10 right-10 text-[9px] font-mono text-white/10 hidden lg:block text-right">
                LATENCY: 14ms<br />
                REGION: GLOBAL_EDGE
            </div>
        </div>
    );
}
