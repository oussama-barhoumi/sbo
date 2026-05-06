import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { CreditCard, TrendingUp, Landmark, ShieldCheck, Zap, Globe } from 'lucide-react';
import Magnetic from './Animations/Magnetic';

const services = [
    {
        icon: <CreditCard className="w-7 h-7" />,
        title: 'Smart Checking',
        description: 'Zero monthly fees, instant rewards, and a high-end metal card delivered to your door.',
        color: 'text-brand-950',
        bg: 'bg-brand-50',
    },
    {
        icon: <TrendingUp className="w-7 h-7" />,
        title: 'High-Yield Growth',
        description: 'Earn 4.5% APY on your savings. Watch your wealth grow with automated investment tools.',
        color: 'text-brand-950',
        bg: 'bg-brand-100',
    },
    {
        icon: <Globe className="w-7 h-7" />,
        title: 'Global Transfers',
        description: 'Send money to 180+ countries instantly with zero markups on exchange rates.',
        color: 'text-brand-950',
        bg: 'bg-brand-50',
    },
    {
        icon: <Landmark className="w-7 h-7" />,
        title: 'Premium Wealth',
        description: 'Exclusive access to private equity, real estate funds, and dedicated wealth advisors.',
        color: 'text-brand-950',
        bg: 'bg-brand-100',
    },
    {
        icon: <ShieldCheck className="w-7 h-7" />,
        title: 'Crypto Banking',
        description: 'Buy, sell, and store digital assets with institutional-grade security and zero spread.',
        color: 'text-brand-950',
        bg: 'bg-brand-50',
    },
    {
        icon: <Zap className="w-7 h-7" />,
        title: 'Instant Credit',
        description: 'Unlock lines of credit up to $50k in seconds based on your cash flow, not just credit score.',
        color: 'text-brand-950',
        bg: 'bg-brand-100',
    },
];

export default function Services() {
    const containerVars = {
        initial: {},
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVars = {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <section id="services" className="py-24 lg:py-32 relative overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-brand-50 border border-brand-100 rounded-full text-[10px] font-black text-brand-950 uppercase tracking-[0.2em] mb-6"
                    >
                        Limitless Features
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl sm:text-6xl font-black text-brand-950 tracking-tight mb-6 leading-[1.1]"
                    >
                        Financial tools for <br />
                        <span className="italic">the next generation</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-brand-500 text-lg font-medium leading-relaxed"
                    >
                        Say goodbye to traditional banking limits. We've built a ecosystem 
                        that empowers you to spend, save, and invest anywhere on Earth.
                    </motion.p>
                </div>

                {/* Services Grid */}
                <motion.div 
                    variants={containerVars}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            variants={cardVars}
                            className="glass-card group cursor-pointer p-8 rounded-[2.5rem] hover:bg-brand-950 hover:text-white"
                        >
                            <div className={`w-16 h-16 rounded-3xl ${service.bg} flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 shadow-sm`}>
                                <div className={`${service.color} group-hover:text-brand-950`}>
                                    {service.icon}
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-black mb-3 tracking-tight">
                                {service.title}
                            </h3>
                            <p className="text-sm leading-relaxed mb-8 font-medium opacity-70">
                                {service.description}
                            </p>
                            
                            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest transition-all duration-300 group-hover:gap-4">
                                Learn More
                                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 p-10 lg:p-12 bg-brand-950 text-white rounded-[3rem] relative overflow-hidden group"
                >
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="text-center lg:text-left">
                            <h3 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">Ready to transcend traditional banking?</h3>
                            <p className="text-brand-300 font-medium">Join 2 million+ users redefining their financial future today.</p>
                        </div>
                        <Magnetic>
                            <Link href="/register-account" className="px-10 py-5 bg-white text-brand-950 font-black rounded-3xl transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap">
                                Get Started Now
                            </Link>
                        </Magnetic>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
