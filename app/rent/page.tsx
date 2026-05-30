import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Rentals from '@/components/Rentals';
import RentalPromo from '@/components/RentalPromo';

export const metadata: Metadata = {
  title: 'Furnished Apartments for Rent',
  description: 'Exquisite furnished apartments for rent across premium locations. Experience comfort, security, and world-class service with Williston.',
};

export default function Rent() {
  return (
    <>
      <Header />
      <div className="pt-24 bg-navy">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-text tracking-wider uppercase">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="text-gold">&gt;</span>
            <span className="text-white">Furnished Apartments</span>
          </div>
        </div>
        <RentalPromo isRentPage={true} />
        <Rentals />
      </div>
      <Footer />
    </>
  );
}
