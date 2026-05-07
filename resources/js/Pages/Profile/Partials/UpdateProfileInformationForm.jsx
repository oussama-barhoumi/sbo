import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import Magnetic from '@/Components/Landing/Animations/Magnetic';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
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
        post(route('profile.update'));
    };

    const inputCls = (err) => `w-full px-6 py-5 bg-gray-50 border ${err ? 'border-black' : 'border-gray-100'} rounded-2xl text-black text-base font-bold placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-[12px] focus:ring-black/5 focus:border-black transition-all duration-500`;

    const labelCls = "block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 px-1";

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-8">
                {/* Avatar Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-gray-50">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-xl relative">
                            {data.avatar ? (
                                <img src={URL.createObjectURL(data.avatar)} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-black flex items-center justify-center text-white text-3xl font-black italic">
                                    {user.avatar ? (
                                        <img src={`/storage/${user.avatar}`} className="w-full h-full object-cover" />
                                    ) : user.name[0]}
                                </div>
                            )}
                        </div>
                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                            <span className="text-[9px] font-black uppercase text-white tracking-widest">Change</span>
                            <input type="file" className="hidden" onChange={e => setData('avatar', e.target.files[0])} />
                        </label>
                    </div>
                    <div className="text-center sm:text-left">
                        <h4 className="text-sm font-black uppercase tracking-tighter mb-1">Profile Identity</h4>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest leading-relaxed">
                            Recommended: Square image, 500x500px.<br />Max size: 2MB.
                        </p>
                    </div>
                </div>

                <div>
                    <label htmlFor="name" className={labelCls}>Full Name</label>
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
                        <p className="mt-3 text-[10px] text-black font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-black rounded-full" /> {errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className={labelCls}>Email Address</label>
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
                        <p className="mt-3 text-[10px] text-black font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-black rounded-full" /> {errors.email}
                        </p>
                    )}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                        <p className="text-sm font-bold text-amber-900 mb-4">
                            Your email address is unverified.
                        </p>
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="text-xs font-black uppercase tracking-widest text-amber-700 hover:text-black underline underline-offset-4"
                        >
                            Re-send Verification Email
                        </Link>

                        {status === 'verification-link-sent' && (
                            <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                A new link has been sent.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-6 pt-4">
                    <Magnetic>
                        <button 
                            disabled={processing}
                            className="bg-black text-white px-10 py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.3em] hover:bg-gray-800 transition-all disabled:opacity-50"
                        >
                            Update Profile
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
                            Changes Saved
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
