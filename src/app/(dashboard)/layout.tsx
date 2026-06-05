'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useFinance } from '@/context/FinanceContext';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Receipt,
  FileText,
  Tag,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  AlertTriangle,
  Info,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    isAuthenticated,
    logout,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    settings,
    members,
    expenses,
    incomes
  } = useFinance();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Authentication Guard
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // Load and apply theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
    setTheme('dark');
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  // Dynamic Search Results
  const searchResults = (() => {
    if (!searchQuery.trim()) return { members: [], expenses: [], incomes: [] };
    const query = searchQuery.toLowerCase();

    return {
      members: members.filter(m => m.name.toLowerCase().includes(query) || m.relationship.toLowerCase().includes(query)),
      expenses: expenses.filter(e => e.productName.toLowerCase().includes(query) || e.category.toLowerCase().includes(query)).slice(0, 3),
      incomes: incomes.filter(i => i.description.toLowerCase().includes(query) || i.category.toLowerCase().includes(query)).slice(0, 3)
    };
  })();

  const totalResults = searchResults.members.length + searchResults.expenses.length + searchResults.incomes.length;
  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="min-h-screen flex bg-zinc-950 font-sans transition-colors duration-300">

      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white text-lg font-bold shadow-lg shadow-primary/10">
            📊
          </div>
          <div>
            <h1 className="font-bold text-zinc-50 leading-tight">Finance Tracker</h1>
            <span className="text-sm text-zinc-400 font-medium tracking-wide uppercase">{settings.familyInfo.familyName}</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group ${isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/15'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
              >
                <Icon className={`h-4.5 w-4.5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Profile / Logout Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/20">
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-xl bg-zinc-800 h-9 w-9 rounded-lg flex items-center justify-center">
                {settings.profile.avatar}
              </span>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-zinc-200 truncate">{settings.profile.name}</p>
                <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Owner</span>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-zinc-800"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Page Container */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header */}
        <header className="h-16 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">

          {/* Header Left (Mobile menu trigger + Breadcrumb) */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-zinc-400 hover:bg-zinc-800"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {pathname === '/dashboard' ? 'Welcome Back' : 'Management'}
              </p>
              <h2 className="text-sm font-bold text-zinc-200 capitalize">
                {pathname.split('/')[1] || 'Dashboard'}
              </h2>
            </div>
          </div>

          {/* Header Right */}
          <div className="flex items-center gap-3">

            {/* Global Search Bar */}
            <div className="relative" ref={searchRef}>
              <div className="relative hidden md:flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Global search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  className="w-56 lg:w-64 rounded-xl border border-zinc-800 bg-zinc-900/50 py-2.5 pl-9 pr-4 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-primary focus:bg-zinc-900 focus:w-72 text-zinc-200"
                />
              </div>
              <button
                onClick={() => setSearchOpen(true)}
                className="md:hidden p-2 rounded-lg text-zinc-400 hover:bg-zinc-800"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Search Dropdown */}
              <AnimatePresence>
                {searchOpen && (searchQuery.trim() !== '') && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 max-h-100 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 z-50"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-zinc-800 mb-2">
                      <span className="text-sm font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Search Results ({totalResults})</span>
                      <button onClick={() => setSearchQuery('')} className="text-sm font-semibold text-slate-400 hover:text-slate-600">Clear</button>
                    </div>

                    {totalResults === 0 ? (
                      <p className="text-center text-xs text-slate-400 dark:text-slate-400 py-6">No matches found for "{searchQuery}"</p>
                    ) : (
                      <div className="space-y-3">
                        {/* Members section */}
                        {searchResults.members.length > 0 && (
                          <div>
                            <span className="text-xs font-bold text-zinc-400 uppercase">Members</span>
                            <div className="mt-1 space-y-1">
                              {searchResults.members.map(m => (
                                <Link
                                  key={m.id}
                                  href={`/members/${m.id}`}
                                  onClick={() => setSearchOpen(false)}
                                  className="flex items-center gap-2 p-1.5 hover:bg-zinc-800 rounded-lg text-sm font-semibold text-zinc-200"
                                >
                                  <span>{m.avatar}</span>
                                  <span>{m.name} ({m.relationship})</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Incomes section */}
                        {searchResults.incomes.length > 0 && (
                          <div>
                            <span className="text-xs font-bold text-zinc-400 uppercase">Incomes</span>
                            <div className="mt-1 space-y-1">
                              {searchResults.incomes.map(i => (
                                <Link
                                  key={i.id}
                                  href="/income"
                                  onClick={() => setSearchOpen(false)}
                                  className="flex justify-between items-center p-1.5 hover:bg-zinc-800 rounded-lg text-sm text-zinc-300"
                                >
                                  <span className="truncate max-w-40 font-medium">{i.description}</span>
                                  <span className="font-bold text-emerald-400">+{settings.familyInfo.currency}{i.amount}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Expenses section */}
                        {searchResults.expenses.length > 0 && (
                          <div>
                            <span className="text-xs font-bold text-zinc-400 uppercase">Expenses</span>
                            <div className="mt-1 space-y-1">
                              {searchResults.expenses.map(e => (
                                <Link
                                  key={e.id}
                                  href="/expenses"
                                  onClick={() => setSearchOpen(false)}
                                  className="flex justify-between items-center p-1.5 hover:bg-zinc-800 rounded-lg text-sm text-zinc-300"
                                >
                                  <span className="truncate max-w-40 font-medium">{e.productName}</span>
                                  <span className="font-bold text-rose-400">-{settings.familyInfo.currency}{e.amount}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notification Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 relative transition-colors"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-zinc-900"></span>
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-xl z-50"
                  >
                    <div className="flex justify-between items-center pb-2.5 border-b border-zinc-800 mb-2">
                      <span className="text-xs font-bold text-zinc-200">Notifications ({unreadNotifications.length} unread)</span>
                      <button
                        onClick={() => markAllNotificationsAsRead()}
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="max-h-70 overflow-y-auto space-y-2.5 pr-0.5">
                      {notifications.length === 0 ? (
                        <p className="text-center text-xs text-zinc-400 py-6">No notifications</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationAsRead(n.id)}
                            className={`flex gap-3 p-2 rounded-lg cursor-pointer transition-all ${n.read
                              ? 'opacity-65 hover:opacity-100'
                              : 'bg-primary/10 border-l-2 border-primary dark:bg-primary/10 dark:border-primary'
                              }`}
                          >
                            <span className="mt-0.5">
                              {n.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                              {n.type === 'info' && <Info className="h-4 w-4 text-blue-500" />}
                              {n.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                            </span>
                            <div className="flex-1">
                              <h4 className="text-xs font-bold text-zinc-200 leading-tight">{n.title}</h4>
                              <p className="text-xs text-zinc-350 mt-0.5 leading-normal">{n.message}</p>
                              <span className="text-[10px] text-zinc-450 mt-1 block">
                                {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Menu Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <span className="text-lg bg-slate-100 dark:bg-zinc-800 h-8 w-8 rounded-lg flex items-center justify-center">
                  {settings.profile.avatar}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 z-50"
                  >
                    <div className="px-2 pb-2 mb-2 border-b border-slate-100 dark:border-zinc-800">
                      <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">{settings.profile.name}</p>
                      <p className="text-sm text-slate-400 dark:text-slate-400 truncate leading-none mt-0.5">{settings.profile.email}</p>
                    </div>

                    <Link
                      href="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-2 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <Settings className="h-3.5 w-3.5" /> Settings
                    </Link>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-2 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors mt-1"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

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
