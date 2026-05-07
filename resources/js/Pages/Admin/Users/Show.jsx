import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Sidebar from '@/Components/Admin/Sidebar';
import Header from '@/Components/Admin/Header';
import { 
    ChevronLeft, 
    Wallet, 
    ArrowUpRight, 
    ArrowDownLeft,
    Shield,
    Activity,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Info
} from 'lucide-react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useApp } from '@/hooks/useApp';

const UserShow = ({ user }) => {
    const { t } = useLaravelReactI18n();
    const { isDark } = useApp();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex font-sans transition-colors duration-500">
            <Head title={`${t('admin.users.show.title')}: ${user.name}`} />
            
            <Sidebar />

            <main className="flex-1 ml-72">
                <Header title={t('admin.users.show.title')} />

                <div className="p-10 space-y-10">
                    <Link 
                        href="/admin/users" 
                        className="inline-flex items-center gap-2 text-gray-400 dark:text-white/20 hover:text-black dark:hover:text-white transition-colors font-black uppercase tracking-widest text-[10px]"
                    >
                        <ChevronLeft className="w-4 h-4" /> {t('admin.users.show.back')}
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Profile Info */}
                        <div className="space-y-10">
                            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/10 p-10 rounded-[2.5rem] text-center shadow-sm">
                                <div className="w-24 h-24 rounded-[2.5rem] bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-4xl font-black shadow-2xl mx-auto mb-8 border-4 border-gray-50 dark:border-white/10">
                                    {user.name.charAt(0)}
                                </div>
                                <h2 className="text-3xl font-black text-black dark:text-white tracking-tighter uppercase italic mb-2">{user.name}</h2>
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                    user.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                                }`}>
                                    {user.status === 'active' ? t('admin.users.status.active') : t('admin.users.status.blocked')}
                                </span>

                                <div className="mt-10 space-y-5 text-left border-t border-gray-100 dark:border-white/10 pt-10">
                                    <div className="flex items-center gap-4 text-gray-500 dark:text-white/40">
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-500 dark:text-white/40">
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold">{user.phone || t('admin.users.show.not_provided')}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-500 dark:text-white/40">
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold truncate">{user.address || t('admin.users.show.not_provided')}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-500 dark:text-white/40">
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold">{t('admin.users.show.member_since')} {new Date(user.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/10 p-10 rounded-[2.5rem] shadow-sm">
                                <h3 className="text-black dark:text-white font-black text-xl tracking-tighter uppercase italic mb-8 flex items-center gap-3">
                                    <Shield className="text-black dark:text-white w-6 h-6" /> {t('admin.users.show.security_logs')}
                                </h3>
                                <div className="space-y-6">
                                    {user.login_logs.slice(0, 5).map((log) => (
                                        <div key={log.id} className="flex justify-between items-center pb-6 border-b border-gray-100 dark:border-white/5 last:border-0 last:pb-0 group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                <div>
                                                    <p className="text-black dark:text-white text-xs font-black tracking-tight">{log.ip_address}</p>
                                                    <p className="text-gray-400 dark:text-white/20 text-[9px] uppercase font-black tracking-[0.2em]">{log.user_agent.split(' ')[0]}</p>
                                                </div>
                                            </div>
                                            <div className="text-right text-gray-400 dark:text-white/20 text-[9px] font-black uppercase tracking-widest">
                                                {new Date(log.created_at).toLocaleString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                        </div>
                                    ))}
                                    {user.login_logs.length === 0 && <p className="text-gray-400 dark:text-white/20 text-[10px] font-black uppercase tracking-widest text-center py-4">{t('admin.users.show.no_logs')}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Accounts & Transactions */}
                        <div className="lg:col-span-2 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {user.accounts.map((account) => (
                                    <div key={account.id} className="bg-black dark:bg-white p-10 rounded-[2.5rem] text-white dark:text-black shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 dark:bg-black/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                                        <div className="flex justify-between items-start mb-12 relative z-10">
                                            <div>
                                                <p className="text-white/40 dark:text-black/40 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{t('admin.users.show.current_balance')}</p>
                                                <h4 className="text-4xl font-black tracking-tighter italic">
                                                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: account.currency }).format(account.balance)}
                                                </h4>
                                            </div>
                                            <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-black/10 flex items-center justify-center">
                                                <Wallet className="w-6 h-6 opacity-60" />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-end relative z-10">
                                            <div>
                                                <p className="text-white/40 dark:text-black/40 text-[10px] font-black uppercase tracking-[0.3em] mb-1">{t('admin.users.show.account_number')}</p>
                                                <p className="text-white dark:text-black font-mono tracking-[0.2em] text-xs">•••• •••• •••• {account.account_number.slice(-4)}</p>
                                            </div>
                                            <span className="px-4 py-1.5 rounded-xl bg-white/10 dark:bg-black/10 text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/5 dark:border-black/5">
                                                {account.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/10 p-10 rounded-[2.5rem] shadow-sm">
                                <h3 className="text-black dark:text-white font-black text-xl tracking-tighter uppercase italic mb-10 flex items-center gap-3">
                                    <Activity className="text-black dark:text-white w-6 h-6" /> {t('admin.users.show.ledger_history')}
                                </h3>
                                <div className="space-y-4">
                                        <div key={entry.id} className="flex items-center justify-between p-6 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20 transition-all group">
                                            <div className="flex items-center gap-5">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                                                    entry.type === 'credit' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
                                                }`}>
                                                    {entry.type === 'credit' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <p className="text-black dark:text-white font-black text-sm uppercase tracking-tight">{entry.description || t('admin.users.show.ledger_history')}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Clock className="w-3 h-3 text-gray-300 dark:text-white/10" />
                                                        <p className="text-gray-400 dark:text-white/20 text-[10px] font-bold uppercase tracking-widest">{new Date(entry.created_at).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-lg font-black italic tracking-tighter ${entry.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                                    {entry.type === 'credit' ? '+' : '-'}{parseFloat(entry.amount).toLocaleString('fr-FR')} €
                                                </p>
                                                <p className="text-[9px] text-gray-300 dark:text-white/10 font-black uppercase tracking-[0.2em] mt-0.5">Ref: {entry.id.toString().padStart(6, '0')}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {user.accounts.every(acc => acc.ledger_entries.length === 0) && (
                                        <div className="text-center py-20 px-10">
                                            <Info className="w-12 h-12 text-gray-100 dark:text-white/5 mx-auto mb-4" />
                                            <p className="text-gray-400 dark:text-white/20 text-xs font-black uppercase tracking-widest">{t('admin.users.show.no_history')}</p>
                                        </div>
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
