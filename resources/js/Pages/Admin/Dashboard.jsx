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
    TrendingUp
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

const Dashboard = ({ stats, chartData }) => {
    return (
        <div className="min-h-screen bg-[#0f172a] flex">
            <Head title="Admin Dashboard" />
            
            <Sidebar />

            <main className="flex-1 ml-72">
                <Header title="Dashboard Overview" />

                <div className="p-10 space-y-10">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        <StatsCard 
                            title="Total Users" 
                            value={stats.totalUsers} 
                            icon={Users} 
                            color="indigo"
                            trend={12}
                        />
                        <StatsCard 
                            title="Active Users" 
                            value={stats.activeUsers} 
                            icon={UserCheck} 
                            color="emerald"
                        />
                        <StatsCard 
                            title="Blocked Users" 
                            value={stats.blockedUsers} 
                            icon={UserX} 
                            color="rose"
                        />
                        <StatsCard 
                            title="Total Balance" 
                            value={stats.totalBalance} 
                            icon={Wallet} 
                            color="emerald"
                        />
                        <StatsCard 
                            title="Suspicious Accounts" 
                            value={stats.suspiciousAccounts} 
                            icon={AlertTriangle} 
                            color="amber"
                        />
                    </div>

                    {/* Chart & Activities */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 bg-[#1e293b]/40 backdrop-blur-xl border border-slate-800/50 p-8 rounded-[2.5rem]">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Transactions Volume</h3>
                                    <p className="text-slate-400 text-sm">Last 30 days activity</p>
                                </div>
                                <button className="flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                                    View Report <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                        <XAxis 
                                            dataKey="date" 
                                            stroke="#64748b" 
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis 
                                            stroke="#64748b" 
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `DH ${value}`}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#0f172a', 
                                                border: '1px solid #1e293b',
                                                borderRadius: '16px',
                                                color: '#fff'
                                            }}
                                            itemStyle={{ color: '#6366f1' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="total_amount" 
                                            stroke="#6366f1" 
                                            strokeWidth={3}
                                            fillOpacity={1} 
                                            fill="url(#colorValue)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-800/50 p-8 rounded-[2.5rem]">
                            <h3 className="text-xl font-bold text-white mb-6">Security Overview</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                        <AlertTriangle className="text-amber-500 w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-semibold">{stats.suspiciousAccounts} High Risk Accounts</p>
                                        <p className="text-slate-400 text-xs">Require immediate review</p>
                                    </div>
                                </div>

                                <div className="p-5 rounded-3xl bg-slate-800/20 border border-slate-800/50">
                                    <h4 className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-4">Quick Insights</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400 text-sm">System Health</span>
                                            <span className="text-emerald-400 text-sm font-medium">99.9%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400 text-sm">Active Sessions</span>
                                            <span className="text-white text-sm font-medium">1,204</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400 text-sm">Fraud Alerts</span>
                                            <span className="text-rose-400 text-sm font-medium">0 today</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2">
                                    Run Security Audit <TrendingUp className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
