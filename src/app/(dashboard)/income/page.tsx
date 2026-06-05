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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

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
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Combined Income</span>
            <h3 className="text-xl font-extrabold text-zinc-100 mt-1">{currency}{totalIncomeSum.toLocaleString()}</h3>
          </div>
          <span className="p-2 bg-emerald-950/20 text-emerald-400 rounded-xl"><TrendingUp className="h-5 w-5" /></span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">This Month Income (June)</span>
            <h3 className="text-xl font-extrabold text-zinc-100 mt-1">{currency}{thisMonthIncomeSum.toLocaleString()}</h3>
          </div>
          <span className="p-2 bg-primary/10 text-primary rounded-xl"><ArrowUpRight className="h-5 w-5" /></span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Average Monthly Income</span>
            <h3 className="text-xl font-extrabold text-zinc-100 mt-1">
              {currency}{Math.round(totalIncomeSum / (uniqueMonths.length || 1)).toLocaleString()}
            </h3>
          </div>
          <span className="p-2 bg-violet-950/20 text-violet-400 rounded-xl"><CalendarDays className="h-5 w-5" /></span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search details or categories..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pl-9 pr-4 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-primary focus:bg-zinc-950 text-zinc-200"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-400">
            <Filter className="h-3.5 w-3.5 text-zinc-400" /> Filters:
          </div>

          {/* Member Filter */}
          <div className="w-44">
            <Select
              value={memberFilter}
              onValueChange={(val) => { setMemberFilter(val); setCurrentPage(1); }}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="All Members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Members</SelectItem>
                {members.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.avatar} {m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month Filter */}
          <div className="w-44">
            <Select
              value={monthFilter}
              onValueChange={(val) => { setMonthFilter(val); setCurrentPage(1); }}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="All Months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Months</SelectItem>
                {uniqueMonths.map(m => (
                  <SelectItem key={m} value={m}>{getMonthName(m)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sorting */}
          <div className="w-44">
            <Select
              value={`${sortField}-${sortOrder}`}
              onValueChange={(val) => {
                const [field, order] = val.split('-');
                setSortField(field as 'date' | 'amount');
                setSortOrder(order as 'asc' | 'desc');
              }}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date: Newest</SelectItem>
                <SelectItem value="date-asc">Date: Oldest</SelectItem>
                <SelectItem value="amount-desc">Amount: Highest</SelectItem>
                <SelectItem value="amount-asc">Amount: Lowest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

      </div>

      {/* Ledger Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/45 text-sm font-bold uppercase tracking-wider text-zinc-400">
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-4">Member</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Description</th>
                <th className="py-4 px-4">Notes</th>
                <th className="py-4 px-4 text-right">Amount</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-sm">
              {paginatedIncomes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm font-semibold text-zinc-400">
                    No incomes found for this search/filter layout.
                  </td>
                </tr>
              ) : (
                paginatedIncomes.map((i) => {
                  const member = members.find(m => m.id === i.memberId);
                  return (
                    <tr key={i.id} className="hover:bg-zinc-800/30 transition-colors">
                      {/* Date */}
                      <td className="py-4 px-6 font-semibold text-zinc-200">
                        {i.date}
                      </td>

                      {/* Member */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{member?.avatar}</span>
                          <span className="font-bold text-zinc-200">{member?.name}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <CategoryBadge category={i.category} type="income" />
                      </td>

                      {/* Description */}
                      <td className="py-4 px-4 font-bold text-zinc-200">
                        {i.description}
                      </td>

                      {/* Notes */}
                      <td className="py-4 px-4 text-zinc-400 max-w-50 truncate">
                        {i.notes || '-'}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 text-right font-extrabold text-emerald-400 text-sm">
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
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/85 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedIncome(i);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/85 transition-colors"
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
          <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredIncomes.length)} of {filteredIncomes.length} records
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4 text-zinc-400" />
              </button>
              <span className="text-sm font-bold text-zinc-200 px-3">{currentPage} / {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4 text-zinc-400" />
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
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative z-10 m-4"
            >
              <h3 className="text-base font-extrabold text-zinc-100">Add Family Income</h3>
              <p className="text-xs text-zinc-400 mt-1">Log cash earnings or contributions.</p>

              <form onSubmit={handleAddSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Family Member</label>
                  <div className="mt-1.5">
                    <Select
                      value={newIncomeForm.memberId}
                      onValueChange={(val) => setNewIncomeForm(prev => ({ ...prev, memberId: val }))}
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
                        value={newIncomeForm.category}
                        onValueChange={(val) => setNewIncomeForm(prev => ({ ...prev, category: val as IncomeCategory }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
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
                      value={newIncomeForm.amount}
                      onChange={(e) => setNewIncomeForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Date</label>
                  <input
                    type="date"
                    required
                    value={newIncomeForm.date}
                    onChange={(e) => setNewIncomeForm(prev => ({ ...prev, date: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Consultancy invoice, Salary payout"
                    required
                    value={newIncomeForm.description}
                    onChange={(e) => setNewIncomeForm(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-primary focus:bg-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Notes (Optional)</label>
                  <textarea
                    placeholder="Provide context..."
                    value={newIncomeForm.notes}
                    onChange={(e) => setNewIncomeForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-1.5 w-full h-16 rounded-xl border border-zinc-800 bg-zinc-955 p-2.5 text-sm text-zinc-200 outline-none focus:border-primary focus:bg-zinc-950"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="flex-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-xs font-bold text-zinc-200 transition-colors"
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
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative z-10 m-4"
            >
              <h3 className="text-base font-extrabold text-zinc-100">Edit Income Log</h3>
              <p className="text-xs text-zinc-400 mt-1">Modify income details and amount values.</p>

              <form onSubmit={handleEditSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Family Member</label>
                  <div className="mt-1.5">
                    <Select
                      value={editIncomeForm.memberId}
                      onValueChange={(val) => setEditIncomeForm(prev => prev ? ({ ...prev, memberId: val }) : null)}
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
                        value={editIncomeForm.category}
                        onValueChange={(val) => setEditIncomeForm(prev => prev ? ({ ...prev, category: val as IncomeCategory }) : null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
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
                      required
                      value={editIncomeForm.amount}
                      onChange={(e) => setEditIncomeForm(prev => prev ? ({ ...prev, amount: parseFloat(e.target.value) || 0 }) : null)}
                      className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Date</label>
                  <input
                    type="date"
                    required
                    value={editIncomeForm.date}
                    onChange={(e) => setEditIncomeForm(prev => prev ? ({ ...prev, date: e.target.value }) : null)}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Description</label>
                  <input
                    type="text"
                    required
                    value={editIncomeForm.description}
                    onChange={(e) => setEditIncomeForm(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-primary focus:bg-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Notes (Optional)</label>
                  <textarea
                    value={editIncomeForm.notes || ''}
                    onChange={(e) => setEditIncomeForm(prev => prev ? ({ ...prev, notes: e.target.value }) : null)}
                    className="mt-1.5 w-full h-16 rounded-xl border border-zinc-800 bg-zinc-955 p-2.5 text-sm text-zinc-200 outline-none focus:border-primary"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => { setEditModalOpen(false); setSelectedIncome(null); }}
                    className="flex-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-xs font-bold text-zinc-200 transition-colors"
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
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative z-10 m-4 text-center"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-955/20 text-rose-400">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold text-zinc-100 mt-4">Delete Income Log</h3>
              <p className="text-xs text-zinc-400 mt-2 font-medium">
                Are you sure you want to delete the income log <span className="font-bold text-zinc-200">"{selectedIncome.description}"</span> of <span className="font-bold text-zinc-200">{currency}{selectedIncome.amount.toLocaleString()}</span>?
              </p>

              <div className="flex gap-2.5 mt-5">
                <button
                  type="button"
                  onClick={() => { setDeleteModalOpen(false); setSelectedIncome(null); }}
                  className="flex-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-xs font-bold text-zinc-200 transition-colors"
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
