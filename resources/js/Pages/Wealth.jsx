import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PieChart, TrendingUp, Gem, Crown, Globe, ArrowUpRight, Zap, Star } from 'lucide-react';
import Magnetic from '@/Components/Landing/Animations/Magnetic';

export default function Wealth() {
    const containerVars = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVars = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-white/20">Private Banking</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter text-black dark:text-white italic uppercase">Wealth Management</h2>
                </div>
            }
        >
            <Head title="Wealth Management — HarborBank" />

            <motion.div 
                variants={containerVars}
                initial="initial"
                animate="animate"
                className="py-12 px-8 max-w-7xl mx-auto space-y-12"
            >
                {/* Portfolio Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <motion.div variants={itemVars} className="lg:col-span-4 bg-black dark:bg-white text-white dark:text-black rounded-[4rem] p-12 shadow-2xl shadow-black/20 dark:shadow-none flex flex-col justify-between relative overflow-hidden transition-colors">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 dark:bg-black/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10">
                            <Crown className="w-12 h-12 mb-8 text-white dark:text-black" />
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-4 italic">Platinum Portfolio</h3>
                            <p className="text-white/40 dark:text-black/40 text-sm font-medium leading-relaxed mb-12">
                                Exclusive access to premium investment vehicles, private equity, and global markets.
                            </p>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 dark:text-black/30 mb-2">AUM (Assets Under Management)</p>
                                    <h4 className="text-4xl font-black tracking-tighter tabular-nums">$4,850,200</h4>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => alert('Performance Engine: Loading aggregate yield metrics...')}
                            className="w-full mt-12 py-5 bg-white dark:bg-black text-black dark:text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-200 dark:hover:bg-gray-800 transition-all relative z-10"
                        >
                            View Performance
                        </button>
                    </motion.div>

                    <motion.div variants={itemVars} className="lg:col-span-8 bg-white dark:bg-[#0a0a0a] rounded-[4rem] p-12 border border-gray-100 dark:border-white/5 shadow-2xl shadow-gray-200/50 dark:shadow-none transition-colors">
                        <h3 className="text-3xl font-black tracking-tighter mb-10 uppercase italic dark:text-white">Asset Allocation</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                            <div className="relative h-64 flex items-center justify-center">
                                {/* SVG Pseudo Chart */}
                                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" className="dark:stroke-white/5" strokeWidth="15" />
                                    <motion.circle 
                                        initial={{ strokeDasharray: "0 251.2" }}
                                        animate={{ strokeDasharray: "150.72 251.2" }}
                                        transition={{ duration: 2, ease: "easeInOut" }}
                                        cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-black dark:text-white" strokeWidth="15" strokeDasharray="150.72 251.2" 
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black tabular-nums dark:text-white">60%</span>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 dark:text-white/20">Equities</span>
                                </div>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { label: 'Global Equities', value: '60%', colorCls: 'bg-black dark:bg-white' },
                                    { label: 'Digital Assets', value: '25%', colorCls: 'bg-gray-400 dark:bg-white/20' },
                                    { label: 'Commodities', value: '10%', colorCls: 'bg-gray-200 dark:bg-white/10' },
                                    { label: 'Liquid Cash', value: '5%', colorCls: 'bg-gray-100 dark:bg-white/5' },
                                ].map((asset, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${asset.colorCls}`} />
                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">{asset.label}</span>
                                        </div>
                                        <span className="text-xs font-black tabular-nums dark:text-white">{asset.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Investment Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'Venture Capital', icon: <Zap />, desc: 'Early-stage technology investments with high growth potential.' },
                        { title: 'Global Real Estate', icon: <Globe />, desc: 'Prime commercial and residential properties in major global hubs.' },
                        { title: 'Precious Metals', icon: <Gem />, desc: 'Physical gold and silver storage in ultra-secure vault facilities.' },
                    ].map((inv, i) => (
                        <motion.div key={i} variants={itemVars} className="bg-white dark:bg-[#0a0a0a] rounded-[3rem] p-10 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/30 dark:shadow-none group hover:border-black dark:hover:border-white transition-all cursor-pointer">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-10 border border-gray-100 dark:border-white/5 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all">
                                {inv.icon}
                            </div>
                            <h4 className="text-xl font-black mb-4 tracking-tighter uppercase italic dark:text-white">{inv.title}</h4>
                            <p className="text-gray-400 dark:text-white/20 text-sm font-medium leading-relaxed tracking-tight">{inv.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
