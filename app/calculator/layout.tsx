import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investment ROI Calculator | Williston Board of Realtors & Investments',
  description: 'Calculate your expected returns and ROI for real estate investments on the Williston platform.',
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
