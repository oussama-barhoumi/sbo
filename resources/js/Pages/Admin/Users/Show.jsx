import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Sidebar from '@/Components/Admin/Sidebar';
import Header from '@/Components/Admin/Header';
import { 
    ChevronLeft, 
    Wallet, 
    Clock, 
    ArrowUpRight, 
    ArrowDownLeft,
    Shield,
    Activity,
    Mail,
    Phone,
    MapPin,
    Calendar
} from 'lucide-react';

const UserShow = ({ user }) => {
    return (
        <div className="min-h-screen bg-[#0f172a] flex">
            <Head title={`User Details: ${user.name}`} />
            
            <Sidebar />

            <main className="flex-1 ml-72">
                <Header title="Customer Insights" />

                <div className="p-10 space-y-10">
                    <Link 
                        href="/admin/users" 
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back to User List
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Profile Info */}
                        <div className="space-y-10">
                            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-800/50 p-8 rounded-[2.5rem] text-center">
                                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-4xl font-black shadow-2xl mx-auto mb-6">
                                    {user.name.charAt(0)}
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
                                <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${
                                    user.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                }`}>
                                    {user.status}
                                </span>

                                <div className="mt-8 space-y-4 text-left border-t border-slate-800/50 pt-8">
                                    <div className="flex items-center gap-4 text-slate-400">
                                        <Mail className="w-4 h-4" /> <span className="text-sm">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-400">
                                        <Phone className="w-4 h-4" /> <span className="text-sm">{user.phone || 'Not provided'}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-400">
                                        <MapPin className="w-4 h-4" /> <span className="text-sm truncate">{user.address || 'Not provided'}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-400">
                                        <Calendar className="w-4 h-4" /> <span className="text-sm">Member since {new Date(user.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-800/50 p-8 rounded-[2.5rem]">
                                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                                    <Shield className="text-indigo-500 w-5 h-5" /> Security Logs
                                </h3>
                                <div className="space-y-6">
                                    {user.login_logs.slice(0, 5).map((log) => (
                                        <div key={log.id} className="flex justify-between items-center pb-4 border-b border-slate-800/30 last:border-0 last:pb-0">
                                            <div>
                                                <p className="text-white text-xs font-bold">{log.ip_address}</p>
                                                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">{log.user_agent.split(' ')[0]}</p>
                                            </div>
                                            <div className="text-right text-slate-500 text-[10px]">
                                                {new Date(log.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                    {user.login_logs.length === 0 && <p className="text-slate-600 text-sm italic">No login logs found.</p>}
                                </div>
                            </div>
                        </div>

                        {/* Accounts & Transactions */}
                        <div className="lg:col-span-2 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {user.accounts.map((account) => (
                                    <div key={account.id} className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                                        <div className="flex justify-between items-start mb-10">
                                            <div>
                                                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Current Balance</p>
                                                <h4 className="text-3xl font-black">
                                                    {new Intl.NumberFormat('en-MA', { style: 'currency', currency: account.currency }).format(account.balance)}
                                                </h4>
                                            </div>
                                            <Wallet className="w-8 h-8 opacity-40" />
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Account Number</p>
                                                <p className="text-white font-mono tracking-widest">•••• •••• •••• {account.account_number.slice(-4)}</p>
                                            </div>
                                            <span className="px-3 py-1 rounded-lg bg-white/20 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                                                {account.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-800/50 p-8 rounded-[2.5rem]">
                                <h3 className="text-white font-bold mb-8 flex items-center gap-2">
                                    <Activity className="text-indigo-500 w-5 h-5" /> Recent Ledger History
                                </h3>
                                <div className="space-y-4">
                                    {user.accounts.flatMap(acc => acc.ledger_entries).sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10).map((entry) => (
                                        <div key={entry.id} className="flex items-center justify-between p-5 rounded-3xl bg-slate-800/20 border border-slate-800/50 hover:bg-slate-800/40 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                                    entry.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                                }`}>
                                                    {entry.type === 'credit' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-sm">{entry.description || 'Transaction'}</p>
                                                    <p className="text-slate-500 text-xs">{new Date(entry.created_at).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-black ${entry.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {entry.type === 'credit' ? '+' : '-'}{entry.amount}
                                                </p>
                                                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">ID: {entry.id}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {user.accounts.every(acc => acc.ledger_entries.length === 0) && (
                                        <p className="text-slate-600 text-center py-10 italic">No transaction history available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserShow;
