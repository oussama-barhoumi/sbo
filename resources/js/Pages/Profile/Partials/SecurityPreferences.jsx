import { useState } from 'react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { ShieldCheck, Smartphone, Globe, Lock, Shield } from 'lucide-react';
import Magnetic from '@/Components/Landing/Animations/Magnetic';

export default function SecurityPreferences({ className = '' }) {
    const { t } = useLaravelReactI18n();
    const [prefs, setPrefs] = useState({
        mfa: true,
        geo_lock: false,
        tx_limit: true,
        email_alerts: true
    });

    const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));

    const Item = ({ icon: Icon, title, desc, active, onToggle }) => (
        <div className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 transition-all hover:border-accent-blue/30 group">
            <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    active ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20' : 'bg-white dark:bg-white/5 text-gray-400 dark:text-white/10 border border-gray-100 dark:border-white/10'
                }`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-sm font-black uppercase tracking-tighter text-black dark:text-white mb-1">{title}</h4>
                    <p className="text-[10px] font-medium text-gray-400 dark:text-white/20 uppercase tracking-widest">{desc}</p>
                </div>
            </div>
            <button 
                onClick={onToggle}
                className={`w-14 h-8 rounded-full transition-all relative ${
                    active ? 'bg-accent-blue' : 'bg-gray-200 dark:bg-white/10'
                }`}
            >
                <div className={`absolute top-1 w-6 h-6 rounded-full transition-all ${
                    active ? 'right-1 bg-white' : 'left-1 bg-white dark:bg-gray-400'
                }`} />
            </button>
        </div>
    );

    return (
        <div className={`space-y-4 ${className}`}>
            <Item 
                icon={Smartphone}
                title="2FA Authentication"
                desc="Secure your account with MFA"
                active={prefs.mfa}
                onToggle={() => toggle('mfa')}
            />
            <Item 
                icon={Globe}
                title="Geo-IP Lockdown"
                desc="Restrict access by region"
                active={prefs.geo_lock}
                onToggle={() => toggle('geo_lock')}
            />
            <Item 
                icon={Shield}
                title="Transaction Guard"
                desc="Verify high-value transfers"
                active={prefs.tx_limit}
                onToggle={() => toggle('tx_limit')}
            />
            <Item 
                icon={ShieldCheck}
                title="Protocol Alerts"
                desc="Real-time security notifications"
                active={prefs.email_alerts}
                onToggle={() => toggle('email_alerts')}
            />
            
            <div className="pt-6">
                <Magnetic>
                    <button className="w-full bg-accent-blue text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-[1.01] active:scale-[0.98] transition-all shadow-xl shadow-accent-blue/20">
                        Save Security Protocols
                    </button>
                </Magnetic>
            </div>
        </div>
    );
}
