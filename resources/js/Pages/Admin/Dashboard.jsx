import React from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '@/Components/Admin/Sidebar';
import Header from '@/Components/Admin/Header';
import StatsCard from '@/Components/Admin/StatsCard';
import { 
    Users, 
    UserCheck, 
    UserX, 
    ShieldCheck, 
    BarChart3,
    Activity,
    TrendingUp,
    Zap
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
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useApp } from '@/hooks/useApp';

const Dashboard = ({ stats, chartData }) => {
    const { t } = useLaravelReactI18n();
    const { isDark } = useApp();

    const containerVars = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVars = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500">
            <Head title={t('admin.page.oversight.head')} />
            
            <Sidebar />

            <main className="flex-1 ml-72">
                <Header title={t('admin.page.oversight.title')} />

                <motion.div 
                    variants={containerVars}
                    initial="initial"
                    animate="animate"
                    className="p-10 space-y-12"
                >
                    {/* Premium Header */}
                    <motion.div variants={itemVars} className="flex items-center justify-between">
                        <div>
                            <h2 className="text-4xl font-black text-black dark:text-white tracking-tighter uppercase italic">{t('admin.page.oversight.title')}</h2>
                            <p className="text-gray-400 dark:text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Real-time infrastructure health & compliance</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="px-6 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-white/20 block mb-1">{t('admin.dashboard.health.network')}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-xs font-bold text-black dark:text-white">{t('admin.dashboard.health.operational')}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <motion.div variants={itemVars}>
                            <StatsCard 
                                title={t('admin.dashboard.stats.total_clients')} 
                                value={stats.total_users} 
                                trend="+12.5%" 
                                icon={Users} 
                                color="black"
                            />
                        </motion.div>
                        <motion.div variants={itemVars}>
                            <StatsCard 
                                title={t('admin.dashboard.stats.active_protocols')} 
                                value={stats.active_users} 
                                trend="+8.2%" 
                                icon={UserCheck} 
                                color="black"
                            />
                        </motion.div>
                        <motion.div variants={itemVars}>
                            <StatsCard 
                                title={t('admin.dashboard.stats.sanctioned_units')} 
                                value={stats.blocked_users} 
                                trend="-2.4%" 
                                icon={UserX} 
                                color="black"
                            />
                        </motion.div>
                        <motion.div variants={itemVars}>
                            <StatsCard 
                                title={t('admin.dashboard.stats.system_admins')} 
                                value={stats.total_admins} 
                                trend="Stable" 
                                icon={ShieldCheck} 
                                color="black"
                            />
                        </motion.div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Activity Chart */}
                        <motion.div variants={itemVars} className="lg:col-span-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div>
                                    <h3 className="text-xl font-black text-black dark:text-white tracking-tighter uppercase italic">{t('admin.dashboard.chart.title')}</h3>
                                    <p className="text-gray-400 dark:text-white/20 text-[10px] font-black uppercase tracking-widest mt-1">{t('admin.dashboard.chart.subtitle')}</p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                    <TrendingUp className="w-4 h-4 text-black dark:text-white" />
                                    <span className="text-[10px] font-black text-black dark:text-white">+24% {t('admin.dashboard.chart.efficiency')}</span>
                                </div>
                            </div>
                            
                            <div className="h-[350px] w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={isDark ? "white" : "black"} stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor={isDark ? "white" : "black"} stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} />
                                        <XAxis 
                                            dataKey="date" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 10, fontWeight: 900, fill: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)" }}
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 10, fontWeight: 900, fill: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)" }}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: isDark ? "#0a0a0a" : "white", 
                                                border: "none", 
                                                borderRadius: "16px", 
                                                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                                                fontSize: "12px",
                                                fontWeight: 900,
                                                color: isDark ? "white" : "black"
                                            }}
                                            itemStyle={{ color: isDark ? "white" : "black" }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="count" 
                                            stroke={isDark ? "white" : "black"} 
                                            strokeWidth={4} 
                                            fillOpacity={1} 
                                            fill="url(#colorValue)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Quick Actions / Status */}
                        <motion.div variants={itemVars} className="space-y-8">
                            <div className="bg-black dark:bg-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                    <Activity className="w-24 h-24 text-white dark:text-black" />
                                </div>
                                <h3 className="text-xl font-black text-white dark:text-black tracking-tighter uppercase italic relative z-10">{t('admin.dashboard.integrity.title')}</h3>
                                <p className="text-white/40 dark:text-black/40 text-[10px] font-black uppercase tracking-widest mt-1 relative z-10">{t('admin.dashboard.integrity.subtitle')}</p>
                                
                                <div className="mt-12 space-y-6 relative z-10">
                                    {[
                                        { label: 'Cloud Clusters', status: 'Optimal', icon: Activity },
                                        { label: 'Security Layer', status: 'Active', icon: ShieldCheck },
                                        { label: 'Database Sync', status: 'Syncing', icon: Activity }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between group/item">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-white/10 dark:bg-black/10 flex items-center justify-center">
                                                    <item.icon className="w-4 h-4 text-white dark:text-black" />
                                                </div>
                                                <span className="text-[10px] font-black text-white/80 dark:text-black/80 uppercase tracking-widest">{item.label}</span>
                                            </div>
                                            <span className="text-[9px] font-black text-white dark:text-black px-3 py-1 bg-white/10 dark:bg-black/10 rounded-lg">{item.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-10 shadow-sm">
                                <h3 className="text-xl font-black text-black dark:text-white tracking-tighter uppercase italic">{t('admin.dashboard.summary.title')}</h3>
                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                                        <BarChart3 className="w-6 h-6 text-black dark:text-white mb-4" />
                                        <span className="block text-2xl font-black text-black dark:text-white tracking-tighter">99.9%</span>
                                        <span className="text-[9px] font-black text-gray-400 dark:text-white/20 uppercase tracking-widest">{t('admin.dashboard.summary.uptime')}</span>
                                    </div>
                                    <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                                        <Zap className="w-6 h-6 text-black dark:text-white mb-4" />
                                        <span className="block text-2xl font-black text-black dark:text-white tracking-tighter">12ms</span>
                                        <span className="text-[9px] font-black text-gray-400 dark:text-white/20 uppercase tracking-widest">{t('admin.dashboard.summary.latency')}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Dashboard;
