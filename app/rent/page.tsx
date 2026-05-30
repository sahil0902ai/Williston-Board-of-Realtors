import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Rentals from '@/components/Rentals';
import RentalPromo from '@/components/RentalPromo';

export const metadata: Metadata = {
  title: 'Furnished Apartments for Rent | Williston Investments',
  description: 'Exquisite furnished apartments for rent across premium locations. Experience comfort, security, and world-class service with Williston.',
};

export default function Rent() {
  return (
    <>
      <Header />
      <div className="pt-24 bg-navy">
        <RentalPromo />
        <Rentals />
      </div>
      <Footer />
    </>
  );
}
