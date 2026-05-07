import React from 'react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useApp } from '@/hooks/useApp';

const StatsCard = ({ title, value, icon: Icon, trend, color = "black" }) => {
    const { t } = useLaravelReactI18n();
    const { isDark } = useApp();

    return (
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/10 p-8 rounded-[2.5rem] hover:scale-[1.02] transition-all duration-500 group shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-400 dark:text-white/20 text-[10px] font-black uppercase tracking-widest mb-3">{title}</p>
                    <h3 className="text-4xl font-black text-black dark:text-white tracking-tighter italic">
                        {typeof value === 'number' && title.toLowerCase().includes('balance') 
                            ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
                            : value}
                    </h3>
                </div>
                <div className={`p-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black shadow-xl shadow-black/10 transition-transform duration-500 group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            
            {trend && (
                <div className="mt-8 flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
                        trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}>
                        {trend}
                    </span>
                    <span className="text-[9px] text-gray-400 dark:text-white/20 font-black uppercase tracking-widest italic">{t('admin.common.vs_last_month')}</span>
                </div>
            )}
        </div>
    );
};

export default StatsCard;
