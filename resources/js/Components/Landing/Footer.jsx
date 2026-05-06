import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
    banking: {
        title: 'Banking',
        links: ['Premium Checking', 'Smart Savings', 'Business Suite', 'Private Wealth'],
    },
    company: {
        title: 'Company',
        links: ['About Us', 'Global Impact', 'Careers', 'Security'],
    },
    legal: {
        title: 'Legal',
        links: ['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Licenses'],
    },
};

export default function Footer() {
    const [email, setEmail] = useState('');

    return (
        <footer id="footer" className="bg-black text-white pt-24 pb-12 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-10">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 mb-20">
                    {/* Brand & Newsletter */}
                    <div className="lg:col-span-5">
                        <a href="/" className="flex items-center gap-3 mb-8 group">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a3 3 0 00-3 3c0 1.66 1.34 3 3 3s3-1.34 3-3a3 3 0 00-3-3zm0 8v12m0 0c-4-1-7-4-7-8h3m4 8c4-1 7-4 7-8h-3" />
                                </svg>
                            </div>
                            <span className="text-2xl font-black tracking-tight">HarborBank</span>
                        </a>
                        
                        <h4 className="text-xl font-bold mb-6 tracking-tight">Join the financial revolution.</h4>
                        
                        <div className="flex gap-2 max-w-md p-1.5 bg-white/5 border border-white/10 rounded-2xl focus-within:border-white/30 transition-all duration-300">
                            <input
                                id="newsletter-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your work email"
                                className="flex-1 px-4 py-3 bg-transparent border-none rounded-xl text-sm text-white placeholder-gray-500 focus:ring-0"
                            />
                            <button
                                id="newsletter-subscribe"
                                className="px-6 py-3 bg-white text-black font-black text-sm rounded-xl transition-all duration-300 hover:bg-gray-200"
                            >
                                Subscribe
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-4 px-2">
                            By subscribing, you agree to our Privacy Policy and Terms of Service.
                        </p>
                    </div>

                    {/* Nav Links */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
                        {Object.values(footerLinks).map((column) => (
                            <div key={column.title}>
                                <h5 className="text-xs font-black text-brand-500 uppercase tracking-widest mb-6">{column.title}</h5>
                                <ul className="space-y-4">
                                    {column.links.map((link) => (
                                        <li key={link}>
                                            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 font-medium">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Info Row */}
                <div className="grid md:grid-cols-3 gap-8 py-10 border-y border-white/5 mb-10">
                    <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-500 group-hover:bg-brand-600 group-hover:text-white transition-all">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest leading-none mb-1">Email us</p>
                            <p className="text-sm font-bold">hello@harborbank.io</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-500 group-hover:bg-brand-600 group-hover:text-white transition-all">
                            <Phone className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest leading-none mb-1">Call us</p>
                            <p className="text-sm font-bold">+1 (800) 555-0100</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-500 group-hover:bg-brand-600 group-hover:text-white transition-all">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest leading-none mb-1">Visit us</p>
                            <p className="text-sm font-bold">Financial District, NY</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
                    <div className="flex items-center gap-4">
                        {[
                            { name: 'Twitter', path: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' },
                            { name: 'Linkedin', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z' },
                            { name: 'Instagram', path: 'M17 2H7C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5zm-5 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm5-8a1 1 0 110-2 1 1 0 010 2z' },
                            { name: 'Github', path: 'M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5V19c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.08.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .83-.27 2.75 1.02a9.58 9.58 0 015 0c1.92-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.68 0 3.82-2.34 4.66-4.57 4.91.36.31.68.92.68 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z' }
                        ].map((social, i) => (
                            <a key={i} href="#" aria-label={social.name} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-600 hover:text-white hover:-translate-y-1 transition-all duration-300">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d={social.path} />
                                    {social.name === 'Instagram' && <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />}
                                    {social.name === 'Instagram' && <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />}
                                    {social.name === 'Instagram' && <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />}
                                </svg>
                            </a>
                        ))}
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 font-medium">
                        <span>© 2026 HarborBank. Redefining Finance.</span>
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
