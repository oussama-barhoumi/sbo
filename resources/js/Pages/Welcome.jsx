import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import Hero from '@/Components/Landing/Hero';
import Services from '@/Components/Landing/Services';
import Trust from '@/Components/Landing/Trust';
import Promotions from '@/Components/Landing/Promotions';
import Footer from '@/Components/Landing/Footer';
import { AppProvider } from '@/hooks/useApp';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function Welcome() {
    const { t } = useLaravelReactI18n();

    return (
        <div className="selection:bg-black selection:text-white transition-colors duration-500">
            <Head title={t('welcome.title')}>
                <meta name="description" content={t('welcome.description')} />
            </Head>

            <Navbar />
            <main>
                <Hero />
                <Services />
                <Trust />
                <Promotions />
            </main>
            <Footer />
        </div>
    );
}
