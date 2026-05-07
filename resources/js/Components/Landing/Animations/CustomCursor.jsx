import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useApp } from '@/hooks/useApp';

export default function CustomCursor() {
    const { isDark } = useApp();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const cursorSize = isHovering ? 80 : 20;

    const springConfig = { damping: 25, stiffness: 200, restDelta: 0.001 };
    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);

    useEffect(() => {
        const mouseMove = (e) => {
            x.set(e.clientX - cursorSize / 2);
            y.set(e.clientY - cursorSize / 2);
        };

        const handleHover = (e) => {
            const target = e.target;
            const isHoverable = target.closest('a, button, .hover-trigger');
            setIsHovering(!!isHoverable);
        };

        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseover', handleHover);

        return () => {
            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('mouseover', handleHover);
        };
    }, [x, y, cursorSize]);

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block"
            style={{
                x,
                y,
                width: cursorSize,
                height: cursorSize,
                borderRadius: '50%',
                backgroundColor: isHovering ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)') : (isDark ? 'white' : 'black'),
                border: isHovering ? (isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)') : 'none',
                mixBlendMode: isHovering ? 'difference' : 'normal',
                transition: 'width 0.3s, height 0.3s, background-color 0.3s'
            }}
        />
    );
}
