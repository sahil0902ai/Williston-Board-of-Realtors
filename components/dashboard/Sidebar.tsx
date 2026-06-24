import Link from 'next/link';
import { logoutUser } from '@/lib/auth';
import { 
  BarChart3, 
  Briefcase, 
  Building, 
  Wallet, 
  Users, 
  GraduationCap, 
  Settings, 
  LogOut,
  X 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  profile?: any;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, profile }: SidebarProps) {
  const links = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={20} /> },
    { id: 'investments', label: 'My Investments', icon: <Briefcase size={20} /> },
    { id: 'properties', label: 'My Properties', icon: <Building size={20} /> },
    { id: 'wallet', label: 'Wallet', icon: <Wallet size={20} /> },
    { id: 'referrals', label: 'Referrals', icon: <Users size={20} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={20} /> },
  ];

  const bottomLinks = [
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    { id: 'logout', label: 'Logout', icon: <LogOut size={20} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[rgba(4,9,26,0.97)]  z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-[260px] bg-navy-mid border-r border-border-subtle z-50 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-border-subtle shrink-0">
          <Link href="/" className="font-serif text-2xl tracking-widest text-gold">WILLISTON</Link>
          <button 
            className="lg:hidden text-gray-text hover:text-white flex items-center justify-center" 
            onClick={() => setIsOpen(false)}
            style={{
              minHeight: '44px',
              minWidth: '44px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ pointerEvents: 'none' }}>
              <X size={24} />
            </span>
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => { setActiveTab(link.id); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === link.id ? 'bg-gold/10 text-gold font-medium' : 'text-gray-text hover:bg-navy-light hover:text-white'}`}
              style={{
                minHeight: '48px',
                cursor: 'pointer',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span style={{ pointerEvents: 'none' }} className="flex items-center gap-3 w-full">
                <span className={activeTab === link.id ? 'text-gold' : 'text-gray-text group-hover:text-white'}>{link.icon}</span>
                {link.label}
              </span>
            </button>
          ))}

          <div className="pt-6 mt-6 border-t border-border-subtle space-y-1">
            {bottomLinks.map((link) => (
               <button
               key={link.id}
               onClick={async () => { 
                  if(link.id === 'logout') {
                    try {
                      await logoutUser();
                    } catch (e) {
                      console.error('Logout error:', e);
                    }
                    window.location.href = '/';
                  } else {
                    setActiveTab(link.id); 
                    setIsOpen(false);
                  }
               }}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === link.id ? 'bg-gold/10 text-gold font-medium' : 'text-gray-text hover:bg-navy-light hover:text-white'}`}
               style={{
                 minHeight: '48px',
                 cursor: 'pointer',
                 touchAction: 'manipulation',
                 WebkitTapHighlightColor: 'transparent',
               }}
             >
               <span style={{ pointerEvents: 'none' }} className="flex items-center gap-3 w-full">
                 <span className={activeTab === link.id ? 'text-gold' : 'text-gray-text group-hover:text-white'}>{link.icon}</span>
                 {link.label}
               </span>
             </button>
            ))}
          </div>
        </div>

        <div className="p-4 shrink-0 border-t border-border-subtle text-xs text-gray-400 space-y-2">
          <div className="font-semibold text-white mb-2">Need Support?</div>
          <div>📧 <a href="mailto:willistonboardofrealtors@gmail.com" className="hover:text-gold transition">willistonboardofrealtors@gmail.com</a></div>
          <div className="pt-1">✈️ <a href="https://t.me/willistonboardofrealtors" target="_blank" rel="noopener" className="hover:text-[#0088cc] transition">@willistonboardofrealtors on Telegram</a></div>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-border-subtle bg-[rgba(4,9,26,0.97)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-navy font-bold shrink-0 overflow-hidden text-xs">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                profile?.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : 'US'
              )}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-medium text-white truncate">{profile?.full_name || 'Guest User'}</div>
              <div className="text-xs text-gold truncate capitalize">{profile?.investor_level || 'Starter'} Member</div>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
}
