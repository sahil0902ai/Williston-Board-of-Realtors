'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, Building2, User } from 'lucide-react';

export default function MobileBottomBar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Invest', href: '/#invest', icon: Briefcase },
    { label: 'Rent', href: '/rent', icon: Building2 },
    { label: 'Dashboard', href: '/dashboard', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[rgba(4,9,26,0.97)]  border-t border-border-subtle z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/' && pathname === '') || (item.href !== '/' && pathname?.startsWith(item.href) && !item.href.includes('#'));
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-gold' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <item.icon size={20} className={isActive ? 'opacity-100' : 'opacity-80'} />
              <span className="text-[10px] font-medium tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
