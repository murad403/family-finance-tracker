'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { ExpenseCategory, IncomeCategory } from '@/lib/types';
import CategoryBadge from '@/components/CategoryBadge';
import { 
  Printer, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Search, 
  Calendar,
  Filter,
  DollarSign,
  User,
  Tags
} from 'lucide-react';

export default function ReportsPage() {
  const { members, incomes, expenses, settings } = useFinance();
  const currency = settings.familyInfo.currency;

  // Filter States
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'>('monthly');
  const [memberId, setMemberId] = useState('All');
  const [category, setCategory] = useState('All');

  // Custom date range
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2026-06-30');

  // Specific single date filters
  const [singleDate, setSingleDate] = useState('2026-06-05');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('2026-06');

  // Categories helper
  const expenseCategories: ExpenseCategory[] = ['Grocery', 'Food', 'Utilities', 'Medical', 'Education', 'Transportation', 'Entertainment', 'Others'];

  // Resolve dates based on selected period
  const getFilterRange = () => {
    let start = '';
    let end = '';

    if (period === 'daily') {
      start = singleDate;
      end = singleDate;
    } else if (period === 'weekly') {
      // Find starting Monday of the week containing singleDate
      const d = new Date(singleDate);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      const monday = new Date(d.setDate(diff));
      const sunday = new Date(monday);
      sunday.setDate(sunday.getDate() + 6);
      
      start = monday.toISOString().split('T')[0];
      end = sunday.toISOString().split('T')[0];
    } else if (period === 'monthly') {
      start = `${selectedMonth}-01`;
      // Get last day of that month
      const [y, m] = selectedMonth.split('-');
      const lastDay = new Date(parseInt(y), parseInt(m), 0).getDate();
      end = `${selectedMonth}-${String(lastDay).padStart(2, '0')}`;
    } else if (period === 'yearly') {
      start = `${selectedYear}-01-01`;
      end = `${selectedYear}-12-31`;
    } else {
      start = startDate;
      end = endDate;
    }

    return { start, end };
  };

  const { start, end } = getFilterRange();

  // Filter Incomes and Expenses
  const reportIncomes = incomes.filter(i => {
    const inRange = i.date >= start && i.date <= end;
    const matchMember = memberId === 'All' || i.memberId === memberId;
    // Income category match if category filter is 'All' or matches (Note: income categories differ, we only apply if filter matches)
    const matchCategory = category === 'All' || i.category === category; 
    return inRange && matchMember && (category === 'All' || i.category.toLowerCase() === category.toLowerCase());
  });

  const reportExpenses = expenses.filter(e => {
    const inRange = e.date >= start && e.date <= end;
    const matchMember = memberId === 'All' || e.memberId === memberId;
    const matchCategory = category === 'All' || e.category === category;
    return inRange && matchMember && matchCategory;
  });

  // Calculations
  const incomeSum = reportIncomes.reduce((sum, i) => sum + i.amount, 0);
  const expenseSum = reportExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netSavings = incomeSum - expenseSum;
  const savingsRate = incomeSum > 0 ? (netSavings / incomeSum) * 100 : 0;

  // Top Category
  const catSums: { [key: string]: number } = {};
  reportExpenses.forEach(e => {
    catSums[e.category] = (catSums[e.category] || 0) + e.amount;
  });
  let topCategory = 'N/A';
  let topCatAmt = 0;
  Object.entries(catSums).forEach(([cat, amt]) => {
    if (amt > topCatAmt) {
      topCatAmt = amt;
      topCategory = cat;
    }
  });

  // Combined ledger for display in report
  const ledgerItems = [
    ...reportIncomes.map(i => ({ ...i, type: 'income' as const })),
    ...reportExpenses.map(e => ({ ...e, type: 'expense' as const }))
  ].sort((a, b) => a.date.localeCompare(b.date));

  // Trigger browser print
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Printable CSS inject */}
      <style jsx global>{`
        @media print {
          aside, header, .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
          }
          body {
            background-color: white !important;
            color: black !important;
          }
          .print-card {
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
            padding: 0 !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-zinc-50 tracking-tight">Financial Reports</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">Generate visual expense statements, calculate margins, and print summaries</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-hover px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/10 active:scale-[0.98] transition-all"
        >
          <Printer className="h-4 w-4" /> Print Statement
        </button>
      </div>

      {/* Filter Options Panel */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-6 shadow-sm no-print space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Report configuration</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {/* Period Selector */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Report Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 font-semibold"
            >
              <option value="daily">Daily Report</option>
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="yearly">Yearly Report</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {/* Period Date Inputs */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Select Date/Range</label>
            {period === 'daily' && (
              <input
                type="date"
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 font-semibold"
              />
            )}
            {period === 'weekly' && (
              <input
                type="date"
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 font-semibold"
              />
            )}
            {period === 'monthly' && (
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 font-semibold"
              />
            )}
            {period === 'yearly' && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 font-semibold"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
            )}
            {period === 'custom' && (
              <div className="flex gap-2 mt-1.5">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-1/2 rounded-xl border border-slate-200 bg-slate-50/50 px-2 py-1.5 text-[10px] text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-1/2 rounded-xl border border-slate-200 bg-slate-50/50 px-2 py-1.5 text-[10px] text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                />
              </div>
            )}
          </div>

          {/* Member filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Family Member</label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 font-semibold"
            >
              <option value="All">All Family</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.avatar} {m.name}</option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Category Filter</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 font-semibold"
            >
              <option value="All">All Categories</option>
              {expenseCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Prompt */}
          <div className="flex items-end">
            <div className="text-[10px] bg-slate-50 dark:bg-zinc-950 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 text-slate-400 font-semibold leading-normal w-full">
              Period Range: <span className="text-slate-800 dark:text-zinc-200 font-extrabold">{start}</span> to <span className="text-slate-800 dark:text-zinc-200 font-extrabold">{end}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-8 shadow-md print-card">
        
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-start border-b border-slate-200 dark:border-zinc-800 pb-6 mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <h2 className="text-lg font-black text-slate-800 dark:text-zinc-100">Family Finance statement</h2>
            </div>
            <p className="text-xs text-primary font-bold uppercase tracking-wider mt-1">{settings.familyInfo.familyName}</p>
            <p className="text-[10px] text-slate-400 mt-1">Generated: {new Date().toLocaleDateString(undefined, { dateStyle: 'full' })}</p>
          </div>
          
          <div className="text-right sm:text-right">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Statement Range</span>
            <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 mt-1">{start} to {end}</p>
            <p className="text-[10px] text-slate-400 mt-1">Filters: Member [{members.find(m=>m.id===memberId)?.name || 'All'}], Category [{category}]</p>
          </div>
        </div>

        {/* Dynamic Aggregations Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Income */}
          <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-900/40">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Report Income</span>
            <div className="mt-2 flex items-center justify-between text-emerald-600">
              <span className="text-base font-extrabold">+{currency}{incomeSum.toLocaleString()}</span>
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </div>

          {/* Expense */}
          <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-900/40">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Report Expenses</span>
            <div className="mt-2 flex items-center justify-between text-rose-600">
              <span className="text-base font-extrabold">-{currency}{expenseSum.toLocaleString()}</span>
              <TrendingDown className="h-4.5 w-4.5" />
            </div>
          </div>

          {/* Savings */}
          <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-900/40">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Savings</span>
            <div className="mt-2 flex items-center justify-between text-slate-800 dark:text-zinc-200">
              <span className={`text-base font-extrabold ${netSavings >= 0 ? '' : 'text-rose-500'}`}>
                {currency}{netSavings.toLocaleString()}
              </span>
              <FileText className="h-4.5 w-4.5 text-slate-400" />
            </div>
          </div>

          {/* Savings Rate */}
          <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-900/40">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Savings Rate</span>
            <div className="mt-2 flex items-center justify-between text-slate-800 dark:text-zinc-200">
              <span className="text-base font-extrabold">{savingsRate.toFixed(1)}%</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">Margin</span>
            </div>
          </div>

        </div>

        {/* Insights widgets inside the print layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 border border-dashed border-slate-200 rounded-xl dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tags className="h-4.5 w-4.5 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Top spending category in range</span>
            </div>
            <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-250">{topCategory} ({currency}{topCatAmt.toLocaleString()})</span>
          </div>

          <div className="p-4 border border-dashed border-slate-200 rounded-xl dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Ledger items counts</span>
            </div>
            <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-250">{ledgerItems.length} transactions logged</span>
          </div>
        </div>

        {/* Ledger logs */}
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3.5">Statement Ledger logs</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-slate-200 dark:border-zinc-800 text-[10px] font-bold uppercase text-slate-400 dark:text-zinc-500">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Member</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Description/Item</th>
                  <th className="py-2.5 px-3 text-right">Cash In</th>
                  <th className="py-2.5 px-3 text-right">Cash Out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/40">
                {ledgerItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs font-semibold text-slate-400">
                      No ledger transactions logged for this selected time window.
                    </td>
                  </tr>
                ) : (
                  ledgerItems.map(item => {
                    const member = members.find(m => m.id === item.memberId);
                    const isIncome = item.type === 'income';
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/20 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-zinc-300">{item.date}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-700 dark:text-zinc-300">{member?.avatar} {member?.name}</td>
                        <td className="py-2.5 px-3">
                          <CategoryBadge category={item.category} type={item.type} />
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-zinc-150">
                          {isIncome ? (item as any).description : (item as any).productName}
                        </td>
                        <td className="py-2.5 px-3 text-right font-extrabold text-emerald-600">
                          {isIncome ? `+${currency}${item.amount.toLocaleString()}` : ''}
                        </td>
                        <td className="py-2.5 px-3 text-right font-extrabold text-rose-600">
                          {!isIncome ? `-${currency}${item.amount.toLocaleString()}` : ''}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer print disclaimer */}
          <div className="border-t border-slate-200 dark:border-zinc-800 mt-12 pt-6 text-center text-[10px] text-slate-400 leading-normal">
            <p>Family Finance Tracker • Secure private accounting workbook statement.</p>
            <p className="mt-1">All details are stored locally in sandbox data files.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
