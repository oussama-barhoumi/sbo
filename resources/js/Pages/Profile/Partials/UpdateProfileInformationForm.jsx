import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import Magnetic from '@/Components/Landing/Animations/Magnetic';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Upload, Camera, CheckCircle2 } from 'lucide-react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const { t } = useLaravelReactI18n();
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            avatar: null,
            _method: 'PATCH',
        });

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            preserveScroll: true,
        });
    };

    const inputCls = (err) => `w-full px-6 py-5 bg-gray-50 dark:bg-white/5 border ${err ? 'border-red-500' : 'border-gray-100 dark:border-white/10'} rounded-2xl text-black dark:text-white text-base font-bold placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:ring-[12px] focus:ring-black/5 dark:focus:ring-white/5 focus:border-black dark:focus:border-white transition-all duration-500`;

    const labelCls = "block text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.3em] mb-3 px-1";

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-8">
                {/* Avatar Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-gray-50 dark:border-white/5">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-gray-50 dark:border-white/5 shadow-xl relative bg-black dark:bg-white/10">
                            {data.avatar ? (
                                <img src={URL.createObjectURL(data.avatar)} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white dark:text-white/80 text-3xl font-black italic">
                                    {user.avatar ? (
                                        <img src={`/storage/${user.avatar}`} className="w-full h-full object-cover" />
                                    ) : user.name[0]}
                                </div>
                            )}
                        </div>
                        <label className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-[2.5rem]">
                            <Camera className="w-6 h-6 text-white" />
                            <input type="file" className="hidden" onChange={e => setData('avatar', e.target.files[0])} />
                        </label>
                    </div>
                    <div className="text-center sm:text-left">
                        <h4 className="text-sm font-black uppercase tracking-tighter text-black dark:text-white mb-1">{t('profile.info.avatar.title')}</h4>
                        <p className="text-[10px] font-medium text-gray-400 dark:text-white/20 uppercase tracking-widest leading-relaxed">
                            {t('profile.info.avatar.desc')}
                        </p>
                    </div>
                </div>

                <div>
                    <label htmlFor="name" className={labelCls}>{t('profile.info.name')}</label>
                    <input
                        id="name"
                        type="text"
                        className={inputCls(errors.name)}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />
                    {errors.name && (
                        <p className="mt-3 text-[10px] text-red-600 font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full" /> {errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className={labelCls}>{t('profile.info.email')}</label>
                    <input
                        id="email"
                        type="email"
                        className={inputCls(errors.email)}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    {errors.email && (
                        <p className="mt-3 text-[10px] text-red-600 font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full" /> {errors.email}
                        </p>
                    )}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-6 bg-amber-500/5 dark:bg-amber-500/10 rounded-2xl border border-amber-500/20">
                        <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-4">
                            {t('profile.info.unverified')}
                        </p>
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-500 hover:text-black dark:hover:text-white underline underline-offset-8"
                        >
                            {t('profile.info.resend')}
                        </Link>

                        {status === 'verification-link-sent' && (
                            <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3" />
                                {t('profile.info.sent')}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-6 pt-4">
                    <Magnetic>
                        <button 
                            disabled={processing}
                            className="bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {t('profile.info.submit')}
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
