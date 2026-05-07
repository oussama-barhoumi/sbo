import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { LaravelReactI18nProvider } from 'laravel-react-i18n';

const appName = import.meta.env.VITE_APP_NAME || 'HarborBank';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // The locale comes from Inertia shared data (set by HandleInertiaRequests)
        const locale = props.initialPage.props.locale ?? 'en';

        root.render(
            <LaravelReactI18nProvider
                locale={locale}
                fallbackLocale="en"
                files={import.meta.glob('../../lang/*.json')}
            >
                <App {...props} />
            </LaravelReactI18nProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
