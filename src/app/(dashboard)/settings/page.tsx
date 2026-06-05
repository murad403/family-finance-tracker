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
        <h1 className="text-2xl font-black text-slate-800 dark:text-zinc-50 tracking-tight">System Settings</h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">Configure system preferences, family names, currency symbols, and profile logs</p>
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
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/10' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/40'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </aside>

        {/* Right Side Settings Panels Card */}
        <div className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-6 shadow-sm relative">
          
          {successMsg && (
            <div className="mb-4 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 p-3.5 text-xs font-bold flex items-center gap-2 shadow-sm">
              <CheckCircle2 className="h-4 w-4" /> {successMsg}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-zinc-200">Owner Profile</h3>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">Manage administrative contact credentials & avatar indicators.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-250"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Avatar Emoji</label>
                    <select 
                      value={profileForm.avatar}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, avatar: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-250 font-bold"
                    >
                      {['👨‍💻', '👩‍⚕️', '👨', '👩', '💼', '🏡'].map(emoji => (
                        <option key={emoji} value={emoji}>{emoji} Avatar Emojis</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-250"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Phone Number</label>
                    <input 
                      type="text" 
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-250"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* FAMILY TAB */}
            {activeTab === 'family' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-zinc-200">Family Info & Currency</h3>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">Define household workspace titles & base financial currency symbols.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Family Name</label>
                    <input 
                      type="text" 
                      required
                      value={familyForm.familyName}
                      onChange={(e) => setFamilyForm(prev => ({ ...prev, familyName: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-250"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Base Currency Symbol</label>
                    <select 
                      value={familyForm.currency}
                      onChange={(e) => setFamilyForm(prev => ({ ...prev, currency: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-250 font-bold"
                    >
                      <option value="$">USD ($)</option>
                      <option value="€">EUR (€)</option>
                      <option value="£">GBP (£)</option>
                      <option value="₹">INR (₹)</option>
                      <option value="¥">JPY (¥)</option>
                      <option value="৳">BDT (৳)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-zinc-200">Alert Rules & Diagnostics</h3>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">Toggle alert threshold rules for family ledger mutations.</p>
                </div>

                <div className="space-y-3.5 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notificationsForm.spendingLimitAlerts}
                      onChange={(e) => setNotificationsForm(prev => ({ ...prev, spendingLimitAlerts: e.target.checked }))}
                      className="mt-1 rounded border-slate-200 text-primary dark:border-zinc-800 h-4 w-4"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">Spending Limit Violations</span>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Notify admin instantly if category spending exceeds 100% of limits.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notificationsForm.weeklySummaries}
                      onChange={(e) => setNotificationsForm(prev => ({ ...prev, weeklySummaries: e.target.checked }))}
                      className="mt-1 rounded border-slate-200 text-primary dark:border-zinc-800 h-4 w-4"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">Weekly Summary Reports</span>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Log system alerts containing monthly margin roll-ups.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notificationsForm.systemUpdates}
                      onChange={(e) => setNotificationsForm(prev => ({ ...prev, systemUpdates: e.target.checked }))}
                      className="mt-1 rounded border-slate-200 text-primary dark:border-zinc-800 h-4 w-4"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">System Activity Notifications</span>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Receive updates on code patches or system feature updates.</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Footer Action buttons */}
            <div className="border-t border-slate-100 dark:border-zinc-800 pt-5 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-hover px-5 py-3 text-xs font-bold text-white shadow-md shadow-primary/10 active:scale-[0.98] transition-all"
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
