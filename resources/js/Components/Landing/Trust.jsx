import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle, Award } from 'lucide-react';
import { useApp } from '@/hooks/useApp';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function Trust() {
    const { t } = useLaravelReactI18n();
    const { isDark } = useApp();

    const trustItems = [
        { icon: <Shield className="w-5 h-5" />, label: t('trust.item0.label'), sub: t('trust.item0.sub') },
        { icon: <Lock className="w-5 h-5" />, label: t('trust.item1.label'), sub: t('trust.item1.sub') },
        { icon: <Award className="w-5 h-5" />, label: t('trust.item2.label'), sub: t('trust.item2.sub') },
        { icon: <CheckCircle className="w-5 h-5" />, label: t('trust.item3.label'), sub: t('trust.item3.sub') },
    ];

    return (
        <section id="trust" className={`py-16 relative transition-colors duration-500 ${isDark ? 'bg-[#050505]' : 'bg-brand-50/30'}`}>
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Social Proof */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-center lg:text-left max-w-xl"
                    >
                        <h3 className={`text-2xl sm:text-3xl font-black mb-4 tracking-tight ${isDark ? 'text-white' : 'text-brand-950'}`}>
                            {t('trust.title')} <br />
                            <span className={`${isDark ? 'text-white/40' : 'text-brand-600'}`}>{t('trust.titleAccent')}</span>
                        </h3>
                        <p className={`font-medium leading-relaxed ${isDark ? 'text-white/60' : 'text-brand-500/80'}`}>
                            {t('trust.subtitle')}
                        </p>
                    </motion.div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
                        {trustItems.map((item, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`glass-card p-6 rounded-[2rem] flex flex-col items-center lg:items-start text-center lg:text-left transition-colors duration-300 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : '!bg-white/40 hover:bg-white'}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${isDark ? 'bg-white/10 text-white' : 'bg-brand-100 text-brand-600'}`}>
                                    {item.icon}
                                </div>
                                <p className={`text-sm font-black mb-1 ${isDark ? 'text-white' : 'text-brand-950'}`}>{item.label}</p>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-brand-400'}`}>{item.sub}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Logo Cloud Placeholder */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: isDark ? 0.2 : 0.3 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className={`mt-16 pt-12 border-t flex flex-wrap items-center justify-center gap-10 lg:gap-20 grayscale contrast-125 ${isDark ? 'border-white/10' : 'border-brand-100/50'}`}
                >
                    {['Forbes', 'TechCrunch', 'Bloomberg', 'Wired', 'The Verge'].map((logo) => (
                        <span key={logo} className={`text-xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-brand-950'}`}>{logo}</span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
