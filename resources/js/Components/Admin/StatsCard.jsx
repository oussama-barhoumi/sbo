import React from 'react';

const StatsCard = ({ title, value, icon: Icon, trend, color = "indigo" }) => {
    const colorClasses = {
        indigo: "bg-indigo-500/10 text-indigo-400 shadow-indigo-500/10",
        emerald: "bg-emerald-500/10 text-emerald-400 shadow-emerald-500/10",
        rose: "bg-rose-500/10 text-rose-400 shadow-rose-500/10",
        amber: "bg-amber-500/10 text-amber-400 shadow-amber-500/10",
    };

    return (
        <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-800/50 p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-white tracking-tight">
                        {typeof value === 'number' && title.toLowerCase().includes('balance') 
                            ? new Intl.NumberFormat('en-MA', { style: 'currency', currency: 'MAD' }).format(value)
                            : value}
                    </h3>
                </div>
                <div className={`p-3 rounded-2xl ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            
            {trend && (
                <div className="mt-4 flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                        trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                    <span className="text-xs text-slate-500 italic">vs last month</span>
                </div>
            )}
        </div>
    );
};

export default StatsCard;
