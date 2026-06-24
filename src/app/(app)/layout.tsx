'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useFinance } from '@/context/FinanceContext';
import { LayoutDashboard, Users, TrendingUp, Receipt, FileText, Tag, BarChart3, Settings, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';



const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    isAuthenticated,
    logout,
    settings
  } = useFinance();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authentication Guard
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/sign-in');
    }
  }, [isAuthenticated, router]);

  // Load and apply theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Sidebar Links Configuration
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Members', href: '/members', icon: Users },
    { name: 'Income', href: '/income', icon: TrendingUp },
    { name: 'Expenses', href: '/expenses', icon: Receipt },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Categories', href: '/categories', icon: Tag },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-linear-to-r from-slate-700 to-cyan-700">

      {/* 1. Desktop Sidebar */}
      <Sidebar />

      {/* 2. Main Page Container */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header */}
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        {/* 3. Main Route Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* 4. Mobile Nav Drawer Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />
            {/* Slide-out Menu */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-zinc-900 z-50 lg:hidden flex flex-col p-6 shadow-2xl border-r border-slate-100 dark:border-zinc-800"
            >
              <div className="flex justify-between items-center pb-6 border-b border-slate-100 dark:border-zinc-800 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white text-base font-bold shadow-lg shadow-primary/10">
                    📊
                  </div>
                  <div>
                    <h1 className="font-bold text-slate-800 dark:text-zinc-50 text-sm">Finance Tracker</h1>
                    <span className="text-[9px] text-slate-400 font-semibold tracking-wide uppercase dark:text-slate-400">{settings.familyInfo.familyName}</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${isActive
                        ? 'bg-primary text-white shadow-md shadow-primary/15'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/50'
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Drawer Footer */}
              <div className="pt-6 border-t border-slate-100 dark:border-zinc-800">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="text-base bg-slate-100 dark:bg-zinc-800 h-7 w-7 rounded-lg flex items-center justify-center">
                      {settings.profile.avatar}
                    </span>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 truncate">{settings.profile.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


export default DashboardLayout;