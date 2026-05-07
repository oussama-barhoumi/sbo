import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    darkMode: 'class',

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                harbor: {
                    50: '#f7f8fa',
                    100: '#eef0f4',
                    200: '#d5dae3',
                    300: '#b0b9c9',
                    400: '#8592aa',
                    500: '#66748f',
                    600: '#515d76',
                    700: '#434d61',
                    800: '#3a4252',
                    900: '#343a46',
                    950: '#1a1d24',
                },
                accent: {
                    blue: '#3b82f6',
                    cyan: '#06b6d4',
                    emerald: '#10b981',
                    violet: '#8b5cf6',
                    amber: '#f59e0b',
                    rose: '#f43f5e',
                },
            },
            borderRadius: {
                '3xl': '1.5rem',
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            boxShadow: {
                'card': '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
                'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.1)',
                'float': '0 8px 40px rgba(0,0,0,0.12)',
                'glass': '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
                'glass-hover': '0 16px 48px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.15)',
                'glow-blue': '0 0 20px rgba(59,130,246,0.3), 0 0 60px rgba(59,130,246,0.1)',
                'glow-emerald': '0 0 20px rgba(16,185,129,0.3), 0 0 60px rgba(16,185,129,0.1)',
                'glow-violet': '0 0 20px rgba(139,92,246,0.3), 0 0 60px rgba(139,92,246,0.1)',
                'glow-amber': '0 0 20px rgba(245,158,11,0.3), 0 0 60px rgba(245,158,11,0.1)',
                'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.05)',
            },
            backdropBlur: {
                'xs': '2px',
                'glass': '12px',
                'heavy': '24px',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                'slide-up': 'slide-up 0.5s ease-out',
                'slide-down': 'slide-down 0.5s ease-out',
                'fade-in': 'fade-in 0.5s ease-out',
                'scale-in': 'scale-in 0.3s ease-out',
                'shimmer': 'shimmer 2s linear infinite',
                'spin-slow': 'spin 3s linear infinite',
            },
            keyframes: {
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'glow-pulse': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.6' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'slide-down': {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'scale-in': {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
        },
    },

    plugins: [forms],
};
