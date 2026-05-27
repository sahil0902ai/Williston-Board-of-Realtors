import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Rentals from '@/components/Rentals';
import RentalPromo from '@/components/RentalPromo';

export default function Rent() {
  return (
    <>
      <Header />
      <div className="pt-32 pb-24">
        <RentalPromo />
        <Rentals />
      </div>
      <Footer />
    </>
  );
}
