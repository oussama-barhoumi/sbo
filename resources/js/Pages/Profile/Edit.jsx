import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import SecurityPreferences from './Partials/SecurityPreferences';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Lock, Trash2, ArrowLeft } from 'lucide-react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function Edit({ mustVerifyEmail, status }) {
    const { t } = useLaravelReactI18n();

    const containerVars = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
    };

    const itemVars = {
        initial: { opacity: 0, y: 30, filter: "blur(10px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    };

    const sectionCls = "lg:col-span-8 bg-white dark:bg-white/5 rounded-[3rem] p-10 border border-gray-100 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-none";

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/banking" className="w-10 h-10 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl flex items-center justify-center hover:border-black dark:hover:border-white transition-all group">
                            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-black dark:group-hover:text-white" />
                        </Link>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-white/20">{t('profile.subtitle')}</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter text-black dark:text-white italic uppercase">
                        {t('profile.title')}
                    </h2>
                </div>
            }
        >
            <Head title={`${t('profile.title')} — HarborBank`} />

            <motion.div 
                variants={containerVars}
                initial="initial"
                animate="animate"
                className="py-12 px-8 max-w-7xl mx-auto space-y-12"
            >
                {/* Profile Info Section */}
                <motion.div variants={itemVars} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black">
                                <User className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter text-black dark:text-white">{t('profile.info.title')}</h3>
                        </div>
                        <p className="text-gray-400 dark:text-white/40 text-sm font-medium leading-relaxed">
                            {t('profile.info.desc')}
                        </p>
                    </div>
                    <div className={sectionCls}>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-2xl"
                        />
                    </div>
                </motion.div>

                {/* Password Section */}
                <motion.div variants={itemVars} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter text-black dark:text-white">{t('profile.security.title')}</h3>
                        </div>
                        <p className="text-gray-400 dark:text-white/40 text-sm font-medium leading-relaxed">
                            {t('profile.security.desc')}
                        </p>
                    </div>
                    <div className={sectionCls}>
                        <UpdatePasswordForm className="max-w-2xl" />
                    </div>
                </motion.div>

                {/* Advanced Security Section */}
                <motion.div variants={itemVars} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter text-black dark:text-white">{t('profile.preferences.title')}</h3>
                        </div>
                        <p className="text-gray-400 dark:text-white/40 text-sm font-medium leading-relaxed">
                            {t('profile.preferences.desc')}
                        </p>
                    </div>
                    <div className={sectionCls}>
                        <SecurityPreferences className="max-w-2xl" />
                    </div>
                </motion.div>

                {/* Account Deletion Section */}
                <motion.div variants={itemVars} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter text-red-600 dark:text-red-400">{t('profile.danger.title')}</h3>
                        </div>
                        <p className="text-gray-400 dark:text-white/40 text-sm font-medium leading-relaxed">
                            {t('profile.danger.desc')}
                        </p>
                    </div>
                    <div className="lg:col-span-8 bg-red-50/30 dark:bg-red-500/5 rounded-[3rem] p-10 border border-red-100/50 dark:border-red-500/10">
                        <DeleteUserForm className="max-w-2xl" />
                    </div>
                </motion.div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
