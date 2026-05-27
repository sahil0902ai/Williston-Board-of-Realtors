'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab setActiveTab={setActiveTab} />;
      case 'investments': return <MyInvestmentsTab />;
      case 'properties': return <MyPropertiesTab />;
      case 'wallet': return <WalletTab setActiveTab={setActiveTab} />;
      case 'deposit': return <DepositTab setActiveTab={setActiveTab} />;
      case 'withdraw': return <WithdrawTab setActiveTab={setActiveTab} />;
      case 'referrals': return <ReferralTab />;
      case 'education': return <PlaceholderTab title="Education" />;
      case 'settings': return <PlaceholderTab title="Settings" />;
      default: return <OverviewTab setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-navy text-white flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden h-20 border-b border-border-subtle flex items-center px-6 justify-between bg-navy shrink-0 sticky top-0 z-30">
           <button onClick={() => setIsSidebarOpen(true)} className="text-gray-text hover:text-white">
              <Menu size={24} />
           </button>
           <div className="font-serif text-xl tracking-widest text-gold">WILLISTON</div>
           <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-navy font-bold text-xs shrink-0">EA</div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden">
          {renderTab()}
        </main>
      </div>
    </div>
  );
}
