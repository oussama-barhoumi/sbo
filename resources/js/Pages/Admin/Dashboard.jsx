import React from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '@/Components/Admin/Sidebar';
import Header from '@/Components/Admin/Header';
import StatsCard from '@/Components/Admin/StatsCard';
import { 
    Users, 
    UserCheck, 
    UserX, 
    Wallet, 
    AlertTriangle,
    ArrowUpRight,
    TrendingUp,
    ShieldCheck,
    BarChart3,
    Activity
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';

const Dashboard = ({ stats, chartData }) => {
    const containerVars = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVars = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans selection:bg-black selection:text-white">
            <Head title="System Oversight — HarborBank Admin" />
            
            <Sidebar />

            <main className="flex-1 ml-72">
                <Header title="System Oversight" />

                <motion.div 
                    variants={containerVars}
                    initial="initial"
                    animate="animate"
                    className="p-10 space-y-12"
                >
                    {/* Premium Header */}
                    <motion.div variants={itemVars} className="flex items-end justify-between border-b border-gray-200 pb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Network Status: Nominal</span>
                            </div>
                            <h1 className="text-5xl font-black tracking-tighter uppercase italic">Control Panel</h1>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white px-6 py-3 rounded-2xl border border-gray-200 flex items-center gap-3">
                                <Activity className="w-4 h-4 text-black" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Real-time Feed</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: 'Global Users', value: stats.totalUsers, icon: Users, trend: '+12%', color: 'black' },
                            { title: 'Verified Assets', value: stats.totalBalance, icon: Wallet, trend: 'Stable', color: 'black' },
                            { title: 'Security Alerts', value: stats.suspiciousAccounts, icon: AlertTriangle, trend: 'Critical', color: 'black' },
                            { title: 'Active Node', value: 'Primary', icon: ShieldCheck, trend: 'Online', color: 'black' },
                        ].map((s, i) => (
                            <motion.div key={i} variants={itemVars} className="bg-white rounded-[2.5rem] p-8 border border-gray-200 shadow-xl shadow-gray-200/50 group hover:border-black transition-all cursor-pointer">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-all">
                                        <s.icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 italic">{s.trend}</span>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">{s.title}</p>
                                <h4 className="text-3xl font-black tracking-tighter tabular-nums">{s.value}</h4>
                            </motion.div>
                        ))}
                    </div>

                    {/* Chart & Activities */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <motion.div variants={itemVars} className="lg:col-span-2 bg-white border border-gray-200 p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h3 className="text-2xl font-black tracking-tighter uppercase italic">Network Volume</h3>
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Aggregate Transaction Flow</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-lg"><BarChart3 className="w-4 h-4" /></button>
                                    <button className="w-10 h-10 bg-gray-50 text-gray-300 rounded-xl flex items-center justify-center border border-gray-100"><Activity className="w-4 h-4" /></button>
                                </div>
                            </div>

                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="adminGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#000" stopOpacity={0.05}/>
                                                <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis 
                                            dataKey="date" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 10, fontWeight: 900, fill: '#D1D5DB' }}
                                        />
                                        <YAxis hide />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#000', 
                                                border: 'none',
                                                borderRadius: '16px',
                                                color: '#fff',
                                                fontSize: '10px',
                                                fontWeight: '900',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.1em'
                                            }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="total_amount" 
                                            stroke="#000" 
                                            strokeWidth={4}
                                            fillOpacity={1} 
                                            fill="url(#adminGradient)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVars} className="bg-black text-white rounded-[3rem] p-10 shadow-2xl shadow-black/20 flex flex-col overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8 relative z-10">Security Audit</h3>
                            
                            <div className="space-y-6 relative z-10 flex-1">
                                <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <AlertTriangle className="text-white w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-white text-xs font-black uppercase tracking-widest">{stats.suspiciousAccounts} Node Alerts</p>
                                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Urgent Review</p>
                                    </div>
                                </div>

                                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5">
                                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-6">Metrics Feed</p>
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Uptime</span>
                                            <span className="text-white text-[10px] font-black tracking-widest">99.98%</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: '99%' }} className="h-full bg-white shadow-[0_0_10px_white]" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Throughput</span>
                                            <span className="text-white text-[10px] font-black tracking-widest">High</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-10 py-5 bg-white text-black rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gray-200 transition-all active:scale-95 relative z-10">
                                Global Audit Log
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Dashboard;
