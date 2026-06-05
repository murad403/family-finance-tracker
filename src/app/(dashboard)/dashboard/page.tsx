'use client';

import React, { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Users, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp as IconIncome,
  ArrowRight,
  Calendar,
  Sparkles,
  ShoppingBag,
  User,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ExpenseCategory, IncomeCategory, RelationshipType } from '@/lib/types';

// Dynamically import charts to avoid hydration errors
const IncomeExpenseComparison = dynamic(
  () => import('@/components/FinancialCharts').then(mod => mod.IncomeExpenseComparison),
  { ssr: false }
);

const ExpenseCategoryPie = dynamic(
  () => import('@/components/FinancialCharts').then(mod => mod.ExpenseCategoryPie),
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

  // 5. Chart Data Formatter (Jan - Jun)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const comparisonChartData = months.map((m, idx) => {
    const monthNum = String(idx + 1).padStart(2, '0');
    const monthPrefix = `2026-${monthNum}`;
    const monthlyInc = incomes.filter(i => i.date.startsWith(monthPrefix)).reduce((sum, i) => sum + i.amount, 0);
    const monthlyExp = expenses.filter(e => e.date.startsWith(monthPrefix)).reduce((sum, e) => sum + e.amount, 0);
    return {
      month: m,
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-zinc-50 tracking-tight">Family Dashboard</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">Financial health overview for {settings.familyInfo.familyName}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setExpenseModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-600/10 active:scale-[0.98] transition-all dark:bg-rose-600 dark:hover:bg-rose-500"
          >
            <PlusCircle className="h-4 w-4" /> Add Expense
          </button>
          <button 
            onClick={() => setIncomeModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/10 active:scale-[0.98] transition-all dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <PlusCircle className="h-4 w-4" /> Add Income
          </button>
          <button 
            onClick={() => setMemberModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-hover px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/10 active:scale-[0.98] transition-all dark:bg-primary/100 dark:hover:bg-primary"
          >
            <PlusCircle className="h-4 w-4" /> Add Member
          </button>
        </div>
      </div>

      {/* 1. Summary Cards Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Total Income */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-4 shadow-sm hover-glow"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Total Income</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"><TrendingUp className="h-4 w-4" /></span>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-zinc-100">{currency}{totalIncome.toLocaleString()}</h3>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold block mt-0.5">Lifetime earnings</span>
          </div>
        </motion.div>

        {/* Total Expenses */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-4 shadow-sm hover-glow"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Total Expenses</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"><TrendingDown className="h-4 w-4" /></span>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-zinc-100">{currency}{totalExpense.toLocaleString()}</h3>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold block mt-0.5">Lifetime spending</span>
          </div>
        </motion.div>

        {/* Remaining Balance */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-4 shadow-sm hover-glow"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Net Balance</span>
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary"><Wallet className="h-4 w-4" /></span>
          </div>
          <div className="mt-3">
            <h3 className={`text-lg font-extrabold ${remainingBalance >= 0 ? 'text-slate-900 dark:text-zinc-100' : 'text-rose-600'}`}>
              {currency}{remainingBalance.toLocaleString()}
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold block mt-0.5">Total net assets</span>
          </div>
        </motion.div>

        {/* Total Family Members */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-4 shadow-sm hover-glow"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Family Members</span>
            <span className="p-1.5 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400"><Users className="h-4 w-4" /></span>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-zinc-100">{members.length}</h3>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold block mt-0.5">Active profiles</span>
          </div>
        </motion.div>

        {/* This Month Income */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-4 shadow-sm hover-glow"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">This Month Income</span>
            <span className="text-emerald-500 text-[10px] font-bold flex items-center gap-0.5">
              {incomeTrendPercentage >= 0 ? '+' : ''}{incomeTrendPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-zinc-100">{currency}{thisMonthIncomeSum.toLocaleString()}</h3>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold block mt-0.5">June 2026 earnings</span>
          </div>
        </motion.div>

        {/* This Month Expenses */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-4 shadow-sm hover-glow"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">This Month Exp.</span>
            <span className={`${expenseTrendPercentage > 0 ? 'text-rose-500' : 'text-emerald-500'} text-[10px] font-bold flex items-center gap-0.5`}>
              {expenseTrendPercentage >= 0 ? '+' : ''}{expenseTrendPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-zinc-100">{currency}{thisMonthExpenseSum.toLocaleString()}</h3>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold block mt-0.5">June 2026 spending</span>
          </div>
        </motion.div>

      </div>

      {/* 2. Charts Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Trends (2/3 width) */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Income vs Expense Trends</h2>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">Monthly progression over the last 6 months</p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary rounded-full">2026 Stats</span>
          </div>
          <IncomeExpenseComparison data={comparisonChartData} currency={currency} />
        </div>

        {/* Right Side: Category Breakdown (1/3 width) */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Category breakdown</h2>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500">Current month expenses distribution</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <ExpenseCategoryPie data={pieChartData} currency={currency} />
          </div>
        </div>

      </div>

      {/* 3. Bottom Row: Top Insights & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Insights Card (1/3) */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-4.5 w-4.5 text-primary dark:text-primary" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Smart Financial Insights</h2>
          </div>

          <div className="space-y-4">
            
            {/* Highest Spending Category */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50/50 dark:bg-zinc-950/50 border border-slate-200/30 dark:border-zinc-800/30">
              <span className="h-9 w-9 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 flex items-center justify-center"><ShoppingBag className="h-4.5 w-4.5" /></span>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold dark:text-zinc-500 uppercase tracking-wider">Highest Spender Category</p>
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 mt-0.5">{highestSpendingCategory}</h4>
                <span className="text-[10px] text-slate-400 font-semibold">{currency}{maxCatSpent.toLocaleString()} spent this month</span>
              </div>
            </div>

            {/* Most Active Family Member */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50/50 dark:bg-zinc-950/50 border border-slate-200/30 dark:border-zinc-800/30">
              <span className="h-9 w-9 rounded-lg bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary flex items-center justify-center"><User className="h-4.5 w-4.5" /></span>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold dark:text-zinc-500 uppercase tracking-wider">Most Active Member</p>
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 mt-0.5">
                  {mostActiveMember ? `${mostActiveMember.avatar} ${mostActiveMember.name}` : 'None'}
                </h4>
                <span className="text-[10px] text-slate-400 font-semibold">{maxActiveCount} transactions logged</span>
              </div>
            </div>

            {/* Highest Contributor */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50/50 dark:bg-zinc-950/50 border border-slate-200/30 dark:border-zinc-800/30">
              <span className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 flex items-center justify-center"><Crown className="h-4.5 w-4.5" /></span>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold dark:text-zinc-500 uppercase tracking-wider">Highest Contributor</p>
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 mt-0.5">
                  {highestContributor ? `${highestContributor.avatar} ${highestContributor.name}` : 'None'}
                </h4>
                <span className="text-[10px] text-slate-400 font-semibold">{currency}{maxContributorAmt.toLocaleString()} total contributed</span>
              </div>
            </div>

          </div>
        </div>

        {/* Recent Transactions List (2/3) */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Recent Transactions</h2>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">Latest cash ins and cash outs across the family</p>
            </div>
            <Link 
              href="/expenses" 
              className="text-[10px] font-bold text-primary hover:text-primary dark:text-primary flex items-center gap-1"
            >
              View All Ledger <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-zinc-800/50">
            {combinedTransactions.map((tx) => {
              const member = members.find(m => m.id === tx.memberId);
              const isIncome = tx.type === 'income';
              return (
                <div key={tx.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="text-base h-9 w-9 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                      {member?.avatar || '👤'}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 leading-tight">
                        {isIncome ? (tx as any).description : (tx as any).productName}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500">
                          {member?.name}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-zinc-700" />
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400 rounded-md">
                          {tx.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-extrabold flex items-center justify-end ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {isIncome ? <ArrowUpRight className="h-3.5 w-3.5 mr-0.5 shrink-0" /> : <ArrowDownRight className="h-3.5 w-3.5 mr-0.5 shrink-0" />}
                      {isIncome ? '+' : '-'}{currency}{tx.amount.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block">
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
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative z-10 m-4"
            >
              <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-100">Add Family Expense</h3>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">Log a cash-out item for your household budget.</p>

              <form onSubmit={handleExpenseSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Family Member</label>
                  <select 
                    value={expenseForm.memberId}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, memberId: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.avatar} {m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Product / Item Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Milk, Rice, Medicine, Internet bill"
                    required
                    value={expenseForm.productName}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, productName: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:focus:border-primary-hover"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Category</label>
                    <select 
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value as ExpenseCategory }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                    >
                      {categoriesList.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Amount ({currency})</label>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      required
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:focus:border-primary-hover"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Quantity</label>
                    <input 
                      type="number" 
                      min="1"
                      value={expenseForm.quantity}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, quantity: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:focus:border-primary-hover"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Date</label>
                    <input 
                      type="date" 
                      required
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, date: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Notes (Optional)</label>
                  <textarea 
                    placeholder="Short detail..."
                    value={expenseForm.notes}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-1.5 w-full h-16 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:focus:border-primary-hover"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setExpenseModalOpen(false)}
                    className="flex-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 py-2.5 text-xs font-bold text-slate-700 dark:text-zinc-200 transition-colors"
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
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative z-10 m-4"
            >
              <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-100">Add Family Income</h3>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">Log cash earnings or contributions.</p>

              <form onSubmit={handleIncomeSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Family Member</label>
                  <select 
                    value={incomeForm.memberId}
                    onChange={(e) => setIncomeForm(prev => ({ ...prev, memberId: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.avatar} {m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Category</label>
                    <select 
                      value={incomeForm.category}
                      onChange={(e) => setIncomeForm(prev => ({ ...prev, category: e.target.value as IncomeCategory }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                    >
                      {['Salary', 'Business', 'Investment', 'Freelance', 'Pocket Money', 'Others'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Amount ({currency})</label>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      required
                      value={incomeForm.amount}
                      onChange={(e) => setIncomeForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:focus:border-primary-hover"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Date</label>
                    <input 
                      type="date" 
                      required
                      value={incomeForm.date}
                      onChange={(e) => setIncomeForm(prev => ({ ...prev, date: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Description</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Monthly salary, Web development contract"
                    required
                    value={incomeForm.description}
                    onChange={(e) => setIncomeForm(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:focus:border-primary-hover"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Notes (Optional)</label>
                  <textarea 
                    placeholder="Short details..."
                    value={incomeForm.notes}
                    onChange={(e) => setIncomeForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-1.5 w-full h-16 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:focus:border-primary-hover"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIncomeModalOpen(false)}
                    className="flex-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 py-2.5 text-xs font-bold text-slate-700 dark:text-zinc-200 transition-colors"
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
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative z-10 m-4"
            >
              <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-100">Add Family Member</h3>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">Add a profile to assign and track financial metrics.</p>

              <form onSubmit={handleMemberSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Name</label>
                  <input 
                    type="text" 
                    placeholder="Family member full name"
                    required
                    value={memberForm.name}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:focus:border-primary-hover"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Relationship</label>
                    <select 
                      value={memberForm.relationship}
                      onChange={(e) => setMemberForm(prev => ({ ...prev, relationship: e.target.value as RelationshipType }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                    >
                      {['Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Sibling', 'Other'].map(rel => (
                        <option key={rel} value={rel}>{rel}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Emoji Avatar</label>
                    <select 
                      value={memberForm.avatar}
                      onChange={(e) => setMemberForm(prev => ({ ...prev, avatar: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                    >
                      {['👨', '👩', '👦', '👧', '👴', '👵', '🧑', '👶'].map(emoji => (
                        <option key={emoji} value={emoji}>{emoji}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. +880 1712-345678"
                    value={memberForm.phone}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:focus:border-primary-hover"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Status</label>
                  <select 
                    value={memberForm.status}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, status: e.target.value as 'Active' | 'Inactive' }))}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setMemberModalOpen(false)}
                    className="flex-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 py-2.5 text-xs font-bold text-slate-700 dark:text-zinc-200 transition-colors"
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
