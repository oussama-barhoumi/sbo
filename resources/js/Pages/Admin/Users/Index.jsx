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
    AlertTriangle,
    ShieldCheck,
    UserCheck,
    UserX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
            <Head title="Client Directory — HarborBank Admin" />
            
            <Sidebar />

            <main className="flex-1 ml-72">
                <Header title="Identity Oversight" />

                <motion.div 
                    variants={containerVars}
                    initial="initial"
                    animate="animate"
                    className="p-10 space-y-10"
                >
                    {/* Filter & Search Bar */}
                    <motion.div variants={itemVars} className="flex flex-col lg:flex-row gap-6 justify-between items-center bg-white p-6 rounded-[2.5rem] border border-gray-200 shadow-xl shadow-gray-200/50">
                        <div className="relative w-full lg:w-96 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" />
                            <input 
                                type="text" 
                                defaultValue={filters.search}
                                onChange={handleSearch}
                                placeholder="Filter clients..." 
                                className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-bold placeholder-gray-300 focus:ring-[12px] focus:ring-black/5 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                            {['all', 'active', 'blocked'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusFilter(status === 'all' ? '' : status)}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        (filters.status || 'all') === status 
                                        ? 'bg-black text-white shadow-lg' 
                                        : 'text-gray-400 hover:text-black'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Elite Data Table */}
                    <motion.div variants={itemVars} className="bg-white rounded-[3rem] border border-gray-200 shadow-2xl shadow-gray-200/50 overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-10 py-6 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">Client Identity</th>
                                    <th className="px-10 py-6 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">Compliance</th>
                                    <th className="px-10 py-6 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">Asset Volume</th>
                                    <th className="px-10 py-6 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">Last Access</th>
                                    <th className="px-10 py-6 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.data.map((user) => (
                                    <motion.tr 
                                        key={user.id} 
                                        className={`group hover:bg-gray-50/80 transition-colors ${user.isSuspicious ? 'bg-red-50/5' : ''}`}
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-white text-lg font-black italic shadow-xl shadow-black/10">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-black font-black tracking-tighter text-base">{user.name}</span>
                                                        {user.isSuspicious && (
                                                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black text-white text-[8px] font-black uppercase tracking-widest animate-pulse">
                                                                <AlertTriangle className="w-3 h-3" /> Flagged
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                                                user.status === 'active' 
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                                : 'bg-black text-white'
                                            }`}>
                                                {user.status === 'active' ? <ShieldCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="text-black font-black tabular-nums tracking-tighter text-lg">
                                                {new Intl.NumberFormat('en-MA', { style: 'currency', currency: 'MAD' }).format(user.balance)}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="text-xs font-black text-gray-400">{user.lastActivity}</div>
                                            <div className="text-[9px] text-gray-300 mt-1 uppercase tracking-[0.2em] font-black italic">Node Joined {user.createdAt}</div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link 
                                                    href={`/admin/users/${user.id}`}
                                                    className="w-10 h-10 bg-white border border-gray-100 hover:border-black text-gray-400 hover:text-black rounded-xl flex items-center justify-center transition-all shadow-sm"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </Link>
                                                
                                                {user.status === 'active' ? (
                                                    <button 
                                                        onClick={() => handleAction(user, 'block')}
                                                        className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:scale-110 transition-all shadow-xl shadow-black/20"
                                                    >
                                                        <Ban className="w-5 h-5" />
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleAction(user, 'unblock')}
                                                        className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center hover:scale-110 transition-all shadow-xl shadow-emerald-500/20"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="px-10 py-8 bg-gray-50/50 flex items-center justify-between border-t border-gray-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Manifesting <span className="text-black">{users.from}</span> - <span className="text-black">{users.to}</span> of <span className="text-black">{users.total}</span> entities
                            </p>
                            <div className="flex gap-2">
                                {users.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            link.active 
                                            ? 'bg-black text-white shadow-xl' 
                                            : link.url 
                                                ? 'text-gray-400 hover:text-black hover:bg-white border border-transparent hover:border-gray-100' 
                                                : 'text-gray-200 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </main>

            {/* Action Modal */}
            <Modal
                isOpen={isBlockModalOpen}
                onClose={() => setIsBlockModalOpen(false)}
                title={actionType === 'block' ? 'Terminate Access' : 'Reactivate Entity'}
            >
                <form onSubmit={submitAction} className="space-y-8">
                    {actionType === 'block' && (
                        <div className="bg-black text-white p-6 rounded-[2rem] flex items-start gap-5 shadow-2xl">
                            <AlertCircle className="text-white w-6 h-6 shrink-0 mt-1" />
                            <div>
                                <h4 className="text-sm font-black uppercase tracking-widest italic mb-2">Protocol Warning</h4>
                                <p className="text-white/50 text-[10px] leading-relaxed font-medium uppercase tracking-widest">
                                    Entity sessions will be terminated. All assets will be frozen until manual review.
                                </p>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 px-1">Justification</label>
                        <textarea
                            value={data.reason}
                            onChange={e => setData('reason', e.target.value)}
                            className="w-full bg-gray-50 border-gray-100 rounded-2xl p-6 text-black font-bold placeholder:text-gray-300 focus:ring-[12px] focus:ring-black/5 focus:border-black transition-all min-h-[140px] focus:outline-none"
                            placeholder="Specify violation details..."
                        />
                        {errors.reason && <p className="text-black text-[10px] font-black uppercase tracking-widest mt-2">{errors.reason}</p>}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsBlockModalOpen(false)}
                            className="flex-1 py-5 bg-gray-100 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className={`flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl transition-all ${
                                actionType === 'block' 
                                ? 'bg-black hover:bg-gray-800 shadow-black/20' 
                                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                            }`}
                        >
                            {processing ? 'Processing...' : `Confirm ${actionType === 'block' ? 'Termination' : 'Reactivation'}`}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UsersIndex;
