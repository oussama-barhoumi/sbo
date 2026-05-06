import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Sidebar from '@/Components/Admin/Sidebar';
import Header from '@/Components/Admin/Header';
import { 
    History, 
    User, 
    Shield, 
    Info, 
    Calendar, 
    Clock,
    ArrowRight
} from 'lucide-react';

const AuditLogs = ({ logs }) => {
    return (
        <div className="min-h-screen bg-[#0f172a] flex">
            <Head title="System Audit Logs" />
            
            <Sidebar />

            <main className="flex-1 ml-72">
                <Header title="Security Audit Trails" />

                <div className="p-10 space-y-8">
                    <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="px-8 py-6 border-b border-slate-800/50 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <History className="text-indigo-500 w-6 h-6" /> System Activity Log
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Auto-refresh active</span>
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900/30">
                                        <th className="px-8 py-5 text-slate-400 font-bold text-xs uppercase tracking-widest">Admin</th>
                                        <th className="px-8 py-5 text-slate-400 font-bold text-xs uppercase tracking-widest">Action</th>
                                        <th className="px-8 py-5 text-slate-400 font-bold text-xs uppercase tracking-widest">Target</th>
                                        <th className="px-8 py-5 text-slate-400 font-bold text-xs uppercase tracking-widest">Reason / Details</th>
                                        <th className="px-8 py-5 text-slate-400 font-bold text-xs uppercase tracking-widest text-right">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/30">
                                    {logs.data.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-xs border border-indigo-500/20">
                                                        {log.admin?.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-white text-sm font-bold">{log.admin?.name}</p>
                                                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">{log.admin?.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border ${
                                                    log.action === 'block' 
                                                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                                                    : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                }`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-3.5 h-3.5 text-slate-500" />
                                                    <span className="text-slate-300 text-sm font-medium">{log.target_user?.name || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-start gap-2 max-w-md">
                                                    <Info className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
                                                    <p className="text-slate-400 text-sm italic">"{log.reason}"</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="text-white text-sm font-bold">{new Date(log.created_at).toLocaleDateString()}</div>
                                                <div className="text-slate-500 text-xs">{new Date(log.created_at).toLocaleTimeString()}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-8 py-6 bg-slate-900/30 flex items-center justify-between border-t border-slate-800/50">
                            <p className="text-sm text-slate-500 font-medium">
                                Showing <span className="text-white">{logs.from}</span> to <span className="text-white">{logs.to}</span> of <span className="text-white">{logs.total}</span> audit entries
                            </p>
                            <div className="flex gap-2">
                                {logs.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                            link.active 
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                                            : link.url 
                                                ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                                                : 'text-slate-700 cursor-not-allowed'
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
