import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import Hero from '@/Components/Landing/Hero';
import Services from '@/Components/Landing/Services';
import Trust from '@/Components/Landing/Trust';
import Promotions from '@/Components/Landing/Promotions';
import Footer from '@/Components/Landing/Footer';

export default function Welcome() {
    return (
        <>
            <Head title="Modern Digital Banking">
                <meta name="description" content="HarborBank — Banking that moves with you. Zero-fee checking, high-yield savings, and seamless transfers." />
            </Head>

            <Navbar />
            <main>
                <Hero />
                <Services />
                <Trust />
                <Promotions />
            </main>
            <Footer />
        </>
    );
}
