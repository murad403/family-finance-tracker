'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { FamilyMember } from '@/lib/types';

interface DeleteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedMember: FamilyMember | null;
    onConfirm: () => void;
}

const DeleteMemberModal = ({
    isOpen,
    onClose,
    selectedMember,
    onConfirm,
}: DeleteMemberModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && selectedMember && (
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
                                onClick={onClose}
                                className="flex-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-sm font-bold text-zinc-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={onConfirm}
                                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-500 py-2.5 text-sm font-bold text-white transition-colors"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DeleteMemberModal;