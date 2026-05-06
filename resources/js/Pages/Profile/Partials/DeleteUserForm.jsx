import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from '@/Components/Landing/Animations/Magnetic';
import { AlertCircle, X } from 'lucide-react';

export default function DeleteUserForm({ className = '' }) {
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

    const inputCls = (err) => `w-full px-6 py-5 bg-gray-50 border ${err ? 'border-red-500' : 'border-gray-100'} rounded-2xl text-black text-base font-bold placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-[12px] focus:ring-red-500/5 focus:border-red-500 transition-all duration-500`;

    return (
        <section className={className}>
            <div className="flex flex-col items-start gap-6">
                <p className="text-sm font-medium text-gray-400 leading-relaxed">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. This action is irreversible.
                </p>
                
                <Magnetic>
                    <button 
                        onClick={confirmUserDeletion}
                        className="bg-red-600 text-white px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-700 transition-all shadow-xl shadow-red-600/10"
                    >
                        Delete Account
                    </button>
                </Magnetic>
            </div>

            <AnimatePresence>
                {confirmingUserDeletion && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                            onClick={closeModal} 
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 z-10 border border-white/20" 
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <h2 className="text-2xl font-black text-black tracking-tighter mb-4">
                                Confirm Deletion
                            </h2>

                            <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8">
                                Please enter your password to confirm you would like to permanently delete
                                your account. This action cannot be undone.
                            </p>

                            <form onSubmit={deleteUser}>
                                <div className="mb-8">
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        ref={passwordInput}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={inputCls(errors.password)}
                                        placeholder="Current Password"
                                        autoFocus
                                    />
                                    {errors.password && (
                                        <p className="mt-3 text-[10px] text-red-600 font-black uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full" /> {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-100 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-5 bg-red-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-700 transition-all disabled:opacity-50"
                                    >
                                        {processing ? 'Deleting...' : 'Delete'}
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
