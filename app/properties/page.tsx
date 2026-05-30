import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RealEstateListings from '@/components/RealEstateListings';

export const metadata: Metadata = {
  title: 'Our Properties',
  description: 'Explore asset-backed real estate investments across the United States. High-yield properties across residential, commercial, and land markets.',
};

export default function Properties() {
  return (
    <>
      <Header />
      <div className="pt-24 bg-navy">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-text tracking-wider uppercase">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="text-gold">&gt;</span>
            <span className="text-white">Properties</span>
          </div>
        </div>
        <RealEstateListings isPropertiesPage={true} />
      </div>
      <Footer />
    </>
  );
}
