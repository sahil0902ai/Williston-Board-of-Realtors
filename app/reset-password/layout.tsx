import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Password | Williston Investments',
  description: 'Enter a new password to secure your Williston Investments account.',
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
