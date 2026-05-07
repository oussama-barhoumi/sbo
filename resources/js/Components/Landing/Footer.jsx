import { useApp } from '@/hooks/useApp';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function Footer() {
    const { isDark } = useApp();
    const { t } = useLaravelReactI18n();

    const navLinks = [
        { label: t('footer.about'), href: '#' },
        { label: t('footer.products'), href: '#' },
        { label: t('footer.security'), href: '#' },
        { label: t('footer.terms'), href: '#' },
    ];

    return (
        <footer id="footer" className={`py-12 relative overflow-hidden border-t border-white/5 transition-colors duration-500 ${isDark ? 'bg-black text-white' : 'bg-black text-white'}`}>
            <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Brand */}
                    <a href="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a3 3 0 00-3 3c0 1.66 1.34 3 3 3s3-1.34 3-3a3 3 0 00-3-3zm0 8v12m0 0c-4-1-7-4-7-8h3m4 8c4-1 7-4 7-8h-3" />
                            </svg>
                        </div>
                        <span className="text-xl font-black tracking-tight">HarborBank</span>
                    </a>

                    {/* Nav Links */}
                    <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
                        {navLinks.map((link) => (
                            <a key={link.label} href={link.href} className="hover:text-white transition-colors">
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Socials */}
                    <div className="flex items-center gap-4">
                        {[
                            { name: 'Twitter', path: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' },
                            { name: 'Linkedin', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z' },
                            { name: 'Github', path: 'M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5V19c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.08.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .83-.27 2.75 1.02a9.58 9.58 0 015 0c1.92-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.68 0 3.82-2.34 4.66-4.57 4.91.36.31.68.92.68 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z' }
                        ].map((social, i) => (
                            <a key={i} href="#" aria-label={social.name} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d={social.path} />
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    <span>© 2026 HarborBank. {t('footer.rights')}</span>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
                        <a href="#" className="hover:text-white transition-colors">{t('footer.cookies')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
