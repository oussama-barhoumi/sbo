import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Sidebar from '@/Components/Admin/Sidebar';
import Header from '@/Components/Admin/Header';
import Modal from '@/Components/Admin/Modal';
import { 
    UserPlus, 
    Shield, 
    ShieldAlert, 
    Trash2, 
    Mail, 
    ShieldCheck,
    MoreHorizontal
} from 'lucide-react';

const AdminsIndex = ({ admins }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        email: '',
        role: 'admin',
    });

    const handleAddAdmin = (e) => {
        e.preventDefault();
        post('/admin/admins', {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            }
        });
    };

    const handleRoleUpdate = (id, role) => {
        patch(`/admin/admins/${id}`, { role });
    };

    const handleRemoveAdmin = (id) => {
        if (confirm('Are you sure you want to remove administrative privileges from this user?')) {
            destroy(`/admin/admins/${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex">
            <Head title="Admin Management" />
            
            <Sidebar />

            <main className="flex-1 ml-72">
                <Header title="Administrative Access" />

                <div className="p-10 space-y-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-white">System Administrators</h2>
                            <p className="text-slate-500 text-sm">Manage administrative roles and access levels</p>
                        </div>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-3"
                        >
                            <UserPlus className="w-5 h-5" /> Grant Admin Access
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {admins.map((admin) => (
                            <div key={admin.id} className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-800/50 p-8 rounded-[2.5rem] relative group overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                                
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-500/10">
                                        {admin.name.charAt(0)}
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
                                        admin.role === 'super_admin' 
                                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                    }`}>
                                        {admin.role === 'super_admin' ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                                        {admin.role.replace('_', ' ')}
                                    </div>
                                </div>

                                <div className="space-y-1 mb-8">
                                    <h3 className="text-white text-xl font-bold tracking-tight">{admin.name}</h3>
                                    <p className="text-slate-500 text-sm flex items-center gap-2 italic">
                                        <Mail className="w-3.5 h-3.5" /> {admin.email}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 pt-6 border-t border-slate-800/50">
                                    <select 
                                        value={admin.role}
                                        onChange={(e) => handleRoleUpdate(admin.id, e.target.value)}
                                        className="flex-1 bg-[#0f172a] border-slate-800 rounded-xl text-xs text-slate-300 font-bold uppercase tracking-wider py-3 focus:ring-indigo-500/50"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                    
                                    <button 
                                        onClick={() => handleRemoveAdmin(admin.id)}
                                        className="p-3 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-all shadow-lg"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Grant Access Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Grant Administrative Access"
            >
                <form onSubmit={handleAddAdmin} className="space-y-6">
                    <div>
                        <label className="block text-slate-400 text-sm font-bold mb-3 uppercase tracking-widest">User Email Address</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="w-full bg-[#0f172a] border-slate-800 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50"
                            placeholder="user@harborbank.test"
                        />
                        {errors.email && <p className="text-rose-500 text-xs mt-2">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-bold mb-3 uppercase tracking-widest">Access Level</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setData('role', 'admin')}
                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                                    data.role === 'admin' 
                                    ? 'bg-indigo-600/10 border-indigo-500 text-white' 
                                    : 'bg-slate-800/30 border-transparent text-slate-500 hover:border-slate-700'
                                }`}
                            >
                                <Shield className="w-8 h-8" />
                                <span className="font-bold">Standard Admin</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setData('role', 'super_admin')}
                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                                    data.role === 'super_admin' 
                                    ? 'bg-amber-500/10 border-amber-500 text-white' 
                                    : 'bg-slate-800/30 border-transparent text-slate-500 hover:border-slate-700'
                                }`}
                            >
                                <ShieldAlert className="w-8 h-8" />
                                <span className="font-bold">Super Admin</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all"
                        >
                            {processing ? 'Processing...' : 'Grant Access'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminsIndex;
