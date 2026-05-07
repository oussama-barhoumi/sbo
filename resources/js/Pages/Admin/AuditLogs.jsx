import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Sidebar from '@/Components/Admin/Sidebar';
import Header from '@/Components/Admin/Header';
import { 
    History, 
    User, 
    Shield, 
    Info, 
} from 'lucide-react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useApp } from '@/hooks/useApp';

const AuditLogs = ({ logs }) => {
    const { t } = useLaravelReactI18n();
    const { isDark } = useApp();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex font-sans transition-colors duration-500">
            <Head title={t('admin.page.ledger.head')} />
            
            <Sidebar />

            <main className="flex-1 ml-72">
                <Header title={t('admin.page.ledger.title')} />

                <div className="p-10 space-y-8">
                    <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-sm transition-colors duration-500">
                        <div className="px-8 py-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                            <h3 className="text-xl font-black text-black dark:text-white tracking-tighter uppercase italic flex items-center gap-3">
                                <History className="text-black dark:text-white w-6 h-6" /> {t('admin.common.activity_log')}
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-widest">{t('admin.common.auto_refresh')}</span>
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-white/5">
                                        <th className="px-8 py-5 text-gray-400 dark:text-white/20 font-black text-[10px] uppercase tracking-widest">{t('admin.common.admin')}</th>
                                        <th className="px-8 py-5 text-gray-400 dark:text-white/20 font-black text-[10px] uppercase tracking-widest">{t('admin.common.action')}</th>
                                        <th className="px-8 py-5 text-gray-400 dark:text-white/20 font-black text-[10px] uppercase tracking-widest">{t('admin.common.target')}</th>
                                        <th className="px-8 py-5 text-gray-400 dark:text-white/20 font-black text-[10px] uppercase tracking-widest">{t('admin.common.details')}</th>
                                        <th className="px-8 py-5 text-gray-400 dark:text-white/20 font-black text-[10px] uppercase tracking-widest text-right">{t('admin.common.timestamp')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                    {logs.data.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-black text-[10px] border border-transparent shadow-sm">
                                                        {log.admin?.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-black dark:text-white text-xs font-black uppercase tracking-tight">{log.admin?.name}</p>
                                                        <p className="text-gray-400 dark:text-white/20 text-[9px] uppercase font-black tracking-widest">{log.admin?.role.replace('_', ' ')}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-colors ${
                                                    log.action === 'block' 
                                                    ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' 
                                                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                }`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-3.5 h-3.5 text-gray-400 dark:text-white/20" />
                                                    <span className="text-black dark:text-white text-xs font-bold">{log.target_user?.name || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-start gap-2 max-w-md">
                                                    <Info className="w-4 h-4 text-gray-300 dark:text-white/10 mt-0.5 shrink-0" />
                                                    <p className="text-gray-500 dark:text-white/40 text-xs italic">"{log.reason}"</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="text-black dark:text-white text-xs font-black">{new Date(log.created_at).toLocaleDateString()}</div>
                                                <div className="text-gray-400 dark:text-white/20 text-[10px] font-bold mt-0.5">{new Date(log.created_at).toLocaleTimeString()}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-8 py-6 bg-gray-50 dark:bg-white/5 flex items-center justify-between border-t border-gray-100 dark:border-white/10">
                            <p className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-widest">
                                {t('admin.common.showing')} <span className="text-black dark:text-white">{logs.from}</span> {t('admin.common.to')} <span className="text-black dark:text-white">{logs.to}</span> {t('admin.common.of')} <span className="text-black dark:text-white">{logs.total}</span> {t('admin.common.entries')}
                            </p>
                            <div className="flex gap-2">
                                {logs.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            link.active 
                                            ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10' 
                                            : link.url 
                                                ? 'text-gray-400 dark:text-white/20 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10' 
                                                : 'text-gray-300 dark:text-white/5 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AuditLogs;
