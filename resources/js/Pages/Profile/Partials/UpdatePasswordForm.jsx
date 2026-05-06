import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import Magnetic from '@/Components/Landing/Animations/Magnetic';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    const inputCls = (err) => `w-full px-6 py-5 bg-gray-50 border ${err ? 'border-black' : 'border-gray-100'} rounded-2xl text-black text-base font-bold placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-[12px] focus:ring-black/5 focus:border-black transition-all duration-500`;

    const labelCls = "block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 px-1";

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-8">
                <div>
                    <label htmlFor="current_password" className={labelCls}>Current Password</label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className={inputCls(errors.current_password)}
                        autoComplete="current-password"
                    />
                    {errors.current_password && (
                        <p className="mt-3 text-[10px] text-black font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-black rounded-full" /> {errors.current_password}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className={labelCls}>New Password</label>
                    <input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className={inputCls(errors.password)}
                        autoComplete="new-password"
                    />
                    {errors.password && (
                        <p className="mt-3 text-[10px] text-black font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-black rounded-full" /> {errors.password}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="password_confirmation" className={labelCls}>Confirm New Password</label>
                    <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className={inputCls(errors.password_confirmation)}
                        autoComplete="new-password"
                    />
                    {errors.password_confirmation && (
                        <p className="mt-3 text-[10px] text-black font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-black rounded-full" /> {errors.password_confirmation}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-6 pt-4">
                    <Magnetic>
                        <button 
                            disabled={processing}
                            className="bg-black text-white px-10 py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.3em] hover:bg-gray-800 transition-all disabled:opacity-50"
                        >
                            Update Password
                        </button>
                    </Magnetic>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0 translate-x-2"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" />
                            Security Updated
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
