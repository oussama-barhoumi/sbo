import { useEffect, useRef } from 'react';

/**
 * AnimatedCounter — Smoothly animates a number from 0 to its target value.
 *
 * Props:
 *   - value: target number
 *   - duration: animation duration in seconds (default: 1.5)
 *   - prefix: string before the number (e.g. '$')
 *   - suffix: string after the number (e.g. '%')
 *   - decimals: number of decimal places (default: 0)
 *   - className: additional classes
 *   - formatOptions: Intl.NumberFormat options
 */
export default function AnimatedCounter({
    value = 0,
    duration = 1.5,
    prefix = '',
    suffix = '',
    decimals = 0,
    className = '',
    formatOptions,
}) {
    const nodeRef = useRef(null);
    const prevValue = useRef(0);

    useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;

        const from = prevValue.current;
        const to = typeof value === 'number' ? value : parseFloat(value) || 0;
        prevValue.current = to;

        const startTime = performance.now();
        const durationMs = duration * 1000;

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / durationMs, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = from + (to - from) * eased;

            let formatted;
            if (formatOptions) {
                formatted = new Intl.NumberFormat('en-US', formatOptions).format(current);
            } else {
                formatted = current.toLocaleString('en-US', {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                });
            }

            node.textContent = `${prefix}${formatted}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }, [value, duration, prefix, suffix, decimals, formatOptions]);

    const initial = formatOptions
        ? new Intl.NumberFormat('en-US', formatOptions).format(0)
        : (0).toLocaleString('en-US', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
          });

    return (
        <span ref={nodeRef} className={className}>
            {prefix}{initial}{suffix}
        </span>
    );
}
