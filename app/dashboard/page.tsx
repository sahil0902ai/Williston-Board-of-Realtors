import { Metadata } from 'next';
import UserDashboard from '@/components/UserDashboard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Investor Dashboard | Williston Investments',
  description: 'View your real estate investment portfolio, returns, and transaction history.',
};

export default function DashboardPage() {
  return <UserDashboard />;
}
