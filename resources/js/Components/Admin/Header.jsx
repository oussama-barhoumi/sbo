import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { usePage } from '@inertiajs/react';

const Header = ({ title }) => {
    const { auth } = usePage().props;

    return (
        <header className="h-20 flex items-center justify-between px-10 bg-[#0f172a]/50 backdrop-blur-md sticky top-0 z-40 border-b border-slate-800/50">
            <div>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                <p className="text-slate-400 text-sm">Welcome back, {auth.user.name}</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search anything..." 
                        className="bg-slate-800/50 border-none rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-600 focus:ring-1 focus:ring-indigo-500/50 w-64 transition-all"
                    />
                </div>

                <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#0f172a]"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">{auth.user.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{auth.user.role.replace('_', ' ')}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <User className="text-white w-5 h-5" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
