'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { ExpenseCategory } from '@/lib/types';
import {
  Tag,
  Edit3,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Receipt,
  Scale,
  ShoppingBag,
  Utensils,
  Zap,
  Activity,
  BookOpen,
  Car,
  Film,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CategoriesPage() {
  const { expenses, budgets, updateBudget, settings } = useFinance();
  const currency = settings.familyInfo.currency;

  const currentMonthStr = '2026-06';

  // Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [editLimit, setEditLimit] = useState('');

  // 1. Calculate spending per category for current month
  const getCategorySpend = (cat: ExpenseCategory) => {
    return expenses
      .filter(e => e.category === cat && e.date.startsWith(currentMonthStr))
      .reduce((sum, e) => sum + e.amount, 0);
  };

  // Submit Handler
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory && editLimit) {
      updateBudget(selectedCategory, parseFloat(editLimit) || 0);
      setEditModalOpen(false);
      setSelectedCategory(null);
    }
  };

  // Stats
  const totalBudgets = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpendThisMonth = expenses
    .filter(e => e.date.startsWith(currentMonthStr))
    .reduce((sum, e) => sum + e.amount, 0);

  const budgetUsageRate = totalBudgets > 0 ? (totalSpendThisMonth / totalBudgets) * 100 : 0;

  // Category Icons & Accent colors
  const categoryMeta: { [key in ExpenseCategory]: { icon: React.ComponentType<any>; color: string; bg: string; border: string; text: string } } = {
    Grocery: { icon: ShoppingBag, color: 'bg-primary', bg: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary', border: 'border-primary/20 dark:border-indigo-950/20', text: 'text-primary' },
    Food: { icon: Utensils, color: 'bg-rose-500', bg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450', border: 'border-rose-100 dark:border-rose-950/20', text: 'text-rose-600' },
    Utilities: { icon: Zap, color: 'bg-cyan-500', bg: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/20 dark:text-cyan-400', border: 'border-cyan-100 dark:border-cyan-950/20', text: 'text-cyan-600' },
    Medical: { icon: Activity, color: 'bg-emerald-500', bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-950/20', text: 'text-emerald-600' },
    Education: { icon: BookOpen, color: 'bg-amber-500', bg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-950/20', text: 'text-amber-600' },
    Transportation: { icon: Car, color: 'bg-purple-500', bg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-950/20', text: 'text-purple-600' },
    Entertainment: { icon: Film, color: 'bg-pink-500', bg: 'bg-pink-50 text-pink-600 dark:bg-pink-950/20 dark:text-pink-400', border: 'border-pink-100 dark:border-pink-950/20', text: 'text-pink-600' },
    Others: { icon: FolderOpen, color: 'bg-slate-500', bg: 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-350', border: 'border-slate-100 dark:border-zinc-800/40', text: 'text-slate-600' }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-zinc-50 tracking-tight">Budgets & Categories</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">Define monthly category caps, monitor spend rate thresholds, and optimize household budgets</p>
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Total Budgeted */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Total Allocated Budget</span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 mt-1">{currency}{totalBudgets.toLocaleString()}</h3>
          </div>
          <span className="p-2 bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary rounded-xl"><Scale className="h-5 w-5" /></span>
        </div>

        {/* Total Spent */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Spend this month (June)</span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 mt-1">{currency}{totalSpendThisMonth.toLocaleString()}</h3>
          </div>
          <span className="p-2 bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 rounded-xl"><Receipt className="h-5 w-5" /></span>
        </div>

        {/* Global Usage Bar */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
            <span>Overall Budget Usage</span>
            <span className={budgetUsageRate > 90 ? 'text-rose-500' : 'text-slate-700 dark:text-zinc-300'}>{budgetUsageRate.toFixed(0)}% Used</span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-zinc-950 rounded-full h-2 overflow-hidden mt-1.5">
            <div
              className={`h-full transition-all duration-300 ${budgetUsageRate > 100
                ? 'bg-rose-600'
                : budgetUsageRate > 80
                  ? 'bg-amber-500'
                  : 'bg-primary'
                }`}
              style={{ width: `${Math.min(100, budgetUsageRate)}%` }}
            />
          </div>
        </div>

      </div>

      {/* Visual Category List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {budgets.map((b) => {
          const spent = getCategorySpend(b.category);
          const limit = b.limit;
          const usagePercent = limit > 0 ? (spent / limit) * 100 : 0;
          const meta = categoryMeta[b.category];

          return (
            <motion.div
              key={b.category}
              layout
              className={`bg-white dark:bg-zinc-900 border ${meta.border} rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all`}
            >

              {/* Card Header (Category Title + Lucide Icon) */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className={`h-9 w-9 rounded-xl flex items-center justify-center border shadow-sm shrink-0 ${meta.bg} ${meta.border}`}>
                    <meta.icon className="h-4.5 w-4.5 shrink-0" />
                  </span>
                  <div>
                    <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200">{b.category}</h3>
                    <p className="text-[9px] text-slate-400 dark:text-slate-400 font-semibold uppercase mt-0.5">Budget Allocation</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory(b.category);
                    setEditLimit(limit.toString());
                    setEditModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg border border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 transition-colors"
                  title="Configure Allocation Limit"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Progress and Spending Details */}
              <div className="space-y-3.5">

                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">Spent</span>
                    <span className="text-sm font-extrabold text-slate-800 dark:text-zinc-200 mt-1 inline-block">{currency}{spent.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">Limit</span>
                    <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 mt-1 inline-block">{currency}{limit.toLocaleString()}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="w-full bg-slate-50 dark:bg-zinc-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${usagePercent > 100
                        ? 'bg-rose-600'
                        : usagePercent > 80
                          ? 'bg-amber-500'
                          : meta.color
                        }`}
                      style={{ width: `${Math.min(100, usagePercent)}%` }}
                    />
                  </div>

                  {/* Status alert text */}
                  <div className="flex items-center justify-between mt-2.5">
                    <span className={`text-[9px] font-bold flex items-center gap-1 ${usagePercent > 100
                      ? 'text-rose-500'
                      : usagePercent > 80
                        ? 'text-amber-500'
                        : 'text-emerald-500'
                      }`}>
                      {usagePercent > 100 ? (
                        <>
                          <AlertTriangle className="h-3 w-3 shrink-0" /> Over budget
                        </>
                      ) : usagePercent > 80 ? (
                        <>
                          <AlertTriangle className="h-3 w-3 shrink-0" /> Approaching cap
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3 w-3 shrink-0" /> Within bounds
                        </>
                      )}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-400">{usagePercent.toFixed(0)}% utilized</span>
                  </div>

                </div>

              </div>

            </motion.div>
          );
        })}

      </div>

      {/* ========================================================
          MODALS SECTION - React-driven Dialog wrappers
         ======================================================== */}

      {/* 1. Edit Budget Modal */}
      <AnimatePresence>
        {editModalOpen && selectedCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setEditModalOpen(false)} className="absolute inset-0 bg-black" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative z-10 m-4"
            >
              <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-100">Adjust Category Budget</h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 mt-1">Set monthly allocation thresholds for <span className="font-bold">{selectedCategory}</span>.</p>

              <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">Allocation Cap Limit ({currency})</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    required
                    value={editLimit}
                    onChange={(e) => setEditLimit(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button type="button" onClick={() => { setEditModalOpen(false); setSelectedCategory(null); }} className="flex-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 py-2.5 text-xs font-bold text-slate-700 dark:text-zinc-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 rounded-xl bg-primary hover:bg-primary-hover py-2.5 text-xs font-bold text-white transition-colors">Save Budget</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
