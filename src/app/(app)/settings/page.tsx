'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import {
  User,
  Settings,
  Bell,
  Palette,
  Save,
  HelpCircle,
  Users,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function SettingsPage() {
  const { settings, updateSettings } = useFinance();

  // Tab State: 'profile' | 'family' | 'theme' | 'notifications'
  const [activeTab, setActiveTab] = useState<'profile' | 'family' | 'notifications'>('profile');
  const [successMsg, setSuccessMsg] = useState('');

  // Form local states
  const [profileForm, setProfileForm] = useState({
    name: settings.profile.name,
    email: settings.profile.email,
    phone: settings.profile.phone,
    avatar: settings.profile.avatar
  });

  const [familyForm, setFamilyForm] = useState({
    familyName: settings.familyInfo.familyName,
    currency: settings.familyInfo.currency
  });

  const [notificationsForm, setNotificationsForm] = useState({
    spendingLimitAlerts: settings.notifications.spendingLimitAlerts,
    weeklySummaries: settings.notifications.weeklySummaries,
    systemUpdates: settings.notifications.systemUpdates
  });

  // Handle Form Submission
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      profile: profileForm,
      familyInfo: familyForm,
      notifications: notificationsForm
    });
    setSuccessMsg('Settings updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const tabsList = [
    { id: 'profile' as const, name: 'Profile Settings', icon: User },
    { id: 'family' as const, name: 'Family Information', icon: Users },
    { id: 'notifications' as const, name: 'Notification Rules', icon: Bell }
  ];

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-zinc-50 tracking-tight">System Settings</h1>
        <p className="text-zinc-400 text-sm">Configure system preferences, family names, currency symbols, and profile logs</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Left Side Tab Links */}
        <aside className="w-full lg:w-64 space-y-1">
          {tabsList.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold rounded-xl transition-all ${isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </aside>

        {/* Right Side Settings Panels Card */}
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm relative">

          {successMsg && (
            <div className="mb-4 rounded-xl bg-emerald-950/20 text-emerald-400 p-3.5 text-sm font-bold flex items-center gap-2 shadow-sm">
              <CheckCircle2 className="h-4 w-4" /> {successMsg}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-zinc-200">Owner Profile</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Manage administrative contact credentials & avatar indicators.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-primary focus:bg-zinc-900/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Avatar Emoji</label>
                    <div className="mt-1.5">
                      <Select
                        value={profileForm.avatar}
                        onValueChange={(val) => setProfileForm(prev => ({ ...prev, avatar: val }))}
                      >
                        <SelectTrigger className="font-bold">
                          <SelectValue placeholder="Select Avatar" />
                        </SelectTrigger>
                        <SelectContent>
                          {['👨‍💻', '👩‍⚕️', '👨', '👩', '💼', '🏡'].map(emoji => (
                            <SelectItem key={emoji} value={emoji}>{emoji} Avatar Emojis</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Email Address</label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-primary focus:bg-zinc-900/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Phone Number</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-primary focus:bg-zinc-900/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* FAMILY TAB */}
            {activeTab === 'family' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-zinc-200">Family Info & Currency</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Define household workspace titles & base financial currency symbols.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Family Name</label>
                    <input
                      type="text"
                      required
                      value={familyForm.familyName}
                      onChange={(e) => setFamilyForm(prev => ({ ...prev, familyName: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-primary focus:bg-zinc-900/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Base Currency Symbol</label>
                    <div className="mt-1.5">
                      <Select
                        value={familyForm.currency}
                        onValueChange={(val) => setFamilyForm(prev => ({ ...prev, currency: val }))}
                      >
                        <SelectTrigger className="font-bold">
                          <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="$">USD ($)</SelectItem>
                          <SelectItem value="€">EUR (€)</SelectItem>
                          <SelectItem value="£">GBP (£)</SelectItem>
                          <SelectItem value="₹">INR (₹)</SelectItem>
                          <SelectItem value="¥">JPY (¥)</SelectItem>
                          <SelectItem value="৳">BDT (৳)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-zinc-200">Alert Rules & Diagnostics</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Toggle alert threshold rules for family ledger mutations.</p>
                </div>

                <div className="space-y-3.5 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationsForm.spendingLimitAlerts}
                      onChange={(e) => setNotificationsForm(prev => ({ ...prev, spendingLimitAlerts: e.target.checked }))}
                      className="mt-1 rounded border-zinc-850 text-primary dark:border-zinc-800 h-4 w-4 bg-zinc-950"
                    />
                    <div>
                      <span className="text-sm font-bold text-zinc-200">Spending Limit Violations</span>
                      <p className="text-sm text-zinc-450 mt-0.5">Notify admin instantly if category spending exceeds 100% of limits.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationsForm.weeklySummaries}
                      onChange={(e) => setNotificationsForm(prev => ({ ...prev, weeklySummaries: e.target.checked }))}
                      className="mt-1 rounded border-zinc-850 text-primary dark:border-zinc-800 h-4 w-4 bg-zinc-950"
                    />
                    <div>
                      <span className="text-sm font-bold text-zinc-200">Weekly Summary Reports</span>
                      <p className="text-sm text-zinc-450 mt-0.5">Log system alerts containing monthly margin roll-ups.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationsForm.systemUpdates}
                      onChange={(e) => setNotificationsForm(prev => ({ ...prev, systemUpdates: e.target.checked }))}
                      className="mt-1 rounded border-zinc-850 text-primary dark:border-zinc-800 h-4 w-4 bg-zinc-950"
                    />
                    <div>
                      <span className="text-sm font-bold text-zinc-200">System Activity Notifications</span>
                      <p className="text-sm text-zinc-450 mt-0.5">Receive updates on code patches or system feature updates.</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Footer Action buttons */}
            <div className="border-t border-zinc-800 pt-5 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-hover px-5 py-3 text-sm font-bold text-white shadow-md shadow-primary/10 active:scale-[0.98] transition-all"
              >
                <Save className="h-4 w-4" /> Save System Settings
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
