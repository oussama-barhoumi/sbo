export default function Hero() {
    return (
        <section id="hero" className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Column */}
                    <div className="order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-harbor-100 rounded-full text-xs font-semibold text-harbor-600 mb-6">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            FDIC Insured · Trusted since 1998
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-harbor-950 leading-[1.08] tracking-tight mb-6">
                            Banking that
                            <span className="block text-harbor-500">moves with you</span>
                        </h1>

                        <p className="text-base lg:text-lg text-harbor-500 leading-relaxed max-w-lg mb-8">
                            Open an account in minutes. Enjoy zero-fee checking, high-yield savings,
                            and seamless transfers — all from your phone or computer.
                        </p>

                        <div className="flex flex-wrap gap-3 mb-12">
                            <a href="/register-account" className="btn-primary">
                                Open an Account
                                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </a>
                            <a href="#" className="btn-secondary">
                                View Rates
                            </a>
                        </div>

                        {/* Feature Cards */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="card !p-4 flex items-start gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-harbor-950 mb-0.5">Quick Start</h3>
                                    <p className="text-xs text-harbor-400 leading-relaxed">Open your account in under 5 minutes with just your ID.</p>
                                </div>
                            </div>

                            <div className="card !p-4 flex items-start gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-harbor-950 mb-0.5">Secure & Insured</h3>
                                    <p className="text-xs text-harbor-400 leading-relaxed">256-bit encryption. Deposits insured up to $250,000.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="order-1 lg:order-2 relative">
                        {/* Hero Image */}
                        <div className="relative rounded-3xl overflow-hidden shadow-float aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5]">
                            <img
                                src="/images/hero-building.png"
                                alt="Modern HarborBank headquarters"
                                className="w-full h-full object-cover"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-harbor-950/30 via-transparent to-transparent" />
                        </div>

                        {/* Floating Account Card */}
                        <div className="absolute -bottom-4 -left-4 sm:bottom-8 sm:-left-8 bg-white rounded-2xl p-5 shadow-float w-64 sm:w-72 border border-harbor-100/50">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold text-harbor-400 uppercase tracking-wider">Checking Account</span>
                                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                            </div>
                            <p className="text-2xl font-extrabold text-harbor-950 mb-1">$24,512.80</p>
                            <p className="text-xs text-harbor-400 mb-3">Last updated just now</p>
                            <div className="flex items-center justify-between pt-3 border-t border-harbor-100">
                                <span className="text-xs text-harbor-500 font-mono tracking-wide">•••• •••• •••• 4821</span>
                                <svg className="w-4 h-4 text-harbor-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Small floating badge */}
                        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-white/90 backdrop-blur-sm rounded-xl px-3.5 py-2 shadow-card flex items-center gap-2">
                            <span className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                                </svg>
                            </span>
                            <div>
                                <p className="text-[10px] text-harbor-400 leading-none">APY</p>
                                <p className="text-sm font-bold text-harbor-950 leading-tight">4.25%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
