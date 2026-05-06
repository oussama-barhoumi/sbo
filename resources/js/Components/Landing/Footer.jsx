import { useState } from 'react';

const footerLinks = {
    personal: {
        title: 'Personal',
        links: ['Checking', 'Savings', 'Credit Cards', 'Personal Loans', 'Mobile App'],
    },
    business: {
        title: 'Business',
        links: ['Business Checking', 'Merchant Services', 'Business Loans', 'Payroll', 'Treasury'],
    },
    support: {
        title: 'Support',
        links: ['Help Center', 'Contact Us', 'Find a Branch', 'Security', 'Accessibility'],
    },
};

const socialIcons = [
    { name: 'Twitter', path: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' },
    { name: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
    { name: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
];

export default function Footer() {
    const [email, setEmail] = useState('');

    return (
        <footer id="footer" className="bg-harbor-950 text-white pt-16 pb-6">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                {/* Top Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-14">
                    {/* Bank Info */}
                    <div className="col-span-2 lg:col-span-2">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a3 3 0 00-3 3c0 1.66 1.34 3 3 3s3-1.34 3-3a3 3 0 00-3-3zm0 8v12m0 0c-4-1-7-4-7-8h3m4 8c4-1 7-4 7-8h-3" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold tracking-tight">HarborBank</span>
                        </div>
                        <p className="text-sm text-harbor-400 leading-relaxed mb-6 max-w-xs">
                            123 Financial District<br />
                            New York, NY 10004<br />
                            United States
                        </p>
                        {/* Newsletter */}
                        <div className="max-w-sm">
                            <p className="text-sm font-semibold mb-3">Stay up to date</p>
                            <div className="flex gap-2">
                                <input
                                    id="newsletter-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-harbor-500 focus:outline-none focus:border-white/30 transition-colors"
                                />
                                <button
                                    id="newsletter-subscribe"
                                    className="px-5 py-2.5 bg-white text-harbor-950 font-semibold text-sm rounded-xl transition-all duration-200 hover:bg-harbor-100 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.values(footerLinks).map((column) => (
                        <div key={column.title}>
                            <h4 className="text-sm font-semibold mb-4">{column.title}</h4>
                            <ul className="space-y-2.5">
                                {column.links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm text-harbor-400 hover:text-white transition-colors duration-200">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 pt-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-5">
                            {socialIcons.map((icon) => (
                                <a key={icon.name} href="#" aria-label={icon.name} className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5">
                                    <svg className="w-4 h-4 text-harbor-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d={icon.path} />
                                    </svg>
                                </a>
                            ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-harbor-500">
                            <span>© 2026 HarborBank. All rights reserved.</span>
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
