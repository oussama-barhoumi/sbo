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
    Ban, 
    Eye,
    ChevronLeft,
    ChevronRight,
    AlertTriangle
} from 'lucide-react';

const UsersIndex = ({ users, filters }) => {
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState('block'); // 'block' or 'unblock'

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
        router.get('/admin/users', { search: value, status: filters.status }, { preserveState: true, replace: true });
    };

    const handleStatusFilter = (status) => {
        router.get('/admin/users', { search: filters.search, status: status }, { preserveState: true });
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex">
            <Head title="User Management" />
            
            <Sidebar />

            <main className="flex-1 ml-72">
                <Header title="User Management" />

                <div className="p-10 space-y-8">
                    {/* Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input 
                                type="text" 
                                defaultValue={filters.search}
                                onChange={handleSearch}
                                placeholder="Search by name, email or phone..." 
                                className="w-full bg-[#1e293b]/50 border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-indigo-500/50 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-3 bg-[#1e293b]/50 p-1.5 rounded-2xl border border-slate-800/50">
                            {['all', 'active', 'blocked'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusFilter(status === 'all' ? '' : status)}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                        (filters.status || 'all') === status 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                                        : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table Card */}
                    <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800/50 bg-slate-900/50">
                                    <th className="px-8 py-6 text-slate-400 font-bold text-xs uppercase tracking-widest">Customer</th>
                                    <th className="px-8 py-6 text-slate-400 font-bold text-xs uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-slate-400 font-bold text-xs uppercase tracking-widest">Balance</th>
                                    <th className="px-8 py-6 text-slate-400 font-bold text-xs uppercase tracking-widest">Activity</th>
                                    <th className="px-8 py-6 text-slate-400 font-bold text-xs uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/30">
                                {users.data.map((user) => (
                                    <tr 
                                        key={user.id} 
                                        className={`group hover:bg-slate-800/20 transition-colors ${user.isSuspicious ? 'bg-red-500/5' : ''}`}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold shadow-lg">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white font-bold">{user.name}</span>
                                                        {user.isSuspicious && (
                                                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-tighter animate-pulse">
                                                                <AlertTriangle className="w-3 h-3" /> Suspicious
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-slate-500 text-xs mt-1">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                                                user.status === 'active' 
                                                ? 'bg-emerald-500/10 text-emerald-400' 
                                                : 'bg-rose-500/10 text-rose-400'
                                            }`}>
                                                {user.status === 'active' ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-white font-black">
                                                {new Intl.NumberFormat('en-MA', { style: 'currency', currency: 'MAD' }).format(user.balance)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm text-slate-300">{user.lastActivity}</div>
                                            <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Joined {user.createdAt}</div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link 
                                                    href={`/admin/users/${user.id}`}
                                                    className="p-2.5 bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </Link>
                                                
                                                {user.status === 'active' ? (
                                                    <button 
                                                        onClick={() => handleAction(user, 'block')}
                                                        className="p-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-all"
                                                    >
                                                        <Ban className="w-5 h-5" />
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleAction(user, 'unblock')}
                                                        className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl transition-all"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="px-8 py-6 bg-slate-900/30 flex items-center justify-between border-t border-slate-800/50">
                            <p className="text-sm text-slate-500 font-medium">
                                Showing <span className="text-white">{users.from}</span> to <span className="text-white">{users.to}</span> of <span className="text-white">{users.total}</span> users
                            </p>
                            <div className="flex gap-2">
                                {users.links.map((link, i) => (
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

            {/* Action Modal */}
            <Modal
                isOpen={isBlockModalOpen}
                onClose={() => setIsBlockModalOpen(false)}
                title={`${actionType === 'block' ? 'Block' : 'Unblock'} User: ${selectedUser?.name}`}
            >
                <form onSubmit={submitAction} className="space-y-6">
                    {actionType === 'block' && (
                        <div className="bg-rose-500/10 p-5 rounded-2xl flex items-start gap-4 border border-rose-500/20">
                            <AlertCircle className="text-rose-500 w-6 h-6 shrink-0 mt-1" />
                            <div>
                                <h4 className="text-rose-500 font-bold">Critical Warning</h4>
                                <p className="text-rose-500/70 text-sm leading-relaxed mt-1">
                                    Blocking this user will immediately terminate all active sessions, revoke API tokens, and freeze all financial transactions. This action is logged for audit purposes.
                                </p>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-slate-400 text-sm font-bold mb-3 uppercase tracking-widest">Reason for action</label>
                        <textarea
                            value={data.reason}
                            onChange={e => setData('reason', e.target.value)}
                            className="w-full bg-[#0f172a] border-slate-800 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 min-h-[120px]"
                            placeholder="Enter detailed reason here..."
                        />
                        {errors.reason && <p className="text-rose-500 text-xs mt-2">{errors.reason}</p>}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsBlockModalOpen(false)}
                            className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className={`flex-1 py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
                                actionType === 'block' 
                                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20' 
                                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                            }`}
                        >
                            {processing ? 'Processing...' : `Confirm ${actionType === 'block' ? 'Block' : 'Reactivate'}`}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UsersIndex;
