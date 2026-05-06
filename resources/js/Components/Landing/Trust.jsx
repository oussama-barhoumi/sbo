import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle, Award } from 'lucide-react';

export default function Trust() {
    const trustItems = [
        { icon: <Shield className="w-5 h-5" />, label: 'FDIC Insured', sub: 'Up to $250k' },
        { icon: <Lock className="w-5 h-5" />, label: 'SSL Encrypted', sub: '256-bit AES' },
        { icon: <Award className="w-5 h-5" />, label: 'SOC2 Type II', sub: 'Gold Standard' },
        { icon: <CheckCircle className="w-5 h-5" />, label: 'PCI Compliant', sub: 'Tier 1 Security' },
    ];

    return (
        <section id="trust" className="py-16 relative bg-brand-50/30">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Social Proof */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-center lg:text-left max-w-xl"
                    >
                        <h3 className="text-2xl sm:text-3xl font-black text-brand-950 mb-4 tracking-tight">
                            Institutional grade security <br />
                            <span className="text-brand-600">for your peace of mind</span>
                        </h3>
                        <p className="text-brand-500/80 font-medium leading-relaxed">
                            We use the same encryption standards as the world's largest financial 
                            institutions. Your data and assets are protected by multiple layers 
                            of advanced security.
                        </p>
                    </motion.div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
                        {trustItems.map((item, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card !bg-white/40 p-6 rounded-[2rem] flex flex-col items-center lg:items-start text-center lg:text-left hover:bg-white transition-colors duration-300"
                            >
                                <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 mb-4">
                                    {item.icon}
                                </div>
                                <p className="text-sm font-black text-brand-950 mb-1">{item.label}</p>
                                <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">{item.sub}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Logo Cloud Placeholder */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.3 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 pt-12 border-t border-brand-100/50 flex flex-wrap items-center justify-center gap-10 lg:gap-20 grayscale contrast-125"
                >
                    {['Forbes', 'TechCrunch', 'Bloomberg', 'Wired', 'The Verge'].map((logo) => (
                        <span key={logo} className="text-xl font-black tracking-tighter text-brand-950">{logo}</span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
