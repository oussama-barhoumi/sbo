import { useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

export default function DeleteUserForm({ className = '' }) {
    const { t } = useLaravelReactI18n();
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    const inputCls = (err) => `w-full px-6 py-5 bg-gray-50 dark:bg-white/10 border ${err ? 'border-red-500' : 'border-gray-100 dark:border-white/20'} rounded-2xl text-black dark:text-white text-base font-bold placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-white/20 focus:ring-[12px] focus:ring-accent-blue/5 focus:border-accent-blue transition-all duration-500`;

    const labelCls = "block text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.3em] mb-3 px-1";

    return (
        <section className={`space-y-6 ${className}`}>
            <button
                onClick={confirmUserDeletion}
                className="bg-red-600 text-white px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-red-500/20"
            >
                {t('profile.danger.button')}
            </button>

            <AnimatePresence>
                {confirmingUserDeletion && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-xl bg-white dark:bg-black rounded-[3rem] p-12 border border-gray-100 dark:border-white/10 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600" />
                            
                            <button 
                                onClick={closeModal}
                                className="absolute top-8 right-8 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center text-red-600">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-black dark:text-white italic">
                                    {t('profile.danger.modal_title')}
                                </h2>
                            </div>

                            <p className="text-gray-500 dark:text-white/40 text-sm font-medium leading-relaxed mb-10">
                                {t('profile.danger.modal_desc')}
                            </p>

                            <form onSubmit={deleteUser} className="space-y-8">
                                <div>
                                    <label htmlFor="password" className={labelCls}>
                                        {t('profile.danger.password')}
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        ref={passwordInput}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={inputCls(errors.password)}
                                        placeholder="••••••••"
                                        autoFocus
                                    />
                                    {errors.password && (
                                        <p className="mt-3 text-[10px] text-red-600 font-black uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full" /> {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-white/20 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-black dark:hover:text-white transition-all"
                                    >
                                        {t('profile.danger.cancel')}
                                    </button>
                                    <button
                                        disabled={processing}
                                        className="flex-1 bg-red-600 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        {t('profile.danger.confirm')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
