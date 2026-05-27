import { CircleDollarSign, ArrowRightLeft, Shield, BarChart3 } from "lucide-react";
import { FadeUp, FadeUpItem } from './FadeUp';
import SectionLabel from './SectionLabel';

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: <CircleDollarSign className="w-8 h-8 text-gold" />,
      title: "Create Account",
      desc: "Sign up securely in minutes and complete your KYC verification."
    },
    {
      num: "02",
      icon: <BarChart3 className="w-8 h-8 text-gold" />,
      title: "Choose a Plan",
      desc: "Select an investment package that matches your financial goals."
    },
    {
      num: "03",
      icon: <ArrowRightLeft className="w-8 h-8 text-gold" />,
      title: "Fund Your Wallet",
      desc: "Deposit via local bank transfer or multi-currency options for diaspora."
    },
    {
      num: "04",
      icon: <Shield className="w-8 h-8 text-gold" />,
      title: "Earn & Grow",
      desc: "Watch your dashboard as you receive automated payouts."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <FadeUp className="text-center mb-16 md:mb-20 flex flex-col items-center">
          <SectionLabel>The Process</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif">How It Works</h2>
        </FadeUp>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[60px] left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-transparent via-border-gold to-transparent border-dashed border-t border-border-gold opacity-50 z-0"></div>

          <FadeUp stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-12 relative z-10">
            {steps.map((step, idx) => (
              <FadeUpItem key={idx} className="relative group text-center lg:text-left flex flex-col items-center lg:items-start">
                
                <div className="flex justify-center items-center w-32 h-32 mb-8 relative">
                  {/* Background Number */}
                  <div className="absolute inset-0 flex items-center justify-center font-serif text-[100px] text-navy-light font-bold opacity-30 select-none group-hover:text-gold/10 transition-colors duration-500">
                    {step.num}
                  </div>
                  {/* Icon Container */}
                  <div className="relative w-16 h-16 bg-navy border border-border-gold rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(201,168,76,0.1)] transition duration-300">
                    {step.icon}
                  </div>
                </div>

                <h3 className="font-serif text-2xl mb-3 text-white">{step.title}</h3>
                <p className="text-gray-text leading-relaxed text-sm max-w-[250px] lg:max-w-none text-center lg:text-left">
                  {step.desc}
                </p>

              </FadeUpItem>
            ))}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
