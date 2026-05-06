import { motion } from 'framer-motion';
import { ArrowRight, Bell } from 'lucide-react';
import Magnetic from './Animations/Magnetic';

const promotions = [
    {
        tag: 'New Offer',
        title: 'Spring Savings Boost',
        description: 'Get a 5.00% APY for the first 6 months when you open a new savings account.',
        cta: 'Claim Offer',
        bg: 'bg-white',
    },
    {
        tag: 'Investment',
        title: 'Zero-Fee Trading',
        description: 'Enjoy $0 commissions on all stock and ETF trades through the end of the year.',
        cta: 'Start Trading',
        bg: 'bg-brand-50',
    },
    {
        tag: 'Security',
        title: 'KYC Verification',
        description: 'Complete your identity verification today and unlock higher transfer limits.',
        cta: 'Verify Now',
        bg: 'bg-brand-100',
    },
];

export default function Promotions() {
    return (
        <section id="promotions" className="py-24 lg:py-32 bg-brand-50/50">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-950 rounded-full text-[10px] font-black text-white uppercase tracking-widest mb-6">
                            <Bell className="w-3.5 h-3.5" />
                            Don't miss out
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black text-brand-950 tracking-tight leading-[1.1]">
                            Exclusive opportunities <br />
                            <span className="opacity-50">for our community</span>
                        </h2>
                    </motion.div>
                    <Magnetic>
                        <a href="#" className="hidden sm:inline-flex items-center gap-2 text-sm font-black text-brand-950 hover:underline transition-all group">
                            See All Updates
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </Magnetic>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {promotions.map((promo, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-8 rounded-[2.5rem] ${promo.bg} border border-brand-200 relative overflow-hidden group shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                        >
                            <span className="inline-block px-3 py-1 bg-brand-950 rounded-full text-[10px] font-black text-white uppercase tracking-tighter mb-6 shadow-sm">
                                {promo.tag}
                            </span>
                            
                            <h3 className="text-2xl font-black text-brand-950 mb-4 tracking-tight leading-snug">
                                {promo.title}
                            </h3>
                            <p className="text-brand-600 text-sm font-medium leading-relaxed mb-10">
                                {promo.description}
                            </p>
                            
                            <Magnetic>
                                <a href="#" className="inline-flex items-center gap-2 text-sm font-black text-brand-950 group-hover:gap-4 transition-all">
                                    {promo.cta}
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                            </Magnetic>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
