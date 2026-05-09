import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Landmark, 
    Zap, 
    Gem, 
    Calculator,
    Settings,
    History,
    LogOut,
    User,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLaravelReactI18n } from 'laravel-react-i18n';

const Sidebar = ({ isDark, toggleDark, isCollapsed, setIsCollapsed }) => {
    const { url, props } = usePage();
    const { t } = useLaravelReactI18n();
    const user = props.auth?.user || {};

    const menuItems = [
        { name: t('layout.nav.dashboard'), icon: LayoutDashboard, href: '/dashboard' },
        { name: t('layout.nav.banking'), icon: Landmark, href: '/banking' },
        { name: t('layout.nav.treasury'), icon: Zap, href: '/treasury' },
        { name: t('layout.nav.wealth'), icon: Gem, href: '/wealth' },
        { name: t('layout.nav.salary'), icon: Calculator, href: '/salary-calculator' },
    ];

    return (
        <motion.aside 
            animate={{ width: isCollapsed ? 110 : 320 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-6 top-6 bottom-6 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 z-50 rounded-[3rem] shadow-2xl shadow-black/5 dark:shadow-none transition-colors duration-500 hidden lg:flex flex-col overflow-hidden"
        >
            <div className={`h-full flex flex-col relative transition-all duration-500 ${isCollapsed ? 'p-6' : 'p-8'}`}>
                {/* Collapse Toggle Button */}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center shadow-xl z-50 hover:scale-110 transition-transform"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                {/* Logo Section */}
                <div className={`flex items-center gap-4 mb-16 px-2 overflow-hidden whitespace-nowrap ${isCollapsed ? 'justify-center' : ''}`}>
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-black/10 dark:shadow-none group-hover:rotate-12 transition-transform duration-500 flex-shrink-0">
                            <Landmark className="text-white dark:text-black w-6 h-6" />
                        </div>
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                >
                                    <span className="block text-xl font-black tracking-tighter uppercase italic leading-none dark:text-white">
                                        HarborBank
                                    </span>
                                    <span className="block text-[8px] font-black uppercase tracking-[0.4em] text-gray-300 dark:text-white/20 mt-1">
                                        Institutional Portal
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-4 flex-1">
                    {menuItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-4 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden whitespace-nowrap ${isCollapsed ? 'justify-center px-0' : 'px-5'} ${
                                    isActive 
                                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-2xl shadow-black/20 dark:shadow-none' 
                                    : 'text-gray-400 dark:text-white/20 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-500 ${isActive ? 'text-white dark:text-black' : 'group-hover:scale-110'}`} />
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="text-[10px] font-black uppercase tracking-widest"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="absolute -left-2 w-1 h-8 bg-black dark:bg-white rounded-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="pt-8 space-y-4 border-t border-gray-50 dark:border-white/5">
                    <Link 
                        href="/profile" 
                        className={`flex items-center gap-4 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden whitespace-nowrap ${isCollapsed ? 'justify-center px-0' : 'px-5'} ${url.startsWith('/profile') ? 'bg-gray-50 dark:bg-white/5 text-black dark:text-white' : 'text-gray-400 dark:text-white/20 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    >
                        <User className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="text-[10px] font-black uppercase tracking-widest"
                                >
                                    {t('layout.profile.title')}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className={`flex items-center gap-4 py-4 rounded-2xl w-full text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all duration-500 group text-left relative overflow-hidden whitespace-nowrap ${isCollapsed ? 'justify-center px-0' : 'px-5'}`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="text-[10px] font-black uppercase tracking-widest"
                                >
                                    {t('layout.profile.logout')}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                </div>

                {/* User Info Card */}
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mt-8 p-6 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 flex items-center gap-4 overflow-hidden"
                        >
                            <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black font-black italic text-xs flex-shrink-0">
                                {user.name ? user.name[0] : 'U'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] font-black text-black dark:text-white truncate uppercase italic">{user.name}</p>
                                <p className="text-[8px] font-black text-gray-300 dark:text-white/20 uppercase tracking-widest truncate">{user.email}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
