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
            },
            borderRadius: {
                '4xl': '2rem',
            },
            boxShadow: {
                'card': '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
                'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.1)',
                'float': '0 8px 40px rgba(0,0,0,0.12)',
            },
        },
    },

    plugins: [forms],
};
