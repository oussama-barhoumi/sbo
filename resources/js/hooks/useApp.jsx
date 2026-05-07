import { createContext, useContext, useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

const AppContext = createContext(null);

const SUPPORTED_LOCALES = ['en', 'fr', 'ar'];

export function AppProvider({ children }) {
    // ── Dark Mode ──────────────────────────────────────────────────────────
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') return false;
        return (
            localStorage.getItem('theme') === 'dark' ||
            (!localStorage.getItem('theme') &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)
        );
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleDark = () => setIsDark((prev) => !prev);

    // ── Locale (via laravel-react-i18n + backend session) ─────────────────
    const { locale, setLocale: setI18nLocale } = useLaravelReactI18n();

    const setLocale = (newLocale) => {
        if (!SUPPORTED_LOCALES.includes(newLocale)) return;

        // 1. Update frontend translations immediately
        setI18nLocale(newLocale);

        // 2. Persist to backend session (no full reload)
        router.post(
            `/locale/${newLocale}`,
            {},
            { preserveScroll: true, preserveState: true }
        );

        // 3. Apply RTL for Arabic
        document.documentElement.setAttribute(
            'dir',
            newLocale === 'ar' ? 'rtl' : 'ltr'
        );
        document.documentElement.setAttribute('lang', newLocale);
    };

    // Apply direction on mount based on current locale
    useEffect(() => {
        document.documentElement.setAttribute(
            'dir',
            locale === 'ar' ? 'rtl' : 'ltr'
        );
        document.documentElement.setAttribute('lang', locale);
    }, [locale]);

    return (
        <AppContext.Provider value={{ isDark, toggleDark, locale, setLocale }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
