import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InvestmentPackages from '@/components/InvestmentPackages';
import PropertyPlans from '@/components/PropertyPlans';

export const metadata: Metadata = {
  title: 'Investment Plans | Williston Board of Realtors & Investments',
  description: 'Choose from our tailored real estate investment packages designed to grow your capital with security. Discover our Foundation, Prosperity, Legacy, and Dynasty plans.',
};

export default function InvestmentPlans() {
  return (
    <>
      <Header />
      <div className="pt-24 bg-navy">
        <InvestmentPackages />
        <PropertyPlans />
      </div>
      <Footer />
    </>
  );
}
