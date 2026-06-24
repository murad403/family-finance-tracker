'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { FamilyMember, RelationshipType } from '@/lib/types';
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  ChevronRight,
  UserCheck,
  ChevronLeft,
  SlidersHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function MembersPage() {
  const {
    members,
    addMember,
    updateMember,
    deleteMember,
    settings,
    expenses,
    incomes
  } = useFinance();

  const currency = settings.familyInfo.currency;

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [relFilter, setRelFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<'name' | 'joinDate'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  // Forms state
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    relationship: 'Spouse' as RelationshipType,
    phone: '',
    status: 'Active' as 'Active' | 'Inactive',
    avatar: '👨'
  });

  const [editMemberForm, setEditMemberForm] = useState<FamilyMember | null>(null);

  // Math helper: Get member details (Income/Expense sums)
  const getMemberBalances = (memberId: string) => {
    const memberIncomes = incomes.filter(i => i.memberId === memberId).reduce((sum, i) => sum + i.amount, 0);
    const memberExpenses = expenses.filter(e => e.memberId === memberId).reduce((sum, e) => sum + e.amount, 0);
    return {
      income: memberIncomes,
      expense: memberExpenses,
      balance: memberIncomes - memberExpenses
    };
  };

  // Handle CRUD submissions
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.name) return;
    addMember(newMemberForm);
    setNewMemberForm({
      name: '',
      relationship: 'Spouse',
      phone: '',
      status: 'Active',
      avatar: '👨'
    });
    setAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMemberForm || !editMemberForm.name) return;
    updateMember(editMemberForm);
    setEditModalOpen(false);
    setSelectedMember(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedMember) {
      deleteMember(selectedMember.id);
      setDeleteModalOpen(false);
      setSelectedMember(null);
    }
  };

  // Filter & Sort math
  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.phone.includes(searchQuery);
    const matchesRel = relFilter === 'All' || m.relationship === relFilter;
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesRel && matchesStatus;
  }).sort((a, b) => {
    let comp = 0;
    if (sortField === 'name') {
      comp = a.name.localeCompare(b.name);
    } else {
      comp = a.joinDate.localeCompare(b.joinDate);
    }
    return sortOrder === 'asc' ? comp : -comp;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  const relationships: RelationshipType[] = ['Self', 'Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Sibling', 'Other'];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-50 tracking-tight">Family Members</h1>
          <p className="text-zinc-400 text-sm">Add and organize your family directory & check individual balances</p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-hover px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/10 active:scale-[0.98] transition-all dark:bg-primary dark:hover:bg-primary"
        >
          <UserPlus className="h-4 w-4" /> Add Family Member
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search member name or phone..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pl-10 pr-4 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-500 focus:border-primary focus:bg-zinc-900/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-400">
            <SlidersHorizontal className="h-4 w-4 text-zinc-400" /> Filter:
          </div>

          {/* Relationship Filter */}
          <div className="w-44">
            <Select
              value={relFilter}
              onValueChange={(val) => { setRelFilter(val); setCurrentPage(1); }}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="All Relationships" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Relationships</SelectItem>
                {relationships.map(rel => (
                  <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-36">
            <Select
              value={statusFilter}
              onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div className="w-44">
            <Select
              value={`${sortField}-${sortOrder}`}
              onValueChange={(val) => {
                const [field, order] = val.split('-');
                setSortField(field as 'name' | 'joinDate');
                setSortOrder(order as 'asc' | 'desc');
              }}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name: A-Z</SelectItem>
                <SelectItem value="name-desc">Name: Z-A</SelectItem>
                <SelectItem value="joinDate-asc">Join Date: Oldest</SelectItem>
                <SelectItem value="joinDate-desc">Join Date: Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

      </div>

      {/* Members Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/40 text-sm font-bold uppercase tracking-wider text-zinc-400">
                <th className="py-4 px-6">Profile</th>
                <th className="py-4 px-4">Relationship</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Phone</th>
                <th className="py-4 px-4 text-right">Lifetime Income</th>
                <th className="py-4 px-4 text-right">Lifetime Spent</th>
                <th className="py-4 px-4 text-right">Balance</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {paginatedMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs font-semibold text-slate-400">
                    No family members matched your criteria.
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((m) => {
                  const bal = getMemberBalances(m.id);
                  return (
                    <tr key={m.id} className="hover:bg-zinc-800/40 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className="text-xl bg-zinc-800 h-10 w-10 rounded-xl flex items-center justify-center">
                            {m.avatar}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-zinc-100 leading-tight">{m.name}</h4>
                            <span className="text-xs text-zinc-400 font-semibold mt-1 block">Joined: {m.joinDate}</span>
                          </div>
                        </div>
                      </td>

                      {/* Relationship */}
                      <td className="py-4 px-4">
                        <span className="text-sm font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                          {m.relationship}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${m.status === 'Active'
                          ? 'bg-emerald-950/20 text-emerald-400'
                          : 'bg-zinc-800 text-zinc-400'
                          }`}>
                          {m.status}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-4 text-xs font-semibold text-zinc-300">
                        {m.phone || 'No phone logged'}
                      </td>

                      {/* Income */}
                      <td className="py-4 px-4 text-right text-xs font-bold text-emerald-400">
                        +{currency}{bal.income.toLocaleString()}
                      </td>

                      {/* Expense */}
                      <td className="py-4 px-4 text-right text-xs font-bold text-rose-400">
                        -{currency}{bal.expense.toLocaleString()}
                      </td>

                      {/* Balance */}
                      <td className="py-4 px-4 text-right text-xs font-bold text-zinc-200">
                        {currency}{bal.balance.toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/members/${m.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-zinc-800/80 transition-colors"
                            title="View Personal Dashboard"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedMember(m);
                              setEditMemberForm({ ...m });
                              setEditModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-zinc-800/80 transition-colors"
                            title="Edit Member Info"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {m.relationship !== 'Self' && (
                            <button
                              onClick={() => {
                                setSelectedMember(m);
                                setDeleteModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-50 dark:hover:bg-zinc-800/80 transition-colors"
                              title="Delete Profile"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of {filteredMembers.length} members
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4 text-zinc-400" />
              </button>
              <span className="text-xs font-bold text-zinc-200 px-3">{currentPage} / {totalPages}</span>
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

      {/* 1. Add Member Modal */}
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
              <h3 className="text-base font-extrabold text-zinc-100">Add Family Member</h3>
              <p className="text-xs text-zinc-400 mt-1">Assign budget allocations and track spending activity.</p>

              <form onSubmit={handleAddSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">Name</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    required
                    value={newMemberForm.name}
                    onChange={(e) => setNewMemberForm(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-primary focus:bg-zinc-900/50 placeholder:text-zinc-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">Relationship</label>
                    <div className="mt-1.5">
                      <Select
                        value={newMemberForm.relationship}
                        onValueChange={(val) => setNewMemberForm(prev => ({ ...prev, relationship: val as RelationshipType }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          {relationships.map(rel => (
                            <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">Emoji Avatar</label>
                    <div className="mt-1.5">
                      <Select
                        value={newMemberForm.avatar}
                        onValueChange={(val) => setNewMemberForm(prev => ({ ...prev, avatar: val }))}
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +880 1819-000000"
                    value={newMemberForm.phone}
                    onChange={(e) => setNewMemberForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-primary focus:bg-zinc-900/50 placeholder:text-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">Status</label>
                  <div className="mt-1.5">
                    <Select
                      value={newMemberForm.status}
                      onValueChange={(val) => setNewMemberForm(prev => ({ ...prev, status: val as 'Active' | 'Inactive' }))}
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
                    onClick={() => setAddModalOpen(false)}
                    className="flex-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-sm font-bold text-zinc-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-primary hover:bg-primary-hover py-2.5 text-sm font-bold text-white transition-colors"
                  >
                    Create Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Edit Member Modal */}
      <AnimatePresence>
        {editModalOpen && editMemberForm && (
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
              <h3 className="text-base font-extrabold text-zinc-100">Edit Family Member</h3>
              <p className="text-xs text-zinc-400 mt-1">Modify profile settings and status levels.</p>

              <form onSubmit={handleEditSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">Name</label>
                  <input
                    type="text"
                    required
                    value={editMemberForm.name}
                    onChange={(e) => setEditMemberForm(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-primary focus:bg-zinc-900/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">Relationship</label>
                    <div className="mt-1.5">
                      <Select
                        value={editMemberForm.relationship}
                        onValueChange={(val) => setEditMemberForm(prev => prev ? ({ ...prev, relationship: val as RelationshipType }) : null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          {relationships.map(rel => (
                            <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">Emoji Avatar</label>
                    <div className="mt-1.5">
                      <Select
                        value={editMemberForm.avatar}
                        onValueChange={(val) => setEditMemberForm(prev => prev ? ({ ...prev, avatar: val }) : null)}
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">Phone Number</label>
                  <input
                    type="text"
                    value={editMemberForm.phone}
                    onChange={(e) => setEditMemberForm(prev => prev ? ({ ...prev, phone: e.target.value }) : null)}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-primary focus:bg-zinc-900/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">Status</label>
                  <div className="mt-1.5">
                    <Select
                      value={editMemberForm.status}
                      onValueChange={(val) => setEditMemberForm(prev => prev ? ({ ...prev, status: val as 'Active' | 'Inactive' }) : null)}
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
                    onClick={() => { setEditModalOpen(false); setSelectedMember(null); }}
                    className="flex-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-sm font-bold text-zinc-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-primary hover:bg-primary-hover py-2.5 text-sm font-bold text-white transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Delete Member Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && selectedMember && (
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
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-950/20 text-rose-400">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold text-zinc-100 mt-4">Delete Member Profile</h3>
              <p className="text-xs text-zinc-400 mt-2">
                Are you sure you want to remove <span className="font-bold text-zinc-200">{selectedMember.name}</span>? This action is permanent and will cascade delete all associated income and expense records!
              </p>

              <div className="flex gap-2.5 mt-5">
                <button
                  type="button"
                  onClick={() => { setDeleteModalOpen(false); setSelectedMember(null); }}
                  className="flex-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-sm font-bold text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-500 py-2.5 text-sm font-bold text-white transition-colors"
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
