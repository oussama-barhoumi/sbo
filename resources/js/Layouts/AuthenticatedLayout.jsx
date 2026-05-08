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
    Zap,
    History,
    Sun,
    Moon
} from 'lucide-react';
import Magnetic from '@/Components/Landing/Animations/Magnetic';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useApp } from '@/hooks/useApp';

export default function AuthenticatedLayout({ header, children }) {
    const { t } = useLaravelReactI18n();
    const { isDark, toggleDark } = useApp();
    const user = usePage().props.auth?.user || {};
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: t('layout.nav.banking'), href: '/banking', icon: Landmark },
        { name: t('layout.nav.treasury'), href: '/treasury', icon: Zap },
        { name: t('layout.nav.wealth'), href: '/wealth', icon: Gem },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500">
            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-10 py-6 ${scrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 py-4' : 'bg-transparent'}`}>
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-16">
                        <Link href="/" className="text-2xl font-black tracking-tighter italic text-black dark:text-white group">
                            HB<span className="text-gray-300 dark:text-white/20 group-hover:text-black dark:group-hover:text-white transition-colors">.</span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-10">
                            {navItems.map((item) => (
                                <Link 
                                    key={item.name} 
                                    href={item.href}
                                    className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-2 ${usePage().url.startsWith(item.href) ? 'text-black dark:text-white underline underline-offset-8 decoration-2' : 'text-gray-400 dark:text-white/20 hover:text-black dark:hover:text-white'}`}
                                >
                                    <item.icon className="w-3 h-3" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        {/* Theme Toggle */}
                        <button 
                            onClick={toggleDark}
                            className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-400 dark:text-white/20 hover:text-black dark:hover:text-white transition-all group"
                        >
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>

                        {/* Notifications */}
                        <div className="relative">
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
                                        className="absolute right-0 mt-6 w-96 bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10 p-10 z-[110] overflow-hidden transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-sm font-black text-black dark:text-white tracking-tighter uppercase italic">{t('layout.alerts.title')}</h3>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 dark:text-white/20">{t('layout.alerts.new')} (2)</span>
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                { title: 'Transfer Success', msg: 'Sent €450.00 to #1004', time: '2m ago', type: 'success' },
                                                { title: 'Security Alert', msg: 'New login from unknown IP', time: '1h ago', type: 'warning' },
                                            ].map((n, i) => (
                                                <div key={i} className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all cursor-pointer group">
                                                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-black dark:text-white">{n.title}</p>
                                                    <p className="text-xs font-medium text-gray-400 dark:text-white/40 leading-tight">{n.msg}</p>
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-300 dark:text-white/10 mt-3">{n.time}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-full mt-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-[1.5rem] text-[9px] font-black uppercase tracking-[0.4em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                                            {t('layout.alerts.view_all')}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setProfileDropdown(!profileDropdown)}
                                className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center border border-black/10 dark:border-white/10 shadow-xl shadow-black/10 dark:shadow-none hover:scale-105 active:scale-95 transition-all"
                            >
                                <span className="font-black text-sm italic">{user.name ? user.name[0] : 'U'}</span>
                            </button>

                            <AnimatePresence>
                                {profileDropdown && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                        className="absolute right-0 mt-6 w-80 bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10 p-10 z-[110] transition-colors"
                                    >
                                        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100 dark:border-white/5">
                                            <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-black dark:text-white font-black italic">
                                                {user.name ? user.name[0] : 'U'}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-black dark:text-white tracking-tighter uppercase italic">{user.name}</h4>
                                                <p className="text-[9px] font-black text-gray-300 dark:text-white/20 uppercase tracking-widest">{t('layout.profile.title')}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            {(user.role === 'admin' || user.role === 'super_admin') && (
                                                <Link 
                                                    href={route('admin.dashboard')} 
                                                    className="flex items-center gap-4 px-4 py-4 rounded-xl text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/5 transition-all"
                                                >
                                                    <ShieldCheck className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Admin Portal</span>
                                                </Link>
                                            )}
                                            <Link href="/profile" className="flex items-center gap-4 px-4 py-4 rounded-xl text-gray-400 dark:text-white/20 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                                <Settings className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{t('layout.profile.settings')}</span>
                                            </Link>
                                            <Link href="/audit" className="flex items-center gap-4 px-4 py-4 rounded-xl text-gray-400 dark:text-white/20 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                                <History className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{t('layout.nav.audit')}</span>
                                            </Link>
                                            <Link 
                                                method="post" 
                                                href={route('logout')} 
                                                as="button" 
                                                className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{t('layout.profile.logout')}</span>
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                            className="lg:hidden w-12 h-12 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center text-black dark:text-white"
                        >
                            {showingNavigationDropdown ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {showingNavigationDropdown && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/5 mt-6 rounded-[2.5rem] p-10 overflow-hidden"
                        >
                            <div className="flex flex-col gap-6">
                                {navItems.map((item) => (
                                    <Link 
                                        key={item.name} 
                                        href={item.href}
                                        className="text-xl font-black text-black dark:text-white tracking-tighter uppercase italic flex items-center gap-4"
                                    >
                                        <item.icon className="w-6 h-6" />
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Page Header */}
            {header && (
                <header className="pt-40 px-10 max-w-[1600px] mx-auto">
                    {header}
                </header>
            )}

            {/* Main Content */}
            <main className="max-w-[1600px] mx-auto">
                {children}
            </main>

            {/* Premium Footer */}
            <footer className="px-10 py-20 border-t border-gray-100 dark:border-white/5 mt-20">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="text-center md:text-left">
                        <h4 className="text-2xl font-black tracking-tighter text-black dark:text-white italic uppercase mb-2">HarborBank</h4>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-white/20">Institutional Wealth Management System</p>
                    </div>
                    <div className="flex gap-12">
                        {['Privacy', 'Legal', 'Infrastructure', 'Security'].map(f => (
                            <button key={f} className="text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-white/20 hover:text-black dark:hover:text-white transition-colors">{f}</button>
                        ))}
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-gray-300 dark:text-white/10">
                        © 2026 Institutional Network • Node 01
                    </div>
                </div>
            </footer>
        </div>
    );
}
