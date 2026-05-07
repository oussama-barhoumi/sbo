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
} from 'lucide-react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useApp } from '@/hooks/useApp';

const AdminsIndex = ({ admins }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { t } = useLaravelReactI18n();
    const { isDark } = useApp();
    
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
        if (confirm(t('admin.admins.confirm_remove'))) {
            destroy(`/admin/admins/${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex font-sans transition-colors duration-500">
            <Head title={t('admin.page.protocol.head')} />
            
            <Sidebar />

            <main className="flex-1 ml-72">
                <Header title={t('admin.admins.title')} />

                <div className="p-10 space-y-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-3xl font-black text-black dark:text-white tracking-tighter uppercase italic">{t('admin.admins.subtitle')}</h2>
                            <p className="text-gray-400 dark:text-white/20 text-xs font-black uppercase tracking-[0.3em] mt-2">{t('admin.admins.desc')}</p>
                        </div>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-black/20 dark:shadow-none transition-all flex items-center gap-3 group"
                        >
                            <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" /> {t('admin.admins.grant_access')}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {admins.map((admin) => (
                            <div key={admin.id} className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/10 p-10 rounded-[2.5rem] relative group overflow-hidden shadow-sm transition-colors duration-500">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 dark:bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                                
                                <div className="flex items-start justify-between mb-10">
                                    <div className="w-16 h-16 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-2xl font-black shadow-xl shadow-black/10 border-2 border-gray-50 dark:border-white/10">
                                        {admin.name.charAt(0)}
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border transition-colors ${
                                        admin.role === 'super_admin' 
                                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' 
                                        : 'bg-black/5 dark:bg-white/10 text-black dark:text-white border-transparent'
                                    }`}>
                                        {admin.role === 'super_admin' ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                                        {admin.role === 'super_admin' ? t('admin.admins.role.super_admin') : t('admin.admins.role.admin')}
                                    </div>
                                </div>

                                <div className="space-y-2 mb-10">
                                    <h3 className="text-black dark:text-white text-xl font-black tracking-tighter uppercase italic">{admin.name}</h3>
                                    <p className="text-gray-400 dark:text-white/20 text-xs font-bold flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5" /> {admin.email}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 pt-8 border-t border-gray-100 dark:border-white/10">
                                    <select 
                                        value={admin.role}
                                        onChange={(e) => handleRoleUpdate(admin.id, e.target.value)}
                                        className="flex-1 bg-gray-50 dark:bg-white/5 border-none rounded-xl text-[10px] text-black dark:text-white font-black uppercase tracking-widest py-3.5 focus:ring-[8px] focus:ring-black/5 dark:focus:ring-white/5 transition-all outline-none"
                                    >
                                        <option value="admin">{t('admin.admins.role.admin')}</option>
                                        <option value="super_admin">{t('admin.admins.role.super_admin')}</option>
                                    </select>
                                    
                                    <button 
                                        onClick={() => handleRemoveAdmin(admin.id)}
                                        className="p-3.5 bg-red-500/10 hover:bg-red-600 text-red-600 hover:text-white rounded-xl transition-all shadow-sm group/btn"
                                        title="Revoke Access"
                                    >
                                        <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Grant Access Modal */}
            <Modal
                show={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                maxWidth="md"
            >
                <div className="p-10 dark:bg-[#0a0a0a] transition-colors duration-500">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black">
                            <UserPlus className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-black dark:text-white tracking-tighter uppercase italic">{t('admin.admins.modal.title')}</h2>
                            <p className="text-gray-400 dark:text-white/20 text-[10px] font-black uppercase tracking-widest mt-1">Elevate user privileges</p>
                        </div>
                    </div>

                    <form onSubmit={handleAddAdmin} className="space-y-8">
                        <div>
                            <label className="block text-gray-400 dark:text-white/20 text-[10px] font-black uppercase tracking-widest mb-3">{t('admin.admins.modal.email_label')}</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-5 text-sm font-bold text-black dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/10 focus:ring-[12px] focus:ring-black/5 dark:focus:ring-white/5 transition-all outline-none"
                                placeholder={t('admin.admins.modal.email_placeholder')}
                                required
                            />
                            {errors.email && <p className="text-red-600 text-xs font-bold mt-2">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-400 dark:text-white/20 text-[10px] font-black uppercase tracking-widest mb-3">{t('admin.admins.modal.access_level')}</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setData('role', 'admin')}
                                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${
                                        data.role === 'admin' 
                                        ? 'bg-black dark:bg-white border-transparent text-white dark:text-black shadow-xl' 
                                        : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-400 dark:text-white/20 hover:border-gray-200 dark:hover:border-white/20'
                                    }`}
                                >
                                    <Shield className="w-10 h-10" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{t('admin.admins.role.admin')}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('role', 'super_admin')}
                                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${
                                        data.role === 'super_admin' 
                                        ? 'bg-amber-500 border-transparent text-white shadow-xl shadow-amber-500/20' 
                                        : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-400 dark:text-white/20 hover:border-gray-200 dark:hover:border-white/20'
                                    }`}
                                >
                                    <ShieldAlert className="w-10 h-10" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{t('admin.admins.role.super_admin')}</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-white/20 hover:text-black dark:hover:text-white transition-colors"
                            >
                                {t('admin.users.modal.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-black/20 dark:shadow-none transition-all disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : t('admin.admins.modal.submit')}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default AdminsIndex;
