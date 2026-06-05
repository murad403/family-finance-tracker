'use client';

import React, { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { ExpenseCategory, IncomeCategory } from '@/lib/types';
import {
  TrendingUp,
  TrendingDown,
  HelpCircle,
  BarChart3,
  Calendar,
  Sparkles,
  PieChart as IconPie,
  Percent
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic charts loading
const FamilyContributionBar = dynamic(
  () => import('@/components/FinancialCharts').then(mod => mod.FamilyContributionBar),
  { ssr: false }
);

const SavingsTrendArea = dynamic(
  () => import('@/components/FinancialCharts').then(mod => mod.SavingsTrendArea),
  { ssr: false }
);

const ExpenseCategoryPie = dynamic(
  () => import('@/components/FinancialCharts').then(mod => mod.ExpenseCategoryPie),
  { ssr: false }
);

export default function AnalyticsPage() {
  const { incomes, expenses, members, settings } = useFinance();
  const currency = settings.familyInfo.currency;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // 1. Calculations - Savings Trend (Jan - Jun)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const savingsChartData = months.map((m, idx) => {
    const monthNum = String(idx + 1).padStart(2, '0');
    const monthPrefix = `2026-${monthNum}`;
    const monthlyInc = incomes.filter(i => i.date.startsWith(monthPrefix)).reduce((sum, i) => sum + i.amount, 0);
    const monthlyExp = expenses.filter(e => e.date.startsWith(monthPrefix)).reduce((sum, e) => sum + e.amount, 0);
    return {
      month: m,
      Savings: monthlyInc - monthlyExp
    };
  });

  // 2. Calculations - Family Contribution Rankings
  const contributionData = members.map(m => {
    const memberIncome = incomes.filter(i => i.memberId === m.id).reduce((sum, i) => sum + i.amount, 0);
    return {
      name: m.name,
      amount: memberIncome
    };
  }).filter(c => c.amount > 0);

  // 3. Expense Distribution (This Month)
  const currentMonthStr = '2026-06';
  const categoriesList: ExpenseCategory[] = ['Grocery', 'Food', 'Utilities', 'Medical', 'Education', 'Transportation', 'Entertainment', 'Others'];
  const expensePieData = categoriesList.map(cat => {
    const amt = expenses.filter(e => e.category === cat && e.date.startsWith(currentMonthStr)).reduce((sum, e) => sum + e.amount, 0);
    return { name: cat, value: amt };
  }).filter(c => c.value > 0);

  // 4. Calculations - Income Sources Pie Chart (Overall)
  const incomeCategories: IncomeCategory[] = ['Salary', 'Business', 'Investment', 'Freelance', 'Pocket Money', 'Others'];
  const incomePieData = incomeCategories.map(cat => {
    const amt = incomes.filter(i => i.category === cat).reduce((sum, i) => sum + i.amount, 0);
    return { name: cat, value: amt };
  }).filter(c => c.value > 0);

  // 5. Heatmap Calendar (June 2026)
  const year = 2026;
  const month = 5; // June is index 5
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const heatmapDays = [];
  // Empty boxes before month start
  for (let i = 0; i < firstDayIndex; i++) {
    heatmapDays.push({ key: `empty-${i}`, day: null, amount: 0 });
  }
  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayExpenses = expenses.filter(e => e.date === dateStr);
    const daySpent = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
    heatmapDays.push({ key: `day-${d}`, day: d, dateStr, amount: daySpent });
  }

  // Get color scale class based on amount
  const getHeatmapColor = (amount: number) => {
    if (amount === 0) return 'bg-slate-100/80 dark:bg-zinc-800/40 hover:bg-slate-200';
    if (amount <= 100) return 'bg-indigo-100 text-primary dark:bg-indigo-950/40 dark:text-primary hover:bg-indigo-200';
    if (amount <= 500) return 'bg-indigo-300 text-indigo-950 dark:bg-indigo-800/60 dark:text-indigo-100 hover:bg-indigo-400';
    return 'bg-primary text-white dark:bg-primary/100 hover:bg-indigo-700'; // High spend days
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-zinc-50 tracking-tight">Advanced Analytics</h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">Deep dive into family contributions, savings ratios, and daily cash out intensities</p>
      </div>

      {/* Row 1: Savings Trend (2/3) & Contribution Rankings (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Savings Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Savings Rate Progression</h2>
              <p className="text-[11px] text-slate-400 dark:text-slate-400">Monthly net savings (Income minus Expenses)</p>
            </div>
            <span className="p-1 rounded bg-primary/10 text-primary text-sm font-bold">Line Area Tracker</span>
          </div>
          <SavingsTrendArea data={savingsChartData} currency={currency} />
        </div>

        {/* Contribution Rankings */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Family Contributions</h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-400">Total earned revenues by family member</p>
          </div>
          <FamilyContributionBar data={contributionData} currency={currency} />
        </div>

      </div>

      {/* Row 2: Distribution Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Income Sources (Overall) */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Income Stream Categories</h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-400">Allocation breakdown of overall family cash inputs</p>
          </div>
          <div className="flex-1 mt-4">
            <ExpenseCategoryPie data={incomePieData} currency={currency} />
          </div>
        </div>

        {/* Expense Category share (This Month) */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">June Expense Categories share</h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-400">Relative allocation percentages for monthly expenses</p>
          </div>
          <div className="flex-1 mt-4">
            <ExpenseCategoryPie data={expensePieData} currency={currency} />
          </div>
        </div>

      </div>

      {/* Row 3: Visual Heatmap Calendar */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-6 shadow-sm">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-primary dark:text-primary" />
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Expense Heatmap Calendar</h2>
              <p className="text-[11px] text-slate-400">Spending intensity levels for June 2026. Hover or tap cells to inspect daily cash outs.</p>
            </div>
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center gap-3.5 text-sm font-bold text-slate-400">
            <span>Spend levels:</span>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-slate-100 border border-slate-200/80 dark:bg-zinc-800/50 dark:border-zinc-700/60 block" /> <span>0</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-indigo-100 block" /> <span>&le; {currency}100</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-indigo-300 block" /> <span>&le; {currency}500</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-primary block" /> <span>{currency}500+</span>
            </div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-7 gap-2 max-w-xl mx-auto text-center font-bold">

          {/* Weekday labels */}
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div key={idx} className="text-sm font-bold text-slate-400 dark:text-slate-400 py-1.5">{day}</div>
          ))}

          {/* Grid Cells */}
          {heatmapDays.map((cell) => {
            if (cell.day === null) {
              return <div key={cell.key} className="aspect-square bg-transparent rounded-lg"></div>;
            }

            return (
              <div
                key={cell.key}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs relative group cursor-pointer transition-all shadow-sm ${getHeatmapColor(cell.amount)}`}
              >
                <span>{cell.day}</span>

                {/* Tooltip on Hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-28 bg-zinc-950 text-white rounded-lg p-1.5 text-sm opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 text-center font-bold shadow-lg">
                  <p>{cell.dateStr}</p>
                  <p className="text-indigo-400 mt-0.5">Spent: {currency}{cell.amount.toLocaleString()}</p>
                </div>
              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}
