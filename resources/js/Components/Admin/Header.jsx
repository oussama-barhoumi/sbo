import React from 'react';
import { Search, Bell, User, Sun, Moon } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useApp } from '@/hooks/useApp';

const Header = ({ title }) => {
    const { auth } = usePage().props;
    const { t } = useLaravelReactI18n();
    const { isDark, toggleDark } = useApp();

    return (
        <header className="h-28 flex items-center justify-between px-12 bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-40 border-b border-gray-100 dark:border-white/5 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500">
            <div>
                <h1 className="text-3xl font-black text-black dark:text-white tracking-tighter uppercase italic">{title}</h1>
                <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-pulse" />
                    <p className="text-gray-400 dark:text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
                        {t('admin.header.active')}: {auth.user.name}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-8">
                {/* Theme Toggle */}
                <button 
                    onClick={toggleDark}
                    className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 dark:text-white/20 hover:text-black dark:hover:text-white border border-gray-100 dark:border-white/5 transition-all group"
                >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <div className="relative group hidden lg:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-white/20 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                    <input 
                        type="text" 
                        placeholder={t('admin.header.search')} 
                        className="bg-gray-50 dark:bg-white/5 border-none rounded-2xl pl-12 pr-6 py-4 text-xs font-black text-black dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/10 focus:ring-[12px] focus:ring-black/5 dark:focus:ring-white/5 w-72 transition-all focus:outline-none"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative w-12 h-12 flex items-center justify-center text-gray-400 dark:text-white/20 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-all">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-black dark:bg-white rounded-full border-2 border-white dark:border-black"></span>
                    </button>

                    <div className="flex items-center gap-4 pl-8 border-l border-gray-100 dark:border-white/5">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black text-black dark:text-white uppercase tracking-widest">{auth.user.name}</p>
                            <p className="text-[9px] text-gray-400 dark:text-white/20 font-black uppercase tracking-[0.3em] mt-0.5 italic">{auth.user.role.replace('_', ' ')}</p>
                        </div>
                        <div className="w-14 h-14 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-black/10 dark:shadow-none group cursor-pointer hover:scale-105 transition-transform overflow-hidden border-2 border-gray-50 dark:border-white/10">
                            {auth.user.avatar ? (
                                <img src={`/storage/${auth.user.avatar}`} className="w-full h-full object-cover" alt={auth.user.name} />
                            ) : (
                                <User className="text-white dark:text-black w-6 h-6" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
