'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Income, IncomeCategory } from '@/lib/types';
import { 
  Search, 
  TrendingUp, 
  PlusCircle, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  ArrowUpRight,
  TrendingDown,
  CalendarDays
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryBadge from '@/components/CategoryBadge';

export default function IncomePage() {
  const { 
    members, 
    incomes, 
    addIncome, 
    updateIncome, 
    deleteIncome, 
    settings 
  } = useFinance();

  const currency = settings.familyInfo.currency;

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [memberFilter, setMemberFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState('All');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);

  // Form States
  const [newIncomeForm, setNewIncomeForm] = useState({
    memberId: members[0]?.id || '',
    amount: '',
    category: 'Salary' as IncomeCategory,
    date: new Date().toISOString().split('T')[0],
    description: '',
    notes: ''
  });

  const [editIncomeForm, setEditIncomeForm] = useState<Income | null>(null);

  // 1. Calculations
  const totalIncomeSum = incomes.reduce((sum, i) => sum + i.amount, 0);
  const currentMonthStr = '2026-06';
  const thisMonthIncomeSum = incomes.filter(i => i.date.startsWith(currentMonthStr)).reduce((sum, i) => sum + i.amount, 0);

  // Group months for filter select
  const uniqueMonths = Array.from(new Set(incomes.map(i => i.date.substring(0, 7)))).sort().reverse();
  const getMonthName = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // 2. Submit handlers
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncomeForm.memberId || !newIncomeForm.amount || !newIncomeForm.description) return;
    
    addIncome({
      memberId: newIncomeForm.memberId,
      amount: parseFloat(newIncomeForm.amount),
      category: newIncomeForm.category,
      date: newIncomeForm.date,
      description: newIncomeForm.description,
      notes: newIncomeForm.notes
    });

    setNewIncomeForm({
      memberId: members[0]?.id || '',
      amount: '',
      category: 'Salary',
      date: new Date().toISOString().split('T')[0],
      description: '',
      notes: ''
    });
    setAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editIncomeForm || !editIncomeForm.memberId || !editIncomeForm.amount || !editIncomeForm.description) return;
    
    updateIncome(editIncomeForm);
    setEditModalOpen(false);
    setSelectedIncome(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedIncome) {
      deleteIncome(selectedIncome.id);
      setDeleteModalOpen(false);
      setSelectedIncome(null);
    }
  };

  // 3. Filter & Sort Math
  const filteredIncomes = incomes.filter(i => {
    const matchesSearch = i.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (i.notes && i.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          i.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMember = memberFilter === 'All' || i.memberId === memberFilter;
    const matchesMonth = monthFilter === 'All' || i.date.startsWith(monthFilter);
    return matchesSearch && matchesMember && matchesMonth;
  }).sort((a, b) => {
    if (sortField === 'amount') {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    } else {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredIncomes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIncomes = filteredIncomes.slice(startIndex, startIndex + itemsPerPage);

  const categories: IncomeCategory[] = ['Salary', 'Business', 'Investment', 'Freelance', 'Pocket Money', 'Others'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-zinc-50 tracking-tight">Income Ledger</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">Log and manage non-fixed family earnings & monthly contributions</p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/10 active:scale-[0.98] transition-all dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          <PlusCircle className="h-4 w-4" /> Log Income
        </button>
      </div>

      {/* Dynamic Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Total Combined Income</span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 mt-1">{currency}{totalIncomeSum.toLocaleString()}</h3>
          </div>
          <span className="p-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-xl"><TrendingUp className="h-5 w-5" /></span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">This Month Income (June)</span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 mt-1">{currency}{thisMonthIncomeSum.toLocaleString()}</h3>
          </div>
          <span className="p-2 bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary rounded-xl"><ArrowUpRight className="h-5 w-5" /></span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Average Monthly Income</span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 mt-1">
              {currency}{Math.round(totalIncomeSum / (uniqueMonths.length || 1)).toLocaleString()}
            </h3>
          </div>
          <span className="p-2 bg-violet-50 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400 rounded-xl"><CalendarDays className="h-5 w-5" /></span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 h-4 w-4 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search details or categories..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Filter className="h-3.5 w-3.5 text-slate-400" /> Filters:
          </div>
          
          {/* Member Filter */}
          <select
            value={memberFilter}
            onChange={(e) => { setMemberFilter(e.target.value); setCurrentPage(1); }}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-600 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
          >
            <option value="All">All Members</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.avatar} {m.name}</option>
            ))}
          </select>

          {/* Month Filter */}
          <select
            value={monthFilter}
            onChange={(e) => { setMonthFilter(e.target.value); setCurrentPage(1); }}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-600 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
          >
            <option value="All">All Months</option>
            {uniqueMonths.map(m => (
              <option key={m} value={m}>{getMonthName(m)}</option>
            ))}
          </select>

          {/* Sorting */}
          <select
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortField(field as 'date' | 'amount');
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-600 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
          >
            <option value="date-desc">Date: Newest</option>
            <option value="date-asc">Date: Oldest</option>
            <option value="amount-desc">Amount: Highest</option>
            <option value="amount-asc">Amount: Lowest</option>
          </select>
        </div>

      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-4">Member</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Description</th>
                <th className="py-4 px-4">Notes</th>
                <th className="py-4 px-4 text-right">Amount</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 text-xs">
              {paginatedIncomes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs font-semibold text-slate-400">
                    No incomes found for this search/filter layout.
                  </td>
                </tr>
              ) : (
                paginatedIncomes.map((i) => {
                  const member = members.find(m => m.id === i.memberId);
                  return (
                    <tr key={i.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-900/30 transition-colors">
                      {/* Date */}
                      <td className="py-4 px-6 font-semibold text-slate-800 dark:text-zinc-200">
                        {i.date}
                      </td>

                      {/* Member */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{member?.avatar}</span>
                          <span className="font-bold text-slate-700 dark:text-zinc-300">{member?.name}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <CategoryBadge category={i.category} type="income" />
                      </td>

                      {/* Description */}
                      <td className="py-4 px-4 font-bold text-slate-800 dark:text-zinc-200">
                        {i.description}
                      </td>

                      {/* Notes */}
                      <td className="py-4 px-4 text-slate-400 dark:text-zinc-500 max-w-50 truncate">
                        {i.notes || '-'}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 text-right font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                        +{currency}{i.amount.toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedIncome(i);
                              setEditIncomeForm({ ...i });
                              setEditModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-zinc-800/80 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedIncome(i);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-50 dark:hover:bg-zinc-800/80 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredIncomes.length)} of {filteredIncomes.length} records
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-slate-200/80 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4 text-slate-500 dark:text-zinc-400" />
              </button>
              <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 px-3">{currentPage} / {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg border border-slate-200/80 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4 text-slate-500 dark:text-zinc-400" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================
          MODALS SECTION - React-driven Dialog wrappers
         ======================================================== */}

      {/* 1. Add Income Modal */}
      <AnimatePresence>
        {addModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.5 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setAddModalOpen(false)} 
              className="absolute inset-0 bg-black"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative z-10 m-4"
            >
              <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-100">Add Family Income</h3>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">Log cash earnings or contributions.</p>

              <form onSubmit={handleAddSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Family Member</label>
                  <select 
                    value={newIncomeForm.memberId}
                    onChange={(e) => setNewIncomeForm(prev => ({ ...prev, memberId: e.target.value }))}
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
                      value={newIncomeForm.category}
                      onChange={(e) => setNewIncomeForm(prev => ({ ...prev, category: e.target.value as IncomeCategory }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                    >
                      {categories.map(cat => (
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
                      value={newIncomeForm.amount}
                      onChange={(e) => setNewIncomeForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Date</label>
                  <input 
                    type="date" 
                    required
                    value={newIncomeForm.date}
                    onChange={(e) => setNewIncomeForm(prev => ({ ...prev, date: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Description</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Consultancy invoice, Salary payout"
                    required
                    value={newIncomeForm.description}
                    onChange={(e) => setNewIncomeForm(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Notes (Optional)</label>
                  <textarea 
                    placeholder="Provide context..."
                    value={newIncomeForm.notes}
                    onChange={(e) => setNewIncomeForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-1.5 w-full h-16 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setAddModalOpen(false)}
                    className="flex-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 py-2.5 text-xs font-bold text-slate-700 dark:text-zinc-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white transition-colors"
                  >
                    Log Income
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Edit Income Modal */}
      <AnimatePresence>
        {editModalOpen && editIncomeForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.5 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setEditModalOpen(false)} 
              className="absolute inset-0 bg-black"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative z-10 m-4"
            >
              <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-100">Edit Income Log</h3>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">Modify income details and amount values.</p>

              <form onSubmit={handleEditSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Family Member</label>
                  <select 
                    value={editIncomeForm.memberId}
                    onChange={(e) => setEditIncomeForm(prev => prev ? ({ ...prev, memberId: e.target.value }) : null)}
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
                      value={editIncomeForm.category}
                      onChange={(e) => setEditIncomeForm(prev => prev ? ({ ...prev, category: e.target.value as IncomeCategory }) : null)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Amount ({currency})</label>
                    <input 
                      type="number" 
                      required
                      value={editIncomeForm.amount}
                      onChange={(e) => setEditIncomeForm(prev => prev ? ({ ...prev, amount: parseFloat(e.target.value) || 0 }) : null)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Date</label>
                  <input 
                    type="date" 
                    required
                    value={editIncomeForm.date}
                    onChange={(e) => setEditIncomeForm(prev => prev ? ({ ...prev, date: e.target.value }) : null)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Description</label>
                  <input 
                    type="text" 
                    required
                    value={editIncomeForm.description}
                    onChange={(e) => setEditIncomeForm(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Notes (Optional)</label>
                  <textarea 
                    value={editIncomeForm.notes || ''}
                    onChange={(e) => setEditIncomeForm(prev => prev ? ({ ...prev, notes: e.target.value }) : null)}
                    className="mt-1.5 w-full h-16 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button 
                    type="button" 
                    onClick={() => { setEditModalOpen(false); setSelectedIncome(null); }}
                    className="flex-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 py-2.5 text-xs font-bold text-slate-700 dark:text-zinc-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 rounded-xl bg-primary hover:bg-primary-hover py-2.5 text-xs font-bold text-white transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && selectedIncome && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.5 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setDeleteModalOpen(false)} 
              className="absolute inset-0 bg-black"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative z-10 m-4 text-center"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-100 mt-4">Delete Income Log</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 font-medium">
                Are you sure you want to delete the income log <span className="font-bold">"{selectedIncome.description}"</span> of <span className="font-bold">{currency}{selectedIncome.amount.toLocaleString()}</span>?
              </p>

              <div className="flex gap-2.5 mt-5">
                <button 
                  type="button" 
                  onClick={() => { setDeleteModalOpen(false); setSelectedIncome(null); }}
                  className="flex-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 py-2.5 text-xs font-bold text-slate-700 dark:text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleDeleteConfirm}
                  className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-500 py-2.5 text-xs font-bold text-white transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
