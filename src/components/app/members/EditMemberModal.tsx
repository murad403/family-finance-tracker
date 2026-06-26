'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { FamilyMember, RelationshipType } from '@/lib/types';

interface EditMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    editMemberForm: FamilyMember | null;
    setEditMemberForm: React.Dispatch<React.SetStateAction<FamilyMember | null>>;
    onSubmit: (e: React.FormEvent) => void;
}

const relationships: RelationshipType[] = ['Self', 'Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Sibling', 'Other'];

const EditMemberModal = ({
    isOpen,
    onClose,
    editMemberForm,
    setEditMemberForm,
    onSubmit,
}: EditMemberModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && editMemberForm && (
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
                        <h3 className="text-base font-extrabold text-zinc-100">Edit Family Member</h3>
                        <p className="text-xs text-zinc-400 mt-1">Modify profile settings and status levels.</p>

                        <form onSubmit={onSubmit} className="mt-4 space-y-3.5">
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
                                    onClick={onClose}
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
    );
};

export default EditMemberModal;