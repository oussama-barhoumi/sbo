import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
    LayoutDashboard, 
    CreditCard, 
    ArrowUpRight, 
    ArrowDownLeft, 
    History, 
    ShieldCheck, 
    ArrowRight,
    Zap,
    Lock
} from 'lucide-react';
import Magnetic from '@/Components/Landing/Animations/Magnetic';

const WordReveal = ({ text, className }) => {
    return (
        <span className={className}>
            {text.split(' ').map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-[0.2em]">
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

export default function Dashboard() {
    const containerVars = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
    };

    const itemVars = {
        initial: { opacity: 0, y: 30, filter: "blur(5px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-white/20">Quantum Link Established</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-4xl font-black tracking-tighter text-black dark:text-white italic uppercase">
                            Overview
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Command Center — HarborBank" />

            <div className="py-20 px-8 relative overflow-hidden">
                {/* Subtle Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                
                <motion.div 
                    variants={containerVars}
                    initial="initial"
                    animate="animate"
                    className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10"
                >
                    {/* Welcome Banner */}
                    <motion.div variants={itemVars} className="lg:col-span-8 bg-white dark:bg-[#0a0a0a] rounded-[4rem] p-16 border border-gray-100 dark:border-white/5 shadow-2xl shadow-gray-200/50 dark:shadow-none relative overflow-hidden group transition-colors">
                        <div className="relative z-10">
                            <WordReveal 
                                text="Your command center is ready." 
                                className="text-6xl font-black mb-6 tracking-tighter leading-[0.95] block dark:text-white" 
                            />
                            <p className="text-gray-400 dark:text-white/40 text-lg font-medium max-w-lg mb-12 tracking-tight">
                                Access your encrypted financial portal to manage assets, execute transfers, and monitor market movements in real-time.
                            </p>
                            <Magnetic>
                                <Link 
                                    href="/banking" 
                                    className="inline-flex items-center gap-6 bg-gradient-to-r from-accent-blue to-accent-cyan text-white px-10 py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] hover:shadow-glass hover:-translate-y-1 transition-all group"
                                >
                                    Enter Banking Vault
                                    <Zap className="w-4 h-4 fill-white group-hover:scale-125 transition-transform" />
                                </Link>
                            </Magnetic>
                        </div>
                    </motion.div>

                    {/* Quick Security Status */}
                    <motion.div variants={itemVars} className="lg:col-span-4 bg-gradient-to-br from-accent-blue to-accent-cyan text-white rounded-[4rem] p-12 shadow-2xl shadow-accent-blue/20 flex flex-col justify-between relative overflow-hidden transition-colors">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] pointer-events-none" />
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-10">
                                <ShieldCheck className="w-10 h-10 text-white" />
                                <div className="px-4 py-1.5 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/20">Active</div>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-3">Total Liquid Assets</p>
                            <h4 className="text-5xl font-black tracking-tighter tabular-nums mb-4">$48,250</h4>
                            <div className="flex items-center gap-3 text-xs font-black tracking-widest text-white">
                                <ArrowUpRight className="w-5 h-5" /> +12.4% <span className="opacity-40 uppercase">THIS YEAR</span>
                            </div>
                        </div>

                        <div className="pt-12 relative z-10">
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Network Health</span>
                                <span className="text-[10px] font-black tracking-widest">ENCRYPTED</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '92%' }}
                                    className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Interactive Feature Grid */}
                    {[
                        { icon: <CreditCard className="w-6 h-6" />, title: 'Asset Cards', desc: 'Manage your physical and virtual payment instruments.', href: '/banking' },
                        { icon: <History className="w-6 h-6" />, title: 'Deep Audit', desc: 'Complete history of every encrypted transaction.', href: '/banking' },
                        { icon: <LayoutDashboard className="w-6 h-6" />, title: 'Wealth Graph', desc: 'Predictive analytics for your financial growth.', href: '/wealth' },
                        { icon: <Lock className="w-6 h-6" />, title: 'Vault Settings', desc: 'Configure biometric and multi-factor security layers.', href: '/profile' },
                    ].map((feature, i) => (
                        <motion.div 
                            key={i} 
                            variants={itemVars}
                            whileHover={{ y: -10 }}
                            onClick={() => window.location.href = feature.href}
                            className="lg:col-span-3 bg-white dark:bg-[#0a0a0a] rounded-[3rem] p-10 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/30 dark:shadow-none hover:border-black dark:hover:border-white transition-all cursor-pointer group"
                        >
                            <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-[1.5rem] flex items-center justify-center mb-10 border border-gray-100 dark:border-white/5 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all duration-500">
                                {feature.icon}
                            </div>
                            <h4 className="text-xl font-black mb-3 tracking-tighter uppercase italic dark:text-white">{feature.title}</h4>
                            <p className="text-gray-400 dark:text-white/20 text-sm font-medium leading-relaxed tracking-tight">{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
