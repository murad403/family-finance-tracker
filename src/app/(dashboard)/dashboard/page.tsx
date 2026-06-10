'use client';
import React, { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ExpenseCategory, IncomeCategory, RelationshipType } from '@/lib/types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import PageHeader from '@/components/shared/PageHeader';
import SummaryCards from '@/components/dashboard/dashboard/SummaryCards';
import IncomeExpenseComparisonChart from '@/components/dashboard/dashboard/IncomeExpenseComparisonChart';
import CategoryBreakdownChart from '@/components/dashboard/dashboard/CategoryBreakdownChart';
import SmartFinancialInsights from '@/components/dashboard/dashboard/SmartFinancialInsights';
import RecentTransactions from '@/components/dashboard/dashboard/RecentTransactions';


const DashboardPage = () => {
  const { members, incomes, expenses, settings, addExpense, addIncome, addMember } = useFinance();

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
  const thisMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonthStr));

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


  // Category breakdown chart data for pie
  const categoriesList: ExpenseCategory[] = ['Grocery', 'Food', 'Utilities', 'Medical', 'Education', 'Transportation', 'Entertainment', 'Others'];
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
    <div className="space-y-4">
      {/* Page Header Area */}
      <PageHeader title="Family Dashboard" description={`Financial health overview for ${settings?.familyInfo?.familyName}`} />

      {/* 1. Summary Cards Matrix */}
      <SummaryCards />

      {/* 2. Charts Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <IncomeExpenseComparisonChart />
        <CategoryBreakdownChart />
      </div>

      {/* 3. Bottom Row: Top Insights & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SmartFinancialInsights />
        <RecentTransactions />
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


export default DashboardPage;