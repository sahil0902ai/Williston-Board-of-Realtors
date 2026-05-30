import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account | Williston Investments',
  description: 'Register a new account on Williston Investments and start building your real estate investment portfolio.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
