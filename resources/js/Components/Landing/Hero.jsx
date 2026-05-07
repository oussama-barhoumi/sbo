import { Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Magnetic from './Animations/Magnetic';
import { useApp } from '@/hooks/useApp';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function Hero() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, -100]);
    const y2 = useTransform(scrollY, [0, 500], [0, -50]);
    const { t } = useLaravelReactI18n();
    const { isDark } = useApp();

    const titleWords = t('hero.title').split(' ');

    const containerVars = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    };
    const wordVars = {
        initial: { y: 100, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 10 } }
    };

    return (
        <section id="hero" className={`relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#050505]' : 'bg-white'}`}>

            {/* Background blobs */}
            <div className="absolute inset-0 z-0 opacity-40">
                <motion.div style={{ y: y2 }} className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] ${isDark ? 'bg-white/5' : 'bg-brand-200'}`} />
                <motion.div style={{ y: y1 }} className={`absolute bottom-[0%] right-[-5%] w-[40%] h-[60%] rounded-full blur-[100px] ${isDark ? 'bg-white/5' : 'bg-brand-100'}`} />
            </div>

            <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Left Content */}
                    <div className="order-2 lg:order-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest mb-8 shadow-sm border ${isDark ? 'bg-white/5 border-white/10 text-white/60' : 'bg-white/50 backdrop-blur-sm border-white/60 text-brand-700'}`}
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black dark:bg-white opacity-75"></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${isDark ? 'bg-white' : 'bg-black'}`}></span>
                            </span>
                            {t('hero.badge')}
                        </motion.div>

                        <motion.h1
                            variants={containerVars}
                            initial="initial"
                            animate="animate"
                            className={`text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-8 ${isDark ? 'text-white' : 'text-brand-950'}`}
                        >
                            {titleWords.map((word, i) => (
                                <span key={i} className="inline-block overflow-hidden mr-3 pb-2">
                                    <motion.span variants={wordVars} className="inline-block">{word}</motion.span>
                                </span>
                            ))}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className={`text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10 font-medium ${isDark ? 'text-white/50' : 'text-brand-600/80'}`}
                        >
                            {t('hero.subtitle')}
                        </motion.p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-16">
                            <Magnetic>
                                <Link href="/register-account" className="btn-primary w-full sm:w-auto group">
                                    {t('hero.cta')}
                                    <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                            </Magnetic>
                            <Magnetic>
                                <Link href="/login" className="btn-secondary w-full sm:w-auto">
                                    {t('hero.explore')}
                                </Link>
                            </Magnetic>
                        </div>

                        {/* Quick Stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            transition={{ delay: 1.2 }}
                            className="flex flex-wrap items-center justify-center lg:justify-start gap-8 hover:opacity-100 transition-opacity duration-500"
                        >
                            {[
                                { value: t('hero.stat0.value'), label: t('hero.stat0.label') },
                                { value: t('hero.stat1.value'), label: t('hero.stat1.label') },
                                { value: t('hero.stat2.value'), label: t('hero.stat2.label') },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-8">
                                    {i > 0 && <div className={`w-px h-8 hidden sm:block ${isDark ? 'bg-white/10' : 'bg-brand-200'}`} />}
                                    <div>
                                        <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-brand-950'}`}>{stat.value}</p>
                                        <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-white/30' : 'text-brand-500'}`}>{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right Visual */}
                    <div className="order-1 lg:order-2 relative px-4 lg:px-0">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="relative"
                        >
                            <div className={`relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/5] sm:aspect-square lg:aspect-[4/5] border-[12px] ring-1 ${isDark ? 'border-white/5 ring-white/5' : 'border-white ring-brand-100'}`}>
                                <img
                                    src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800"
                                    alt="Digital Banking Experience"
                                    className="w-full h-full object-cover scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            </div>

                            {/* Floating Card: Balance */}
                            <motion.div
                                style={{ y: y1 }}
                                whileHover={{ scale: 1.05, rotate: -2 }}
                                className={`absolute -bottom-10 -left-6 sm:bottom-12 sm:-left-12 rounded-3xl p-6 w-64 sm:w-72 shadow-2xl z-20 cursor-pointer border ${isDark ? 'bg-white/5 backdrop-blur-xl border-white/10' : 'bg-white/80 backdrop-blur-sm border-white/60'}`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.82v-1.91c-1.64-.17-3.09-.94-4.14-2.1l1.55-1.55c.78.89 1.83 1.45 2.59 1.61v-3.76c-1.93-.41-3.66-1.12-3.66-3.41 0-1.8 1.41-3.09 3.12-3.41V4h2.82v1.91c1.39.14 2.56.76 3.41 1.63l-1.55 1.55c-.56-.56-1.29-.91-1.86-1.02v3.52c1.93.47 3.66 1.25 3.66 3.53 0 1.94-1.42 3.32-3.41 3.53z" />
                                        </svg>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-brand-400'}`}>{t('hero.balance')}</span>
                                </div>
                                <p className={`text-3xl font-black mb-1 ${isDark ? 'text-white' : 'text-brand-950'}`}>$48,250.00</p>
                                <div className={`flex items-center gap-1.5 font-bold text-xs ${isDark ? 'text-white/60' : 'text-black'}`}>
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                                    </svg>
                                    +12.5% monthly
                                </div>
                            </motion.div>

                            {/* Floating Card: Security */}
                            <motion.div
                                style={{ y: y2 }}
                                whileHover={{ scale: 1.05, rotate: 2 }}
                                className={`absolute top-10 -right-4 sm:top-20 sm:-right-8 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-xl border-l-4 z-20 cursor-pointer border ${isDark ? 'bg-white/5 backdrop-blur-xl border-white/10 border-l-white' : 'bg-white/80 backdrop-blur-sm border-white/60 border-l-black'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}>
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-brand-400'}`}>{t('hero.security')}</p>
                                    <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-brand-950'}`}>{t('hero.securitySub')}</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
