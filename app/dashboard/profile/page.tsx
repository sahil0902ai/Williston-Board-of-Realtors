import { Metadata } from 'next';
import UserDashboard from '@/components/UserDashboard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'User Profile & KYC | Williston Investments',
  description: 'Manage your profile details, KYC identity verification, and security options.',
};

export default function ProfilePage() {
  return <UserDashboard initialTab="settings" />;
}
