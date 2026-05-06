const services = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
        ),
        title: 'Everyday Checking',
        description: 'Zero monthly fees, free ATM access worldwide, and instant purchase notifications. Banking simplified.',
        color: 'bg-blue-50 text-blue-600',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: 'Savings & Investments',
        description: 'Earn up to 4.25% APY with our high-yield savings. Automatic round-ups and smart saving goals.',
        color: 'bg-emerald-50 text-emerald-600',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
            </svg>
        ),
        title: 'Loans & Mortgages',
        description: 'Competitive rates from 3.5% APR. Pre-qualify in minutes with no impact to your credit score.',
        color: 'bg-amber-50 text-amber-600',
    },
];

export default function Services() {
    return (
        <section id="services" className="py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-harbor-100 rounded-full text-xs font-semibold text-harbor-600 mb-4">
                        Our Services
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-harbor-950 tracking-tight mb-4">
                        Everything you need,
                        <span className="text-harbor-400"> all in one place</span>
                    </h2>
                    <p className="text-harbor-500 leading-relaxed">
                        From everyday spending to long-term investments, we have the tools to help you reach your financial goals.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <div
                            key={service.title}
                            id={`service-card-${index}`}
                            className="card group cursor-pointer"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${service.color} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                                {service.icon}
                            </div>
                            <h3 className="text-lg font-bold text-harbor-950 mb-2">
                                {service.title}
                            </h3>
                            <p className="text-sm text-harbor-500 leading-relaxed mb-5">
                                {service.description}
                            </p>
                            <a
                                href="#"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-harbor-950 transition-all duration-200 group-hover:gap-3"
                            >
                                Learn More
                                <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
