import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PieChart, TrendingUp, Gem, Crown, Globe, ArrowUpRight, Zap, Star, Shield, Info } from 'lucide-react';
import Magnetic from '@/Components/Landing/Animations/Magnetic';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useApp } from '@/hooks/useApp';

export default function Wealth() {
    const { t } = useLaravelReactI18n();
    const { isDark } = useApp();

    const containerVars = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVars = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <AuthenticatedLayout
            header={
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-4 pb-12"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-white/20">Private Wealth Management</span>
                    </div>
                    <h2 className="text-7xl font-black tracking-tighter text-black dark:text-white italic uppercase">{t('layout.nav.wealth')}</h2>
                </motion.div>
            }
        >
            <Head title={`${t('layout.nav.wealth')} — HarborBank`} />

            <motion.div 
                variants={containerVars}
                initial="initial"
                animate="animate"
                className="py-12 px-10 space-y-12"
            >
                {/* Portfolio Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <motion.div variants={itemVars} className="lg:col-span-4 bg-gradient-to-br from-accent-blue to-accent-cyan text-white rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col justify-between transition-colors">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10">
                            <Crown className="w-16 h-16 mb-10 text-white" />
                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 italic italic">Platinum Portfolio</h3>
                            <p className="text-white/60 text-sm font-medium leading-relaxed mb-16">
                                Exclusive access to premium investment vehicles, private equity, and global markets managed with institutional precision.
                            </p>
                            <div className="space-y-8">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-3">AUM (Assets Under Management)</p>
                                    <p className="text-5xl font-black tracking-tighter italic">€ 4.850.000,00</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="px-4 py-2 bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20">
                                        Tier 01
                                    </div>
                                    <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest">
                                        <TrendingUp className="w-4 h-4" /> +18.4% YTD
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVars} className="lg:col-span-8 bg-white dark:bg-white/5 rounded-[4rem] p-12 border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden transition-colors">
                        <div className="flex items-center justify-between mb-12 relative z-10">
                            <h3 className="text-2xl font-black tracking-tighter uppercase italic text-black dark:text-white flex items-center gap-4">
                                <Gem className="w-6 h-6 text-accent-blue" /> Allocation Strategy
                            </h3>
                            <div className="px-6 py-3 bg-accent-blue/5 rounded-2xl border border-accent-blue/10">
                                <span className="text-[10px] font-black text-accent-blue uppercase tracking-widest italic">Optimized Performance</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                            <div className="space-y-6">
                                {[
                                    { label: 'Global Equities', val: '45%', color: 'bg-accent-blue' },
                                    { label: 'Fixed Income', val: '25%', color: 'bg-accent-cyan' },
                                    { label: 'Private Equity', val: '20%', color: 'bg-indigo-500' },
                                    { label: 'Liquid Cash', val: '10%', color: 'bg-gray-200 dark:bg-white/10' }
                                ].map((item, i) => (
                                    <div key={i} className="group">
                                        <div className="flex justify-between items-end mb-3">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-white/20">{item.label}</span>
                                            <span className="text-sm font-black text-black dark:text-white">{item.val}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: item.val }}
                                                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                                                className={`h-full ${item.color}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col justify-center items-center p-12 bg-gray-50 dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/10 relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[3rem]" />
                                <PieChart className="w-32 h-32 text-accent-blue mb-8 opacity-20" />
                                <button className="px-10 py-5 bg-accent-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:shadow-glass hover:scale-105 transition-all">
                                    Full Audit
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Performance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { title: 'Global Exposure', val: '24 Markets', icon: Globe },
                        { title: 'Risk Protocol', val: 'Conservative', icon: Shield },
                        { title: 'Yield (Est.)', val: '8.4%', icon: TrendingUp },
                        { title: 'Asset Nodes', val: '124 Units', icon: Zap }
                    ].map((card, i) => (
                        <motion.div key={i} variants={itemVars} className="bg-white dark:bg-white/5 rounded-[2.5rem] p-10 border border-gray-100 dark:border-white/10 shadow-sm group hover:border-accent-blue transition-all">
                            <div className="w-12 h-12 bg-accent-blue/5 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <card.icon className="w-6 h-6 text-accent-blue" />
                            </div>
                            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-white/20 mb-2">{card.title}</h4>
                            <p className="text-2xl font-black text-black dark:text-white tracking-tighter uppercase italic">{card.val}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
