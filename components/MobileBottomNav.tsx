"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Briefcase, PlusCircle, LayoutGrid, User } from 'lucide-react';

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/#invest', label: 'Invest', icon: Briefcase },
  { href: '/deposit', label: 'Deposit', icon: PlusCircle, primary: true },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '64px',
      background: '#04091A',
      borderTop: '1px solid rgba(201,168,76,0.15)',
      display: 'flex',
      alignItems: 'center',
      zIndex: 998,
    }}
    className="mobile-bottom-nav"
    >
      {tabs.map(tab => {
        const isActive = pathname === tab.href;
        const IconComponent = tab.icon;
        
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              textDecoration: 'none',
              paddingTop: '4px',
              borderTop: isActive
                ? '2px solid #C9A84C'
                : '2px solid transparent',
            }}
          >
            <span style={{
              background: tab.primary
                ? '#C9A84C'
                : 'transparent',
              width: tab.primary ? '40px' : 'auto',
              height: tab.primary ? '40px' : 'auto',
              borderRadius: tab.primary ? '50%' : '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: tab.primary ? '-12px' : '0',
              color: tab.primary ? '#04091A' : (isActive ? '#C9A84C' : '#8A9BB5'),
              boxShadow: tab.primary ? '0 4px 10px rgba(201,168,76,0.3)' : 'none',
            }}>
              <IconComponent size={tab.primary ? 22 : 18} />
            </span>
            <span style={{
              fontSize: '10px',
              color: isActive ? '#C9A84C' : '#8A9BB5',
              fontWeight: isActive ? 600 : 400,
            }}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
