export default function Trust() {
    const badges = [
        { name: 'FDIC', label: 'FDIC Insured' },
        { name: 'SSL', label: '256-bit SSL' },
        { name: 'SOC2', label: 'SOC 2 Certified' },
        { name: 'PCI', label: 'PCI DSS' },
    ];

    return (
        <section id="trust" className="py-16 lg:py-20 border-y border-harbor-100">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                    <div className="flex items-center gap-6 sm:gap-8 flex-shrink-0">
                        {badges.map((badge) => (
                            <div key={badge.name} className="flex flex-col items-center gap-1.5 group">
                                <div className="w-14 h-14 rounded-2xl bg-white border border-harbor-200 flex items-center justify-center transition-all duration-300 group-hover:shadow-card group-hover:border-harbor-300">
                                    <span className="text-xs font-extrabold text-harbor-600 tracking-tighter">{badge.name}</span>
                                </div>
                                <span className="text-[10px] font-medium text-harbor-400 text-center">{badge.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="hidden lg:block w-px h-16 bg-harbor-200" />
                    <div className="text-center lg:text-left">
                        <p className="text-xl sm:text-2xl font-bold text-harbor-950 leading-snug mb-2">
                            Trusted by over <span className="text-emerald-600">600,000</span> customers nationwide
                        </p>
                        <p className="text-sm text-harbor-500 max-w-lg">
                            With over $12 billion in assets under management, HarborBank has been a pillar of financial security and innovation for more than 25 years.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
