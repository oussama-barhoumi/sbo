import { useState } from 'react';
import { ShieldCheck, Smartphone, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SecurityPreferences({ className = '' }) {
    const [tfaEnabled, setTfaEnabled] = useState(false);

    return (
        <section className={className}>
            <div className="space-y-8">
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100 group hover:border-black transition-all">
                    <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${tfaEnabled ? 'bg-black text-white' : 'bg-white text-gray-400'}`}>
                            <Smartphone className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-black uppercase tracking-tighter">Two-Factor Authentication</p>
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Enhanced login security</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setTfaEnabled(!tfaEnabled)}
                        className={`w-14 h-8 rounded-full relative transition-all duration-500 ${tfaEnabled ? 'bg-black' : 'bg-gray-200'}`}
                    >
                        <motion.div 
                            animate={{ x: tfaEnabled ? 24 : 4 }}
                            className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg" 
                        />
                    </button>
                </div>

                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-black uppercase tracking-tighter">Transaction Guard</p>
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">OTP for transfers (Enabled)</p>
                        </div>
                    </div>
                    <div className="px-4 py-1 bg-black text-white text-[9px] font-black uppercase rounded-lg tracking-widest">Active</div>
                </div>

                <div className="p-6 bg-black text-white rounded-[2rem] shadow-2xl shadow-black/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="w-4 h-4 text-white" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Quantum Security</span>
                        </div>
                        <p className="text-xs font-medium leading-relaxed opacity-60">
                            Your account is protected by industry-leading end-to-end encryption and a unique hardware-bound identity protocol.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
