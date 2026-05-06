const promotions = [
    {
        date: 'May 1, 2026',
        title: 'Spring Into Savings',
        description: 'Lock in a 4.25% APY on our high-yield savings account. Limited-time offer for new customers.',
    },
    {
        date: 'April 20, 2026',
        title: 'Zero-Fee International Transfers',
        description: 'Send money abroad with zero fees and real exchange rates through the end of June.',
    },
    {
        date: 'April 10, 2026',
        title: 'Refer a Friend, Get $100',
        description: 'Earn $100 for every friend who opens and funds a new HarborBank checking account.',
    },
    {
        date: 'March 28, 2026',
        title: 'Home Loan Rates Drop to 3.5%',
        description: 'Our lowest mortgage rate in 3 years. Pre-qualify today with no credit impact.',
    },
];

export default function Promotions() {
    return (
        <section id="promotions" className="py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
                    <div>
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-harbor-100 rounded-full text-xs font-semibold text-harbor-600 mb-4">
                            Latest News
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-harbor-950 tracking-tight">
                            Promotions & Updates
                        </h2>
                    </div>
                    <a href="#" className="text-sm font-semibold text-harbor-950 flex items-center gap-1.5 hover:gap-3 transition-all duration-200">
                        View All
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </a>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {promotions.map((promo, i) => (
                        <div key={i} id={`promo-card-${i}`} className="card group cursor-pointer">
                            <p className="text-xs font-medium text-harbor-400 mb-3">{promo.date}</p>
                            <h3 className="text-base font-bold text-harbor-950 mb-2 group-hover:text-harbor-700 transition-colors">
                                {promo.title}
                            </h3>
                            <p className="text-sm text-harbor-500 leading-relaxed">{promo.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
