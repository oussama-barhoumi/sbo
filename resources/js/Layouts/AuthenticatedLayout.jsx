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
    Gem,
    Zap
} from 'lucide-react';
import Magnetic from '@/Components/Landing/Animations/Magnetic';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDark(true);
        }
    };
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-black dark:text-white font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black pb-24 lg:pb-0 transition-colors duration-500">
            {/* Premium Nav */}
            <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-500 ${scrolled ? 'bg-white/90 dark:bg-[#050505]/90 backdrop-blur-2xl py-4 shadow-sm border-gray-100 dark:border-white/5' : 'bg-white dark:bg-[#050505] py-6 border-transparent'}`}>
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

                        <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-white/20">
                            <Link href={route('dashboard')} className={`${route().current('dashboard') ? 'text-black dark:text-white border-b-2 border-black dark:border-white pb-1' : 'hover:text-black dark:hover:text-white'} transition-all`}>Overview</Link>
                            <Link href={route('treasury')} className={`${route().current('treasury') ? 'text-black dark:text-white border-b-2 border-black dark:border-white pb-1' : 'hover:text-black dark:hover:text-white'} transition-all`}>Treasury</Link>
                            <Link href={route('wealth')} className={`${route().current('wealth') ? 'text-black dark:text-white border-b-2 border-black dark:border-white pb-1' : 'hover:text-black dark:hover:text-white'} transition-all`}>Wealth</Link>
                            <Link href="/banking" className="hover:text-black dark:hover:text-white transition-all">Vault</Link>
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

                        <div className="relative mr-2 flex items-center gap-4">
                            {/* Theme Toggle */}
                            <button 
                                onClick={toggleTheme}
                                className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-white/5 hover:border-black dark:hover:border-white transition-all group"
                                title="Toggle Theme"
                            >
                                {isDark ? <Zap className="w-5 h-5 text-white" /> : <ShieldCheck className="w-5 h-5 text-gray-400 group-hover:text-black" />}
                            </button>

                            <button 
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-white/5 hover:border-black dark:hover:border-white transition-all group relative"
                            >
                                <Bell className="w-5 h-5 text-gray-400 dark:text-white/20 group-hover:text-black dark:group-hover:text-white" />
                                <div className="absolute top-3 right-3 w-2 h-2 bg-black dark:bg-white rounded-full border-2 border-white dark:border-black" />
                            </button>

                            <AnimatePresence>
                                {notificationsOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                        className="absolute right-0 mt-4 w-80 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-6 z-50 overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-sm font-black uppercase tracking-widest italic">Alerts</h3>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">2 New</span>
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                { title: 'Transfer Success', msg: 'Sent $450.00 to #1004', time: '2m ago', type: 'success' },
                                                { title: 'Security Alert', msg: 'New login from unknown IP', time: '1h ago', type: 'warning' },
                                            ].map((n, i) => (
                                                <div key={i} className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 dark:text-white">{n.title}</p>
                                                    <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 leading-tight">{n.msg}</p>
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-300 dark:text-white/10 mt-2">{n.time}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => alert('Notifications Archive: Accessing historical security logs...')}
                                            className="w-full mt-6 py-4 bg-black dark:bg-white text-white dark:text-black rounded-[1.5rem] text-[9px] font-black uppercase tracking-[0.4em]"
                                        >
                                            View All
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="relative">
                            <button 
                                onClick={() => setProfileDropdown(!profileDropdown)}
                                className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center border border-black/10 dark:border-white/10 shadow-xl shadow-black/10 dark:shadow-none hover:scale-105 transition-transform"
                            >
                                {user.name ? <span className="font-black text-sm italic">{user.name[0]}</span> : <User className="w-5 h-5" />}
                            </button>

                            <AnimatePresence>
                                {profileDropdown && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                        className="absolute right-0 mt-4 w-64 bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 p-3 z-50 overflow-hidden"
                                    >
                                        <div className="px-6 py-4 border-b border-gray-50 dark:border-white/5 mb-2">
                                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 dark:text-white/10">Identity</p>
                                            <p className="text-xs font-black truncate text-black dark:text-white">{user.email}</p>
                                        </div>
                                        <Link href={route('profile.edit')} className="flex items-center gap-4 px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-white/20 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white rounded-[1.5rem] transition-all">
                                            <Settings className="w-4 h-4" /> Settings
                                        </Link>
                                        <Link 
                                            href={route('logout')} 
                                            method="post" 
                                            as="button" 
                                            className="w-full flex items-center gap-4 px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded-[1.5rem] transition-all mt-1"
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
                            className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-400 dark:text-white/20"
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
                        className="fixed inset-0 z-[60] bg-white dark:bg-black lg:hidden flex flex-col p-10 transition-colors"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <span className="font-black text-2xl tracking-tighter uppercase italic dark:text-white">Harbor</span>
                            <button onClick={() => setShowingNavigationDropdown(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-white/5 dark:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            <Link href={route('dashboard')} onClick={() => setShowingNavigationDropdown(false)} className="block text-5xl font-black tracking-tighter text-black dark:text-white uppercase italic mb-8">Overview</Link>
                            <Link href="/banking" onClick={() => setShowingNavigationDropdown(false)} className="block text-5xl font-black tracking-tighter text-gray-200 dark:text-white/5 uppercase italic mb-8">The Vault</Link>
                            <button 
                                onClick={() => { toggleTheme(); setShowingNavigationDropdown(false); }}
                                className="block text-4xl font-black tracking-tighter text-black dark:text-white uppercase italic mb-8 text-left"
                            >
                                Toggle {isDark ? 'Light' : 'Dark'}
                            </button>
                            <Link href={route('profile.edit')} onClick={() => setShowingNavigationDropdown(false)} className="block text-2xl font-black tracking-tighter text-gray-400 dark:text-white/20 uppercase italic">Settings</Link>
                        </div>
                        <div className="mt-auto">
                            <Link href={route('logout')} method="post" as="button" className="w-full bg-black dark:bg-white text-white dark:text-black py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em]">Terminate Session</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Bottom Bar (Premium App Style) */}
            <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50 h-20 bg-black/90 dark:bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 dark:border-black/10 shadow-2xl flex items-center justify-around px-4 transition-colors">
                <Link href={route('dashboard')} className={`p-4 rounded-2xl transition-all ${route().current('dashboard') ? 'bg-white dark:bg-black text-black dark:text-white scale-110 shadow-lg' : 'text-white/40 dark:text-black/40'}`}>
                    <LayoutDashboard className="w-6 h-6" />
                </Link>
                <Link href={route('treasury')} className={`p-4 rounded-2xl transition-all ${route().current('treasury') ? 'bg-white dark:bg-black text-black dark:text-white scale-110 shadow-lg' : 'text-white/40 dark:text-black/40'}`}>
                    <Landmark className="w-6 h-6" />
                </Link>
                <Link href={route('wealth')} className={`p-4 rounded-2xl transition-all ${route().current('wealth') ? 'bg-white dark:bg-black text-black dark:text-white scale-110 shadow-lg' : 'text-white/40 dark:text-black/40'}`}>
                    <Gem className="w-6 h-6" />
                </Link>
                <Link href="/banking" className={`p-4 rounded-2xl transition-all ${route().current('banking') ? 'bg-white dark:bg-black text-black dark:text-white scale-110 shadow-lg' : 'text-white/40 dark:text-black/40'}`}>
                    <Wallet className="w-6 h-6" />
                </Link>
            </div>

            {/* Header / Breadcrumbs Area */}
            {header && (
                <header className="bg-white dark:bg-black pt-32 pb-10 transition-colors">
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
            <footer className="max-w-[1600px] mx-auto px-6 sm:px-10 py-20 mt-20 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 opacity-20 transition-all">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-black dark:text-white">HarborBank Quantum Session © 2026</p>
                <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.5em] text-gray-400 no-print">
                    <button onClick={() => alert('Harbor Quantum Encryption: AES-256-GCM Active.')} className="hover:text-black dark:hover:text-white transition-colors">End-to-End Encryption</button>
                    <button onClick={() => alert('Privacy Protocol: Your data is protected by Swiss-grade privacy laws.')} className="hover:text-black dark:hover:text-white transition-colors">Privacy Protocol</button>
                </div>
            </footer>
        </div>
    );
}
