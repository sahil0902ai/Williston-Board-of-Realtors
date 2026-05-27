import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InvestmentPackages from '@/components/InvestmentPackages';
import PropertyPlans from '@/components/PropertyPlans';

export default function InvestmentPlans() {
  return (
    <>
      <Header />
      <div className="pt-32 pb-24">
        <InvestmentPackages />
        <PropertyPlans />
      </div>
      <Footer />
    </>
  );
}
