'use client';

import { useState, useEffect } from 'react';
import { Menu, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import OverviewTab from '@/components/dashboard/OverviewTab';
import MyInvestmentsTab from '@/components/dashboard/MyInvestmentsTab';
import MyPropertiesTab from '@/components/dashboard/MyPropertiesTab';
import WalletTab from '@/components/dashboard/WalletTab';
import DepositTab from '@/components/dashboard/DepositTab';
import WithdrawTab from '@/components/dashboard/WithdrawTab';
import ReferralTab from '@/components/dashboard/ReferralTab';
import PlaceholderTab from '@/components/dashboard/PlaceholderTab';

export default function UserDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#04091A] flex flex-col items-center justify-center text-white gap-4">
        <Loader2 size={40} className="animate-spin text-gold" />
        <p className="font-serif text-sm tracking-widest text-gold uppercase">Loading Your Dashboard...</p>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': 
        return <OverviewTab setActiveTab={setActiveTab} profile={profile} fetchProfile={fetchProfile} />;
      case 'investments': 
        return <MyInvestmentsTab profile={profile} fetchProfile={fetchProfile} />;
      case 'properties': 
        return <MyPropertiesTab />;
      case 'wallet': 
        return <WalletTab setActiveTab={setActiveTab} profile={profile} fetchProfile={fetchProfile} />;
      case 'deposit': 
        return <DepositTab setActiveTab={setActiveTab} profile={profile} fetchProfile={fetchProfile} />;
      case 'withdraw': 
        return <WithdrawTab setActiveTab={setActiveTab} profile={profile} fetchProfile={fetchProfile} />;
      case 'referrals': 
        return <ReferralTab profile={profile} />;
      case 'education': 
        return <PlaceholderTab title="Education" />;
      case 'settings': 
        return <PlaceholderTab title="Settings" />;
      default: 
        return <OverviewTab setActiveTab={setActiveTab} profile={profile} fetchProfile={fetchProfile} />;
    }
  };

  // Get initials for profile avatar fallback
  const getInitials = () => {
    if (!profile || !profile.full_name) return 'US';
    return profile.full_name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-navy text-white flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} profile={profile} />
      
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden h-20 border-b border-border-subtle flex items-center px-6 justify-between bg-navy shrink-0 sticky top-0 z-30">
           <button onClick={() => setIsSidebarOpen(true)} className="text-gray-text hover:text-white">
              <Menu size={24} />
           </button>
           <div className="font-serif text-xl tracking-widest text-gold">WILLISTON</div>
           <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-navy font-bold text-xs shrink-0">
             {profile?.avatar_url ? (
               // eslint-disable-next-line @next/next/no-img-element
               <img src={profile.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
             ) : (
               getInitials()
             )}
           </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden p-6 md:p-8">
          {renderTab()}
        </main>
      </div>
    </div>
  );
}
