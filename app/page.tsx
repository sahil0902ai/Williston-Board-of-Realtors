import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustBadges from '@/components/TrustBadges';
import About from '@/components/About';
import Stats from '@/components/Stats';
import PropertyPlans from '@/components/PropertyPlans';
import RealEstateListings from '@/components/RealEstateListings';
import InvestmentPackages from '@/components/InvestmentPackages';
import Testimonials from '@/components/Testimonials';
import RentalPromo from '@/components/RentalPromo';
import Education from '@/components/Education';
import FAQ from '@/components/FAQ';
import Referral from '@/components/Referral';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBadges />
        <About />
        <Stats />
        <PropertyPlans />
        <RealEstateListings />
        <InvestmentPackages />
        <Testimonials />
        <RentalPromo />
        <Education />
        <FAQ />
        <Referral />
      </main>
      <Footer />
    </>
  );
}
