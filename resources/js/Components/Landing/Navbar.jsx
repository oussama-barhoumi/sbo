import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useApp } from '@/hooks/useApp';

const LANGUAGES = [
    { code: 'en', label: 'EN', name: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'FR', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'عر', name: 'العربية', flag: '🇸🇦' },
];

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
);

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const { url } = usePage();
    const { isDark, toggleDark, locale, setLocale } = useApp();
    const { t } = useLaravelReactI18n();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { setMobileOpen(false); setLangOpen(false); }, [url]);

    const links = [
        { href: '/', label: t('nav.home') },
        { href: '#services', label: t('nav.services') },
        { href: '#trust', label: t('nav.trust') },
    ];

    const currentLang = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-500 ${
                scrolled
                    ? 'backdrop-blur-heavy bg-harbor-950/90 dark:bg-black/90 border-white/[0.08] shadow-glass'
                    : 'bg-transparent border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16 lg:h-20">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/30">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                            </svg>
                        </div>
                        <span className="font-bold text-lg text-white tracking-tight">HarborBank</span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden lg:flex items-center gap-1">
                        {links.map((link) => {
                            const isHash = link.href.startsWith('#');
                            const href = isHash ? `/${link.href}` : link.href;
                            const isActive = url === href || (href !== '/' && url.startsWith(href));
                            
                            const Tag = isHash ? 'a' : Link;

                            return (
                                <Tag
                                    key={link.href}
                                    href={href}
                                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                                        isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
                                    }`}
                                >
                                    {link.label}
                                    <AnimatePresence>
                                        {isActive && scrolled && (
                                            <motion.div
                                                key="indicator"
                                                layoutId="navbar-indicator"
                                                initial={{ opacity: 0, scaleX: 0 }}
                                                animate={{ opacity: 1, scaleX: 1 }}
                                                exit={{ opacity: 0, scaleX: 0 }}
                                                className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full"
                                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </AnimatePresence>
                                </Tag>
                            );
                        })}
                    </div>

                    {/* Desktop Right Controls */}
                    <div className="hidden lg:flex items-center gap-3">

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDark}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
                            title={isDark ? 'Light mode' : 'Dark mode'}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                    key={isDark ? 'moon' : 'sun'}
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isDark ? <SunIcon /> : <MoonIcon />}
                                </motion.span>
                            </AnimatePresence>
                        </button>

                        {/* Language Switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 text-xs font-bold"
                            >
                                <span>{currentLang.flag}</span>
                                <span>{currentLang.label}</span>
                                <motion.svg
                                    animate={{ rotate: langOpen ? 180 : 0 }}
                                    className="w-3 h-3 opacity-60"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </motion.svg>
                            </button>

                            <AnimatePresence>
                                {langOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full mt-2 right-0 w-36 bg-harbor-950/95 dark:bg-black/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                                    >
                                        {LANGUAGES.map((l) => (
                                            <button
                                                key={l.code}
                                                onClick={() => { setLocale(l.code); setLangOpen(false); }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-all ${
                                                    locale === l.code
                                                        ? 'bg-white/10 text-white'
                                                        : 'text-white/40 hover:bg-white/5 hover:text-white/80'
                                                }`}
                                            >
                                                <span className="text-base">{l.flag}</span>
                                                <span>{l.name}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* CTA Buttons */}
                        <Link
                            href="/login"
                            className="px-5 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                        >
                            {t('nav.signIn')}
                        </Link>
                        <Link
                            href="/register-account"
                            className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan text-white hover:shadow-glass transition-all duration-300 hover:-translate-y-0.5"
                        >
                            {t('nav.openAccount')}
                        </Link>
                    </div>

                    {/* Mobile: theme + burger */}
                    <div className="lg:hidden flex items-center gap-2">
                        <button
                            onClick={toggleDark}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white/70 hover:text-white transition-all"
                        >
                            {isDark ? <SunIcon /> : <MoonIcon />}
                        </button>
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="w-10 h-10 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
                            aria-label="Toggle navigation"
                        >
                            <div className="w-5 h-4 relative flex flex-col justify-between">
                                <motion.span animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} className="block w-full h-0.5 bg-current rounded-full origin-center" />
                                <motion.span animate={mobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }} className="block w-full h-0.5 bg-current rounded-full" />
                                <motion.span animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className="block w-full h-0.5 bg-current rounded-full origin-center" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="lg:hidden overflow-hidden backdrop-blur-heavy bg-harbor-950/95 dark:bg-black/95 border-t border-white/[0.06]"
                    >
                        <div className="px-6 py-4 space-y-1">
                            {links.map((link, i) => {
                                const isHash = link.href.startsWith('#');
                                const href = isHash ? `/${link.href}` : link.href;
                                const Tag = isHash ? 'a' : Link;

                                return (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                    >
                                        <Tag
                                            href={href}
                                            className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                                url === href ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            {link.label}
                                        </Tag>
                                    </motion.div>
                                );
                            })}

                            {/* Mobile Language Switcher */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: links.length * 0.08 }}
                                className="pt-3 border-t border-white/[0.06]"
                            >
                                <p className="px-4 text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">Language</p>
                                <div className="flex gap-2 px-4">
                                    {LANGUAGES.map((l) => (
                                        <button
                                            key={l.code}
                                            onClick={() => setLocale(l.code)}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                                locale === l.code ? 'bg-white/15 text-white' : 'text-white/30 hover:text-white/60'
                                            }`}
                                        >
                                            <span>{l.flag}</span>
                                            <span>{l.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (links.length + 1) * 0.08 }}
                                className="pt-3"
                            >
                                <Link
                                    href="/register-account"
                                    className="block w-full text-center px-5 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan text-white"
                                >
                                    {t('nav.openAccount')}
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
