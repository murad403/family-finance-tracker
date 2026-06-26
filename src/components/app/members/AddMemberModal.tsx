'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RelationshipType } from '@/lib/types';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    newMemberForm: {
        name: string;
        relationship: RelationshipType;
        phone: string;
        status: 'Active' | 'Inactive';
        avatar: string;
    };
    setNewMemberForm: React.Dispatch<React.SetStateAction<{
        name: string;
        relationship: RelationshipType;
        phone: string;
        status: 'Active' | 'Inactive';
        avatar: string;
    }>>;
    onSubmit: (e: React.FormEvent) => void;
}

const relationships: RelationshipType[] = ['Self', 'Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Sibling', 'Other'];

const AddMemberModal = ({
    isOpen,
    onClose,
    newMemberForm,
    setNewMemberForm,
    onSubmit,
}: AddMemberModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative z-10 m-4"
                    >
                        <h3 className="text-base font-extrabold text-zinc-100">Add Family Member</h3>
                        <p className="text-xs text-zinc-400 mt-1">Assign budget allocations and track spending activity.</p>

                        <form onSubmit={onSubmit} className="mt-4 space-y-3.5">
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
                                    onClick={onClose}
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
    );
};

export default AddMemberModal;