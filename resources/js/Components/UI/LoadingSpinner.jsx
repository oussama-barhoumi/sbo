import { motion } from 'framer-motion';

/**
 * LoadingSpinner — Premium animated loading spinner with brand styling.
 *
 * Props:
 *   - size: 'sm' | 'md' | 'lg' (default: 'md')
 *   - message: optional loading message
 *   - variant: 'dark' | 'light' (default: 'dark')
 *   - fullScreen: if true, centers in viewport
 */
const sizes = {
    sm: { spinner: 'w-6 h-6', border: 'border-2', text: 'text-xs' },
    md: { spinner: 'w-10 h-10', border: 'border-[3px]', text: 'text-sm' },
    lg: { spinner: 'w-14 h-14', border: 'border-4', text: 'text-base' },
};

export default function LoadingSpinner({
    size = 'md',
    message,
    variant = 'dark',
    fullScreen = false,
}) {
    const s = sizes[size] || sizes.md;
    const isDark = variant === 'dark';

    const content = (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
        >
            {/* Outer ring */}
            <div className="relative">
                <div
                    className={`
                        ${s.spinner} ${s.border} rounded-full animate-spin
                        ${isDark
                            ? 'border-harbor-200 border-t-harbor-950'
                            : 'border-white/20 border-t-white'
                        }
                    `}
                />
                {/* Inner pulse dot */}
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className={`
                        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-1.5 h-1.5 rounded-full
                        ${isDark ? 'bg-harbor-950' : 'bg-white'}
                    `}
                />
            </div>

            {message && (
                <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`
                        ${s.text} font-medium
                        ${isDark ? 'text-harbor-500' : 'text-white/70'}
                    `}
                >
                    {message}
                </motion.p>
            )}
        </motion.div>
    );

    if (fullScreen) {
        return (
            <div className={`
                min-h-screen flex items-center justify-center
                ${isDark ? 'bg-harbor-50' : 'bg-harbor-950'}
            `}>
                {content}
            </div>
        );
    }

    return content;
}

/**
 * SkeletonLoader — Shimmer loading placeholder.
 *
 * Props:
 *   - className: dimensions and shape (e.g. 'h-4 w-32 rounded-lg')
 *   - count: number of skeleton lines
 */
export function SkeletonLoader({ className = 'h-4 w-full rounded-lg', count = 1 }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`bg-harbor-200/60 animate-pulse ${className}`}
                    style={{ animationDelay: `${i * 100}ms` }}
                />
            ))}
        </div>
    );
}
