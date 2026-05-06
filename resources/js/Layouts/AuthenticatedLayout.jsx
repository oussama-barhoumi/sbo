import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, 
    LogOut, 
    Settings, 
    Menu, 
    X, 
    ChevronDown, 
    ShieldCheck,
    LayoutDashboard,
    Wallet,
    Bell,
    Landmark,
    Gem
} from 'lucide-react';
import Magnetic from '@/Components/Landing/Animations/Magnetic';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 text-black font-sans selection:bg-black selection:text-white pb-24 lg:pb-0">
            {/* Premium Nav */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-2xl py-4 shadow-sm' : 'bg-white py-6'}`}>
                <div className="max-w-[1600px] mx-auto px-6 sm:px-10 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110 shadow-lg shadow-black/10">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a3 3 0 00-3 3c0 1.66 1.34 3 3 3s3-1.34 3-3a3 3 0 00-3-3zm0 8v12m0 0c-4-1-7-4-7-8h3m4 8c4-1 7-4 7-8h-3" />
                                </svg>
                            </div>
                            <span className="font-black text-2xl tracking-tighter uppercase italic hidden sm:block">Harbor</span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                            <Link href={route('dashboard')} className={`${route().current('dashboard') ? 'text-black border-b-2 border-black pb-1' : 'hover:text-black'} transition-all`}>Overview</Link>
                            <Link href={route('treasury')} className={`${route().current('treasury') ? 'text-black border-b-2 border-black pb-1' : 'hover:text-black'} transition-all`}>Treasury</Link>
                            <Link href={route('wealth')} className={`${route().current('wealth') ? 'text-black border-b-2 border-black pb-1' : 'hover:text-black'} transition-all`}>Wealth</Link>
                            <Link href="/banking" className="hover:text-black transition-all">Vault</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-8">
                        <div className="hidden sm:flex flex-col items-end">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Secure Link</span>
                            </div>
                            <span className="text-sm font-black">{user.name}</span>
                        </div>

                        <div className="relative">
                            <button 
                                onClick={() => setProfileDropdown(!profileDropdown)}
                                className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center border border-black/10 shadow-xl shadow-black/10 hover:scale-105 transition-transform"
                            >
                                {user.name ? <span className="font-black text-sm italic">{user.name[0]}</span> : <User className="w-5 h-5" />}
                            </button>

                            <AnimatePresence>
                                {profileDropdown && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                        className="absolute right-0 mt-4 w-64 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-3 z-50 overflow-hidden"
                                    >
                                        <div className="px-6 py-4 border-b border-gray-50 mb-2">
                                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">Identity</p>
                                            <p className="text-xs font-black truncate text-black">{user.email}</p>
                                        </div>
                                        <Link href={route('profile.edit')} className="flex items-center gap-4 px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:bg-gray-50 hover:text-black rounded-[1.5rem] transition-all">
                                            <Settings className="w-4 h-4" /> Settings
                                        </Link>
                                        <Link 
                                            href={route('logout')} 
                                            method="post" 
                                            as="button" 
                                            className="w-full flex items-center gap-4 px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-black hover:bg-black hover:text-white rounded-[1.5rem] transition-all mt-1"
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
                            className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 border border-gray-100"
                        >
                            {showingNavigationDropdown ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {showingNavigationDropdown && (
                    <motion.div 
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 z-[60] bg-white lg:hidden flex flex-col p-10"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <span className="font-black text-2xl tracking-tighter uppercase italic">Harbor</span>
                            <button onClick={() => setShowingNavigationDropdown(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            <Link href={route('dashboard')} onClick={() => setShowingNavigationDropdown(false)} className="block text-5xl font-black tracking-tighter text-black uppercase italic mb-8">Overview</Link>
                            <Link href="/banking" onClick={() => setShowingNavigationDropdown(false)} className="block text-5xl font-black tracking-tighter text-gray-200 uppercase italic mb-8">The Vault</Link>
                            <Link href={route('profile.edit')} onClick={() => setShowingNavigationDropdown(false)} className="block text-2xl font-black tracking-tighter text-gray-400 uppercase italic">Settings</Link>
                        </div>
                        <div className="mt-auto">
                            <Link href={route('logout')} method="post" as="button" className="w-full bg-black text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em]">Terminate Session</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Bottom Bar (Premium App Style) */}
            <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50 h-20 bg-black/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center justify-around px-4">
                <Link href={route('dashboard')} className={`p-4 rounded-2xl transition-all ${route().current('dashboard') ? 'bg-white text-black scale-110 shadow-lg' : 'text-white/40'}`}>
                    <LayoutDashboard className="w-6 h-6" />
                </Link>
                <Link href={route('treasury')} className={`p-4 rounded-2xl transition-all ${route().current('treasury') ? 'bg-white text-black scale-110 shadow-lg' : 'text-white/40'}`}>
                    <Landmark className="w-6 h-6" />
                </Link>
                <Link href={route('wealth')} className={`p-4 rounded-2xl transition-all ${route().current('wealth') ? 'bg-white text-black scale-110 shadow-lg' : 'text-white/40'}`}>
                    <Gem className="w-6 h-6" />
                </Link>
                <Link href="/banking" className={`p-4 rounded-2xl transition-all ${route().current('banking') ? 'bg-white text-black scale-110 shadow-lg' : 'text-white/40'}`}>
                    <Wallet className="w-6 h-6" />
                </Link>
            </div>

            {/* Header / Breadcrumbs Area */}
            {header && (
                <header className="bg-white pt-32 pb-10">
                    <div className="max-w-[1600px] mx-auto px-6 sm:px-10">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className={!header ? 'pt-32' : ''}>
                {children}
            </main>

            {/* Premium Footer */}
            <footer className="max-w-[1600px] mx-auto px-6 sm:px-10 py-20 mt-20 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-10 opacity-20">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-black">HarborBank Quantum Session © 2026</p>
                <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.5em] text-gray-400">
                    <a href="#">End-to-End Encryption</a>
                    <a href="#">Privacy Protocol</a>
                </div>
            </footer>
        </div>
    );
}
