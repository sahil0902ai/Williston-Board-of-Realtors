import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RealEstateListings from '@/components/RealEstateListings';

export default function Properties() {
  return (
    <>
      <Header />
      <div className="pt-32 pb-24">
        <RealEstateListings />
      </div>
      <Footer />
    </>
  );
}
