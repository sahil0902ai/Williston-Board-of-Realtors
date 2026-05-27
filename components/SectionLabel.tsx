import React from 'react';

export default function SectionLabel({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`inline-flex relative mb-4 ${className}`}>
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold -translate-x-1 -translate-y-1"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gold translate-x-1 translate-y-1"></div>
      <div className="text-sm font-semibold text-gold tracking-[0.2em] uppercase px-2">
        {children}
      </div>
    </div>
  );
}
