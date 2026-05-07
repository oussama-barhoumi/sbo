import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { url } = usePage();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => { setMobileOpen(false); }, [url]);

    const links = [
        { href: '/', label: 'Home' },
        { href: '/register-account', label: 'Open Account' },
        { href: '/login', label: 'Sign In' },
    ];

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled
                    ? 'backdrop-blur-heavy bg-harbor-950/80 border-b border-white/[0.08] shadow-glass'
                    : 'bg-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16 lg:h-20">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/30 group-hover:shadow-glow-blue">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                            </svg>
                        </div>
                        <span className="font-bold text-lg text-white tracking-tight">HarborBank</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {links.map((link) => {
                            const isActive = url === link.href || (link.href !== '/' && url.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                                        isActive
                                            ? 'text-white'
                                            : 'text-white/50 hover:text-white/80'
                                    }`}
                                >
                                    {link.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Link
                            href="/login"
                            className="px-5 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register-account"
                            className="px-5 py-2.5 text-sm font-semibold rounded-xl
                                       bg-gradient-to-r from-accent-blue to-accent-cyan text-white
                                       hover:shadow-glow-blue transition-all duration-300 hover:-translate-y-0.5"
                        >
                            Open Account
                        </Link>
                    </div>

                    {/* Mobile burger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
                        aria-label="Toggle navigation"
                    >
                        <div className="w-5 h-4 relative flex flex-col justify-between">
                            <motion.span
                                animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                                className="block w-full h-0.5 bg-current rounded-full origin-center"
                            />
                            <motion.span
                                animate={mobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                                className="block w-full h-0.5 bg-current rounded-full"
                            />
                            <motion.span
                                animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                                className="block w-full h-0.5 bg-current rounded-full origin-center"
                            />
                        </div>
                    </button>
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
                        className="lg:hidden overflow-hidden backdrop-blur-heavy bg-harbor-950/95 border-t border-white/[0.06]"
                    >
                        <div className="px-6 py-4 space-y-1">
                            {links.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                >
                                    <Link
                                        href={link.href}
                                        className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                            url === link.href
                                                ? 'text-white bg-white/10'
                                                : 'text-white/50 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: links.length * 0.08 }}
                                className="pt-3"
                            >
                                <Link
                                    href="/register-account"
                                    className="block w-full text-center px-5 py-3 text-sm font-semibold rounded-xl
                                               bg-gradient-to-r from-accent-blue to-accent-cyan text-white"
                                >
                                    Open Account
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
