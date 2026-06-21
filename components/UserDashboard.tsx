'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Menu, Loader2, Bell, X, CheckCircle2, ArrowUpRight, 
  TrendingUp, DollarSign, ShieldCheck, ShieldAlert 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Sidebar from '@/components/dashboard/Sidebar';
import OverviewTab from '@/components/dashboard/OverviewTab';
import MyInvestmentsTab from '@/components/dashboard/MyInvestmentsTab';
import MyPropertiesTab from '@/components/dashboard/MyPropertiesTab';
import WalletTab from '@/components/dashboard/WalletTab';
import DepositTab from '@/components/dashboard/DepositTab';
import WithdrawTab from '@/components/dashboard/WithdrawTab';
import ReferralTab from '@/components/dashboard/ReferralTab';
import PlaceholderTab from '@/components/dashboard/PlaceholderTab';
import SettingsTab from '@/components/dashboard/SettingsTab';

export default function UserDashboard({ initialTab }: { initialTab?: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialTab || 'overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Notifications & Realtime States
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'investments' | 'deposits' | 'withdrawals'>('all');
  const [toasts, setToasts] = useState<any[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const showToastNotif = (notif: any) => {
    const toastId = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { toastId, ...notif }]);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.toastId !== toastId));
    }, 5000);
  };

  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }
      await fetchProfile();
    }
    checkAuth();
  }, []);

  // Set up notifications and Supabase Realtime channel once profile.id is resolved
  useEffect(() => {
    if (!profile?.id) return;

    fetchNotifications();

    // Set up Realtime listener
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    import('@supabase/supabase-js').then(({ createClient }) => {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      const channel = supabase
        .channel(`user-notifs-${profile.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${profile.id}`,
          },
          (payload) => {
            const newNotif = payload.new;
            // Display toast
            showToastNotif(newNotif);
            // Refresh states
            setUnreadCount(prev => prev + 1);
            setNotifications(prev => [newNotif, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    });
  }, [profile?.id]);

  // Click outside to close notifications dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#04091A] flex flex-col items-center justify-center text-white gap-4">
        <Loader2 size={40} className="animate-spin text-gold" />
        <p className="font-serif text-sm tracking-widest text-gold uppercase">Loading Your Dashboard...</p>
      </div>
    );
  }

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

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
        return <SettingsTab profile={profile} fetchProfile={fetchProfile} />;
      default: 
        return <OverviewTab setActiveTab={setActiveTab} profile={profile} fetchProfile={fetchProfile} />;
    }
  };

  const getInitials = () => {
    if (!profile || !profile.full_name) return 'US';
    return profile.full_name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const timeAgo = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  const getNotifIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('deposit')) {
      return (
        <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center shrink-0">
          <CheckCircle2 size={16} />
        </div>
      );
    }
    if (t.includes('withdrawal')) {
      return (
        <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
          <ArrowUpRight size={16} />
        </div>
      );
    }
    if (t.includes('investment')) {
      return (
        <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/20 text-gold flex items-center justify-center shrink-0">
          <TrendingUp size={16} />
        </div>
      );
    }
    if (t.includes('return') || t.includes('payout')) {
      return (
        <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center shrink-0">
          <DollarSign size={16} />
        </div>
      );
    }
    if (t.includes('kyc') || t.includes('identity')) {
      return (
        <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center shrink-0">
          <ShieldCheck size={16} />
        </div>
      );
    }
    if (t.includes('security')) {
      return (
        <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
          <ShieldAlert size={16} />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
        <Bell size={16} />
      </div>
    );
  };

  const filteredNotifs = notifications.filter(n => {
    if (notifFilter === 'unread') return !n.is_read;
    const typeStr = n.type?.toLowerCase() || '';
    if (notifFilter === 'investments') return typeStr.includes('investment') || typeStr.includes('return') || typeStr.includes('payout');
    if (notifFilter === 'deposits') return typeStr.includes('deposit');
    if (notifFilter === 'withdrawals') return typeStr.includes('withdrawal');
    return true;
  });

  return (
    <div className="min-h-screen bg-navy text-white flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} profile={profile} />
      
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        
        {/* Unified Top Header / Top Bar */}
        <header className="h-20 border-b border-border-subtle bg-navy flex items-center justify-between px-6 md:px-8 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-text hover:text-white">
              <Menu size={24} />
            </button>
            <div className="hidden lg:block">
              <h2 className="text-md font-serif font-bold text-white leading-tight">
                Welcome back, {profile?.full_name?.split(' ')[0] || 'Investor'} 👋
              </h2>
            </div>
            <div className="lg:hidden font-serif text-xl tracking-widest text-gold">WILLISTON</div>
          </div>

          <div className="flex items-center gap-4 md:gap-5" ref={dropdownRef}>
            
            {/* Notification Bell Icon */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative p-2.5 bg-[#0A1224] border border-border-subtle hover:border-gold/30 rounded-xl text-gray-text hover:text-white transition cursor-pointer"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center animate-bounce min-w-[16px] min-h-[16px] border border-navy">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3.5 w-[360px] bg-navy-mid border border-border-gold rounded-2xl shadow-2xl overflow-hidden z-[999] flex flex-col max-h-[480px] animate-in fade-in slide-in-from-top-3 duration-200">
                  {/* Dropdown Header */}
                  <div className="p-4 bg-[#060D1A] border-b border-border-subtle flex justify-between items-center shrink-0">
                    <span className="text-xs uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
                      <Bell size={14} /> Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-[10px] text-gold hover:underline cursor-pointer uppercase font-bold tracking-wider"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Filter tabs */}
                  <div className="flex bg-[#04091A] border-b border-border-subtle text-[8px] font-bold uppercase tracking-wider text-gray-text scrollbar-thin overflow-x-auto shrink-0">
                    {(['all', 'unread', 'investments', 'deposits', 'withdrawals'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setNotifFilter(tab)}
                        className={`py-2 px-3 transition border-b-2 ${
                          notifFilter === tab ? 'border-gold text-gold bg-gold/5' : 'border-transparent hover:text-white cursor-pointer'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* List content (Scrollable) */}
                  <div className="flex-1 overflow-y-auto divide-y divide-border-subtle/50 bg-[#0A1224] scrollbar-thin">
                    {filteredNotifs.map(n => (
                      <div 
                        key={n.id}
                        onClick={() => handleMarkSingleRead(n.id)}
                        className={`p-4 flex gap-3 cursor-pointer transition-colors relative ${
                          !n.is_read ? 'bg-navy-light/10 hover:bg-navy-light/20' : 'hover:bg-navy/30'
                        }`}
                      >
                        {/* Status Icon */}
                        {getNotifIcon(n.type)}

                        {/* Title, message & time */}
                        <div className="flex-1 font-sans text-xs">
                          <div className={`text-white ${!n.is_read ? 'font-bold' : 'font-medium'}`}>{n.title}</div>
                          <div className="text-gray-400 mt-0.5 leading-relaxed">{n.message}</div>
                          <div className="text-[9px] text-gray-500 mt-1.5 font-mono">{timeAgo(n.created_at)}</div>
                        </div>

                        {/* Blue Dot if unread */}
                        {!n.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 self-center"></div>
                        )}
                      </div>
                    ))}
                    {filteredNotifs.length === 0 && (
                      <div className="p-8 text-center text-xs text-gray-text font-sans leading-relaxed">
                        No notifications found.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center text-navy font-bold text-xs shrink-0 overflow-hidden cursor-pointer" onClick={() => setActiveTab('settings')}>
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                getInitials()
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden p-6 md:p-8">
          {renderTab()}
        </main>
      </div>

      {/* Toast Notification Container (Bottom-Right corner) */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.toastId}
            className="bg-[#0A1224] border-l-4 border-l-gold border-y border-r border-border-subtle rounded-xl p-4 flex gap-3 shadow-2xl animate-in slide-in-from-bottom duration-300 relative pointer-events-auto"
          >
            <div className="shrink-0">
              {getNotifIcon(toast.type)}
            </div>
            <div className="flex-1 font-sans text-xs">
              <div className="font-bold text-white">{toast.title}</div>
              <div className="text-gray-300 mt-0.5 leading-relaxed">{toast.message}</div>
            </div>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.toastId !== toast.toastId))}
              className="text-gray-text hover:text-white p-0.5 shrink-0 self-start cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
