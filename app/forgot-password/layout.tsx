import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password | Williston Investments',
  description: 'Request a password reset link to access your Williston Investments account.',
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
