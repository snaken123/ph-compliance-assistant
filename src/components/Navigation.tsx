'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Building2, 
  MapPin, 
  ClipboardList, 
  Calculator, 
  CalendarDays, 
  FolderArchive, 
  Users, 
  PhoneCall, 
  History, 
  Settings,
  Sparkles,
  UserCheck,
  LogOut,
  LogIn,
  KeyRound
} from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProfile(data.profile);
      })
      .catch(() => {});

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) setUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/business', label: 'My Business', icon: Building2 },
    { href: '/roadmap', label: 'Roadmap', icon: MapPin },
    { href: '/requirements', label: 'Requirements', icon: ClipboardList },
    { href: '/tax-calculator', label: 'Tax Calculator', icon: Calculator },
    { href: '/calendar', label: 'Calendar', icon: CalendarDays },
    { href: '/documents', label: 'Documents', icon: FolderArchive },
    { href: '/contractors', label: 'Contractors', icon: Users },
    { href: '/contacts', label: 'Govt Contacts', icon: PhoneCall },
    { href: '/audit', label: 'Audit Trail', icon: History },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const mode = profile?.mode || 'REGISTRATION';

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mandatory First Login Password Change Alert Banner */}
        {user?.mustChangePassword && pathname !== '/change-password' && (
          <div className="bg-amber-500 text-slate-950 px-4 py-1 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <KeyRound className="w-4 h-4" />
              <span>SECURITY ACTION REQUIRED: First time login detected. Please change your initial password.</span>
            </div>
            <Link href="/change-password" className="underline hover:text-white font-extrabold">
              Change Password Now →
            </Link>
          </div>
        )}

        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg tracking-tight text-white">FlowForce<span className="text-blue-400">Compliance</span></span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                    PH Sole Prop
                  </span>
                </div>
                <p className="text-xs text-slate-400">Philippine Sole Proprietorship Registration & Compliance Assistant</p>
              </div>
            </Link>
          </div>

          {/* User Account Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Mode Pill Badge */}
            <div className="hidden md:flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full">
              <span className="text-xs text-slate-400 font-medium">Mode:</span>
              {mode === 'REGISTRATION' ? (
                <span className="flex items-center text-xs font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 mr-1 animate-pulse" />
                  REGISTRATION MODE
                </span>
              ) : (
                <span className="flex items-center text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  ONGOING COMPLIANCE MANAGER
                </span>
              )}
            </div>

            {/* User Session Pill */}
            {user ? (
              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200 font-mono font-medium hidden sm:inline">{user.email}</span>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="text-slate-400 hover:text-red-400 transition ml-2 border-l border-slate-800 pl-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition"
              >
                <LogIn className="w-3.5 h-3.5 mr-1.5" /> Sign In
              </Link>
            )}

          </div>

        </div>

        {/* Sub-nav Links */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 mr-1.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
