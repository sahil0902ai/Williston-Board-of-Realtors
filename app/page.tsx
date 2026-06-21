import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import About from '@/components/About';
import HowItWorks from '@/components/HowItWorks';
import PropertyPlans from '@/components/PropertyPlans';
import RealEstateListings from '@/components/RealEstateListings';
import InvestmentPackages from '@/components/InvestmentPackages';
import Testimonials from '@/components/Testimonials';
import TrustSection from '@/components/TrustSection';
import RentalPromo from '@/components/RentalPromo';
import Education from '@/components/Education';
import FAQ from '@/components/FAQ';
import Referral from '@/components/Referral';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <About />
        <HowItWorks />
        <PropertyPlans />
        <RealEstateListings />
        <InvestmentPackages />
        <Testimonials />
        <TrustSection />
        <RentalPromo />
        <Education />
        <FAQ />
        <Referral />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
