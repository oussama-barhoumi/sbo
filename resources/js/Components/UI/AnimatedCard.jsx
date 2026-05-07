import { motion } from 'framer-motion';

/**
 * AnimatedCard — A premium card with hover tilt/scale and glow effects.
 *
 * Props:
 *   - children: React children
 *   - className: additional classes
 *   - delay: entrance animation delay (seconds)
 *   - glowColor: 'blue' | 'emerald' | 'violet' | 'amber' (optional glow on hover)
 *   - onClick: click handler
 */
const glowMap = {
    blue: 'hover:shadow-glow-blue',
    emerald: 'hover:shadow-glow-emerald',
    violet: 'hover:shadow-glow-violet',
    amber: 'hover:shadow-glow-amber',
};

export default function AnimatedCard({
    children,
    className = '',
    delay = 0,
    glowColor,
    onClick,
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={onClick ? { scale: 0.98 } : undefined}
            onClick={onClick}
            className={`
                bg-white rounded-2xl p-6 shadow-card
                border border-harbor-100
                transition-shadow duration-300 ease-out
                ${glowColor ? glowMap[glowColor] : 'hover:shadow-card-hover'}
                ${onClick ? 'cursor-pointer' : ''}
                ${className}
            `}
        >
            {children}
        </motion.div>
    );
}
