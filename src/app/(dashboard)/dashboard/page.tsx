'use client';

import React, { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import {
  TrendingUp, TrendingDown, Wallet, Users, PlusCircle, ArrowUpRight, ArrowDownRight, TrendingUp as IconIncome, ArrowRight, Calendar, Sparkles, ShoppingBag, User, Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ExpenseCategory, IncomeCategory, RelationshipType } from '@/lib/types';
import CategoryBadge from '@/components/CategoryBadge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import PageHeader from '@/components/shared/PageHeader';
import SummaryCards from '@/components/dashboard/dashboard/SummaryCards';
import { IncomeExpenseComparison } from '@/components/dashboard/dashboard/FinancialCharts';
import IncomeExpenseComparisonChart from '@/components/dashboard/dashboard/IncomeExpenseComparisonChart';
import CategoryBreakdownChart from '@/components/dashboard/dashboard/CategoryBreakdownChart';
import CardHeader from '@/components/shared/CardHeader';


const ExpenseCategoryPie = dynamic(
  () => import('@/components/dashboard/dashboard/FinancialCharts').then(mod => mod.ExpenseCategoryPie),
  { ssr: false }
);

export default function DashboardPage() {
  const {
    members,
    incomes,
    expenses,
    settings,
    addExpense,
    addIncome,
    addMember
  } = useFinance();

  const currency = settings.familyInfo.currency;

  // Active Modals
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);

  // Form States
  const [expenseForm, setExpenseForm] = useState({
    memberId: '',
    productName: '',
    category: 'Grocery' as ExpenseCategory,
    amount: '',
    quantity: '1',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [incomeForm, setIncomeForm] = useState({
    memberId: '',
    amount: '',
    category: 'Salary' as IncomeCategory,
    date: new Date().toISOString().split('T')[0],
    description: '',
    notes: ''
  });

  const [memberForm, setMemberForm] = useState({
    name: '',
    relationship: 'Spouse' as RelationshipType,
    phone: '',
    status: 'Active' as 'Active' | 'Inactive',
    avatar: '👨'
  });

  // Autofill first member for select default
  useEffect(() => {
    if (members.length > 0) {
      setExpenseForm(prev => ({ ...prev, memberId: members[0].id }));
      setIncomeForm(prev => ({ ...prev, memberId: members[0].id }));
    }
  }, [members]);

  // Current Month String YYYY-MM
  const currentMonthStr = '2026-06'; // Matches mock current date

  // 1. Calculations & Metrics
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBalance = totalIncome - totalExpense;

  const thisMonthIncomes = incomes.filter(i => i.date.startsWith(currentMonthStr));
  const thisMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonthStr));

  const thisMonthIncomeSum = thisMonthIncomes.reduce((sum, i) => sum + i.amount, 0);
  const thisMonthExpenseSum = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // 2. Trend Calculations (Compared to previous month: May 2026)
  const prevMonthStr = '2026-05';
  const prevMonthIncome = incomes.filter(i => i.date.startsWith(prevMonthStr)).reduce((sum, i) => sum + i.amount, 0);
  const prevMonthExpense = expenses.filter(e => e.date.startsWith(prevMonthStr)).reduce((sum, e) => sum + e.amount, 0);

  const incomeTrendPercentage = prevMonthIncome > 0
    ? ((thisMonthIncomeSum - prevMonthIncome) / prevMonthIncome) * 100
    : 0;

  const expenseTrendPercentage = prevMonthExpense > 0
    ? ((thisMonthExpenseSum - prevMonthExpense) / prevMonthExpense) * 100
    : 0;

  // 3. Dynamic Insights Calculations
  // a) Highest spending category this month
  const categorySpending: { [key in ExpenseCategory]?: number } = {};
  thisMonthExpenses.forEach(e => {
    categorySpending[e.category] = (categorySpending[e.category] || 0) + e.amount;
  });
  let highestSpendingCategory: ExpenseCategory | 'None' = 'None';
  let maxCatSpent = 0;
  Object.entries(categorySpending).forEach(([cat, amt]) => {
    if (amt > maxCatSpent) {
      maxCatSpent = amt;
      highestSpendingCategory = cat as ExpenseCategory;
    }
  });

  // b) Most Active Family Member (highest count of expenses overall)
  const memberActivity: { [key: string]: number } = {};
  expenses.forEach(e => {
    memberActivity[e.memberId] = (memberActivity[e.memberId] || 0) + 1;
  });
  let mostActiveMemberId = '';
  let maxActiveCount = 0;
  Object.entries(memberActivity).forEach(([mId, count]) => {
    if (count > maxActiveCount) {
      maxActiveCount = count;
      mostActiveMemberId = mId;
    }
  });
  const mostActiveMember = members.find(m => m.id === mostActiveMemberId);

  // c) Highest Contributor (highest sum of income overall)
  const memberContributions: { [key: string]: number } = {};
  incomes.forEach(i => {
    memberContributions[i.memberId] = (memberContributions[i.memberId] || 0) + i.amount;
  });
  let highestContributorId = '';
  let maxContributorAmt = 0;
  Object.entries(memberContributions).forEach(([mId, amt]) => {
    if (amt > maxContributorAmt) {
      maxContributorAmt = amt;
      highestContributorId = mId;
    }
  });
  const highestContributor = members.find(m => m.id === highestContributorId);

  // 4. Combined Transaction List (Recent Activity - Top 5)
  const combinedTransactions = [
    ...incomes.map(i => ({ ...i, type: 'income' as const })),
    ...expenses.map(e => ({ ...e, type: 'expense' as const }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // 5. Chart Data Formatter (Last 12 Completed Months: Jun 2025 - May 2026)
  const comparisonChartData = Array.from({ length: 12 }).map((_, idx) => {
    // Start from June 2025 (month index 5 of 2025)
    const d = new Date(2025, 5 + idx, 1);
    const monthName = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    const monthNum = String(d.getMonth() + 1).padStart(2, '0');
    const monthPrefix = `${year}-${monthNum}`;

    const monthlyInc = incomes.filter(i => i.date.startsWith(monthPrefix)).reduce((sum, i) => sum + i.amount, 0);
    const monthlyExp = expenses.filter(e => e.date.startsWith(monthPrefix)).reduce((sum, e) => sum + e.amount, 0);

    return {
      month: monthName,
      Income: monthlyInc,
      Expense: monthlyExp
    };
  });

  // Category breakdown chart data for pie
  const categoriesList: ExpenseCategory[] = ['Grocery', 'Food', 'Utilities', 'Medical', 'Education', 'Transportation', 'Entertainment', 'Others'];
  const pieChartData = categoriesList.map(cat => {
    const amt = thisMonthExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
    return { name: cat, value: amt };
  }).filter(c => c.value > 0);

  // Form Submit Handlers
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.memberId || !expenseForm.productName || !expenseForm.amount) return;
    addExpense({
      memberId: expenseForm.memberId,
      productName: expenseForm.productName,
      category: expenseForm.category,
      amount: parseFloat(expenseForm.amount),
      quantity: parseInt(expenseForm.quantity) || 1,
      date: expenseForm.date,
      notes: expenseForm.notes
    });
    setExpenseForm(prev => ({
      ...prev,
      productName: '',
      amount: '',
      notes: ''
    }));
    setExpenseModalOpen(false);
  };

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeForm.memberId || !incomeForm.amount || !incomeForm.description) return;
    addIncome({
      memberId: incomeForm.memberId,
      amount: parseFloat(incomeForm.amount),
      category: incomeForm.category,
      date: incomeForm.date,
      description: incomeForm.description,
      notes: incomeForm.notes
    });
    setIncomeForm(prev => ({
      ...prev,
      amount: '',
      description: '',
      notes: ''
    }));
    setIncomeModalOpen(false);
  };

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name) return;
    addMember({
      name: memberForm.name,
      relationship: memberForm.relationship,
      phone: memberForm.phone,
      status: memberForm.status,
      avatar: memberForm.avatar
    });
    setMemberForm({
      name: '',
      relationship: 'Spouse',
      phone: '',
      status: 'Active',
      avatar: '👨'
    });
    setMemberModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header Area */}
      <PageHeader title="Family Dashboard" description={`Financial health overview for ${settings?.familyInfo?.familyName}`} />

      {/* 1. Summary Cards Matrix */}
      <SummaryCards />

      {/* 2. Charts Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Side: Trends (2/3 width) */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl">
          <IncomeExpenseComparisonChart />
        </div>

        {/* Right Side: Category Breakdown (1/3 width) */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <CardHeader title='Category breakdown' description='Current month expenses distribution' />
          <div className="flex-1 flex items-center justify-center">
            <CategoryBreakdownChart />
          </div>
        </div>

      </div>

      {/* 3. Bottom Row: Top Insights & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Top Insights Card (1/3) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-4.5 w-4.5 text-primary" />
            <h2 className="text-sm font-bold text-zinc-100">Smart Financial Insights</h2>
          </div>

          <div className="space-y-4">

            {/* Highest Spending Category */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/30">
              <span className="h-9 w-9 rounded-lg bg-rose-950/20 text-rose-400 flex items-center justify-center"><ShoppingBag className="h-4.5 w-4.5" /></span>
              <div>
                <p className="text-xs text-zinc-450 font-bold uppercase tracking-wider">Highest Spender Category</p>
                <h4 className="text-sm font-bold text-zinc-200 mt-0.5">{highestSpendingCategory}</h4>
                <span className="text-xs text-zinc-400 font-semibold">{currency}{maxCatSpent.toLocaleString()} spent this month</span>
              </div>
            </div>

            {/* Most Active Family Member */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/30">
              <span className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><User className="h-4.5 w-4.5" /></span>
              <div>
                <p className="text-xs text-zinc-450 font-bold uppercase tracking-wider">Most Active Member</p>
                <h4 className="text-sm font-bold text-zinc-200 mt-0.5">
                  {mostActiveMember ? `${mostActiveMember.avatar} ${mostActiveMember.name}` : 'None'}
                </h4>
                <span className="text-xs text-zinc-400 font-semibold">{maxActiveCount} transactions logged</span>
              </div>
            </div>

            {/* Highest Contributor */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/30">
              <span className="h-9 w-9 rounded-lg bg-emerald-950/20 text-emerald-400 flex items-center justify-center"><Crown className="h-4.5 w-4.5" /></span>
              <div>
                <p className="text-xs text-zinc-450 font-bold uppercase tracking-wider">Highest Contributor</p>
                <h4 className="text-sm font-bold text-zinc-200 mt-0.5">
                  {highestContributor ? `${highestContributor.avatar} ${highestContributor.name}` : 'None'}
                </h4>
                <span className="text-xs text-zinc-400 font-semibold">{currency}{maxContributorAmt.toLocaleString()} total contributed</span>
              </div>
            </div>

          </div>
        </div>

        {/* Recent Transactions List (2/3) */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-zinc-100">Recent Transactions</h2>
              <p className="text-xs text-zinc-450">Latest cash ins and cash outs across the family</p>
            </div>
            <Link
              href="/expenses"
              className="text-sm font-bold text-primary hover:text-primary flex items-center gap-1"
            >
              View All Ledger <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-800/50">
            {combinedTransactions.map((tx) => {
              const member = members.find(m => m.id === tx.memberId);
              const isIncome = tx.type === 'income';
              return (
                <div key={tx.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="text-base h-9 w-9 rounded-xl bg-zinc-800 flex items-center justify-center">
                      {member?.avatar || '👤'}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-250 leading-tight">
                        {isIncome ? (tx as any).description : (tx as any).productName}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-zinc-400">
                          {member?.name}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-zinc-700" />
                        <CategoryBadge category={tx.category} type={tx.type} />
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-extrabold flex items-center justify-end ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isIncome ? <ArrowUpRight className="h-3.5 w-3.5 mr-0.5 shrink-0" /> : <ArrowDownRight className="h-3.5 w-3.5 mr-0.5 shrink-0" />}
                      {isIncome ? '+' : '-'}{currency}{tx.amount.toLocaleString()}
                    </span>
                    <span className="text-xs text-zinc-450 font-semibold mt-1 block">
                      {tx.date}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ========================================================
          MODALS SECTION - React-driven Dialog wrappers
         ======================================================== */}

      {/* 1. Add Expense Modal */}
      <AnimatePresence>
        {expenseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpenseModalOpen(false)}
              className="absolute inset-0 bg-black"
            />
            {/* Dialog Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative z-10 m-4"
            >
              <h3 className="text-base font-extrabold text-zinc-100">Add Family Expense</h3>
              <p className="text-xs text-zinc-400 mt-1">Log a cash-out item for your household budget.</p>

              <form onSubmit={handleExpenseSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Family Member</label>
                  <div className="mt-1.5">
                    <Select
                      value={expenseForm.memberId}
                      onValueChange={(val) => setExpenseForm(prev => ({ ...prev, memberId: val }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Member" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map(m => (
                          <SelectItem key={m.id} value={m.id}>{m.avatar} {m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Product / Item Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Milk, Rice, Medicine, Internet bill"
                    required
                    value={expenseForm.productName}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, productName: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-primary focus:bg-zinc-950"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Category</label>
                    <div className="mt-1.5">
                      <Select
                        value={expenseForm.category}
                        onValueChange={(val) => setExpenseForm(prev => ({ ...prev, category: val as ExpenseCategory }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesList.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Amount ({currency})</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      required
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-primary focus:bg-zinc-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={expenseForm.quantity}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, quantity: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-primary focus:bg-zinc-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Date</label>
                    <input
                      type="date"
                      required
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, date: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Notes (Optional)</label>
                  <textarea
                    placeholder="Short detail..."
                    value={expenseForm.notes}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-1.5 w-full h-16 rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-sm text-zinc-200 outline-none focus:border-primary focus:bg-zinc-950"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setExpenseModalOpen(false)}
                    className="flex-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-xs font-bold text-zinc-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-500 py-2.5 text-xs font-bold text-white transition-colors shadow-md shadow-rose-600/10"
                  >
                    Log Expense
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Add Income Modal */}
      <AnimatePresence>
        {incomeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIncomeModalOpen(false)}
              className="absolute inset-0 bg-black"
            />
            {/* Dialog Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative z-10 m-4"
            >
              <h3 className="text-base font-extrabold text-zinc-100">Add Family Income</h3>
              <p className="text-xs text-zinc-400 mt-1">Log cash earnings or contributions.</p>

              <form onSubmit={handleIncomeSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Family Member</label>
                  <div className="mt-1.5">
                    <Select
                      value={incomeForm.memberId}
                      onValueChange={(val) => setIncomeForm(prev => ({ ...prev, memberId: val }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Member" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map(m => (
                          <SelectItem key={m.id} value={m.id}>{m.avatar} {m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Category</label>
                    <div className="mt-1.5">
                      <Select
                        value={incomeForm.category}
                        onValueChange={(val) => setIncomeForm(prev => ({ ...prev, category: val as IncomeCategory }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Salary', 'Business', 'Investment', 'Freelance', 'Pocket Money', 'Others'].map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Amount ({currency})</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      required
                      value={incomeForm.amount}
                      onChange={(e) => setIncomeForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-primary focus:bg-zinc-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Date</label>
                    <input
                      type="date"
                      required
                      value={incomeForm.date}
                      onChange={(e) => setIncomeForm(prev => ({ ...prev, date: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Monthly salary, Web development contract"
                    required
                    value={incomeForm.description}
                    onChange={(e) => setIncomeForm(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-primary focus:bg-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Notes (Optional)</label>
                  <textarea
                    placeholder="Short details..."
                    value={incomeForm.notes}
                    onChange={(e) => setIncomeForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-1.5 w-full h-16 rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-sm text-zinc-200 outline-none focus:border-primary focus:bg-zinc-950"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIncomeModalOpen(false)}
                    className="flex-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-xs font-bold text-zinc-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white transition-colors shadow-md shadow-emerald-600/10"
                  >
                    Log Income
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Add Member Modal */}
      <AnimatePresence>
        {memberModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMemberModalOpen(false)}
              className="absolute inset-0 bg-black"
            />
            {/* Dialog Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative z-10 m-4"
            >
              <h3 className="text-base font-extrabold text-zinc-100">Add Family Member</h3>
              <p className="text-xs text-zinc-400 mt-1">Add a profile to assign and track financial metrics.</p>

              <form onSubmit={handleMemberSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Name</label>
                  <input
                    type="text"
                    placeholder="Family member full name"
                    required
                    value={memberForm.name}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-primary focus:bg-zinc-950"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Relationship</label>
                    <div className="mt-1.5">
                      <Select
                        value={memberForm.relationship}
                        onValueChange={(val) => setMemberForm(prev => ({ ...prev, relationship: val as RelationshipType }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Sibling', 'Other'].map(rel => (
                            <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Emoji Avatar</label>
                    <div className="mt-1.5">
                      <Select
                        value={memberForm.avatar}
                        onValueChange={(val) => setMemberForm(prev => ({ ...prev, avatar: val }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Avatar" />
                        </SelectTrigger>
                        <SelectContent>
                          {['👨', '👩', '👦', '👧', '👴', '👵', '🧑', '👶'].map(emoji => (
                            <SelectItem key={emoji} value={emoji}>{emoji}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +880 1712-345678"
                    value={memberForm.phone}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-primary focus:bg-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Status</label>
                  <div className="mt-1.5">
                    <Select
                      value={memberForm.status}
                      onValueChange={(val) => setMemberForm(prev => ({ ...prev, status: val as 'Active' | 'Inactive' }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setMemberModalOpen(false)}
                    className="flex-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-xs font-bold text-zinc-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-primary hover:bg-primary-hover py-2.5 text-xs font-bold text-white transition-colors shadow-md shadow-primary/10"
                  >
                    Create Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
