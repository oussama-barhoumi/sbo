import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Users, 
    ShieldCheck, 
    History, 
    Settings, 
    LogOut,
    TrendingUp
} from 'lucide-react';

const Sidebar = () => {
    const { url } = usePage();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
        { name: 'User Management', icon: Users, href: '/admin/users' },
        { name: 'Admin Management', icon: ShieldCheck, href: '/admin/admins' },
        { name: 'Audit Logs', icon: History, href: '/admin/audit-logs' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-72 bg-[#0f172a] border-r border-slate-800/50 backdrop-blur-xl z-50">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <TrendingUp className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        HarborAdmin
                    </span>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                                    isActive 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-white'}`} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex items-center gap-4 px-4 py-3.5 rounded-2xl w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
