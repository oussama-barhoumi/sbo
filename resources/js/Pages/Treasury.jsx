import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Landmark, ArrowUpRight, ArrowDownLeft, ShieldCheck, Zap, Globe, BarChart3, PieChart } from 'lucide-react';
import Magnetic from '@/Components/Landing/Animations/Magnetic';

export default function Treasury() {
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
                        <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Liquidity Management</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter text-black italic uppercase">Treasury</h2>
                </div>
            }
        >
            <Head title="Treasury — HarborBank" />

            <motion.div 
                variants={containerVars}
                initial="initial"
                animate="animate"
                className="py-12 px-8 max-w-7xl mx-auto space-y-12"
            >
                {/* Liquidity Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <motion.div variants={itemVars} className="lg:col-span-8 bg-white rounded-[4rem] p-12 border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black tracking-tighter mb-8 uppercase italic">Liquidity Analysis</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Available Capital</p>
                                    <h4 className="text-5xl font-black tracking-tighter tabular-nums mb-6">$1,240,000</h4>
                                    <div className="flex items-center gap-3 text-emerald-600 text-xs font-black tracking-widest">
                                        <ArrowUpRight className="w-5 h-5" /> +5.2% VS PREVIOUS MONTH
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Current Reserves</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-black">$450,000</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Tier 1</span>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Pending Inflow</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-black">$82,500</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Verified</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full translate-x-1/2 -translate-y-1/2" />
                    </motion.div>

                    <motion.div variants={itemVars} className="lg:col-span-4 bg-black text-white rounded-[4rem] p-12 shadow-2xl shadow-black/20 flex flex-col justify-between">
                        <div>
                            <ShieldCheck className="w-12 h-12 mb-8" />
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-4 italic">Security Level 4</h3>
                            <p className="text-white/40 text-sm font-medium leading-relaxed mb-10">
                                Your treasury assets are protected by quantum-safe encryption and multi-signature authorization protocols.
                            </p>
                        </div>
                        <button className="w-full py-5 bg-white text-black rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-200 transition-all">
                            Audit Assets
                        </button>
                    </motion.div>
                </div>

                {/* Cash Flow Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { label: 'Inbound Flow', value: '$24.5k', icon: <ArrowDownLeft />, color: 'emerald' },
                        { label: 'Outbound Flow', value: '$12.1k', icon: <ArrowUpRight />, color: 'black' },
                        { label: 'Burn Rate', value: '2.4%', icon: <Zap />, color: 'black' },
                        { label: 'Market Exposure', value: 'Low', icon: <Globe />, color: 'black' },
                    ].map((item, i) => (
                        <motion.div key={i} variants={itemVars} className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/30 group hover:border-black transition-all">
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 border border-gray-100 group-hover:bg-black group-hover:text-white transition-all">
                                {item.icon}
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{item.label}</p>
                            <h4 className="text-3xl font-black tracking-tighter">{item.value}</h4>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
