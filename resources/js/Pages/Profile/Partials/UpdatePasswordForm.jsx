import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useRef } from 'react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import Magnetic from '@/Components/Landing/Animations/Magnetic';

export default function UpdatePasswordForm({ className = '' }) {
    const { t } = useLaravelReactI18n();
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

    const inputCls = (err) => `w-full px-6 py-5 bg-gray-50 dark:bg-white/5 border ${err ? 'border-red-500' : 'border-gray-100 dark:border-white/10'} rounded-2xl text-black dark:text-white text-base font-bold placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:ring-[12px] focus:ring-black/5 dark:focus:ring-white/5 focus:border-black dark:focus:border-white transition-all duration-500`;

    const labelCls = "block text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.3em] mb-3 px-1";

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-8">
                <div>
                    <label htmlFor="current_password" className={labelCls}>{t('profile.security.current_password')}</label>
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
                        <p className="mt-3 text-[10px] text-red-600 font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full" /> {errors.current_password}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className={labelCls}>{t('profile.security.new_password')}</label>
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
                        <p className="mt-3 text-[10px] text-red-600 font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full" /> {errors.password}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="password_confirmation" className={labelCls}>{t('profile.security.confirm_password')}</label>
                    <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className={inputCls(errors.password_confirmation)}
                        autoComplete="new-password"
                    />
                    {errors.password_confirmation && (
                        <p className="mt-3 text-[10px] text-red-600 font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full" /> {errors.password_confirmation}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-6 pt-4">
                    <Magnetic>
                        <button 
                            disabled={processing}
                            className="bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {t('profile.security.submit')}
                        </button>
                    </Magnetic>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0 translate-x-2"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                            <div className="w-1.5 h-1.5 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-pulse" />
                            {t('profile.info.saved')}
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
