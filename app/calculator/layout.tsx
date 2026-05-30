import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ROI Calculator',
  description: 'Calculate your expected returns and ROI for real estate investments on the Williston platform.',
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
