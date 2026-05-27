'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Calculator() {
  const [amount, setAmount] = useState(50000);
  const [months, setMonths] = useState(12);

  const calculateReturn = () => {
    // 35% annual return
    return amount * (1 + (0.35 * (months / 12)));
  };

  return (
    <>
      <Header />
      <div className="pt-32 pb-24 min-h-screen max-w-4xl mx-auto px-6">
         <h1 className="text-4xl font-serif text-white mb-8">Investment Calculator</h1>
         <div className="bg-navy border border-border-subtle p-8 rounded-2xl">
            <div className="mb-8">
              <label className="block text-sm text-gray-text mb-4">Investment Amount: ${amount.toLocaleString()}</label>
              <input type="range" min="50000" max="10000000" step="50000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full accent-gold" />
            </div>
            <div className="mb-8">
              <label className="block text-sm text-gray-text mb-4">Duration: {months} Months</label>
              <input type="range" min="6" max="60" step="6" value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full accent-gold" />
            </div>
            <div className="p-6 bg-gold/10 border border-gold/20 rounded-xl mt-8 flex flex-col items-center">
               <div className="text-sm text-gray-300 uppercase tracking-widest mb-2">Estimated Return</div>
               <div className="text-5xl font-serif text-gold">${calculateReturn().toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            </div>
         </div>
      </div>
      <Footer />
    </>
  );
}
