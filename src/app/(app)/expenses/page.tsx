'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Expense, ExpenseCategory } from '@/lib/types';
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  List,
  Table,
  Calendar as CalendarIcon,
  AlertTriangle,
  Receipt,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryBadge from '@/components/CategoryBadge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function ExpensesPage() {
  const {
    members,
    expenses,
    budgets,
    addExpense,
    updateExpense,
    deleteExpense,
    settings
  } = useFinance();

  const currency = settings.familyInfo.currency;

  // View States: 'table' | 'list' | 'calendar'
  const [viewMode, setViewMode] = useState<'table' | 'list' | 'calendar'>('table');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [memberFilter, setMemberFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState('2026-06'); // Default to current month
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Forms state
  const [newExpenseForm, setNewExpenseForm] = useState({
    memberId: members[0]?.id || '',
    productName: '',
    category: 'Grocery' as ExpenseCategory,
    amount: '',
    quantity: '1',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [editExpenseForm, setEditExpenseForm] = useState<Expense | null>(null);

  // Calendar View month controller (June 2026 default)
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(5); // 0-indexed: May is 4, June is 5

  const categories: ExpenseCategory[] = ['Grocery', 'Food', 'Utilities', 'Medical', 'Education', 'Transportation', 'Entertainment', 'Others'];

  // Calculations
  const currentMonthStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}`;
  const monthlyExpenses = expenses.filter(e => e.date.startsWith(currentMonthStr));
  const totalSpentThisMonth = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Unique months list
  const uniqueMonths = Array.from(new Set(expenses.map(e => e.date.substring(0, 7)))).sort().reverse();
  const getMonthName = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Submit Handlers
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseForm.memberId || !newExpenseForm.productName || !newExpenseForm.amount) return;

    addExpense({
      memberId: newExpenseForm.memberId,
      productName: newExpenseForm.productName,
      category: newExpenseForm.category,
      amount: parseFloat(newExpenseForm.amount),
      quantity: parseInt(newExpenseForm.quantity) || 1,
      date: newExpenseForm.date,
      notes: newExpenseForm.notes
    });

    setNewExpenseForm({
      memberId: members[0]?.id || '',
      productName: '',
      category: 'Grocery',
      amount: '',
      quantity: '1',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editExpenseForm || !editExpenseForm.memberId || !editExpenseForm.productName || !editExpenseForm.amount) return;

    updateExpense(editExpenseForm);
    setEditModalOpen(false);
    setSelectedExpense(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedExpense) {
      deleteExpense(selectedExpense.id);
      setDeleteModalOpen(false);
      setSelectedExpense(null);
    }
  };

  // Filter & Sort Logic
  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMember = memberFilter === 'All' || e.memberId === memberFilter;
    const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
    const matchesMonth = monthFilter === 'All' || e.date.startsWith(monthFilter);
    return matchesSearch && matchesMember && matchesCategory && matchesMonth;
  }).sort((a, b) => {
    if (sortField === 'amount') {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    } else {
      return sortOrder === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  // Pagination Math
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

  // Calendar Math Helpers
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
    const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);
    const calendarDays = [];

    // Empty spaces before first day
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="min-h-24 bg-slate-50/40 border border-slate-100 dark:bg-zinc-950/20 dark:border-zinc-800/40"></div>);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayExpenses = expenses.filter(e => e.date === dateStr);
      const dayTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

      calendarDays.push(
        <div
          key={`day-${day}`}
          onClick={() => {
            setNewExpenseForm(prev => ({ ...prev, date: dateStr }));
            setAddModalOpen(true);
          }}
          className="min-h-24 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/60 p-2 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-all cursor-pointer flex flex-col group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 group-hover:text-primary dark:group-hover:text-primary">{day}</span>
            {dayTotal > 0 && (
              <span className="text-sm font-extrabold text-rose-500">{currency}{dayTotal.toLocaleString()}</span>
            )}
          </div>

          <div className="flex-1 mt-1 space-y-1 overflow-hidden max-h-16">
            {dayExpenses.slice(0, 3).map((de) => {
              const mem = members.find(m => m.id === de.memberId);
              return (
                <div key={de.id} className="text-[9px] font-semibold text-slate-600 bg-slate-100 dark:bg-zinc-800 dark:text-zinc-300 px-1 py-0.5 rounded truncate flex items-center justify-between gap-1">
                  <span className="truncate flex items-center gap-0.5">
                    <span>{mem?.avatar || '👤'}</span>
                    <span className="truncate">{de.productName}</span>
                  </span>
                  <span className="shrink-0 font-extrabold text-rose-500">-{currency}{de.amount}</span>
                </div>
              );
            })}
            {dayExpenses.length > 3 && (
              <p className="text-[8px] font-bold text-slate-400 text-center">+{dayExpenses.length - 3} more</p>
            )}
          </div>
        </div>
      );
    }

    return calendarDays;
  };

  const changeCalendarMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (calendarMonth === 0) {
        setCalendarMonth(11);
        setCalendarYear(prev => prev - 1);
      } else {
        setCalendarMonth(prev => prev - 1);
      }
    } else {
      if (calendarMonth === 11) {
        setCalendarMonth(0);
        setCalendarYear(prev => prev + 1);
      } else {
        setCalendarMonth(prev => prev + 1);
      }
    }
  };

  const getCalendarMonthName = () => {
    const tempDate = new Date(calendarYear, calendarMonth, 1);
    return tempDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-zinc-50 tracking-tight">Expenses Ledger</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">Monitor daily family spending, check category bounds, and analyze receipts</p>
        </div>

        {/* View Toggle + Action Button */}
        <div className="flex items-center gap-2">

          {/* View switcher */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-zinc-900 p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`rounded-lg p-1.5 transition-all ${viewMode === 'table'
                ? 'bg-white text-primary shadow-sm dark:bg-zinc-800 dark:text-primary'
                : 'text-slate-500 hover:text-slate-700 dark:text-zinc-400'
                }`}
              title="Table View"
            >
              <Table className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-lg p-1.5 transition-all ${viewMode === 'list'
                ? 'bg-white text-primary shadow-sm dark:bg-zinc-800 dark:text-primary'
                : 'text-slate-500 hover:text-slate-700 dark:text-zinc-400'
                }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`rounded-lg p-1.5 transition-all ${viewMode === 'calendar'
                ? 'bg-white text-primary shadow-sm dark:bg-zinc-800 dark:text-primary'
                : 'text-slate-500 hover:text-slate-700 dark:text-zinc-400'
                }`}
              title="Calendar View"
            >
              <CalendarIcon className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-600/10 active:scale-[0.98] transition-all dark:bg-rose-600 dark:hover:bg-rose-500"
          >
            <PlusCircle className="h-4 w-4" /> Log Expense
          </button>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Total Month Spent */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Spent this month ({getCalendarMonthName()})</span>
            <h3 className="text-xl font-extrabold text-zinc-100 mt-1">{currency}{totalSpentThisMonth.toLocaleString()}</h3>
          </div>
          <span className="p-2 bg-rose-950/20 text-rose-400 rounded-xl"><Receipt className="h-5 w-5" /></span>
        </div>

        {/* Warning card for budget limits */}
        {(() => {
          const limitOverages = budgets.map(b => {
            const currentMonth = currentMonthStr;
            const spent = expenses
              .filter(e => e.category === b.category && e.date.startsWith(currentMonth))
              .reduce((sum, e) => sum + e.amount, 0);
            return { category: b.category, limit: b.limit, spent, over: spent > b.limit };
          }).filter(o => o.over);

          return (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center justify-between md:col-span-2">
              <div className="flex items-center gap-3">
                <span className={`p-2 rounded-xl ${limitOverages.length > 0 ? 'bg-amber-950/20 text-amber-400' : 'bg-emerald-950/20 text-emerald-400'}`}>
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Budget Limit Diagnostics</h4>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-tight">
                    {limitOverages.length > 0
                      ? `Alert: ${limitOverages.map(o => o.category).join(', ')} spending has crossed limit guidelines!`
                      : 'All categories are within limits. Great job tracking spending!'}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

      </div>

      {/* Search and Filter Panel (Hide when in Calendar view mode) */}
      {viewMode !== 'calendar' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search product details..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pl-9 pr-4 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-primary focus:bg-zinc-950 text-zinc-200"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-400">
              <Filter className="h-3.5 w-3.5 text-zinc-400" /> Filters:
            </div>            {/* Member Filter */}
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

            {/* Category Filter */}
            <div className="w-44">
              <Select
                value={categoryFilter}
                onValueChange={(val) => { setCategoryFilter(val); setCurrentPage(1); }}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
                  setSortOrder(order as 'desc' | 'asc');
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
      )}

      {/* Main Ledger Content Grid */}
      <div>

        {/* ==========================================
            VIEW 1: Table View Mode
           ========================================== */}
        {viewMode === 'table' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/45 text-sm font-bold uppercase tracking-wider text-zinc-400">
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-4">Member</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Product Name</th>
                    <th className="py-4 px-4 text-center">Qty</th>
                    <th className="py-4 px-4 text-right">Unit Amount</th>
                    <th className="py-4 px-4 text-right">Total Spent</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 text-sm">
                  {paginatedExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-sm font-semibold text-zinc-400">
                        No expenses found matching the selected parameters.
                      </td>
                    </tr>
                  ) : (
                    paginatedExpenses.map(e => {
                      const member = members.find(m => m.id === e.memberId);
                      return (
                        <tr key={e.id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-4 px-6 font-semibold text-zinc-200">{e.date}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span>{member?.avatar}</span>
                              <span className="font-bold text-zinc-200">{member?.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <CategoryBadge category={e.category} type="expense" />
                          </td>
                          <td className="py-4 px-4 font-bold text-zinc-200">{e.productName}</td>
                          <td className="py-4 px-4 text-center font-bold text-zinc-100">{e.quantity}</td>
                          <td className="py-4 px-4 text-right text-zinc-300">{currency}{(e.amount / e.quantity).toLocaleString()}</td>
                          <td className="py-4 px-4 text-right font-extrabold text-rose-450 text-sm">
                            -{currency}{e.amount.toLocaleString()}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedExpense(e);
                                  setEditExpenseForm({ ...e });
                                  setEditModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedExpense(e);
                                  setDeleteModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/80 transition-colors"
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredExpenses.length)} of {filteredExpenses.length} records
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
        )}

        {/* ==========================================
            VIEW 2: List View Mode (Timeline layout)
           ========================================== */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {paginatedExpenses.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center text-sm font-semibold text-zinc-400">
                No expenses found.
              </div>
            ) : (
              paginatedExpenses.map((e) => {
                const member = members.find(m => m.id === e.memberId);
                return (
                  <motion.div
                    key={e.id}
                    layout
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm hover:scale-[1.005] hover:shadow-md transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl bg-zinc-800 h-10 w-10 rounded-xl flex items-center justify-center">
                        {member?.avatar || '👤'}
                      </span>
                      <div>
                        <h4 className="text-sm font-extrabold text-zinc-100">{e.productName}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <CategoryBadge category={e.category} type="expense" />
                          <span className="text-xs text-zinc-300 font-semibold">{member?.name}</span>
                          <span className="h-1 w-1 bg-zinc-700 rounded-full" />
                          <span className="text-xs text-zinc-400 font-semibold">{e.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-rose-400">-{currency}{e.amount.toLocaleString()}</span>
                        <p className="text-xs text-zinc-450 font-semibold mt-0.5">Qty: {e.quantity} • {currency}{(e.amount / e.quantity).toLocaleString()}/ea</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedExpense(e);
                            setEditExpenseForm({ ...e });
                            setEditModalOpen(true);
                          }}
                          className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedExpense(e);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-rose-450"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}

            {/* Pagination for list */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center px-4 pt-2">
                <span className="text-xs font-semibold text-zinc-400">Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredExpenses.length)} of {filteredExpenses.length}</span>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-3 py-1 rounded bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 disabled:opacity-40"
                  >
                    Prev
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-3 py-1 rounded bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            VIEW 3: Calendar Grid Mode
           ========================================== */}
        {viewMode === 'calendar' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm overflow-hidden p-6">

            {/* Calendar Controller Bar */}
            <div className="flex items-center justify-between pb-6 border-b border-zinc-800 mb-6">
              <div>
                <h3 className="text-sm font-extrabold text-zinc-100">{getCalendarMonthName()}</h3>
                <p className="text-xs text-zinc-400 mt-1">Click on any box grid day cell to log an expense for that date</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeCalendarMonth('prev')}
                  className="p-1.5 border border-zinc-800 hover:bg-zinc-800 rounded-lg animate-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-zinc-455" />
                </button>
                <button
                  onClick={() => changeCalendarMonth('next')}
                  className="p-1.5 border border-zinc-800 hover:bg-zinc-800 rounded-lg animate-colors"
                >
                  <ChevronRight className="h-4 w-4 text-zinc-455" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center py-2 text-xs font-bold text-zinc-400 uppercase tracking-wide">{d}</div>
              ))}

              {/* Day Cells */}
              {renderCalendarDays()}
            </div>
          </div>
        )}

      </div>

      {/* 1. Log Expense Modal */}
      <AnimatePresence>
        {addModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setAddModalOpen(false)} className="absolute inset-0 bg-black" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative z-10 m-4"
            >
              <h3 className="text-base font-extrabold text-zinc-100">Log Family Expense</h3>
              <p className="text-xs text-zinc-400 mt-1">Submit a new transaction ledger cash out.</p>

              <form onSubmit={handleAddSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Family Member</label>
                  <div className="mt-1.5">
                    <Select
                      value={newExpenseForm.memberId}
                      onValueChange={(val) => setNewExpenseForm(prev => ({ ...prev, memberId: val }))}
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Product / Service Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Vegetables, Broadband Wifi, Medicines"
                    required
                    value={newExpenseForm.productName}
                    onChange={(e) => setNewExpenseForm(prev => ({ ...prev, productName: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-primary focus:bg-zinc-955"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Category</label>
                    <div className="mt-1.5">
                      <Select
                        value={newExpenseForm.category}
                        onValueChange={(val) => setNewExpenseForm(prev => ({ ...prev, category: val as ExpenseCategory }))}
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
                      value={newExpenseForm.amount}
                      onChange={(e) => setNewExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={newExpenseForm.quantity}
                      onChange={(e) => setNewExpenseForm(prev => ({ ...prev, quantity: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-955 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-primary focus:bg-zinc-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Date</label>
                    <input
                      type="date"
                      required
                      value={newExpenseForm.date}
                      onChange={(e) => setNewExpenseForm(prev => ({ ...prev, date: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Notes (Optional)</label>
                  <textarea
                    placeholder="Short detailed description..."
                    value={newExpenseForm.notes}
                    onChange={(e) => setNewExpenseForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-1.5 w-full h-16 rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-sm text-zinc-200 outline-none focus:border-primary"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button type="button" onClick={() => setAddModalOpen(false)} className="flex-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-xs font-bold text-zinc-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-500 py-2.5 text-xs font-bold text-white transition-colors">Log Expense</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Edit Expense Modal */}
      <AnimatePresence>
        {editModalOpen && editExpenseForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setEditModalOpen(false)} className="absolute inset-0 bg-black" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative z-10 m-4"
            >
              <h3 className="text-base font-extrabold text-zinc-100">Edit Expense Item</h3>
              <p className="text-xs text-zinc-400 mt-1">Modify logged items and category bounds.</p>

              <form onSubmit={handleEditSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Family Member</label>
                  <div className="mt-1.5">
                    <Select
                      value={editExpenseForm.memberId}
                      onValueChange={(val) => setEditExpenseForm(prev => prev ? ({ ...prev, memberId: val }) : null)}
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Product Name</label>
                  <input
                    type="text"
                    required
                    value={editExpenseForm.productName}
                    onChange={(e) => setEditExpenseForm(prev => prev ? ({ ...prev, productName: e.target.value }) : null)}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-primary focus:bg-zinc-950"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Category</label>
                    <div className="mt-1.5">
                      <Select
                        value={editExpenseForm.category}
                        onValueChange={(val) => setEditExpenseForm(prev => prev ? ({ ...prev, category: val as ExpenseCategory }) : null)}
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
                      value={editExpenseForm.amount}
                      onChange={(e) => setEditExpenseForm(prev => prev ? ({ ...prev, amount: parseFloat(e.target.value) || 0 }) : null)}
                      className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={editExpenseForm.quantity}
                      onChange={(e) => setEditExpenseForm(prev => prev ? ({ ...prev, quantity: parseInt(e.target.value) || 1 }) : null)}
                      className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-primary focus:bg-zinc-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Date</label>
                    <input
                      type="date"
                      required
                      value={editExpenseForm.date}
                      onChange={(e) => setEditExpenseForm(prev => prev ? ({ ...prev, date: e.target.value }) : null)}
                      className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Notes (Optional)</label>
                  <textarea
                    value={editExpenseForm.notes || ''}
                    onChange={(e) => setEditExpenseForm(prev => prev ? ({ ...prev, notes: e.target.value }) : null)}
                    className="mt-1.5 w-full h-16 rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-sm text-zinc-200 outline-none focus:border-primary"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button type="button" onClick={() => { setEditModalOpen(false); setSelectedExpense(null); }} className="flex-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-xs font-bold text-zinc-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 rounded-xl bg-primary hover:bg-primary-hover py-2.5 text-xs font-bold text-white transition-colors">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && selectedExpense && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setDeleteModalOpen(false)} className="absolute inset-0 bg-black" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative z-10 m-4 text-center"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-955/20 text-rose-400">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold text-zinc-100 mt-4">Delete Expense Entry</h3>
              <p className="text-xs text-zinc-400 mt-2 font-medium">
                Are you sure you want to delete the expense entry <span className="font-bold text-zinc-200">"{selectedExpense.productName}"</span> of <span className="font-bold text-zinc-200">{currency}{selectedExpense.amount.toLocaleString()}</span>?
              </p>

              <div className="flex gap-2.5 mt-5">
                <button type="button" onClick={() => { setDeleteModalOpen(false); setSelectedExpense(null); }} className="flex-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-xs font-bold text-zinc-200 transition-colors">Cancel</button>
                <button type="button" onClick={handleDeleteConfirm} className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-500 py-2.5 text-xs font-bold text-white transition-colors">Confirm Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
