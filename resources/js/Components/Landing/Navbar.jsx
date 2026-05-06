import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const navLinks = [
        { label: 'Personal Banking', href: '#services' },
        { label: 'Business Banking', href: '#services' },
        { label: 'Support & Resources', href: '#promotions' },
    ];

    return (
        <nav
            id="navbar"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/90 backdrop-blur-xl shadow-card py-3'
                    : 'bg-transparent py-5'
            }`}
        >
            <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
                {/* Left: Logo + Phone */}
                <div className="flex items-center gap-4">
                    <a href="/" className="flex items-center gap-2.5 group">
                        {/* Anchor icon */}
                        <div className="w-9 h-9 bg-harbor-950 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a3 3 0 00-3 3c0 1.66 1.34 3 3 3s3-1.34 3-3a3 3 0 00-3-3zm0 8v12m0 0c-4-1-7-4-7-8h3m4 8c4-1 7-4 7-8h-3" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold text-harbor-950 tracking-tight">
                            HarborBank
                        </span>
                    </a>
                    <span className="hidden lg:block text-xs text-harbor-400 border-l border-harbor-200 pl-4 ml-1">
                        +1 (800) 555-0199
                    </span>
                </div>

                {/* Center: Nav Links (desktop) */}
                <div className="hidden lg:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="px-4 py-2 text-sm font-medium text-harbor-600 rounded-full transition-all duration-200 hover:text-harbor-950 hover:bg-harbor-100"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Right: CTA (desktop) + Burger (mobile) */}
                <div className="flex items-center gap-3">
                    <a
                        href="#"
                        className="hidden lg:inline-flex btn-primary !py-2.5 !px-6 text-sm"
                    >
                        Login
                    </a>

                    {/* Burger */}
                    <button
                        id="mobile-menu-toggle"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-harbor-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <div className="w-5 flex flex-col gap-1.5">
                            <span className={`block h-0.5 bg-harbor-950 rounded-full transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`block h-0.5 bg-harbor-950 rounded-full transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                            <span className={`block h-0.5 bg-harbor-950 rounded-full transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`lg:hidden fixed inset-0 top-0 bg-white z-40 transition-all duration-400 ease-out ${
                    mobileOpen
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-full pointer-events-none'
                }`}
            >
                <div className="flex flex-col h-full pt-24 px-8 pb-8">
                    <div className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="px-4 py-4 text-lg font-semibold text-harbor-950 rounded-2xl transition-colors hover:bg-harbor-50"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                    <div className="mt-auto flex flex-col gap-3">
                        <a href="#" className="btn-primary text-center">Login</a>
                        <a href="#" className="btn-secondary text-center">Open an Account</a>
                    </div>
                    <p className="text-center text-xs text-harbor-400 mt-6">
                        +1 (800) 555-0199
                    </p>
                </div>
            </div>
        </nav>
    );
}
