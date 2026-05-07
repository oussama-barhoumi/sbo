import { motion, AnimatePresence } from 'framer-motion';

/**
 * PageTransition — Wraps Inertia pages with smooth enter/exit animations.
 *
 * Usage:
 *   <PageTransition keyProp={url}>
 *     <YourPageContent />
 *   </PageTransition>
 *
 * Props:
 *   - children: page content
 *   - keyProp: unique key for the page (usually the URL)
 *   - variant: 'fade' | 'slideUp' | 'scale' (default: 'slideUp')
 */
const variants = {
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
    slideUp: {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
    },
    scale: {
        initial: { opacity: 0, scale: 0.97 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.97 },
    },
};

export default function PageTransition({
    children,
    keyProp,
    variant = 'slideUp',
}) {
    const v = variants[variant] || variants.slideUp;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={keyProp}
                initial={v.initial}
                animate={v.animate}
                exit={v.exit}
                transition={{
                    duration: 0.35,
                    ease: [0.25, 0.46, 0.45, 0.94],
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

/**
 * StaggerContainer — Animates children with staggered delays.
 */
export function StaggerContainer({
    children,
    className = '',
    staggerDelay = 0.08,
    delay = 0,
}) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        delayChildren: delay,
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * StaggerItem — Individual stagger child item.
 */
export function StaggerItem({ children, className = '' }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
