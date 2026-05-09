import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Landmark, ArrowUpRight, ArrowDownLeft, ShieldCheck, Zap, Globe, BarChart3, PieChart, Info, Activity } from 'lucide-react';
import Magnetic from '@/Components/Landing/Animations/Magnetic';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useApp } from '@/hooks/useApp';

export default function Treasury() {
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
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-white/20">Institutional Liquidity Management</span>
                    </div>
                    <h2 className="text-7xl font-black tracking-tighter text-black dark:text-white italic uppercase">{t('layout.nav.treasury')}</h2>
                </motion.div>
            }
        >
            <Head title={`${t('layout.nav.treasury')} — HarborBank`} />

            <motion.div 
                variants={containerVars}
                initial="initial"
                animate="animate"
                className="py-12 px-10 space-y-12"
            >
                {/* Liquidity Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <motion.div variants={itemVars} className="lg:col-span-8 bg-white dark:bg-white/5 rounded-[3.5rem] p-12 border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden group transition-colors">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black tracking-tighter mb-10 uppercase italic text-black dark:text-white flex items-center gap-4">
                                <Activity className="w-6 h-6 text-accent-blue" /> Liquidity Analysis
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-white/20 mb-4 italic">Available Institutional Capital</p>
                                    <h4 className="text-6xl font-black tracking-tighter tabular-nums mb-8 text-black dark:text-white italic">€ 1.240.000,00</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="px-4 py-2 bg-accent-blue/10 text-accent-blue text-[10px] font-black tracking-widest uppercase rounded-xl border border-accent-blue/20 flex items-center gap-2">
                                            <ArrowUpRight className="w-4 h-4" /> +5.2%
                                        </div>
                                        <span className="text-[9px] font-black text-gray-300 dark:text-white/10 uppercase tracking-widest">Growth vs Cycle 0x49</span>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {[
                                        { label: 'Operational Reserve', value: '€ 450.000', icon: ShieldCheck },
                                        { label: 'Tactical Deployment', value: '€ 790.000', icon: Zap }
                                    ].map((item, i) => (
                                        <div key={i} className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 group/item hover:border-accent-blue transition-all">
                                            <div className="flex items-center justify-between mb-2">
                                                <item.icon className="w-5 h-5 text-gray-400 dark:text-white/20 group-hover/item:text-accent-blue transition-colors" />
                                                <span className="text-sm font-black text-black dark:text-white">{item.value}</span>
                                            </div>
                                            <p className="text-[9px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.2em]">{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVars} className="lg:col-span-4 space-y-8">
                        <div className="bg-gradient-to-br from-accent-blue to-accent-cyan text-white rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden group transition-colors">
                            <div className="absolute inset-0 bg-white/10 opacity-50" />
                            <h3 className="text-xl font-black tracking-tighter mb-2 uppercase italic relative z-10">Network Pulse</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-10 relative z-10">Real-time Node Health</p>
                            
                            <div className="space-y-6 relative z-10">
                                {[
                                    { label: 'Frankfurt Node', status: 'Optimal', latency: '4ms' },
                                    { label: 'London Cluster', status: 'Active', latency: '12ms' },
                                    { label: 'New York Relay', status: 'Optimal', latency: '38ms' }
                                ].map((node, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest">{node.label}</p>
                                            <p className="text-[9px] opacity-40 uppercase font-black tracking-widest mt-0.5">{node.latency} Latency</p>
                                        </div>
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-white/5 rounded-[3.5rem] p-10 border border-gray-100 dark:border-white/10 shadow-sm transition-colors">
                            <h3 className="text-xl font-black text-black dark:text-white tracking-tighter uppercase italic mb-6">Quick Assets</h3>
                            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                <Globe className="w-6 h-6 text-accent-blue" />
                                <div className="text-right">
                                    <p className="text-lg font-black text-black dark:text-white tracking-tighter italic">14 Assets</p>
                                    <p className="text-[9px] font-black text-gray-400 dark:text-white/20 uppercase tracking-widest">Global Exposure</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Secondary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        { title: 'Market Sentiment', val: 'Bullish', icon: BarChart3, desc: 'Institutional aggregate' },
                        { title: 'Capital Efficiency', val: '94.2%', icon: PieChart, desc: 'Utilization rate' },
                        { title: 'Risk Index', val: 'Low', icon: ShieldCheck, desc: 'Volatility threshold' }
                    ].map((card, i) => (
                        <motion.div key={i} variants={itemVars} className="bg-white dark:bg-white/5 rounded-[3rem] p-10 border border-gray-100 dark:border-white/10 shadow-sm transition-colors group hover:border-accent-blue">
                            <div className="w-12 h-12 bg-accent-blue/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <card.icon className="w-6 h-6 text-accent-blue" />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-white/20 mb-2">{card.title}</h4>
                            <p className="text-3xl font-black text-black dark:text-white tracking-tighter italic uppercase mb-2">{card.val}</p>
                            <p className="text-[9px] font-black text-gray-300 dark:text-white/10 uppercase tracking-widest italic">{card.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
