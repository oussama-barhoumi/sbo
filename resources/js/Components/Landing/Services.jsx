import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { CreditCard, TrendingUp, Landmark, ShieldCheck, Zap, Globe } from 'lucide-react';
import Magnetic from './Animations/Magnetic';
import { useApp } from '@/hooks/useApp';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function Services() {
    const { t } = useLaravelReactI18n();
    const { isDark } = useApp();

    const services = [
        {
            icon: <CreditCard className="w-7 h-7" />,
            title: t('services.item0.title'),
            description: t('services.item0.desc'),
            color: isDark ? 'text-white' : 'text-brand-950',
            bg: isDark ? 'bg-white/10' : 'bg-brand-50',
        },
        {
            icon: <TrendingUp className="w-7 h-7" />,
            title: t('services.item1.title'),
            description: t('services.item1.desc'),
            color: isDark ? 'text-white' : 'text-brand-950',
            bg: isDark ? 'bg-white/10' : 'bg-brand-100',
        },
        {
            icon: <Globe className="w-7 h-7" />,
            title: t('services.item2.title'),
            description: t('services.item2.desc'),
            color: isDark ? 'text-white' : 'text-brand-950',
            bg: isDark ? 'bg-white/10' : 'bg-brand-50',
        },
        {
            icon: <Landmark className="w-7 h-7" />,
            title: t('services.item3.title'),
            description: t('services.item3.desc'),
            color: isDark ? 'text-white' : 'text-brand-950',
            bg: isDark ? 'bg-white/10' : 'bg-brand-100',
        },
        {
            icon: <ShieldCheck className="w-7 h-7" />,
            title: t('services.item4.title'),
            description: t('services.item4.desc'),
            color: isDark ? 'text-white' : 'text-brand-950',
            bg: isDark ? 'bg-white/10' : 'bg-brand-50',
        },
        {
            icon: <Zap className="w-7 h-7" />,
            title: t('services.item5.title'),
            description: t('services.item5.desc'),
            color: isDark ? 'text-white' : 'text-brand-950',
            bg: isDark ? 'bg-white/10' : 'bg-brand-100',
        },
    ];

    const containerVars = {
        initial: {},
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVars = {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <section id="services" className={`py-24 lg:py-32 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`inline-flex items-center gap-2 px-5 py-2 border rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 ${isDark ? 'bg-white/5 border-white/10 text-white/60' : 'bg-brand-50 border-brand-100 text-brand-950'}`}
                    >
                        {t('services.badge')}
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className={`text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-[1.1] ${isDark ? 'text-white' : 'text-brand-950'}`}
                    >
                        {t('services.title')} <br />
                        <span className="italic">{t('services.titleAccent')}</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className={`text-lg font-medium leading-relaxed ${isDark ? 'text-white/40' : 'text-brand-500'}`}
                    >
                        {t('services.subtitle')}
                    </motion.p>
                </div>

                {/* Services Grid */}
                <motion.div 
                    variants={containerVars}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            variants={cardVars}
                            className={`glass-card group cursor-pointer p-8 rounded-[2.5rem] transition-all duration-300 ${isDark ? 'bg-white/5 hover:bg-white text-white hover:text-black border-white/10' : 'hover:bg-brand-950 hover:text-white'}`}
                        >
                            <div className={`w-16 h-16 rounded-3xl ${service.bg} flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 shadow-sm`}>
                                <div className={`${service.color} ${isDark ? 'group-hover:text-black' : 'group-hover:text-white'}`}>
                                    {service.icon}
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-black mb-3 tracking-tight">
                                {service.title}
                            </h3>
                            <p className="text-sm leading-relaxed mb-8 font-medium opacity-70">
                                {service.description}
                            </p>
                            
                            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest transition-all duration-300 group-hover:gap-4">
                                {t('services.learnMore')}
                                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className={`mt-20 p-10 lg:p-12 rounded-[3rem] relative overflow-hidden group ${isDark ? 'bg-white text-black' : 'bg-brand-950 text-white'}`}
                >
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="text-center lg:text-left">
                            <h3 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">{t('services.ctaTitle')}</h3>
                            <p className={`${isDark ? 'text-black/60' : 'text-brand-300'} font-medium`}>{t('services.ctaSub')}</p>
                        </div>
                        <Magnetic>
                            <Link href="/register-account" className={`px-10 py-5 font-black rounded-3xl transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap ${isDark ? 'bg-black text-white' : 'bg-white text-brand-950'}`}>
                                {t('services.ctaBtn')}
                            </Link>
                        </Magnetic>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
