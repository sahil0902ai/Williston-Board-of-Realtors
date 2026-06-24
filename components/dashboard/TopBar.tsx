"use client";
import { Bell, Menu, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="h-20 bg-[rgba(4,9,26,0.97)]  border-b border-border-subtle sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden w-11 h-11 rounded-full bg-navy-light flex items-center justify-center text-white"
          onClick={onMenuClick}
          style={{
            minHeight: '44px',
            minWidth: '44px',
            cursor: 'pointer',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center">
            <Menu size={20} />
          </span>
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-serif text-white">Good morning, Emeka 👋</h1>
          <p className="text-xs md:text-sm text-gray-text hidden sm:block">{today}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button 
          className="relative p-2 text-gray-text hover:text-white transition-colors flex items-center justify-center"
          style={{
            minHeight: '44px',
            minWidth: '44px',
            cursor: 'pointer',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span style={{ pointerEvents: 'none' }} className="relative flex items-center justify-center">
            <Bell size={20} />
            <span className="absolute top-0 right-0.5 w-2 h-2 rounded-full bg-red-500 "></span>
          </span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none justify-center"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              minHeight: '44px',
              minWidth: '44px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ pointerEvents: 'none' }} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-navy font-bold shrink-0">
                EA
              </div>
              <ChevronDown size={16} className="text-gray-text hidden md:block" />
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-navy-mid border border-border-subtle rounded-xl shadow-xl overflow-hidden py-1 z-50">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-text hover:bg-navy-light flex items-center gap-2">
                <User size={16} /> Profile
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-text hover:bg-navy-light flex items-center gap-2">
                <Settings size={16} /> Settings
              </button>
              <div className="h-px bg-border-subtle my-1"></div>
              <button 
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-navy-light flex items-center gap-2"
                onClick={() => window.location.href = '/'}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
