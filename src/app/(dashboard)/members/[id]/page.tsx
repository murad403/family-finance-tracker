'use client';

import React, { use, useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Info
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ExpenseCategory, IncomeCategory } from '@/lib/types';
import CategoryBadge from '@/components/CategoryBadge';

// Dynamically import charts
const IncomeExpenseComparison = dynamic(
  () => import('@/components/FinancialCharts').then(mod => mod.IncomeExpenseComparison),
  { ssr: false }
);

const ExpenseCategoryPie = dynamic(
  () => import('@/components/FinancialCharts').then(mod => mod.ExpenseCategoryPie),
  { ssr: false }
);

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MemberDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const memberId = resolvedParams.id;

  const router = useRouter();
  const { members, incomes, expenses, settings } = useFinance();
  const currency = settings.familyInfo.currency;

  const member = members.find(m => m.id === memberId);

  // Tab State
  const [activeTab, setActiveTab] = useState<'expenses' | 'incomes'>('expenses');
  const [txSearch, setTxSearch] = useState('');

  if (!member) {
    return (
      <div className="text-center py-12">
        <h2 className="text-base font-extrabold text-slate-800 dark:text-zinc-200">Family member not found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">The profile might have been deleted or is invalid.</p>
        <Link
          href="/members"
          className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary dark:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Members
        </Link>
      </div>
    );
  }

  // 1. Individual calculations
  const memberIncomes = incomes.filter(i => i.memberId === memberId);
  const memberExpenses = expenses.filter(e => e.memberId === memberId);

  const totalIncome = memberIncomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = memberExpenses.reduce((sum, e) => sum + e.amount, 0);
  const currentBalance = totalIncome - totalExpense;

  const currentMonthStr = '2026-06';
  const thisMonthIncome = memberIncomes.filter(i => i.date.startsWith(currentMonthStr)).reduce((sum, i) => sum + i.amount, 0);
  const thisMonthExpense = memberExpenses.filter(e => e.date.startsWith(currentMonthStr)).reduce((sum, e) => sum + e.amount, 0);

  // 2. Personal Chart Data (Jan - Jun)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const personalChartData = months.map((m, idx) => {
    const monthNum = String(idx + 1).padStart(2, '0');
    const monthPrefix = `2026-${monthNum}`;
    const incSum = memberIncomes.filter(i => i.date.startsWith(monthPrefix)).reduce((sum, i) => sum + i.amount, 0);
    const expSum = memberExpenses.filter(e => e.date.startsWith(monthPrefix)).reduce((sum, e) => sum + e.amount, 0);
    return {
      month: m,
      Income: incSum,
      Expense: expSum
    };
  });

  // Category data for this member
  const categoriesList: ExpenseCategory[] = ['Grocery', 'Food', 'Utilities', 'Medical', 'Education', 'Transportation', 'Entertainment', 'Others'];
  const pieChartData = categoriesList.map(cat => {
    const amt = memberExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
    return { name: cat, value: amt };
  }).filter(c => c.value > 0);

  // Filter lists
  const filteredExpenses = memberExpenses.filter(e =>
    e.productName.toLowerCase().includes(txSearch.toLowerCase()) ||
    e.category.toLowerCase().includes(txSearch.toLowerCase()) ||
    e.date.includes(txSearch)
  );

  const filteredIncomes = memberIncomes.filter(i =>
    i.description.toLowerCase().includes(txSearch.toLowerCase()) ||
    i.category.toLowerCase().includes(txSearch.toLowerCase()) ||
    i.date.includes(txSearch)
  );

  return (
    <div className="space-y-6">

      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/members"
            className="p-2 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-zinc-400" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{member.avatar}</span>
              <h1 className="text-2xl font-black text-zinc-50 tracking-tight">{member.name}</h1>
            </div>
            <p className="text-sm text-zinc-400 mt-0.5">
              Personal workspace ledger ({member.relationship}) • {member.status} status
            </p>
          </div>
        </div>
      </div>

      {/* 1. Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

        {/* Lifetime Income */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm hover-glow">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Lifetime Income</span>
            <span className="p-1 rounded-lg bg-emerald-950/20 text-emerald-400"><TrendingUp className="h-4.5 w-4.5" /></span>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-extrabold text-zinc-100">+{currency}{totalIncome.toLocaleString()}</h3>
            <span className="text-xs text-zinc-450 font-semibold block mt-0.5">Total earnings logging</span>
          </div>
        </div>

        {/* Lifetime Expenses */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm hover-glow">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Lifetime Expenses</span>
            <span className="p-1 rounded-lg bg-rose-950/20 text-rose-400"><TrendingDown className="h-4.5 w-4.5" /></span>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-extrabold text-zinc-100">-{currency}{totalExpense.toLocaleString()}</h3>
            <span className="text-xs text-zinc-450 font-semibold block mt-0.5">Total personal spendings</span>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm hover-glow">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Net Balance</span>
            <span className="p-1 rounded-lg bg-primary/10 text-primary"><Wallet className="h-4.5 w-4.5" /></span>
          </div>
          <div className="mt-3">
            <h3 className={`text-lg font-extrabold ${currentBalance >= 0 ? 'text-zinc-100' : 'text-rose-400'}`}>
              {currency}{currentBalance.toLocaleString()}
            </h3>
            <span className="text-xs text-zinc-450 font-semibold block mt-0.5">Net capital contribution</span>
          </div>
        </div>

        {/* This Month Income */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm hover-glow">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">MTD Income</span>
            <span className="p-1 rounded-lg bg-emerald-950/20 text-emerald-400"><Activity className="h-4.5 w-4.5" /></span>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-extrabold text-zinc-100">+{currency}{thisMonthIncome.toLocaleString()}</h3>
            <span className="text-xs text-zinc-450 font-semibold block mt-0.5">June 2026 contributions</span>
          </div>
        </div>

        {/* This Month Expenses */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm hover-glow">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">MTD Expenses</span>
            <span className="p-1 rounded-lg bg-rose-950/20 text-rose-400"><TrendingDown className="h-4.5 w-4.5" /></span>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-extrabold text-zinc-100">-{currency}{thisMonthExpense.toLocaleString()}</h3>
            <span className="text-xs text-zinc-450 font-semibold block mt-0.5">June 2026 spendings</span>
          </div>
        </div>

      </div>

      {/* 2. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Trend comparison (2/3) */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div>
            <h2 className="text-sm font-bold text-zinc-100">Personal Income vs Expense Trends</h2>
            <p className="text-xs text-zinc-400">6-Month monthly comparison stats for {member.name}</p>
          </div>
          <div className="mt-6">
            <IncomeExpenseComparison data={personalChartData} currency={currency} />
          </div>
        </div>

        {/* Category breakdown (1/3) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-zinc-100">Spending Breakdown</h2>
            <p className="text-xs text-zinc-400">Personal expenditure share across categories</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <ExpenseCategoryPie data={pieChartData} currency={currency} />
          </div>
        </div>

      </div>

      {/* 3. Member Transaction History */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm overflow-hidden">

        {/* Ledger Control Header */}
        <div className="p-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-zinc-100">Member History Ledger</h2>

            {/* Tabs switcher */}
            <div className="inline-flex rounded-xl bg-zinc-800 p-1">
              <button
                onClick={() => { setActiveTab('expenses'); setTxSearch(''); }}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${activeTab === 'expenses'
                  ? 'bg-zinc-950 text-primary shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
                  }`}
              >
                Expenses
              </button>
              <button
                onClick={() => { setActiveTab('incomes'); setTxSearch(''); }}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${activeTab === 'incomes'
                  ? 'bg-zinc-950 text-primary shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
                  }`}
              >
                Incomes
              </button>
            </div>
          </div>

          {/* Search box within tab ledger */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={txSearch}
              onChange={(e) => setTxSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pl-3 pr-8 text-sm outline-none transition-all placeholder:text-zinc-550 text-zinc-100 focus:border-primary focus:bg-zinc-900/50"
            />
          </div>
        </div>

        {/* Ledger Tables */}
        <div className="overflow-x-auto">
          {activeTab === 'expenses' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/40 text-sm font-bold uppercase tracking-wider text-zinc-400">
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Unit Amt</th>
                  <th className="py-3 px-6 text-right">Total Expense</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-sm text-zinc-300">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs font-semibold text-zinc-400">
                      No expense records logged.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map(e => (
                    <tr key={e.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3.5 px-6 font-semibold">{e.date}</td>
                      <td className="py-3.5 px-4 font-bold text-zinc-100">{e.productName}</td>
                      <td className="py-3.5 px-4">
                        <CategoryBadge category={e.category} type="expense" />
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold">{e.quantity}</td>
                      <td className="py-3.5 px-4 text-right">{currency}{(e.amount / e.quantity).toFixed(0)}</td>
                      <td className="py-3.5 px-6 text-right font-extrabold text-rose-400">-{currency}{e.amount.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/40 text-sm font-bold uppercase tracking-wider text-zinc-400">
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-6 text-right">Total Income</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-sm text-zinc-300">
                {filteredIncomes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs font-semibold text-zinc-400">
                      No income records logged.
                    </td>
                  </tr>
                ) : (
                  filteredIncomes.map(i => (
                    <tr key={i.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3.5 px-6 font-semibold">{i.date}</td>
                      <td className="py-3.5 px-4 font-bold text-zinc-100">{i.description}</td>
                      <td className="py-3.5 px-4">
                        <CategoryBadge category={i.category} type="income" />
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400 max-w-50 truncate">{i.notes || '-'}</td>
                      <td className="py-3.5 px-6 text-right font-extrabold text-emerald-400">+{currency}{i.amount.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>

    </div>
  );
}
