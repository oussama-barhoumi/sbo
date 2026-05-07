import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import Sidebar from '@/Components/Admin/Sidebar';
import Header from '@/Components/Admin/Header';
import Modal from '@/Components/Admin/Modal';
import { 
    Search, 
    Filter, 
    MoreVertical, 
    AlertCircle, 
    CheckCircle, 
    Eye,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useApp } from '@/hooks/useApp';

const UsersIndex = ({ users, filters }) => {
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState('block'); // 'block' or 'unblock'
    const { t } = useLaravelReactI18n();
    const { isDark } = useApp();

    const { data, setData, post, processing, reset, errors } = useForm({
        reason: '',
    });

    const handleAction = (user, type) => {
        setSelectedUser(user);
        setActionType(type);
        setIsBlockModalOpen(true);
    };

    const submitAction = (e) => {
        e.preventDefault();
        const url = `/admin/users/${selectedUser.id}/${actionType}`;
        post(url, {
            onSuccess: () => {
                setIsBlockModalOpen(false);
                reset();
            }
        });
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        router.get('/admin/users', { ...filters, search: value }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex font-sans transition-colors duration-500">
            <Head title={t('admin.page.directory.head')} />
            
            <Sidebar />

            <main className="flex-1 ml-72">
                <Header title={t('admin.users.title')} />

                <div className="p-10 space-y-8">
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="relative group flex-1 max-w-xl">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-white/20 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                            <input 
                                type="text" 
                                defaultValue={filters.search}
                                onChange={handleSearch}
                                placeholder={t('admin.users.search_placeholder')} 
                                className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[1.5rem] pl-14 pr-8 py-4 text-xs font-black text-black dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/10 focus:ring-[12px] focus:ring-black/5 dark:focus:ring-white/5 transition-all focus:outline-none shadow-sm"
                            />
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-6 py-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-white/20 hover:text-black dark:hover:text-white transition-all shadow-sm">
                                <Filter className="w-4 h-4" />
                                {t('admin.users.filter')}
                            </button>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-sm transition-colors duration-500">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-white/5">
                                        <th className="px-8 py-5 text-gray-400 dark:text-white/20 font-black text-[10px] uppercase tracking-widest">{t('admin.users.table.identity')}</th>
                                        <th className="px-8 py-5 text-gray-400 dark:text-white/20 font-black text-[10px] uppercase tracking-widest">{t('admin.users.table.status')}</th>
                                        <th className="px-8 py-5 text-gray-400 dark:text-white/20 font-black text-[10px] uppercase tracking-widest">{t('admin.users.table.balance')}</th>
                                        <th className="px-8 py-5 text-gray-400 dark:text-white/20 font-black text-[10px] uppercase tracking-widest text-right">{t('admin.users.table.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-black text-xs shadow-sm overflow-hidden border-2 border-gray-50 dark:border-white/10">
                                                        {user.avatar ? (
                                                            <img src={`/storage/${user.avatar}`} className="w-full h-full object-cover" />
                                                        ) : (
                                                            user.name.charAt(0)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-black dark:text-white text-sm font-black uppercase tracking-tight">{user.name}</p>
                                                        <p className="text-gray-400 dark:text-white/20 text-[10px] font-bold tracking-tight">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {user.status === 'blocked' ? (
                                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                                        <AlertCircle className="w-4 h-4" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{t('admin.users.status.blocked')}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{t('admin.users.status.active')}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-black dark:text-white text-sm font-black tracking-tighter italic">€ {parseFloat(user.balance || 0).toLocaleString()}</p>
                                                <p className="text-[9px] text-gray-400 dark:text-white/20 font-black uppercase tracking-widest mt-0.5">{t('admin.users.table.assets')}</p>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link 
                                                        href={`/admin/users/${user.id}`}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-white/20 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                                                        title={t('admin.users.actions.view')}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    
                                                    {user.status === 'blocked' ? (
                                                        <button 
                                                            onClick={() => handleAction(user, 'unblock')}
                                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all"
                                                            title={t('admin.users.actions.unblock')}
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleAction(user, 'block')}
                                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all"
                                                            title={t('admin.users.actions.block')}
                                                        >
                                                            <Ban className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-8 py-6 bg-gray-50 dark:bg-white/5 flex items-center justify-between border-t border-gray-100 dark:border-white/10">
                            <p className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-widest">
                                {t('admin.common.showing')} <span className="text-black dark:text-white">{users.from}</span> {t('admin.common.to')} <span className="text-black dark:text-white">{users.to}</span> {t('admin.common.of')} <span className="text-black dark:text-white">{users.total}</span> {t('admin.common.entries')}
                            </p>
                            <div className="flex gap-2">
                                <button 
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 text-gray-400 dark:text-white/20 hover:text-black dark:hover:text-white border border-gray-100 dark:border-white/10 transition-all shadow-sm disabled:opacity-30"
                                    disabled={!users.prev_page_url}
                                    onClick={() => router.get(users.prev_page_url)}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button 
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 text-gray-400 dark:text-white/20 hover:text-black dark:hover:text-white border border-gray-100 dark:border-white/10 transition-all shadow-sm disabled:opacity-30"
                                    disabled={!users.next_page_url}
                                    onClick={() => router.get(users.next_page_url)}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Action Modal */}
            <Modal show={isBlockModalOpen} onClose={() => setIsBlockModalOpen(false)} maxWidth="md">
                <div className="p-10 dark:bg-[#0a0a0a] transition-colors duration-500">
                    <div className="flex items-center gap-4 mb-8">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${actionType === 'block' ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                            <AlertTriangle className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-black dark:text-white tracking-tighter uppercase italic">
                                {actionType === 'block' ? t('admin.users.modal.block_title') : t('admin.users.modal.unblock_title')}
                            </h2>
                            <p className="text-gray-400 dark:text-white/20 text-[10px] font-black uppercase tracking-widest mt-1">{t('admin.users.modal.target')}: {selectedUser?.name}</p>
                        </div>
                    </div>

                    <form onSubmit={submitAction} className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-widest mb-3">{t('admin.users.modal.reason_label')}</label>
                            <textarea
                                value={data.reason}
                                onChange={e => setData('reason', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-5 text-sm font-bold text-black dark:text-white focus:ring-[12px] focus:ring-black/5 dark:focus:ring-white/5 transition-all focus:outline-none min-h-[120px]"
                                placeholder={t('admin.users.modal.reason_placeholder')}
                                required
                            />
                            {errors.reason && <p className="mt-2 text-xs text-red-600 font-bold">{errors.reason}</p>}
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsBlockModalOpen(false)}
                                className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-white/20 hover:text-black dark:hover:text-white transition-colors"
                            >
                                {t('admin.users.modal.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-lg ${
                                    actionType === 'block' 
                                    ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' 
                                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                                }`}
                            >
                                {actionType === 'block' ? t('admin.users.modal.confirm_block') : t('admin.users.modal.confirm_unblock')}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default UsersIndex;
