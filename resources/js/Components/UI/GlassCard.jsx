import { motion } from 'framer-motion';

/**
 * GlassCard — A glassmorphism card with configurable blur, border, and glow.
 *
 * Props:
 *   - children: React children
 *   - className: additional classes
 *   - variant: 'dark' (default) | 'light'
 *   - delay: entrance animation delay
 *   - hover: enable hover effects (default: true)
 *   - glow: 'blue' | 'emerald' | 'violet' | 'amber' | null
 *   - padding: override padding (e.g. 'p-4', 'p-8')
 *   - onClick: click handler
 */
const variantClasses = {
    dark: 'bg-white/[0.07] border-white/[0.12] text-white',
    light: 'bg-white/60 border-white/80 text-harbor-950',
};

const glowHoverMap = {
    blue: 'hover:shadow-glow-blue',
    emerald: 'hover:shadow-glow-emerald',
    violet: 'hover:shadow-glow-violet',
    amber: 'hover:shadow-glow-amber',
};

export default function GlassCard({
    children,
    className = '',
    variant = 'dark',
    delay = 0,
    hover = true,
    glow,
    padding = 'p-6',
    onClick,
}) {
    const base = variantClasses[variant] || variantClasses.dark;
    const glowClass = glow ? glowHoverMap[glow] : '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={
                hover
                    ? { scale: 1.015, y: -2, transition: { duration: 0.2 } }
                    : undefined
            }
            whileTap={onClick ? { scale: 0.98 } : undefined}
            onClick={onClick}
            className={`
                rounded-2xl ${padding} backdrop-blur-glass border shadow-glass
                transition-all duration-300 ease-out
                ${base}
                ${hover ? 'hover:bg-white/[0.1] hover:border-white/[0.18] hover:shadow-glass-hover' : ''}
                ${glowClass}
                ${onClick ? 'cursor-pointer' : ''}
                ${className}
            `}
        >
            {children}
        </motion.div>
    );
}
