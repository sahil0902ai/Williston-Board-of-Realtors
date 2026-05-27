'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FadeUp, FadeUpItem } from './FadeUp';
import SectionLabel from './SectionLabel';

const faqs = [
  {
    question: "Is my investment safe with Williston?",
    answer: "Yes, your investment is strictly protected. All our investment plans are fully backed by prime, verified real estate assets across the United States. We employ rigorous risk management, legal verification of titles, and comprehensive insurance to protect our investors' capital."
  },
  {
    question: "How do I receive my returns?",
    answer: "Returns are paid directly into your registered bank account or digital wallet automatically at the end of your investment cycle (maturity date). You can track your expected returns, payout dates, and history securely via your investor dashboard."
  },
  {
    question: "Can I invest from outside the United States?",
    answer: "Absolutely. We have a dedicated portal to support our diaspora investors in the UK, US, and globally. You can fund your account and receive payouts using international bank transfers, creating a seamless cross-border investment experience."
  },
  {
    question: "What is the minimum amount I can invest?",
    answer: "Our Foundation plan is designed for accessibility, allowing you to start your wealth-building journey with a minimum initial investment of just $500."
  },
  {
    question: "How does the referral program work?",
    answer: "You receive a unique referral link upon registration. When a new user signs up and makes their first investment using your link, you instantly earn a percentage commission based on their initial investment, credited directly to your withdrawable wallet balance."
  },
  {
    question: "Can I withdraw my investment before maturity?",
    answer: "Real estate investments are capital intensive and generally illiquid. We strongly encourage investors to commit for the full duration. However, in extreme emergency situations, an early withdrawal request may be reviewed, but it is subject to a significant penalty fee as outlined in our terms."
  },
  {
    question: "What documents do I need to register?",
    answer: "To ensure a secure environment and comply with KYC regulations, you'll need to provide a valid government-issued ID (NIN, Driver's License, or International Passport), your SSN (last 4 digits) for rapid identity verification, and a recent proof of address (such as a utility bill) to fully activate your account."
  },
  {
    question: "Do you accept cryptocurrency payments?",
    answer: "Currently, we do not accept cryptocurrency payments or deposits. We process all transactions via secure, traditional bank transfers and approved payment gateways to ensure strict regulatory compliance and safeguard your funds."
  },
  {
    question: "How are properties allocated to investors?",
    answer: "For our higher-tier plans like Legacy and Dynasty, physical land allocations are processed precisely at maturity. You will receive an official offer letter and survey plan indicating your exclusively allocated plot(s) in our specified estates."
  },
  {
    question: "Is Williston registered with the SEC and CAC?",
    answer: "Yes, Williston Properties is fully incorporated with the Corporate Affairs Commission (CAC) and complies with all relevant financial and real estate regulations stipulated by the Special Control Unit Against Money Laundering (SCUML) and other appropriate regulatory bodies in the United States."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-navy-mid relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-0" style={{ backgroundImage: "url('https://picsum.photos/seed/noise/400/400?grayscale')" }}></div>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        <FadeUp className="text-center mb-16 flex flex-col items-center">
          <SectionLabel>Got Questions?</SectionLabel>
          <h3 className="text-4xl md:text-5xl font-serif text-white mt-2">Everything You Need to Know</h3>
        </FadeUp>

        <FadeUp stagger className="space-y-4">
          {faqs.map((faq, index) => (
            <FadeUpItem key={index}>
              <div 
                className={`bg-navy border transition-colors duration-300 rounded-xl overflow-hidden ${
                  openIndex === index ? 'border-border-gold' : 'border-border-subtle hover:border-gold/30'
                }`}
              >
                <button
                  suppressHydrationWarning
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  aria-expanded={openIndex === index}
                >
                  <span className="font-semibold text-white/90 text-lg pr-8">{faq.question}</span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                    openIndex === index ? 'bg-gold text-navy rotate-180' : 'bg-navy-light text-gold border border-border-gold shadow-sm'
                  }`}>
                    <ChevronDown size={16} />
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <div className="p-6 pt-0 text-gray-text leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeUpItem>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}
