import AdminDashboard from '@/components/AdminDashboard';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const adminSecret = process.env.ADMIN_SECRET_KEY || 'williston_admin_secret_2025';
  return <AdminDashboard adminSecret={adminSecret} />;
}
