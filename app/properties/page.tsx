import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RealEstateListings from '@/components/RealEstateListings';

export const metadata: Metadata = {
  title: 'Property Listings | Williston Board of Realtors & Investments',
  description: 'Explore asset-backed real estate investments across the United States. High-yield properties across residential, commercial, and land markets.',
};

export default function Properties() {
  return (
    <>
      <Header />
      <div className="pt-24 bg-navy">
        <RealEstateListings isPropertiesPage={true} />
      </div>
      <Footer />
    </>
  );
}
