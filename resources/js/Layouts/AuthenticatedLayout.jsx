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
    Moon,
    Calculator
} from 'lucide-react';
import Magnetic from '@/Components/Landing/Animations/Magnetic';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useApp } from '@/hooks/useApp';
import Sidebar from '@/Components/Sidebar';

export default function AuthenticatedLayout({ header, children }) {
    const { t } = useLaravelReactI18n();
    const { isDark, toggleDark } = useApp();
    const user = usePage().props.auth?.user || {};
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

    const navItems = [
        { name: t('layout.nav.banking'), href: '/banking', icon: Landmark },
        { name: t('layout.nav.treasury'), href: '/treasury', icon: Zap },
        { name: t('layout.nav.wealth'), href: '/wealth', icon: Gem },
        { name: t('layout.nav.salary'), href: '/salary-calculator', icon: Calculator },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500 flex">
            {/* Desktop Left Sidebar */}
            <Sidebar 
                isDark={isDark} 
                toggleDark={toggleDark} 
                isCollapsed={isSidebarCollapsed} 
                setIsCollapsed={setIsSidebarCollapsed} 
            />

            <motion.div 
                animate={{ 
                    paddingLeft: isSidebarCollapsed ? '160px' : '380px' 
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col min-w-0"
            >
                {/* Mobile Top Nav & Global Actions */}
                <nav className="h-24 px-10 flex items-center justify-between lg:justify-end gap-8 bg-transparent z-[40]">
                    {/* Mobile Logo (Only visible on mobile) */}
                    <Link href="/" className="lg:hidden text-2xl font-black tracking-tighter italic text-black dark:text-white">
                        HB.
                    </Link>

                    <div className="flex items-center gap-6">
                        {/* Status Node */}
                        <div className="hidden sm:flex items-center gap-4 px-6 py-3 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm transition-colors">
                            <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-black dark:text-white">Node 0x1A Secure</span>
                        </div>

                        {/* Theme Toggle */}
                        <button 
                            onClick={toggleDark}
                            className="w-12 h-12 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 dark:text-white/20 hover:text-accent-blue dark:hover:text-white border border-gray-100 dark:border-white/5 transition-all group"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <button 
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="w-12 h-12 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-white/5 hover:border-accent-blue dark:hover:border-white transition-all group relative"
                            >
                                <Bell className="w-5 h-5 text-gray-400 dark:text-white/20 group-hover:text-accent-blue dark:group-hover:text-white" />
                                <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-accent-blue rounded-full border-2 border-white dark:border-black shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
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
                                            <h3 className="text-sm font-black text-black dark:text-white tracking-tighter uppercase italic">Alerts</h3>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 dark:text-white/20">New (2)</span>
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                { title: 'Transfer Success', msg: 'Sent €450.00 to #1004', time: '2m ago' },
                                                { title: 'Security Alert', msg: 'New login from unknown IP', time: '1h ago' },
                                            ].map((n, i) => (
                                                <div key={i} className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-black/20 transition-all cursor-pointer group">
                                                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-black dark:text-white">{n.title}</p>
                                                    <p className="text-xs font-medium text-gray-400 dark:text-white/40 leading-tight">{n.msg}</p>
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-300 dark:text-white/10 mt-3">{n.time}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-full mt-10 py-5 bg-accent-blue text-white rounded-[1.5rem] text-[9px] font-black uppercase tracking-[0.4em] shadow-xl hover:shadow-glass hover:scale-[1.02] active:scale-95 transition-all">
                                            View All Records
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                            className="lg:hidden w-12 h-12 bg-accent-blue text-white rounded-2xl flex items-center justify-center shadow-lg"
                        >
                            {showingNavigationDropdown ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Navigation Drawer */}
                <AnimatePresence>
                    {showingNavigationDropdown && (
                        <motion.div 
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="fixed inset-0 z-[150] lg:hidden"
                        >
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowingNavigationDropdown(false)} />
                            <motion.div className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-[#0a0a0a] p-10 flex flex-col">
                                <div className="flex items-center justify-between mb-16">
                                    <span className="text-2xl font-black italic dark:text-white">HB.</span>
                                    <button onClick={() => setShowingNavigationDropdown(false)} className="text-gray-400 hover:text-black dark:hover:text-white">
                                        <X className="w-8 h-8" />
                                    </button>
                                </div>
                                <div className="flex flex-col gap-6">
                                    {navItems.map((item) => (
                                        <Link 
                                            key={item.name} 
                                            href={item.href}
                                            onClick={() => setShowingNavigationDropdown(false)}
                                            className="text-xl font-black text-black dark:text-white tracking-tighter uppercase italic flex items-center gap-4"
                                        >
                                            <item.icon className="w-6 h-6" />
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                                <div className="mt-auto pt-10 border-t border-gray-100 dark:border-white/5 flex flex-col gap-6">
                                    <Link href="/profile" className="text-xl font-black text-black dark:text-white tracking-tighter uppercase italic flex items-center gap-4">
                                        <User className="w-6 h-6" /> Profile
                                    </Link>
                                    <Link method="post" href={route('logout')} as="button" className="text-xl font-black text-red-500 tracking-tighter uppercase italic flex items-center gap-4 text-left">
                                        <LogOut className="w-6 h-6" /> Logout
                                    </Link>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Page Header */}
                {header && (
                    <header className="px-10 mt-8 mb-12">
                        <div className="max-w-[1400px]">
                            {header}
                        </div>
                    </header>
                )}

                {/* Main Content Area */}
                <main className="flex-1 px-10 pb-20 overflow-y-auto">
                    <div className="max-w-[1400px]">
                        {children}
                    </div>
                </main>
            </motion.div>
        </div>
    );
}

