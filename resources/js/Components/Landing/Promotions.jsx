import { motion } from 'framer-motion';
import { ArrowRight, Bell } from 'lucide-react';
import Magnetic from './Animations/Magnetic';
import { useApp } from '@/hooks/useApp';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function Promotions() {
    const { t } = useLaravelReactI18n();
    const { isDark } = useApp();

    const promotions = [
        {
            tag: t('promotions.item0.tag'),
            title: t('promotions.item0.title'),
            description: t('promotions.item0.desc'),
            cta: t('promotions.item0.cta'),
            bg: isDark ? 'bg-white/5' : 'bg-white',
        },
        {
            tag: t('promotions.item1.tag'),
            title: t('promotions.item1.title'),
            description: t('promotions.item1.desc'),
            cta: t('promotions.item1.cta'),
            bg: isDark ? 'bg-white/5' : 'bg-brand-50',
        },
        {
            tag: t('promotions.item2.tag'),
            title: t('promotions.item2.title'),
            description: t('promotions.item2.desc'),
            cta: t('promotions.item2.cta'),
            bg: isDark ? 'bg-white/5' : 'bg-brand-100',
        },
    ];

    return (
        <section id="promotions" className={`py-24 lg:py-32 transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-brand-50/50'}`}>
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 ${isDark ? 'bg-white text-black' : 'bg-brand-950 text-white'}`}>
                            <Bell className="w-3.5 h-3.5" />
                            {t('promotions.badge')}
                        </div>
                        <h2 className={`text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] ${isDark ? 'text-white' : 'text-brand-950'}`}>
                            {t('promotions.title')} <br />
                            <span className="opacity-50">{t('promotions.titleAccent')}</span>
                        </h2>
                    </motion.div>
                    <Magnetic>
                        <a href="#" className={`hidden sm:inline-flex items-center gap-2 text-sm font-black hover:underline transition-all group ${isDark ? 'text-white' : 'text-brand-950'}`}>
                            {t('promotions.seeAll')}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </Magnetic>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {promotions.map((promo, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-8 rounded-[2.5rem] border relative overflow-hidden group shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${promo.bg} ${isDark ? 'border-white/10 hover:bg-white/10' : 'border-brand-200'}`}
                        >
                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter mb-6 shadow-sm ${isDark ? 'bg-white text-black' : 'bg-brand-950 text-white'}`}>
                                {promo.tag}
                            </span>
                            
                            <h3 className={`text-2xl font-black mb-4 tracking-tight leading-snug ${isDark ? 'text-white' : 'text-brand-950'}`}>
                                {promo.title}
                            </h3>
                            <p className={`text-sm font-medium leading-relaxed mb-10 ${isDark ? 'text-white/60' : 'text-brand-600'}`}>
                                {promo.description}
                            </p>
                            
                            <Magnetic>
                                <a href="#" className={`inline-flex items-center gap-2 text-sm font-black group-hover:gap-4 transition-all ${isDark ? 'text-white' : 'text-brand-950'}`}>
                                    {promo.cta}
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                            </Magnetic>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
