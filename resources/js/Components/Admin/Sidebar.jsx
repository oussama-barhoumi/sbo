import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Users, 
    ShieldCheck, 
    History, 
    Settings, 
    LogOut,
    TrendingUp,
    Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const { url } = usePage();

    const menuItems = [
        { name: 'Identity Oversight', icon: LayoutDashboard, href: '/admin/dashboard' },
        { name: 'Client Directory', icon: Users, href: '/admin/users' },
        { name: 'Protocol Officers', icon: ShieldCheck, href: '/admin/admins' },
        { name: 'Security Ledger', icon: History, href: '/admin/audit-logs' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-100 z-50 selection:bg-black selection:text-white">
            <div className="p-8 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-16 px-2">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-xl shadow-black/10">
                        <Zap className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <span className="block text-xl font-black tracking-tighter uppercase italic leading-none">
                            Harbor
                        </span>
                        <span className="block text-[8px] font-black uppercase tracking-[0.4em] text-gray-300 mt-1">
                            Admin Command
                        </span>
                    </div>
                </div>

                <nav className="space-y-3 flex-1">
                    {menuItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group relative ${
                                    isActive 
                                    ? 'bg-black text-white shadow-2xl shadow-black/20' 
                                    : 'text-gray-400 hover:text-black hover:bg-gray-50'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'text-white' : 'group-hover:scale-110'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="absolute -left-2 w-1 h-8 bg-black rounded-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-8 border-t border-gray-50">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center gap-4 px-5 py-4 rounded-2xl w-full text-gray-400 hover:bg-black hover:text-white transition-all duration-500 group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
