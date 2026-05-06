import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, 
    LogOut, 
    Settings, 
    Menu, 
    X, 
    ChevronDown, 
    ShieldCheck 
} from 'lucide-react';
import Magnetic from '@/Components/Landing/Animations/Magnetic';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 text-black font-sans selection:bg-black selection:text-white">
            {/* Premium Nav */}
            <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a3 3 0 00-3 3c0 1.66 1.34 3 3 3s3-1.34 3-3a3 3 0 00-3-3zm0 8v12m0 0c-4-1-7-4-7-8h3m4 8c4-1 7-4 7-8h-3" />
                            </svg>
                        </div>
                        <span className="font-black text-xl tracking-tighter">HarborBank</span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-gray-400">
                        <Link href={route('dashboard')} className={`${route().current('dashboard') ? 'text-black' : 'hover:text-black'} transition-colors`}>Dashboard</Link>
                        <a href="#" className="hover:text-black transition-colors">Accounts</a>
                        <a href="#" className="hover:text-black transition-colors">Transfer</a>
                        <a href="#" className="hover:text-black transition-colors">History</a>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex flex-col items-end">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Secure Session</span>
                        </div>
                        <span className="text-xs font-bold">{user.name}</span>
                    </div>

                    <div className="relative">
                        <button 
                            onClick={() => setProfileDropdown(!profileDropdown)}
                            className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200 hover:border-black transition-all group shadow-sm"
                        >
                            <User className="w-4 h-4 text-gray-500 group-hover:text-black" />
                        </button>

                        <AnimatePresence>
                            {profileDropdown && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 z-50 overflow-hidden"
                                >
                                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Account</p>
                                        <p className="text-sm font-bold truncate">{user.email}</p>
                                    </div>
                                    <Link href={route('profile.edit')} className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-black rounded-2xl transition-all">
                                        <Settings className="w-4 h-4" /> Profile Settings
                                    </Link>
                                    <Link 
                                        href={route('logout')} 
                                        method="post" 
                                        as="button" 
                                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-black hover:bg-black hover:text-white rounded-2xl transition-all"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Burger for Mobile */}
                    <button 
                        onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                        className="lg:hidden p-2 text-gray-400 hover:text-black transition-colors"
                    >
                        {showingNavigationDropdown ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {showingNavigationDropdown && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="px-8 py-6 space-y-4">
                            <Link href={route('dashboard')} className="block text-lg font-black text-black">Dashboard</Link>
                            <a href="#" className="block text-lg font-black text-gray-400">Accounts</a>
                            <a href="#" className="block text-lg font-black text-gray-400">Transfer</a>
                            <div className="pt-6 border-t border-gray-50 space-y-4">
                                <Link href={route('profile.edit')} className="block text-sm font-bold text-gray-600">Profile Settings</Link>
                                <Link href={route('logout')} method="post" as="button" className="block text-sm font-bold text-black">Sign Out</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header / Breadcrumbs Area */}
            {header && (
                <header className="bg-white pt-10 pb-6">
                    <div className="max-w-7xl mx-auto px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Content with Fade In */}
            <motion.main 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {children}
            </motion.main>

            {/* Simple Footer */}
            <footer className="max-w-7xl mx-auto px-8 py-10 mt-10 border-t border-gray-100 flex items-center justify-between opacity-30">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Secure Session — HarborBank</p>
                <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span>Terms</span>
                    <span>Privacy</span>
                </div>
            </footer>
        </div>
    );
}
