import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import Magnetic from './Animations/Magnetic';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Products', href: '#services' },
        { label: 'Investment', href: '#services' },
        { label: 'Security', href: '#trust' },
        { label: 'News', href: '#promotions' },
    ];

    return (
        <nav
            id="navbar"
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl transition-all duration-500 ease-in-out px-4 py-2 ${
                scrolled
                    ? 'bg-white/70 backdrop-blur-xl border border-gray-200 shadow-glass rounded-3xl'
                    : 'bg-transparent rounded-none'
            }`}
        >
            <div className="mx-auto flex items-center justify-between">
                {/* Logo */}
                <a href="/" className="flex items-center gap-3 group px-2 py-1">
                    <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a3 3 0 00-3 3c0 1.66 1.34 3 3 3s3-1.34 3-3a3 3 0 00-3-3zm0 8v12m0 0c-4-1-7-4-7-8h3m4 8c4-1 7-4 7-8h-3" />
                        </svg>
                    </div>
                    <span className="text-xl font-black text-black tracking-tight">
                        HarborBank
                    </span>
                </a>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center bg-gray-100/50 rounded-2xl p-1 border border-gray-200/20">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="px-5 py-2 text-sm font-bold text-gray-600 rounded-xl transition-all duration-300 hover:text-black hover:bg-white"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    <Magnetic>
                        <Link
                            href="/login"
                            className="hidden sm:inline-flex px-6 py-2.5 text-sm font-bold text-black hover:text-gray-700 transition-colors"
                        >
                            Log In
                        </Link>
                    </Magnetic>
                    <Magnetic>
                        <Link
                            href="/register-account"
                            className="btn-primary !py-2.5 !px-7 !text-xs !rounded-2xl !bg-black"
                        >
                            Sign Up
                        </Link>
                    </Magnetic>

                    {/* Burger */}
                    <button
                        id="mobile-menu-toggle"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100/50 hover:bg-white transition-colors"
                        aria-label="Toggle menu"
                    >
                        <div className="w-5 flex flex-col gap-1.5">
                            <span className={`block h-0.5 bg-black rounded-full transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`block h-0.5 bg-black rounded-full transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                            <span className={`block h-0.5 bg-black rounded-full transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`lg:hidden fixed inset-0 top-0 left-0 right-0 h-screen bg-white z-40 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    mobileOpen
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-full pointer-events-none'
                }`}
            >
                <div className="flex flex-col h-full pt-28 px-10">
                    <div className="flex flex-col gap-1">
                        {navLinks.map((link, i) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="px-6 py-6 text-3xl font-black text-black rounded-3xl transition-all hover:bg-gray-50 hover:translate-x-2"
                                style={{ transitionDelay: `${i * 50}ms` }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                    <div className="mt-auto pb-12 flex flex-col gap-4">
                        <Link href="/register-account" className="btn-primary w-full py-5 text-lg !bg-black">Create Free Account</Link>
                        <Link href="/login" className="btn-secondary w-full py-5 text-lg">Login to Portal</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
