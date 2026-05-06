import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import SecurityPreferences from './Partials/SecurityPreferences';
import { motion } from 'framer-motion';
import { User, Shield, Lock, Trash2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function Edit({ mustVerifyEmail, status }) {
    const containerVars = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
    };

    const itemVars = {
        initial: { opacity: 0, y: 30, filter: "blur(10px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/dashboard" className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:border-black transition-all group">
                            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-black" />
                        </Link>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Account Management</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter text-black italic uppercase">
                        Profile Settings
                    </h2>
                </div>
            }
        >
            <Head title="Profile Settings — HarborBank" />

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
                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
                                <User className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter">Information</h3>
                        </div>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            Update your account's profile information and email address. Ensure your contact details are accurate for security notifications.
                        </p>
                    </div>
                    <div className="lg:col-span-8 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/50">
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
                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter">Security</h3>
                        </div>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            Maintain a strong, unique password to protect your assets. We recommend changing your password every 90 days.
                        </p>
                    </div>
                    <div className="lg:col-span-8 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/50">
                        <UpdatePasswordForm className="max-w-2xl" />
                    </div>
                </motion.div>

                {/* Advanced Security Section */}
                <motion.div variants={itemVars} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter">Preferences</h3>
                        </div>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            Configure multi-factor authentication and transaction guard protocols for maximum account integrity.
                        </p>
                    </div>
                    <div className="lg:col-span-8 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/50">
                        <SecurityPreferences className="max-w-2xl" />
                    </div>
                </motion.div>

                {/* Account Deletion Section */}
                <motion.div variants={itemVars} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter text-red-600">Danger Zone</h3>
                        </div>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            Once your account is deleted, all of its resources and data will be permanently deleted. Please download any data or information you wish to retain.
                        </p>
                    </div>
                    <div className="lg:col-span-8 bg-red-50/30 rounded-[3rem] p-10 border border-red-100/50">
                        <DeleteUserForm className="max-w-2xl" />
                    </div>
                </motion.div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
