export default function Hero() {
    return (
        <section id="hero" className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden bg-white">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-200 rounded-full blur-[120px]" />
                <div className="absolute bottom-[0%] right-[-5%] w-[40%] h-[60%] bg-brand-100 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Left Content */}
                    <div className="order-2 lg:order-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-full text-[11px] font-bold text-brand-700 uppercase tracking-widest mb-8 shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                            </span>
                            The Future of Digital Banking
                        </div>

                        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-brand-950 leading-[0.95] tracking-tight mb-8">
                            Banking <br />
                            <span className="">
                                Simplified.
                            </span>
                        </h1>

                        <p className="text-lg lg:text-xl text-brand-600/80 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10 font-medium">
                            Experience a borderless financial world. Zero fees, 
                            instant global transfers, and high-yield growth — all in one 
                            stunning application.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-16">
                            <a href="/register-account" className="btn-primary w-full sm:w-auto shadow-2xl shadow-brand-500/30 group">
                                Start Your Journey
                                <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </a>
                            <a href="#" className="btn-secondary w-full sm:w-auto">
                                Explore Rates
                            </a>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                            <div>
                                <p className="text-2xl font-black text-brand-950">4.8/5</p>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-500">App Store</p>
                            </div>
                            <div className="w-px h-8 bg-brand-200 hidden sm:block" />
                            <div>
                                <p className="text-2xl font-black text-brand-950">2M+</p>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-500">Active Users</p>
                            </div>
                            <div className="w-px h-8 bg-brand-200 hidden sm:block" />
                            <div>
                                <p className="text-2xl font-black text-brand-950">$12B</p>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-500">Assets Managed</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual Element */}
                    <div className="order-1 lg:order-2 relative px-4 lg:px-0">
                        <div className="relative animate-float">
                            {/* Main Visual Image Container */}
                            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-brand-500/20 aspect-[4/5] sm:aspect-square lg:aspect-[4/5] border-[12px] border-white ring-1 ring-brand-100">
                                <img
                                    src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800"
                                    alt="Digital Experience"
                                    className="w-full h-full object-cover scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 via-transparent to-transparent" />
                            </div>

                            {/* Floating Card 1: Balance */}
                            <div className="absolute -bottom-10 -left-6 sm:bottom-12 sm:-left-12 glass-card rounded-3xl p-6 w-64 sm:w-72 animate-float shadow-2xl" style={{ animationDelay: '-2s' }}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.82v-1.91c-1.64-.17-3.09-.94-4.14-2.1l1.55-1.55c.78.89 1.83 1.45 2.59 1.61v-3.76c-1.93-.41-3.66-1.12-3.66-3.41 0-1.8 1.41-3.09 3.12-3.41V4h2.82v1.91c1.39.14 2.56.76 3.41 1.63l-1.55 1.55c-.56-.56-1.29-.91-1.86-1.02v3.52c1.93.47 3.66 1.25 3.66 3.53 0 1.94-1.42 3.32-3.41 3.53z" />
                                        </svg>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-400">Personal Balance</span>
                                </div>
                                <p className="text-3xl font-black text-brand-950 mb-1">$48,250.00</p>
                                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                                    </svg>
                                    +12.5% monthly
                                </div>
                            </div>

                            {/* Floating Card 2: Security */}
                            <div className="absolute top-10 -right-4 sm:top-20 sm:-right-8 glass-card rounded-2xl px-5 py-4 flex items-center gap-4 shadow-xl border-l-4 border-l-accent animate-float" style={{ animationDelay: '-4s' }}>
                                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-brand-400 tracking-wider">Level 3 Security</p>
                                    <p className="text-xs font-bold text-brand-950">Active Protection</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
