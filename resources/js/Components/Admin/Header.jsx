import React from 'react';
import { Search, Bell, User, Zap } from 'lucide-react';
import { usePage } from '@inertiajs/react';

const Header = ({ title }) => {
    const { auth } = usePage().props;

    return (
        <header className="h-28 flex items-center justify-between px-12 bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-gray-100 selection:bg-black selection:text-white">
            <div>
                <h1 className="text-3xl font-black text-black tracking-tighter uppercase italic">{title}</h1>
                <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Oversight Active: {auth.user.name}</p>
                </div>
            </div>

            <div className="flex items-center gap-8">
                <div className="relative group hidden lg:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Scan ledger..." 
                        className="bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 text-xs font-black text-black placeholder:text-gray-300 focus:ring-[12px] focus:ring-black/5 w-72 transition-all focus:outline-none"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative w-12 h-12 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 rounded-2xl transition-all">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-black rounded-full border-2 border-white"></span>
                    </button>

                    <div className="flex items-center gap-4 pl-8 border-l border-gray-100">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black text-black uppercase tracking-widest">{auth.user.name}</p>
                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] mt-0.5 italic">{auth.user.role.replace('_', ' ')}</p>
                        </div>
                        <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shadow-xl shadow-black/10 group cursor-pointer hover:scale-105 transition-transform overflow-hidden border-2 border-gray-50">
                            {auth.user.avatar ? (
                                <img src={`/storage/${auth.user.avatar}`} className="w-full h-full object-cover" />
                            ) : (
                                <User className="text-white w-6 h-6" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
